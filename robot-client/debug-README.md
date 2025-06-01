# SpacetimeDB Client Debug Tools

This document provides instructions on how to use the debugging tools for the SpacetimeDB Robot Tracking System client application.

## Overview

The `debug.js` script provides a comprehensive set of tools to help diagnose and troubleshoot issues with the SpacetimeDB client application. It includes:

- A visual debug console that can be toggled on/off
- Functions to test connectivity to the SpacetimeDB server
- Tools to verify that the SpacetimeDB SDK is loaded correctly
- Network connectivity tests
- Browser compatibility checks
- Application state inspection
- Simulated operations for testing

## Getting Started

### 1. Include the Debug Script

Add the debug script to your HTML file after the main application scripts:

```html
<script src="app.js"></script>
<script src="debug.js"></script>
```

### 2. Access the Debug Console

Once the page loads, you'll see a "Debug Console" button in the top-right corner of the screen. Click this button to toggle the debug console on/off.

### 3. Run Diagnostic Tests

In the debug console, click the "Run Tests" button to run all diagnostic tests, which include:

- Browser compatibility check
- Network connectivity test
- SpacetimeDB SDK loading test
- Connection test to the SpacetimeDB module
- Basic robot operations test

## Using the Debug Tools from the Browser Console

All debug functions are also available through the browser's developer console via the `window.debugTools` object:

```javascript
// Run all diagnostic tests
window.debugTools.runAllTests();

// Test if the SpacetimeDB SDK is loaded correctly
window.debugTools.testSDKLoading();

// Test connection to the SpacetimeDB module
window.debugTools.testConnection('localhost:3000');

// Test basic robot operations
window.debugTools.testRobotOperations('localhost:3000');

// Check network connectivity
window.debugTools.checkNetworkConnectivity();

// Check browser compatibility
window.debugTools.checkBrowserCompatibility();

// Inspect the current application state
window.debugTools.inspectAppState();

// Log a custom debug message
window.debugTools.logDebug('Custom debug message', 'info'); // Types: 'info', 'error', 'warn', 'success'
```

## Configuration

You can modify the debug configuration at the top of the `debug.js` file:

```javascript
const DEBUG_CONFIG = {
    logToConsole: true,        // Log messages to browser console
    logToPage: true,           // Log messages to debug panel
    verboseLogging: true,      // Enable verbose logging
    autoRunTests: false,       // Automatically run tests on page load
    testModuleAddress: 'localhost:3000'  // Default module address for tests
};
```

## Troubleshooting Common Issues

### SpacetimeDB SDK Not Loading

If the SpacetimeDB SDK fails to load, the debug script will:

1. Check if any SpacetimeDB script tags exist in the document
2. Attempt to load the SDK manually from the primary CDN
3. If that fails, try loading from an alternative CDN
4. Log detailed error messages to help identify the issue

### Connection Issues

If you're having trouble connecting to the SpacetimeDB module:

1. Run `window.debugTools.testConnection()` to test the connection
2. Check the debug console for error messages
3. Verify that the module address is correct
4. Run `window.debugTools.checkNetworkConnectivity()` to ensure you have internet access

### Robot Operations Not Working

If robot operations (adding, updating, etc.) aren't working:

1. Run `window.debugTools.testRobotOperations()` to test basic operations
2. Check the debug console for error messages
3. Run `window.debugTools.inspectAppState()` to see the current state of the application

## Advanced Usage

### Adding Custom Debug Functions

You can extend the debug tools by adding your own functions:

```javascript
// Add a custom debug function
window.debugTools.myCustomFunction = function() {
    window.debugTools.logDebug('Running my custom function', 'info');
    // Your custom debug code here
};

// Call your custom function
window.debugTools.myCustomFunction();
```

### Programmatically Controlling the Debug Panel

You can programmatically show/hide the debug panel:

```javascript
// Show the debug panel
document.getElementById('debug-panel').style.display = 'block';

// Hide the debug panel
document.getElementById('debug-panel').style.display = 'none';
```

## Conclusion

The debug tools provide a powerful way to diagnose and troubleshoot issues with the SpacetimeDB client application. By using these tools, you can quickly identify and resolve problems related to SDK loading, connectivity, and application state.