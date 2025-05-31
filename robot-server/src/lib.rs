use spacetimedb::{ReducerContext, Table, Timestamp};

#[cfg(test)]
mod tests;

#[spacetimedb::table(name = robot)]
#[derive(Clone)]
pub struct Robot {
    #[primary_key]
    robot_id: String,
    distance: u64
}

#[spacetimedb::table(name = robot_history)]
#[derive(Clone)]
pub struct RobotHistory {
    #[primary_key]
    robot_id: String,
    timestamp: Timestamp,
    distance: u64
}

#[spacetimedb::reducer(init)]
pub fn init(_ctx: &ReducerContext) {
    // Called when the module is initially published
}

#[spacetimedb::reducer(client_connected)]
pub fn identity_connected(_ctx: &ReducerContext) {
    // Called everytime a new client connects
}

#[spacetimedb::reducer(client_disconnected)]
pub fn identity_disconnected(_ctx: &ReducerContext) {
    // Called everytime a client disconnects
}

#[spacetimedb::reducer]
pub fn update_distance(ctx: &ReducerContext, robot_id: String, distance: u64) {
    // Check if the robot exists
    let existing_robot = ctx.db.robot().filter_by_robot_id(&robot_id).first();

    if let Some(robot) = existing_robot {
        // If the robot exists, update it
        ctx.db.robot().delete(robot.clone());
        ctx.db.robot().insert(Robot { robot_id: robot_id.clone(), distance });
    } else {
        // If the robot doesn't exist, create a new one
        ctx.db.robot().insert(Robot { robot_id: robot_id.clone(), distance });
    }

    // Record this update in the history table with the current timestamp
    ctx.db.robot_history().insert(RobotHistory {
        robot_id,
        timestamp: ctx.timestamp(),
        distance,
    });
}

#[spacetimedb::reducer]
pub fn increment_distance(ctx: &ReducerContext, robot_id: String, increment: u64) {
    // Check if the robot exists
    let existing_robot = ctx.db.robot().filter_by_robot_id(&robot_id).first();

    let new_distance: u64;

    if let Some(robot) = existing_robot {
        // If the robot exists, calculate the new distance by adding the increment
        new_distance = robot.distance + increment;

        // Delete the old record and insert an updated one
        ctx.db.robot().delete(robot.clone());
        ctx.db.robot().insert(Robot { robot_id: robot_id.clone(), distance: new_distance });
    } else {
        // If the robot doesn't exist, create a new one with the increment as the initial distance
        new_distance = increment;
        ctx.db.robot().insert(Robot { robot_id: robot_id.clone(), distance: new_distance });
    }

    // Record this update in the history table with the current timestamp
    ctx.db.robot_history().insert(RobotHistory {
        robot_id,
        timestamp: ctx.timestamp(),
        distance: new_distance,
    });
}

#[spacetimedb::reducer]
pub fn say_hello(ctx: &ReducerContext, robot_id: String) {
    // Get the robot's distance if it exists
    let robot_distance = ctx.db.robot().filter_by_robot_id(&robot_id).first().map_or(0, |robot| robot.distance);
    log::info!("Hello, World! Robot {} has traveled {} units.", robot_id, robot_distance);
}

#[spacetimedb::reducer]
pub fn get_distance(ctx: &ReducerContext, robot_id: String) -> u64 {
    // Get the robot's distance if it exists, or return 0 if no robot exists
    ctx.db.robot().filter_by_robot_id(&robot_id).first().map_or(0, |robot| robot.distance)
}

#[spacetimedb::reducer]
pub fn get_distance_at_time(ctx: &ReducerContext, robot_id: String, target_time: Timestamp) -> u64 {
    // Find the most recent history entry at or before the target time for the specific robot
    let history_entries = ctx.db.robot_history()
        .filter_by_robot_id(&robot_id)
        .iter()
        .filter(|entry| entry.timestamp <= target_time)
        .collect::<Vec<_>>();

    // Sort by timestamp in descending order (most recent first)
    let mut sorted_entries = history_entries.clone();
    sorted_entries.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));

    // Return the distance from the most recent entry, or 0 if no entries found
    sorted_entries.first().map_or(0, |entry| entry.distance)
}
