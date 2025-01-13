#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <algorithm>
#include <vector>

using namespace std;

string reverseWords(string s) {
    // Remove extra quotes from the input string
    s.erase(remove(s.begin(), s.end(), '"'), s.end());

    istringstream iss(s);
    vector<string> words;
    string word;
    while (iss >> word) {
        words.push_back(word);
    }
    reverse(words.begin(), words.end());
    string result;
    for (size_t i = 0; i < words.size(); ++i) {
        result += words[i];
        if (i < words.size() - 1) {
            result += " ";
        }
    }
    return result;
}

// Function to run the test case
void runTestCase(int n) {
    string filePath = "../test_cases/input_" + to_string(n) + ".txt";
    ifstream file(filePath);

    if (!file.is_open()) {
        cerr << "Error: File not found at " << filePath << ". Check the file path and try again." << endl;
        return;
    }

    // Read the array from the file
    string ans;
    getline(file, ans);
    string result = reverseWords(ans);
    // Print the result
    cout << result << endl;
    file.close();
}

int main() {
    // Example usage
    runTestCase(3); // Adjust the number as needed for your actual test case
    return 0;
}

