#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <algorithm>
#include <string>
using namespace std;

// Function to reverse words in a string
string reverseWords(const string& s) {
    istringstream iss(s);
    vector<string> words;
    string word;

    // Split the input string into words
    while (iss >> word) {
        words.push_back(word);
    }

    // Reverse the list of words
    reverse(words.begin(), words.end());

    // Join the reversed list into a single string with a single space
    ostringstream oss;
    for (size_t i = 0; i < words.size(); ++i) {
        if (i != 0) {
            oss << " ";
        }
        oss << words[i];
    }

    return oss.str();
}

// Function to run the test case
void runTestCase(int n, string (*func)(const string&)) {
    string filePath = "../test_cases/input_" + to_string(n) + ".txt";
    ifstream file(filePath);

    if (!file.is_open()) {
        cerr << "Error: File not found at " << filePath << ". Check the file path and try again." << endl;
        return;
    }

    string line;
    getline(file, line);
    file.close();

    string result = func(line);
    cout << result << endl;
}

int main() {
    // Example usage
    // Provide the test case number and function name
    runTestCase(1, reverseWords);
    return 0;
}