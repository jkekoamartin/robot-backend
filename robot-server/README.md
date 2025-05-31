# Robot Server Testing Guide

This document explains how to test the Robot Tracking System server component.

## Overview

The Robot Tracking System server component is a SpacetimeDB module written in Rust. It provides functionality for tracking robot distances and their history. The module includes the following features:

- Creating and updating robots
- Incrementing robot distances
- Retrieving current robot distances
- Retrieving historical robot distances at specific points in time

## Testing Approach

Since SpacetimeDB modules require a proper SpacetimeDB environment to run, testing these modules can be challenging. We've implemented a testing strategy that focuses on:

1. **Manual Testing with Simulation Scripts**: We provide simulation scripts that demonstrate how to test the module manually using the SpacetimeDB CLI.

2. **Logic Tests**: We've created tests that verify the core logic of the reducer functions without trying to mock the SpacetimeDB API. These tests ensure that the business logic works as expected.

## Important Note About Unit Tests

**The unit tests in this project are currently not compatible with the version of SpacetimeDB being used.** Attempting to run the tests with `cargo test` will result in compilation errors due to API changes in the SpacetimeDB library.

The main issues are:

1. The SpacetimeDB API has changed since this code was written:
   - Methods like `filter_by_robot_id` are no longer available
   - The `timestamp()` method has been replaced or modified
   - The primary key attribute syntax has changed

2. Reducers in SpacetimeDB cannot return values - they can only return `()` or `Result<(), impl Display>`, but our code has reducers that return `u64`.

Fixing these issues would require a significant rewrite of the codebase, which is beyond the scope of the current testing setup.

## Test Coverage

The logic tests cover the following scenarios:

1. **update_distance**:
   - Verifying that a new robot's distance is set to the provided value
   - Verifying that an existing robot's distance is updated to the new value

2. **increment_distance**:
   - Verifying that a new robot's distance is set to the increment value
   - Verifying that an existing robot's distance is correctly incremented

3. **get_distance**:
   - Verifying that an existing robot's distance is correctly returned
   - Verifying that a nonexistent robot returns a distance of 0

4. **get_distance_at_time**:
   - Verifying that the correct historical distance is returned for a timestamp between entries
   - Verifying that a timestamp before all entries returns a distance of 0
   - Verifying that a timestamp after all entries returns the most recent entry's distance

5. **say_hello**:
   - Verifying that the function doesn't panic

## Manual Testing

In addition to the automated tests, we provide two scripts for manual testing:

1. **test_robot.sh**: A simulation script that demonstrates how to test the module without a SpacetimeDB instance.

2. **test_robot_cli.sh**: A script that uses the actual SpacetimeDB CLI to interact with a deployed module.

To run the simulation script:

```bash
chmod +x test_robot.sh
./test_robot.sh
```

To run the CLI script (after deploying the module):

```bash
chmod +x test_robot_cli.sh
# Edit the MODULE_ADDRESS in the script
./test_robot_cli.sh
```

## Adding New Tests

When adding new functionality to the module, follow these steps to add tests:

1. Add unit tests in the `tests.rs` file
2. Update the simulation script (`test_robot.sh`) to demonstrate the new functionality
3. Update the CLI script (`test_robot_cli.sh`) to test the new functionality with a deployed module

## Troubleshooting

If you encounter issues with the tests:

1. Make sure you have the latest version of Rust installed:
   ```bash
   rustup update
   ```

2. Check that the test logic in `tests.rs` matches the expected behavior of the reducer functions

3. If you're adding new tests, ensure they focus on testing the logic rather than trying to mock the SpacetimeDB API
