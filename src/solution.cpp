#include <bits/stdc++.h>
#include <filesystem>
#include <functional>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

using namespace std;
namespace fs = std::filesystem;

template <typename T>
T parseValue(const string& str) {
    istringstream iss(str);
    T value;
    iss >> value;
    return value;
}

template <>
string parseValue<string>(const string& str) {
    return str;
}

template <typename T>
vector<T> parseArray(const string& str) {
    vector<T> result;
    string trimmedStr = str.substr(1, str.size() - 2); 
    istringstream iss(trimmedStr);
    string item;
    while (getline(iss, item, ',')) {
        result.push_back(parseValue<T>(item));
    }
    return result;
}

void run_test_case(int test_case_number, const function<void(const vector<string>&)>& function) {
    // Determine the base directory dynamically
    fs::path base_directory = fs::path(__FILE__).parent_path().parent_path();
    fs::path file_path = base_directory / "test_cases" / ("input_" + to_string(test_case_number) + ".txt");

    try {
        // Read the input file
        ifstream file(file_path);
        if (!file.is_open()) {
            throw runtime_error("File not found at " + file_path.string());
        }

        string line;
        vector<string> args;
        while (getline(file, line)) {
            args.push_back(line);
        }

        if (args.empty()) {
            throw runtime_error("Invalid input format");
        }

        // Call the provided function with all parsed arguments
        function(args);

    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
    }
}
// YOU CAN CHANGE THE NAME OF THE FUNCTION

void exampleFunction(const vector<string>& args) {
    // Example function that handles different types of inputs

    for (const auto& arg : args) {
        if (arg.front() == '[' && arg.back() == ']') {
            // if the variable in the question is an array declare it here 
            //example - auto array_name = parseArray<int>(arg);

            auto array = parseArray<int>(arg);
            cout << "Array: ";
            for (const auto& item : array) {
                cout << item << " ";
            }
            cout << endl;
        } else if (arg.front() == '"' && arg.back() == '"') {
            // if the variable in the question is a string declare it here
            //example - auto str = parseValue<string>(arg.substr(1, arg.size() - 2));

            string str = parseValue<string>(arg.substr(1, arg.size() - 2));
            cout << "String: " << str << endl;
        } else {
            //if the variable in the question is an integer declare it here
            //example - auto num = parseValue<int>(arg);

            int num = parseValue<int>(arg);
            cout << "Number: " << num << endl;
        }
    }
}

int main() {
    // Provide the test case number and function name
    //example - run_test_case(ENTER YOUR TEST CASE NUMBER,YOUR FUNCTION NAME);

    run_test_case();
    return 0;
}