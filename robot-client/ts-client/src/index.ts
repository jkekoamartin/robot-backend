import { SpacetimeDBClient } from '@clockworklabs/spacetimedb-sdk';
import { Robot, RobotHistory, Reducers } from './models';
import './styles.css';

// Application version
const APP_VERSION = '1.1.0';

/**
 * Robot Tracking System TypeScript Client
 * 
 * This client connects to a SpacetimeDB module and allows users to:
 * - Track multiple robots
 * - Update and increment robot distances
 * - View historical distance data
 */

// DOM Elements
const connectionIndicator = document.getElementById('connection-indicator') as HTMLSpanElement;
const connectionText = document.getElementById('connection-text') as HTMLSpanElement;
const moduleAddressInput = document.getElementById('module-address') as HTMLInputElement;
const connectBtn = document.getElementById('connect-btn') as HTMLButtonElement;
const newRobotIdInput = document.getElementById('new-robot-id') as HTMLInputElement;
const addRobotBtn = document.getElementById('add-robot-btn') as HTMLButtonElement;
const robotList = document.getElementById('robot-list') as HTMLUListElement;
const noRobotSelected = document.getElementById('no-robot-selected') as HTMLDivElement;
const robotInfo = document.getElementById('robot-info') as HTMLDivElement;
const robotIdDisplay = document.getElementById('robot-id-display') as HTMLHeadingElement;
const updateDistanceValue = document.getElementById('update-distance-value') as HTMLInputElement;
const updateDistanceBtn = document.getElementById('update-distance-btn') as HTMLButtonElement;
const incrementDistanceValue = document.getElementById('increment-distance-value') as HTMLInputElement;
const incrementDistanceBtn = document.getElementById('increment-distance-btn') as HTMLButtonElement;
const sayHelloBtn = document.getElementById('say-hello-btn') as HTMLButtonElement;
const currentDistance = document.getElementById('current-distance') as HTMLSpanElement;
const historyTimestamp = document.getElementById('history-timestamp') as HTMLInputElement;
const queryHistoryBtn = document.getElementById('query-history-btn') as HTMLButtonElement;
const historyDistance = document.getElementById('history-distance') as HTMLSpanElement;
const historyLogList = document.getElementById('history-log-list') as HTMLUListElement;
const consoleOutput = document.getElementById('console-output') as HTMLDivElement;

// Application State
let client: SpacetimeDBClient | null = null;
let connected = false;
let robots = new Map<string, Robot>(); // Map of robot_id -> robot object
let selectedRobotId: string | null = null;
let historyEntries = new Map<string, RobotHistory[]>(); // Map of robot_id -> array of history entries

// Helper Functions
function logToConsole(message: string): void {
  const timestamp = new Date().toLocaleTimeString();
  if (consoleOutput) {
    consoleOutput.innerHTML += `[${timestamp}] ${message}\n`;
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  } else {
    console.log(`[${timestamp}] ${message}`);
  }
}

function updateConnectionStatus(isConnected: boolean): void {
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

function updateRobotList(): void {
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

function selectRobot(robotId: string | null): void {
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

function updateRobotDetails(): void {
  if (!selectedRobotId || !robots.has(selectedRobotId)) return;

  const robot = robots.get(selectedRobotId)!;
  currentDistance.textContent = robot.distance.toString();

  // Update history log
  updateHistoryLog();
}

function updateHistoryLog(): void {
  historyLogList.innerHTML = '';

  if (!historyEntries.has(selectedRobotId!)) return;

  const entries = historyEntries.get(selectedRobotId!)!;
  entries.sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp (newest first)

  entries.forEach(entry => {
    const li = document.createElement('li');
    const date = new Date(entry.timestamp);
    li.textContent = `${date.toLocaleString()}: ${entry.distance} units`;
    historyLogList.appendChild(li);
  });
}

// SpacetimeDB Client Setup
function setupClient(address: string): boolean {
  try {
    // Create a new SpacetimeDB client
    client = new SpacetimeDBClient();

    // Set up event handlers
    client.on('connected', () => {
      logToConsole('Connected to SpacetimeDB module');
      updateConnectionStatus(true);
    });

    client.on('disconnected', () => {
      logToConsole('Disconnected from SpacetimeDB module');
      updateConnectionStatus(false);
    });

    client.on('error', (error: Error) => {
      logToConsole(`Error: ${error.message}`);
    });

    // Subscribe to robot table updates
    client.subscribe<Robot>('robot', (robotData) => {
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
    client.subscribe<RobotHistory>('robot_history', (historyData) => {
      logToConsole('Received robot history update');

      // Process each history entry
      historyData.forEach(entry => {
        if (!historyEntries.has(entry.robot_id)) {
          historyEntries.set(entry.robot_id, []);
        }

        const entries = historyEntries.get(entry.robot_id)!;

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
    logToConsole(`Failed to setup client: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

function disconnectClient(): void {
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
    client.call<Reducers>('update_distance', [robotId, 0])
      .then(() => {
        logToConsole(`Added robot: ${robotId}`);
        newRobotIdInput.value = '';
      })
      .catch(error => {
        logToConsole(`Failed to add robot: ${error instanceof Error ? error.message : String(error)}`);
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
    client.call<Reducers>('update_distance', [selectedRobotId, distance])
      .then(() => {
        logToConsole(`Updated ${selectedRobotId}'s distance to ${distance}`);
        updateDistanceValue.value = '';
      })
      .catch(error => {
        logToConsole(`Failed to update distance: ${error instanceof Error ? error.message : String(error)}`);
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
    client.call<Reducers>('increment_distance', [selectedRobotId, increment])
      .then(() => {
        logToConsole(`Incremented ${selectedRobotId}'s distance by ${increment}`);
        incrementDistanceValue.value = '';
      })
      .catch(error => {
        logToConsole(`Failed to increment distance: ${error instanceof Error ? error.message : String(error)}`);
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
    client.call<Reducers>('say_hello', [selectedRobotId])
      .then(() => {
        logToConsole(`Said hello to ${selectedRobotId}`);
      })
      .catch(error => {
        logToConsole(`Failed to say hello: ${error instanceof Error ? error.message : String(error)}`);
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
    client.call<Reducers>('get_distance_at_time', [selectedRobotId, timestamp])
      .then(distance => {
        logToConsole(`Distance of ${selectedRobotId} at ${new Date(timestamp).toLocaleString()}: ${distance} units`);
        historyDistance.textContent = distance.toString();
      })
      .catch(error => {
        logToConsole(`Failed to query history: ${error instanceof Error ? error.message : String(error)}`);
      });
  } else {
    logToConsole('Not connected to SpacetimeDB module');
  }
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  logToConsole(`Robot Tracking System TypeScript Client v${APP_VERSION} initialized`);
  logToConsole('Please connect to a SpacetimeDB module to begin');
});
