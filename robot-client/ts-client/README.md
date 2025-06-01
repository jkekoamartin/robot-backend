# Robot Tracking System TypeScript Client

A TypeScript client application for the Robot Tracking System built with SpacetimeDB. This client allows you to connect to a SpacetimeDB module, manage multiple robots, and track their distances in real-time.

## Features

- Connect to a SpacetimeDB module
- Add and manage multiple robots
- Update and increment robot distances
- View real-time distance updates
- Query historical distance data at specific timestamps
- View a log of distance changes for each robot
- Type-safe implementation using TypeScript

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- A deployed SpacetimeDB module (the robot-server)

## Getting Started

### Installation

1. Clone this repository or download the client files
2. Navigate to the ts-client directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

### Development

#### Option 1: Using the provided script

A convenience script is provided to help you get started quickly:

```bash
chmod +x serve.sh
./serve.sh
```

This script will:
1. Check if Node.js and npm are installed
2. Install dependencies if they don't exist
3. Start the development server

#### Option 2: Manual setup

To start the development server manually:

```bash
npm start
# or
yarn start
```

This will start a development server at http://localhost:8080 with hot reloading enabled.

### Building for Production

To build the client for production:

```bash
npm run build
# or
yarn build
```

This will create a `dist` directory with the compiled JavaScript, HTML, and CSS files.

## Connecting to the SpacetimeDB Module

1. Enter the address of your SpacetimeDB module in the "Module Address" field
   - Format: `hostname:port` (e.g., `localhost:3000`)
   - If you're using the SpacetimeDB cloud service, use the provided address

2. Click the "Connect" button to establish a connection to the module

## Managing Robots

1. **Adding a Robot**:
   - Enter a unique ID for the robot in the "Robot ID" field
   - Click "Add Robot" to create a new robot with an initial distance of 0

2. **Selecting a Robot**:
   - Click on a robot in the list to select it and view its details

3. **Updating Distance**:
   - Enter a new distance value in the "Distance" field
   - Click "Update" to set the robot's distance to the specified value

4. **Incrementing Distance**:
   - Enter an increment value in the "Increment" field
   - Click "Increment" to increase the robot's distance by the specified amount

5. **Say Hello**:
   - Click "Say Hello" to trigger the `say_hello` reducer on the server
   - This will log a greeting message on the server side

## Viewing Historical Data

1. **Querying Distance at a Specific Time**:
   - Select a date and time using the datetime picker
   - Click "Query" to retrieve the robot's distance at that point in time

2. **History Log**:
   - The history log shows all recorded distance changes for the selected robot
   - Entries are sorted with the most recent changes at the top

## Console Output

The console at the bottom of the page displays:
- Client application version (displayed on startup)
- Connection status messages
- Results of reducer calls
- Error messages
- Other informational messages

## Project Structure

- `src/index.ts`: Main application logic
- `src/models.ts`: TypeScript interfaces for the data structures
- `src/index.html`: HTML template
- `webpack.config.js`: Webpack configuration
- `tsconfig.json`: TypeScript configuration
- `package.json`: Project dependencies and scripts

## SpacetimeDB TypeScript SDK

This client uses the SpacetimeDB TypeScript SDK. The SDK is imported as a dependency in the package.json file:

```
{
  "dependencies": {
    "@clockworklabs/spacetimedb-sdk": "^0.7.0"
  }
}
```

For more information about the SDK, refer to the [SpacetimeDB TypeScript SDK documentation](https://spacetimedb.com/docs/sdks/typescript/quickstart).

## Troubleshooting

If you encounter issues:

1. Verify that the SpacetimeDB module is running and accessible
2. Check that the module address is correct
3. Look for error messages in the console output
4. Check your browser's developer console for additional error information

## License

This project is open source and available under the MIT License.
