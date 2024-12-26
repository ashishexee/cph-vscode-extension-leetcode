#include <bits/stdc++.h>
#include <filesystem>
#include <functional>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

using namespace std;
namespace fs = std::filesystem;

// Parse values from string
template <typename T>
T parseValue(const string& str) {
    istringstream iss(str);
    T value;
    iss >> value;
    return value;
}

// Template specialization for string
template <>
string parseValue<string>(const string& str) {
    // Remove quotes if present
    if (str.size() >= 2 && str.front() == '"' && str.back() == '"') {
        return str.substr(1, str.size() - 2);
    }
    return str;
}

// Parse arrays from string
template <typename T>
vector<T> parseArray(const string& str) {
    vector<T> result;
    string trimmedStr = str.substr(1, str.size() - 2); // Remove brackets
    istringstream iss(trimmedStr);
    string item;
    while (getline(iss, item, ',')) {
        result.push_back(parseValue<T>(item));
    }
    return result;
}

// Function to detect data type from string
template <typename T>
T detectAndParseValue(const string& str) {
    if (str.empty()) {
        throw runtime_error("Empty input string");
    }
    
    // Check if it's an array
    if (str.front() == '[' && str.back() == ']') {
        return parseArray<typename T::value_type>(str);
    }
    
    // Check if it's a string (quoted)
    if (str.front() == '"' && str.back() == '"') {
        return parseValue<T>(str);
    }
    
    // Otherwise treat as numeric or other type
    return parseValue<T>(str);
}

// Generic function to run test cases
template <typename T>
void run_test_case(int test_case_number, const function<void(const T&)>& solution_function) {
    fs::path base_directory = fs::path(__FILE__).parent_path().parent_path();
    fs::path file_path = base_directory / "test_cases" / ("input_" + to_string(test_case_number) + ".txt");

    try {
        ifstream file(file_path);
        if (!file.is_open()) {
            throw runtime_error("File not found at " + file_path.string());
        }

        string line;
        vector<string> lines;
        while (getline(file, line)) {
            lines.push_back(line);
        }

        if (lines.empty()) {
            throw runtime_error("Invalid input format");
        }

        // Parse input based on type T
        T parsed_input = detectAndParseValue<T>(lines[0]);
        solution_function(parsed_input);

    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
    }
}

// -------------------- SOLUTION TEMPLATE --------------------
// MODIFY THIS SECTION FOR YOUR SPECIFIC PROBLEM

void solution(const vector<string>& args) {
    // Example parsing different types of inputs
    // Modify according to your problem requirements
    
    // For array input: [1,2,3]
    if (!args.empty() && args[0][0] == '[') {
        auto arr = parseArray<int>(args[0]);
    }
    
    // For string input: "hello"
    if (args.size() >= 2 && args[1][0] == '"') {
        string str = args[1].substr(1, args[1].length() - 2);
    }
    
    // For integer input: 42
    if (args.size() >= 3) {
        int num = parseValue<int>(args[2]);
        cout << "Input Integer: " << num << endl;
    }
    
    // YOUR SOLUTION LOGIC GOES HERE
    
    
}

int main() {
    // Run single test case
    run_test_case<int>(1, solutionInt);                    // For integer input
    run_test_case<string>(2, solutionString);              // For string input
    run_test_case<vector<int>>(3, solutionVectorInt);      // For array input
    return 0;
}