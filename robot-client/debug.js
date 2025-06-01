// SpacetimeDB Client Debug Script
// This script helps diagnose issues with the SpacetimeDB client application

// Debug configuration
const DEBUG_CONFIG = {
    logToConsole: true,
    logToPage: true,
    verboseLogging: true,
    autoRunTests: false,
    testModuleAddress: 'localhost:3000'
};

// Initialize debug environment
function initDebugEnvironment() {
    console.log('Initializing SpacetimeDB Debug Environment');

    // Create debug UI if it doesn't exist
    if (DEBUG_CONFIG.logToPage && !document.getElementById('debug-panel')) {
        createDebugPanel();
    }

    logDebug('Debug environment initialized');
    logDebug(`User Agent: ${navigator.userAgent}`);
    logDebug(`Page URL: ${window.location.href}`);

    // Check if we're running in a local environment
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        logDebug('Running in local development environment');
    } else {
        logDebug('Running in remote environment');
    }

    // Run automatic tests if configured
    if (DEBUG_CONFIG.autoRunTests) {
        setTimeout(() => {
            runAllTests();
        }, 1000);
    }
}

// Create debug panel in the UI
function createDebugPanel() {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.style.cssText = `
        position: fixed;
        bottom: 0;
        right: 0;
        width: 400px;
        height: 300px;
        background-color: rgba(0, 0, 0, 0.8);
        color: #00ff00;
        font-family: monospace;
        font-size: 12px;
        padding: 10px;
        overflow: auto;
        z-index: 9999;
        border-top-left-radius: 5px;
        box-shadow: -2px -2px 10px rgba(0, 0, 0, 0.3);
    `;

    const debugHeader = document.createElement('div');
    debugHeader.textContent = 'SpacetimeDB Debug Console';
    debugHeader.style.cssText = `
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 10px;
        padding-bottom: 5px;
        border-bottom: 1px solid #00ff00;
    `;

    const debugContent = document.createElement('div');
    debugContent.id = 'debug-content';
    debugContent.style.cssText = `
        height: calc(100% - 60px);
        overflow: auto;
        margin-bottom: 10px;
    `;

    const debugActions = document.createElement('div');
    debugActions.style.cssText = `
        display: flex;
        justify-content: space-between;
    `;

    const runTestsButton = document.createElement('button');
    runTestsButton.textContent = 'Run Tests';
    runTestsButton.onclick = runAllTests;

    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear';
    clearButton.onclick = () => {
        document.getElementById('debug-content').innerHTML = '';
    };

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.onclick = () => {
        document.getElementById('debug-panel').style.display = 'none';
    };

    debugActions.appendChild(runTestsButton);
    debugActions.appendChild(clearButton);
    debugActions.appendChild(closeButton);

    debugPanel.appendChild(debugHeader);
    debugPanel.appendChild(debugContent);
    debugPanel.appendChild(debugActions);

    document.body.appendChild(debugPanel);
}

// Log debug message
function logDebug(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const formattedMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;

    // Log to browser console
    if (DEBUG_CONFIG.logToConsole) {
        switch (type) {
            case 'error':
                console.error(formattedMessage);
                break;
            case 'warn':
                console.warn(formattedMessage);
                break;
            case 'success':
                console.log(`%c${formattedMessage}`, 'color: green');
                break;
            default:
                console.log(formattedMessage);
        }
    }

    // Log to debug panel
    if (DEBUG_CONFIG.logToPage) {
        const debugContent = document.getElementById('debug-content');
        if (debugContent) {
            const logEntry = document.createElement('div');

            // Set color based on message type
            let color = '#ffffff';
            switch (type) {
                case 'error':
                    color = '#ff5555';
                    break;
                case 'warn':
                    color = '#ffaa00';
                    break;
                case 'success':
                    color = '#55ff55';
                    break;
                default:
                    color = '#aaaaaa';
            }

            logEntry.style.color = color;
            logEntry.textContent = formattedMessage;
            debugContent.appendChild(logEntry);
            debugContent.scrollTop = debugContent.scrollHeight;
        }
    }
}

// Test SpacetimeDB SDK loading
function testSDKLoading() {
    logDebug('Testing SpacetimeDB SDK loading...', 'info');

    if (typeof SpacetimeDB === 'undefined') {
        logDebug('SpacetimeDB SDK is not loaded!', 'error');

        // Check if script elements for SDK exist
        const sdkScripts = document.querySelectorAll('script[src*="spacetimedb"]');
        if (sdkScripts.length === 0) {
            logDebug('No SpacetimeDB SDK script tags found in the document', 'error');
        } else {
            logDebug(`Found ${sdkScripts.length} SpacetimeDB script tags:`, 'info');
            sdkScripts.forEach((script, index) => {
                logDebug(`  ${index + 1}. ${script.src}`, 'info');
            });
        }

        // Try to load SDK manually
        logDebug('Attempting to load SDK manually...', 'info');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@clockworklabs/spacetimedb-sdk@0.7.0/dist/spacetimedb.min.js';

        script.onload = function() {
            if (typeof SpacetimeDB !== 'undefined') {
                logDebug('Successfully loaded SpacetimeDB SDK manually!', 'success');
                logDebug(`SDK Version: ${SpacetimeDB.version || 'unknown'}`, 'info');
            } else {
                logDebug('SDK script loaded but SpacetimeDB object is still undefined', 'error');
            }
        };

        script.onerror = function() {
            logDebug('Failed to load SpacetimeDB SDK manually', 'error');

            // Try alternative CDN
            logDebug('Trying alternative CDN...', 'info');
            const altScript = document.createElement('script');
            altScript.src = 'https://unpkg.com/@clockworklabs/spacetimedb-sdk@0.7.0/dist/spacetimedb.min.js';

            altScript.onload = function() {
                if (typeof SpacetimeDB !== 'undefined') {
                    logDebug('Successfully loaded SpacetimeDB SDK from alternative CDN!', 'success');
                } else {
                    logDebug('SDK script loaded from alternative CDN but SpacetimeDB object is still undefined', 'error');
                }
            };

            altScript.onerror = function() {
                logDebug('Failed to load SpacetimeDB SDK from alternative CDN', 'error');
                logDebug('All attempts to load the SDK have failed. Please check your internet connection.', 'error');
            };

            document.head.appendChild(altScript);
        };

        document.head.appendChild(script);
        return false;
    } else {
        logDebug('SpacetimeDB SDK is loaded!', 'success');
        logDebug(`SDK Version: ${SpacetimeDB.version || 'unknown'}`, 'info');
        return true;
    }
}

// Test connection to SpacetimeDB module
function testConnection(address = DEBUG_CONFIG.testModuleAddress) {
    logDebug(`Testing connection to SpacetimeDB module at ${address}...`, 'info');

    if (typeof SpacetimeDB === 'undefined') {
        logDebug('Cannot test connection: SpacetimeDB SDK is not loaded', 'error');
        return false;
    }

    try {
        const testClient = new SpacetimeDB.Client();

        testClient.on('connected', () => {
            logDebug(`Successfully connected to ${address}!`, 'success');

            // Get module info if possible
            if (testClient.getModuleInfo) {
                testClient.getModuleInfo().then(info => {
                    logDebug('Module Info:', 'info');
                    logDebug(`  Name: ${info.name || 'unknown'}`, 'info');
                    logDebug(`  Version: ${info.version || 'unknown'}`, 'info');
                }).catch(err => {
                    logDebug(`Failed to get module info: ${err.message}`, 'warn');
                });
            }

            // Disconnect after successful test
            setTimeout(() => {
                testClient.disconnect();
                logDebug('Test connection closed', 'info');
            }, 2000);
        });

        testClient.on('disconnected', () => {
            logDebug('Disconnected from test module', 'info');
        });

        testClient.on('error', (error) => {
            logDebug(`Connection error: ${error.message}`, 'error');
        });

        // Connect to the module
        testClient.connect(address);
        logDebug(`Connection attempt initiated to ${address}`, 'info');

        return true;
    } catch (error) {
        logDebug(`Failed to create test client: ${error.message}`, 'error');
        return false;
    }
}

// Test basic robot operations
function testRobotOperations(address = DEBUG_CONFIG.testModuleAddress) {
    logDebug('Testing basic robot operations...', 'info');

    if (typeof SpacetimeDB === 'undefined') {
        logDebug('Cannot test operations: SpacetimeDB SDK is not loaded', 'error');
        return false;
    }

    try {
        const testClient = new SpacetimeDB.Client();
        const testRobotId = `test-robot-${Date.now()}`;

        testClient.on('connected', () => {
            logDebug(`Connected to ${address} for operation testing`, 'success');

            // Test sequence: add robot, update distance, increment distance, get distance
            setTimeout(() => {
                logDebug(`Creating test robot with ID: ${testRobotId}`, 'info');
                testClient.call('update_distance', [testRobotId, 0])
                    .then(() => {
                        logDebug('Successfully created test robot', 'success');

                        // Update distance
                        return testClient.call('update_distance', [testRobotId, 100]);
                    })
                    .then(() => {
                        logDebug('Successfully updated robot distance to 100', 'success');

                        // Get distance
                        return testClient.call('get_distance', [testRobotId]);
                    })
                    .then(distance => {
                        logDebug(`Current distance: ${distance}`, 'info');
                        if (distance === 100) {
                            logDebug('Distance value is correct', 'success');
                        } else {
                            logDebug(`Distance value is incorrect. Expected 100, got ${distance}`, 'error');
                        }

                        // Increment distance
                        return testClient.call('increment_distance', [testRobotId, 50]);
                    })
                    .then(() => {
                        logDebug('Successfully incremented robot distance by 50', 'success');

                        // Get updated distance
                        return testClient.call('get_distance', [testRobotId]);
                    })
                    .then(distance => {
                        logDebug(`Updated distance: ${distance}`, 'info');
                        if (distance === 150) {
                            logDebug('Incremented distance value is correct', 'success');
                        } else {
                            logDebug(`Incremented distance value is incorrect. Expected 150, got ${distance}`, 'error');
                        }

                        // Test history
                        const pastTime = Date.now() - 1000; // 1 second ago
                        return testClient.call('get_distance_at_time', [testRobotId, pastTime]);
                    })
                    .then(historyDistance => {
                        logDebug(`Historical distance (1 second ago): ${historyDistance}`, 'info');

                        // Clean up - disconnect
                        testClient.disconnect();
                        logDebug('Test operations completed and connection closed', 'success');
                    })
                    .catch(error => {
                        logDebug(`Operation test error: ${error.message}`, 'error');
                        testClient.disconnect();
                    });
            }, 1000);
        });

        testClient.on('error', (error) => {
            logDebug(`Operation test connection error: ${error.message}`, 'error');
        });

        // Connect to the module
        testClient.connect(address);
        return true;
    } catch (error) {
        logDebug(`Failed to create operation test client: ${error.message}`, 'error');
        return false;
    }
}

// Check network connectivity
function checkNetworkConnectivity() {
    logDebug('Checking network connectivity...', 'info');

    // Check navigator.onLine first (basic check)
    if (!navigator.onLine) {
        logDebug('Browser reports that you are offline!', 'error');
        return false;
    }

    // Try to fetch a known reliable resource
    logDebug('Testing connection to CDN...', 'info');

    Promise.all([
        fetch('https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js', { method: 'HEAD', mode: 'no-cors', cache: 'no-store' })
            .then(() => {
                logDebug('Successfully connected to jsdelivr CDN', 'success');
                return true;
            })
            .catch(() => {
                logDebug('Failed to connect to jsdelivr CDN', 'error');
                return false;
            }),

        fetch('https://unpkg.com/react@17/umd/react.production.min.js', { method: 'HEAD', mode: 'no-cors', cache: 'no-store' })
            .then(() => {
                logDebug('Successfully connected to unpkg CDN', 'success');
                return true;
            })
            .catch(() => {
                logDebug('Failed to connect to unpkg CDN', 'error');
                return false;
            })
    ]).then(results => {
        const allSuccessful = results.every(result => result === true);
        if (allSuccessful) {
            logDebug('Network connectivity check passed', 'success');
        } else {
            logDebug('Network connectivity check failed for some CDNs', 'warn');
        }
    });

    return true;
}

// Check browser compatibility
function checkBrowserCompatibility() {
    logDebug('Checking browser compatibility...', 'info');

    const compatibility = {
        promises: typeof Promise !== 'undefined',
        fetch: typeof fetch !== 'undefined',
        arrowFunctions: (() => { try { eval('() => {}'); return true; } catch (e) { return false; } })(),
        async: (() => { try { eval('async () => {}'); return true; } catch (e) { return false; } })(),
        localStorage: (() => { try { return !!window.localStorage; } catch (e) { return false; } })(),
        webSockets: (() => { try { return !!window.WebSocket; } catch (e) { return false; } })()
    };

    let compatible = true;

    Object.entries(compatibility).forEach(([feature, supported]) => {
        if (supported) {
            logDebug(`✓ ${feature} is supported`, 'success');
        } else {
            logDebug(`✗ ${feature} is NOT supported`, 'error');
            compatible = false;
        }
    });

    if (compatible) {
        logDebug('Browser compatibility check passed', 'success');
    } else {
        logDebug('Browser compatibility check failed - some features are not supported', 'error');
    }

    return compatible;
}

// Run all tests
function runAllTests() {
    logDebug('Running all diagnostic tests...', 'info');

    // Check browser compatibility
    checkBrowserCompatibility();

    // Check network connectivity
    checkNetworkConnectivity();

    // Test SDK loading
    const sdkLoaded = testSDKLoading();

    // Only proceed with connection tests if SDK is loaded
    if (sdkLoaded) {
        // Test connection
        testConnection();

        // Test robot operations
        setTimeout(() => {
            testRobotOperations();
        }, 3000);
    }
}

// Inspect application state
function inspectAppState() {
    logDebug('Inspecting application state...', 'info');

    // Check if our app variables are defined
    if (typeof client !== 'undefined') {
        logDebug('SpacetimeDB client is defined', 'success');
        logDebug(`Client connected: ${connected ? 'Yes' : 'No'}`, 'info');
    } else {
        logDebug('SpacetimeDB client is not defined', 'error');
    }

    // Check robots collection
    if (typeof robots !== 'undefined') {
        logDebug(`Number of robots: ${robots.size}`, 'info');
        if (robots.size > 0) {
            logDebug('Robot IDs:', 'info');
            robots.forEach((robot, id) => {
                logDebug(`  ${id}: distance = ${robot.distance}`, 'info');
            });
        }
    } else {
        logDebug('Robots collection is not defined', 'error');
    }

    // Check selected robot
    if (typeof selectedRobotId !== 'undefined') {
        if (selectedRobotId) {
            logDebug(`Selected robot: ${selectedRobotId}`, 'info');
        } else {
            logDebug('No robot is selected', 'info');
        }
    } else {
        logDebug('selectedRobotId variable is not defined', 'error');
    }

    // Check history entries
    if (typeof historyEntries !== 'undefined') {
        logDebug(`Number of robots with history: ${historyEntries.size}`, 'info');
        if (historyEntries.size > 0 && DEBUG_CONFIG.verboseLogging) {
            historyEntries.forEach((entries, robotId) => {
                logDebug(`  ${robotId}: ${entries.length} history entries`, 'info');
            });
        }
    } else {
        logDebug('historyEntries collection is not defined', 'error');
    }
}

// Add debug controls to the page
function addDebugControls() {
    const debugControls = document.createElement('div');
    debugControls.id = 'debug-controls';
    debugControls.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 10px;
        border-radius: 5px;
        z-index: 9998;
    `;

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Debug Console';
    toggleButton.onclick = () => {
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
        } else {
            createDebugPanel();
        }
    };

    debugControls.appendChild(toggleButton);
    document.body.appendChild(debugControls);
}

// Initialize debug tools when the page is loaded
window.addEventListener('DOMContentLoaded', () => {
    // Wait a moment to ensure the page is fully loaded
    setTimeout(() => {
        initDebugEnvironment();
        addDebugControls();

        // Add to window for console access
        window.debugTools = {
            runAllTests,
            testSDKLoading,
            testConnection,
            testRobotOperations,
            checkNetworkConnectivity,
            checkBrowserCompatibility,
            inspectAppState,
            logDebug
        };

        console.log('SpacetimeDB Debug Tools initialized. Access via window.debugTools in the console.');
    }, 500);
});

// Export debug functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runAllTests,
        testSDKLoading,
        testConnection,
        testRobotOperations,
        checkNetworkConnectivity,
        checkBrowserCompatibility,
        inspectAppState,
        logDebug
    };
}
