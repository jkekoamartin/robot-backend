use spacetimedb::{ReducerContext, Table};

#[spacetimedb::table(name = robot)]
#[derive(Clone)]
pub struct Robot {
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
pub fn update_distance(ctx: &ReducerContext, distance: u64) {
    // Check if any robot record exists
    let existing_robots = ctx.db.robot().iter().collect::<Vec<_>>();

    if existing_robots.is_empty() {
        // If no robot exists, create a new one
        ctx.db.robot().insert(Robot { distance });
    } else {
        // If a robot exists, delete the old record and insert an updated one
        // This is a workaround since we don't have a primary key to update directly
        ctx.db.robot().delete(existing_robots[0].clone());
        ctx.db.robot().insert(Robot { distance });
    }
}

#[spacetimedb::reducer]
pub fn say_hello(ctx: &ReducerContext) {
    // Get the robot's distance if it exists
    let robot_distance = ctx.db.robot().iter().next().map_or(0, |robot| robot.distance);
    log::info!("Hello, World! Robot has traveled {} units.", robot_distance);
}
