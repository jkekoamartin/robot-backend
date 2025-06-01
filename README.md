# Robot Tracking System

A complete robot tracking system built with SpacetimeDB, consisting of a server-side WebAssembly module and a web-based client application. This system allows you to track the distance traveled by multiple robots and view their historical data.

## Project Structure

The project is organized into these main components:

- **robot-server**: The server-side SpacetimeDB module written in Rust
- **robot-client**: The client-side web application with two implementations:
  - JavaScript client: A vanilla JavaScript implementation
  - TypeScript client: A type-safe implementation using TypeScript and modern build tools

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

The client component is available in two implementations: a vanilla JavaScript version and a TypeScript version. Both implementations provide the same functionality:

1. Connect to the SpacetimeDB module
2. Provide a user interface to:
   - Add and manage multiple robots
   - Update and increment robot distances
   - View real-time distance updates
   - Query historical distance data
   - View a log of distance changes

### JavaScript Client

The JavaScript client is a simple implementation using vanilla JavaScript, HTML, and CSS. It's easy to set up and run without any build steps.

### TypeScript Client

The TypeScript client is a more robust implementation that offers:

- Type safety with TypeScript
- Modern build system with webpack
- Better error handling
- Improved code organization
- Proper module imports

### Client Setup

#### JavaScript Client Setup

1. Use the provided script to serve the JavaScript client files:
   ```
   chmod +x robot-client/serve.sh
   ./robot-client/serve.sh
   ```

   Alternatively, you can use any web server of your choice:
   - Python's built-in HTTP server: `python -m http.server`
   - Node.js with `http-server`: `npx http-server`

2. Open the client in a web browser at `http://localhost:8000`

3. Enter the SpacetimeDB module address and click "Connect"

4. If you encounter the error "Can't find variable: SpacetimeDB", the application will automatically try to load the SDK using its fallback mechanisms. The client includes a robust loading system that tries multiple sources and provides clear error messages. If all attempts fail, check your internet connection, make sure you can access the CDN URLs, and try using a different browser.

For more detailed instructions, see the [JavaScript client README](robot-client/README.md).

#### TypeScript Client Setup

Option 1: Using the provided script:
   ```
   chmod +x robot-client/ts-client/serve.sh
   ./robot-client/ts-client/serve.sh
   ```
   This script will check for Node.js and npm, install dependencies if needed, and start the development server.

Option 2: Manual setup:
1. Navigate to the TypeScript client directory:
   ```
   cd robot-client/ts-client
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```
   npm start
   # or
   yarn start
   ```

4. Open the client in a web browser at `http://localhost:8080`

5. Enter the SpacetimeDB module address and click "Connect"

For more detailed instructions, see the [TypeScript client README](robot-client/ts-client/README.md).

## Testing

The project includes both automated unit tests and manual test scripts:

### Automated Unit Tests

The server component includes logic tests that verify the core functionality without requiring a running SpacetimeDB instance. However, these tests are currently not compatible with the version of SpacetimeDB being used.

**Important Note**: Attempting to run the tests with `cargo test` will result in compilation errors due to API changes in the SpacetimeDB library. For more details about the issues and the testing approach, see the [server testing guide](robot-server/README.md).

### Manual Test Scripts

In addition to the automated tests, the project includes two manual test scripts:

1. **test_robot.sh**: A simulation script that demonstrates how the module would be used
2. **test_robot_cli.sh**: A script that uses the actual SpacetimeDB CLI to interact with a deployed module

### Client Debug Tools

The client application includes a comprehensive set of debug tools to help diagnose and troubleshoot issues:

1. **Visual Debug Console**: A toggleable console that displays detailed logs and provides testing functions
2. **SDK Loading Tests**: Verify that the SpacetimeDB SDK is loaded correctly
3. **Connection Tests**: Test connectivity to the SpacetimeDB module
4. **Robot Operation Tests**: Test basic robot operations (create, update, increment, query)
5. **Browser Compatibility Checks**: Verify that your browser supports all required features
6. **Network Connectivity Tests**: Check if your device can connect to the required CDNs

To use the debug tools:

1. Open the client application in your browser
2. Click the "Debug Console" button in the top-right corner
3. Use the buttons in the debug console to run tests and view logs

For more information, see the [Debug Tools README](robot-client/debug-README.md) or try the [Debug Tools Test Page](robot-client/debug-test.html).

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

#### JavaScript Client

The JavaScript client code consists of:

- `index.html`: The main HTML structure and UI elements
- `styles.css`: CSS styles for the application
- `app.js`: Client-side JavaScript code that interacts with the SpacetimeDB module

#### TypeScript Client

The TypeScript client code consists of:

- `src/index.ts`: Main application logic written in TypeScript
- `src/models.ts`: TypeScript interfaces for the data structures
- `src/index.html`: HTML template
- `webpack.config.js`: Webpack configuration for bundling
- `tsconfig.json`: TypeScript configuration
- `package.json`: Project dependencies and scripts

## SpacetimeDB Resources

- [SpacetimeDB Documentation](https://spacetimedb.com/docs)
- [Rust SDK Documentation](https://spacetimedb.com/docs/sdks/rust/quickstart)
- [TypeScript SDK Documentation](https://spacetimedb.com/docs/sdks/typescript/quickstart)

## License

This project is open source and available under the MIT License.
