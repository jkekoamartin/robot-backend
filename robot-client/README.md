# Robot Tracking System Client

A web-based client application for the Robot Tracking System built with SpacetimeDB. This client allows you to connect to a SpacetimeDB module, manage multiple robots, and track their distances in real-time.

## Features

- Connect to a SpacetimeDB module
- Add and manage multiple robots
- Update and increment robot distances
- View real-time distance updates
- Query historical distance data at specific timestamps
- View a log of distance changes for each robot

## Prerequisites

- A deployed SpacetimeDB module (the robot-server)
- A web server to serve the client files (or you can use a local development server)

## Getting Started

### Setting Up the Client

1. Clone this repository or download the client files:
   - `index.html`
   - `styles.css`
   - `app.js`

2. Use the provided script to serve the client files:
   ```
   chmod +x serve.sh
   ./serve.sh
   ```

   Alternatively, you can use any web server of your choice:
   - Python's built-in HTTP server: `python -m http.server`
   - Node.js with `http-server`: `npx http-server`

3. Open the client in a web browser at `http://localhost:8000`

4. If you encounter the error "Can't find variable: SpacetimeDB", make sure you're using the latest version of the SpacetimeDB client library. The client is configured to use the latest version from the CDN.

### Connecting to the SpacetimeDB Module

1. Enter the address of your SpacetimeDB module in the "Module Address" field
   - Format: `hostname:port` (e.g., `localhost:3000`)
   - If you're using the SpacetimeDB cloud service, use the provided address

2. Click the "Connect" button to establish a connection to the module

### Managing Robots

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

### Viewing Historical Data

1. **Querying Distance at a Specific Time**:
   - Select a date and time using the datetime picker
   - Click "Query" to retrieve the robot's distance at that point in time

2. **History Log**:
   - The history log shows all recorded distance changes for the selected robot
   - Entries are sorted with the most recent changes at the top

## Console Output

The console at the bottom of the page displays:
- Connection status messages
- Results of reducer calls
- Error messages
- Other informational messages

## Troubleshooting

If you encounter connection issues:

1. Verify that the SpacetimeDB module is running and accessible
2. Check that the module address is correct
3. Look for error messages in the console output
4. Check your browser's developer console for additional error information

## Development

### SpacetimeDB SDK

This client uses the SpacetimeDB TypeScript SDK. The SDK is loaded from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@clockworklabs/spacetimedb-sdk@0.8.0/dist/spacetimedb.min.js"></script>
```

Note: We're using version 0.8.0 of the SDK, which is known to work with this client application. The client also includes a fallback mechanism that will attempt to load the SDK from an alternative CDN (unpkg.com) if the primary CDN fails.

If you encounter the error "Can't find variable: SpacetimeDB", the application will automatically try to load the SDK from the alternative CDN. If that also fails, check your internet connection and make sure you can access the CDN URLs.

For more information about the SDK, refer to the [SpacetimeDB TypeScript SDK documentation](https://spacetimedb.com/docs/sdks/typescript/quickstart).

### Project Structure

- `index.html`: The main HTML structure and UI elements
- `styles.css`: CSS styles for the application
- `app.js`: Client-side JavaScript code that interacts with the SpacetimeDB module

## License

This project is open source and available under the MIT License.
