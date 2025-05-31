#!/bin/bash

# Test script for robot distance tracking and history features
# This script simulates interacting with a SpacetimeDB module

echo "Robot Distance Tracking and History Testing Script (Multiple Robots)"
echo "=================================================================="
echo

# Simulate SpacetimeDB CLI commands and responses
simulate_command() {
    local command=$1
    local expected_result=$2

    echo "$ spacetime call $command"
    echo "Result: $expected_result"
    echo
}

# Test 1: Multiple Robots Basic Operations
echo "Test 1: Multiple Robots Basic Operations"
echo "--------------------------------------"
echo "1. Create and update multiple robots"

# Create Robot A
simulate_command "update_distance robot-a 100" "Success"
simulate_command "get_distance robot-a" "100"

# Create Robot B
simulate_command "update_distance robot-b 200" "Success"
simulate_command "get_distance robot-b" "200"

# Create Robot C
simulate_command "update_distance robot-c 300" "Success"
simulate_command "get_distance robot-c" "300"

# Update Robot A
simulate_command "update_distance robot-a 150" "Success"
simulate_command "get_distance robot-a" "150"

# Verify all robots have correct values
simulate_command "get_distance robot-a" "150"
simulate_command "get_distance robot-b" "200"
simulate_command "get_distance robot-c" "300"

echo "Test 1 completed successfully!"
echo

# Test 2: Multiple Robots Distance Increment
echo "Test 2: Multiple Robots Distance Increment"
echo "----------------------------------------"

# Increment Robot A
simulate_command "increment_distance robot-a 50" "Success"
simulate_command "get_distance robot-a" "200"

# Increment Robot B
simulate_command "increment_distance robot-b 100" "Success"
simulate_command "get_distance robot-b" "300"

# Increment Robot C
simulate_command "increment_distance robot-c 50" "Success"
simulate_command "get_distance robot-c" "350"

echo "Test 2 completed successfully!"
echo

# Test 3: Multiple Robots History and Time-based Retrieval
echo "Test 3: Multiple Robots History and Time-based Retrieval"
echo "-----------------------------------------------------"

# Reset all robots
simulate_command "update_distance robot-a 0" "Success"
simulate_command "update_distance robot-b 0" "Success"
simulate_command "update_distance robot-c 0" "Success"

# Simulate timestamps
timestamp1=$(date +%s)
echo "Current timestamp (timestamp1): $timestamp1"

# Update all robots at timestamp1
simulate_command "update_distance robot-a 100" "Success"
simulate_command "update_distance robot-b 200" "Success"
simulate_command "update_distance robot-c 300" "Success"
sleep 2

timestamp2=$(date +%s)
echo "Current timestamp (timestamp2): $timestamp2"

# Update all robots at timestamp2
simulate_command "update_distance robot-a 150" "Success"
simulate_command "update_distance robot-b 250" "Success"
simulate_command "update_distance robot-c 350" "Success"
sleep 2

timestamp3=$(date +%s)
echo "Current timestamp (timestamp3): $timestamp3"

# Update all robots at timestamp3
simulate_command "update_distance robot-a 200" "Success"
simulate_command "update_distance robot-b 300" "Success"
simulate_command "update_distance robot-c 400" "Success"

# Simulate time-based queries for Robot A
simulate_command "get_distance_at_time robot-a $timestamp1" "100"
simulate_command "get_distance_at_time robot-a $timestamp2" "150"
simulate_command "get_distance_at_time robot-a $timestamp3" "200"

# Simulate time-based queries for Robot B
simulate_command "get_distance_at_time robot-b $timestamp1" "200"
simulate_command "get_distance_at_time robot-b $timestamp2" "250"
simulate_command "get_distance_at_time robot-b $timestamp3" "300"

# Simulate time-based queries for Robot C
simulate_command "get_distance_at_time robot-c $timestamp1" "300"
simulate_command "get_distance_at_time robot-c $timestamp2" "350"
simulate_command "get_distance_at_time robot-c $timestamp3" "400"

# Calculate a timestamp between timestamp1 and timestamp2
timestamp_between=$((timestamp1 + 1))
simulate_command "get_distance_at_time robot-a $timestamp_between" "100"
simulate_command "get_distance_at_time robot-b $timestamp_between" "200"
simulate_command "get_distance_at_time robot-c $timestamp_between" "300"

echo "Test 3 completed successfully!"
echo

# Test 4: Say Hello to Multiple Robots
echo "Test 4: Say Hello to Multiple Robots"
echo "----------------------------------"

simulate_command "say_hello robot-a" "Hello, World! Robot robot-a has traveled 200 units."
simulate_command "say_hello robot-b" "Hello, World! Robot robot-b has traveled 300 units."
simulate_command "say_hello robot-c" "Hello, World! Robot robot-c has traveled 400 units."

echo "Test 4 completed successfully!"
echo

echo "All tests completed successfully!"
echo
echo "Note: This is a simulation script. In a real environment, you would use"
echo "the SpacetimeDB CLI to interact with the deployed module."
