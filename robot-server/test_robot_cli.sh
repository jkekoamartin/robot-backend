#!/bin/bash

# Test script for robot distance tracking and history features
# This script uses the actual SpacetimeDB CLI to interact with the module

echo "Robot Distance Tracking and History Testing Script (Using SpacetimeDB CLI)"
echo "======================================================================"
echo

# Set your SpacetimeDB module address
MODULE_ADDRESS="your_module_address_here"

# Function to call a reducer and display the result
call_reducer() {
    local reducer=$1
    local args=$2

    echo "$ spacetime call $MODULE_ADDRESS $reducer $args"
    spacetime call $MODULE_ADDRESS $reducer $args
    echo
}

# Function to query a table and display the result
query_table() {
    local query=$1

    echo "$ spacetime query $MODULE_ADDRESS \"$query\""
    spacetime query $MODULE_ADDRESS "$query"
    echo
}

echo "Connecting to SpacetimeDB module at $MODULE_ADDRESS..."
echo

# Test 1: Multiple Robots Basic Operations
echo "Test 1: Multiple Robots Basic Operations"
echo "--------------------------------------"

# Create Robot A
call_reducer "update_distance" "robot-a 100"
call_reducer "get_distance" "robot-a"

# Create Robot B
call_reducer "update_distance" "robot-b 200"
call_reducer "get_distance" "robot-b"

# Create Robot C
call_reducer "update_distance" "robot-c 300"
call_reducer "get_distance" "robot-c"

# Update Robot A
call_reducer "update_distance" "robot-a 150"
call_reducer "get_distance" "robot-a"

# Query all robots
query_table "SELECT * FROM robot"
echo "Test 1 completed!"
echo

# Test 2: Multiple Robots Distance Increment
echo "Test 2: Multiple Robots Distance Increment"
echo "----------------------------------------"

# Increment Robot A
call_reducer "increment_distance" "robot-a 50"
call_reducer "get_distance" "robot-a"

# Increment Robot B
call_reducer "increment_distance" "robot-b 100"
call_reducer "get_distance" "robot-b"

# Increment Robot C
call_reducer "increment_distance" "robot-c 50"
call_reducer "get_distance" "robot-c"

# Query all robots
query_table "SELECT * FROM robot"
echo "Test 2 completed!"
echo

# Test 3: Multiple Robots History and Time-based Retrieval
echo "Test 3: Multiple Robots History and Time-based Retrieval"
echo "-----------------------------------------------------"

# Reset all robots
call_reducer "update_distance" "robot-a 0"
call_reducer "update_distance" "robot-b 0"
call_reducer "update_distance" "robot-c 0"

# Get current timestamp
timestamp1=$(date +%s)
echo "Current timestamp (timestamp1): $timestamp1"

# Update all robots at timestamp1
call_reducer "update_distance" "robot-a 100"
call_reducer "update_distance" "robot-b 200"
call_reducer "update_distance" "robot-c 300"
sleep 2

timestamp2=$(date +%s)
echo "Current timestamp (timestamp2): $timestamp2"

# Update all robots at timestamp2
call_reducer "update_distance" "robot-a 150"
call_reducer "update_distance" "robot-b 250"
call_reducer "update_distance" "robot-c 350"
sleep 2

timestamp3=$(date +%s)
echo "Current timestamp (timestamp3): $timestamp3"

# Update all robots at timestamp3
call_reducer "update_distance" "robot-a 200"
call_reducer "update_distance" "robot-b 300"
call_reducer "update_distance" "robot-c 400"

# Time-based queries for Robot A
call_reducer "get_distance_at_time" "robot-a $timestamp1"
call_reducer "get_distance_at_time" "robot-a $timestamp2"
call_reducer "get_distance_at_time" "robot-a $timestamp3"

# Time-based queries for Robot B
call_reducer "get_distance_at_time" "robot-b $timestamp1"
call_reducer "get_distance_at_time" "robot-b $timestamp2"
call_reducer "get_distance_at_time" "robot-b $timestamp3"

# Time-based queries for Robot C
call_reducer "get_distance_at_time" "robot-c $timestamp1"
call_reducer "get_distance_at_time" "robot-c $timestamp2"
call_reducer "get_distance_at_time" "robot-c $timestamp3"

# Calculate a timestamp between timestamp1 and timestamp2
timestamp_between=$((timestamp1 + 1))
call_reducer "get_distance_at_time" "robot-a $timestamp_between"
call_reducer "get_distance_at_time" "robot-b $timestamp_between"
call_reducer "get_distance_at_time" "robot-c $timestamp_between"

# Query the history table
query_table "SELECT * FROM robot_history ORDER BY robot_id, timestamp DESC"
echo "Test 3 completed!"
echo

# Test 4: Say Hello to Multiple Robots
echo "Test 4: Say Hello to Multiple Robots"
echo "----------------------------------"
call_reducer "say_hello" "robot-a"
call_reducer "say_hello" "robot-b"
call_reducer "say_hello" "robot-c"
echo "Test 4 completed!"
echo

echo "All tests completed!"
echo
echo "Note: This script uses the actual SpacetimeDB CLI to interact with a deployed module."
echo "Make sure to replace 'your_module_address_here' with your actual module address."
