/**
 * TypeScript interfaces for the SpacetimeDB tables
 */

/**
 * Represents a robot in the system
 * Corresponds to the `Robot` table in the SpacetimeDB module
 */
export interface Robot {
  robot_id: string;
  distance: number;
}

/**
 * Represents a historical record of a robot's distance
 * Corresponds to the `RobotHistory` table in the SpacetimeDB module
 */
export interface RobotHistory {
  robot_id: string;
  timestamp: number; // Unix timestamp in milliseconds
  distance: number;
}

/**
 * Type definitions for the reducer functions
 */
export interface Reducers {
  update_distance: (robot_id: string, distance: number) => Promise<void>;
  increment_distance: (robot_id: string, increment: number) => Promise<void>;
  say_hello: (robot_id: string) => Promise<void>;
  get_distance: (robot_id: string) => Promise<number>;
  get_distance_at_time: (robot_id: string, timestamp: number) => Promise<number>;
}