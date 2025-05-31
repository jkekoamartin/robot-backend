# Robot Tracking System

A complete robot tracking system built with SpacetimeDB, consisting of a server-side WebAssembly module and a web-based client application. This system allows you to track the distance traveled by multiple robots and view their historical data.

## Project Structure

The project is organized into two main components:

- **robot-server**: The server-side SpacetimeDB module written in Rust
- **robot-client**: The client-side web application written in HTML, CSS, and JavaScript

## Features

- Track multiple robots simultaneously
- Update and increment robot distances
- Query current distance for any robot
- View historical distance data at specific points in time (rewind/replay)
- Real-time updates across all connected clients

## Server Component (robot-server)

The server component is a SpacetimeDB module written in Rust that:

1. Defines the data model for robots and their history
2. Provides reducers (functions) to:
   - Update a robot's distance
   - Increment a robot's distance
   - Query a robot's current distance
   - Query a robot's distance at a specific point in time
   - Say hello to a robot (for testing)

### Server Setup

1. Install Rust and the `wasm32-unknown-unknown` target:
   ```
   rustup target add wasm32-unknown-unknown
   ```

2. Install the SpacetimeDB CLI:
   ```
   cargo install spacetime
   ```

3. Build the WebAssembly module:
   ```
   cd robot-server
   cargo build --target wasm32-unknown-unknown --release
   ```

4. Publish the module to SpacetimeDB:
   ```
   spacetime publish target/wasm32-unknown-unknown/release/spacetime_module.wasm
   ```

5. Note the module address provided after publishing, as you'll need it for the client.

## Client Component (robot-client)

The client component is a web application that:

1. Connects to the SpacetimeDB module
2. Provides a user interface to:
   - Add and manage multiple robots
   - Update and increment robot distances
   - View real-time distance updates
   - Query historical distance data
   - View a log of distance changes

### Client Setup

1. Use the provided script to serve the client files:
   ```
   chmod +x robot-client/serve.sh
   ./robot-client/serve.sh
   ```

   Alternatively, you can use any web server of your choice:
   - Python's built-in HTTP server: `python -m http.server`
   - Node.js with `http-server`: `npx http-server`

2. Open the client in a web browser at `http://localhost:8000`

3. Enter the SpacetimeDB module address and click "Connect"

4. If you encounter the error "Can't find variable: SpacetimeDB", the application will automatically try to load the SDK from an alternative CDN. If that also fails, check your internet connection and make sure you can access the CDN URLs.

For more detailed instructions, see the [client README](robot-client/README.md).

## Testing

The project includes both automated unit tests and manual test scripts:

### Automated Unit Tests

The server component includes logic tests that verify the core functionality without requiring a running SpacetimeDB instance. However, these tests are currently not compatible with the version of SpacetimeDB being used.

**Important Note**: Attempting to run the tests with `cargo test` will result in compilation errors due to API changes in the SpacetimeDB library. For more details about the issues and the testing approach, see the [server testing guide](robot-server/README.md).

### Manual Test Scripts

In addition to the automated tests, the project includes two manual test scripts:

1. **test_robot.sh**: A simulation script that demonstrates how the module would be used
2. **test_robot_cli.sh**: A script that uses the actual SpacetimeDB CLI to interact with a deployed module

To run the simulation script:
```
chmod +x robot-server/test_robot.sh
./robot-server/test_robot.sh
```

To run the CLI script (after deploying the module):
```
chmod +x robot-server/test_robot_cli.sh
# Edit the MODULE_ADDRESS in the script
./robot-server/test_robot_cli.sh
```

## Development

### Server Development

The server code is in `robot-server/src/lib.rs`. Key components:

- `Robot` table: Stores the current distance for each robot
- `RobotHistory` table: Stores the history of distance changes with timestamps
- Reducer functions: Implement the business logic for interacting with robots

### Client Development

The client code consists of:

- `index.html`: The main HTML structure and UI elements
- `styles.css`: CSS styles for the application
- `app.js`: Client-side JavaScript code that interacts with the SpacetimeDB module

## SpacetimeDB Resources

- [SpacetimeDB Documentation](https://spacetimedb.com/docs)
- [Rust SDK Documentation](https://spacetimedb.com/docs/sdks/rust/quickstart)
- [TypeScript SDK Documentation](https://spacetimedb.com/docs/sdks/typescript/quickstart)

## License

This project is open source and available under the MIT License.
