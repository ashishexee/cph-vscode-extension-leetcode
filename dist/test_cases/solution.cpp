#include <bits/stdc++.h>
using namespace std;

string reverseWords(const string &s) {
    istringstream iss(s);
    vector<string> words;
    string word;

    // Split the string into words
    while (iss >> word) {
        words.push_back(word);
    }

    // Reverse the order of words
    reverse(words.begin(), words.end());

    // Join the words back into a single string
    string reversed;
    for (const auto &w : words) {
        reversed += w + " ";
    }

    // Remove the trailing space
    if (!reversed.empty()) {
        reversed.pop_back();
    }

    return reversed;
}
// Function to run the test case
void runTestCase(int n) {
    string filePath = "../test_cases/input_" + to_string(n) + ".txt";
    ifstream file(filePath);

    if (!file.is_open()) {
        cerr << "Error: File not found at " << filePath << ". Check the file path and try again." << endl;
        return;
    }

// if your input files has vector/array uncomment the below code
    // Read the array from the file
string ans;
getline(file,ans);
string result = reverseWords(ans);
    // Print the result
    cout << result << endl;
    file.close();
}

int main() {
    // Example usage
    runTestCase(1); // Adjust the number as needed for your actual test case
    return 0;
}

