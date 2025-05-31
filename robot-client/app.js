// Robot Tracking System Client Application

// DOM Elements
const connectionIndicator = document.getElementById('connection-indicator');
const connectionText = document.getElementById('connection-text');
const moduleAddressInput = document.getElementById('module-address');
const connectBtn = document.getElementById('connect-btn');
const newRobotIdInput = document.getElementById('new-robot-id');
const addRobotBtn = document.getElementById('add-robot-btn');
const robotList = document.getElementById('robot-list');
const noRobotSelected = document.getElementById('no-robot-selected');
const robotInfo = document.getElementById('robot-info');
const robotIdDisplay = document.getElementById('robot-id-display');
const updateDistanceValue = document.getElementById('update-distance-value');
const updateDistanceBtn = document.getElementById('update-distance-btn');
const incrementDistanceValue = document.getElementById('increment-distance-value');
const incrementDistanceBtn = document.getElementById('increment-distance-btn');
const sayHelloBtn = document.getElementById('say-hello-btn');
const currentDistance = document.getElementById('current-distance');
const historyTimestamp = document.getElementById('history-timestamp');
const queryHistoryBtn = document.getElementById('query-history-btn');
const historyDistance = document.getElementById('history-distance');
const historyLogList = document.getElementById('history-log-list');
const consoleOutput = document.getElementById('console-output');

// Application State
let client = null;
let connected = false;
let robots = new Map(); // Map of robot_id -> robot object
let selectedRobotId = null;
let historyEntries = new Map(); // Map of robot_id -> array of history entries

// Helper Functions
function logToConsole(message) {
    const timestamp = new Date().toLocaleTimeString();
    consoleOutput.innerHTML += `[${timestamp}] ${message}\n`;
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function updateConnectionStatus(isConnected) {
    connected = isConnected;
    if (isConnected) {
        connectionIndicator.className = 'connected';
        connectionText.textContent = 'Connected';
        connectBtn.textContent = 'Disconnect';
    } else {
        connectionIndicator.className = 'disconnected';
        connectionText.textContent = 'Disconnected';
        connectBtn.textContent = 'Connect';
    }
}

function updateRobotList() {
    robotList.innerHTML = '';
    robots.forEach((robot, id) => {
        const li = document.createElement('li');
        li.textContent = `${id} (${robot.distance} units)`;
        li.dataset.robotId = id;
        if (id === selectedRobotId) {
            li.className = 'selected';
        }
        li.addEventListener('click', () => selectRobot(id));
        robotList.appendChild(li);
    });
}

function selectRobot(robotId) {
    selectedRobotId = robotId;
    updateRobotList();
    
    if (robotId) {
        noRobotSelected.style.display = 'none';
        robotInfo.style.display = 'block';
        robotIdDisplay.textContent = `Robot: ${robotId}`;
        updateRobotDetails();
    } else {
        noRobotSelected.style.display = 'block';
        robotInfo.style.display = 'none';
    }
}

function updateRobotDetails() {
    if (!selectedRobotId || !robots.has(selectedRobotId)) return;
    
    const robot = robots.get(selectedRobotId);
    currentDistance.textContent = robot.distance;
    
    // Update history log
    updateHistoryLog();
}

function updateHistoryLog() {
    historyLogList.innerHTML = '';
    
    if (!historyEntries.has(selectedRobotId)) return;
    
    const entries = historyEntries.get(selectedRobotId);
    entries.sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp (newest first)
    
    entries.forEach(entry => {
        const li = document.createElement('li');
        const date = new Date(entry.timestamp);
        li.textContent = `${date.toLocaleString()}: ${entry.distance} units`;
        historyLogList.appendChild(li);
    });
}

// SpacetimeDB Client Setup
function setupClient(address) {
    try {
        // Create a new SpacetimeDB client
        client = new SpacetimeDB.Client();
        
        // Set up event handlers
        client.on('connected', () => {
            logToConsole('Connected to SpacetimeDB module');
            updateConnectionStatus(true);
        });
        
        client.on('disconnected', () => {
            logToConsole('Disconnected from SpacetimeDB module');
            updateConnectionStatus(false);
        });
        
        client.on('error', (error) => {
            logToConsole(`Error: ${error.message}`);
        });
        
        // Subscribe to robot table updates
        client.subscribe('robot', (robotData) => {
            logToConsole('Received robot table update');
            
            // Update our local robots map
            robotData.forEach(robot => {
                robots.set(robot.robot_id, robot);
            });
            
            updateRobotList();
            
            // Update details if the selected robot was updated
            if (selectedRobotId && robots.has(selectedRobotId)) {
                updateRobotDetails();
            }
        });
        
        // Subscribe to robot_history table updates
        client.subscribe('robot_history', (historyData) => {
            logToConsole('Received robot history update');
            
            // Process each history entry
            historyData.forEach(entry => {
                if (!historyEntries.has(entry.robot_id)) {
                    historyEntries.set(entry.robot_id, []);
                }
                
                const entries = historyEntries.get(entry.robot_id);
                
                // Check if this entry already exists
                const existingIndex = entries.findIndex(e => e.timestamp === entry.timestamp);
                if (existingIndex >= 0) {
                    entries[existingIndex] = entry;
                } else {
                    entries.push(entry);
                }
            });
            
            // Update history log if the selected robot's history was updated
            if (selectedRobotId) {
                updateHistoryLog();
            }
        });
        
        // Connect to the module
        logToConsole(`Connecting to ${address}...`);
        client.connect(address);
        
        return true;
    } catch (error) {
        logToConsole(`Failed to setup client: ${error.message}`);
        return false;
    }
}

function disconnectClient() {
    if (client) {
        client.disconnect();
        client = null;
    }
    
    // Reset application state
    robots.clear();
    historyEntries.clear();
    selectedRobotId = null;
    updateRobotList();
    selectRobot(null);
    updateConnectionStatus(false);
}

// Event Handlers
connectBtn.addEventListener('click', () => {
    if (connected) {
        disconnectClient();
    } else {
        const address = moduleAddressInput.value.trim();
        if (address) {
            setupClient(address);
        } else {
            logToConsole('Please enter a valid module address');
        }
    }
});

addRobotBtn.addEventListener('click', () => {
    const robotId = newRobotIdInput.value.trim();
    if (!robotId) {
        logToConsole('Please enter a robot ID');
        return;
    }
    
    // Initialize the robot with distance 0
    if (client && connected) {
        client.call('update_distance', [robotId, 0])
            .then(() => {
                logToConsole(`Added robot: ${robotId}`);
                newRobotIdInput.value = '';
            })
            .catch(error => {
                logToConsole(`Failed to add robot: ${error.message}`);
            });
    } else {
        logToConsole('Not connected to SpacetimeDB module');
    }
});

updateDistanceBtn.addEventListener('click', () => {
    if (!selectedRobotId) {
        logToConsole('No robot selected');
        return;
    }
    
    const distance = parseInt(updateDistanceValue.value);
    if (isNaN(distance) || distance < 0) {
        logToConsole('Please enter a valid distance (non-negative number)');
        return;
    }
    
    if (client && connected) {
        client.call('update_distance', [selectedRobotId, distance])
            .then(() => {
                logToConsole(`Updated ${selectedRobotId}'s distance to ${distance}`);
                updateDistanceValue.value = '';
            })
            .catch(error => {
                logToConsole(`Failed to update distance: ${error.message}`);
            });
    } else {
        logToConsole('Not connected to SpacetimeDB module');
    }
});

incrementDistanceBtn.addEventListener('click', () => {
    if (!selectedRobotId) {
        logToConsole('No robot selected');
        return;
    }
    
    const increment = parseInt(incrementDistanceValue.value);
    if (isNaN(increment) || increment < 0) {
        logToConsole('Please enter a valid increment (non-negative number)');
        return;
    }
    
    if (client && connected) {
        client.call('increment_distance', [selectedRobotId, increment])
            .then(() => {
                logToConsole(`Incremented ${selectedRobotId}'s distance by ${increment}`);
                incrementDistanceValue.value = '';
            })
            .catch(error => {
                logToConsole(`Failed to increment distance: ${error.message}`);
            });
    } else {
        logToConsole('Not connected to SpacetimeDB module');
    }
});

sayHelloBtn.addEventListener('click', () => {
    if (!selectedRobotId) {
        logToConsole('No robot selected');
        return;
    }
    
    if (client && connected) {
        client.call('say_hello', [selectedRobotId])
            .then(() => {
                logToConsole(`Said hello to ${selectedRobotId}`);
            })
            .catch(error => {
                logToConsole(`Failed to say hello: ${error.message}`);
            });
    } else {
        logToConsole('Not connected to SpacetimeDB module');
    }
});

queryHistoryBtn.addEventListener('click', () => {
    if (!selectedRobotId) {
        logToConsole('No robot selected');
        return;
    }
    
    const timestamp = new Date(historyTimestamp.value).getTime();
    if (isNaN(timestamp)) {
        logToConsole('Please select a valid timestamp');
        return;
    }
    
    if (client && connected) {
        client.call('get_distance_at_time', [selectedRobotId, timestamp])
            .then(distance => {
                logToConsole(`Distance of ${selectedRobotId} at ${new Date(timestamp).toLocaleString()}: ${distance} units`);
                historyDistance.textContent = distance;
            })
            .catch(error => {
                logToConsole(`Failed to query history: ${error.message}`);
            });
    } else {
        logToConsole('Not connected to SpacetimeDB module');
    }
});

// Initialize the application
logToConsole('Robot Tracking System Client initialized');
logToConsole('Please connect to a SpacetimeDB module to begin');