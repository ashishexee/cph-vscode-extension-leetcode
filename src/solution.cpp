#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <sstream>
#include <algorithm>
#include <filesystem>

namespace fs = std::filesystem;

// Function to reverse words in a string
std::string reverse_words(const std::string& s) {
    std::istringstream iss(s);
    std::vector<std::string> words;
    std::string word;
    while (iss >> word) {
        words.push_back(word);
    }
    std::reverse(words.begin(), words.end());
    std::ostringstream oss;
    for (size_t i = 0; i < words.size(); ++i) {
        oss << words[i];
        if (i < words.size() - 1) {
            oss << " ";
        }
    }
    return oss.str();
}

// Function to run the test case
void runTestCase(int n) {
    std::string filePath = "../test_cases/input_" + std::to_string(n) + ".txt";
    std::ifstream file(filePath);

    if (!file.is_open()) {
        std::cerr << "Error: File not found at " << filePath << ". Check the file path and try again." << std::endl;
        return;
    }

    std::string line;
    if (std::getline(file, line)) {
        std::string result = reverse_words(line);
        std::cout << result << std::endl;
    }

    file.close();
}

int main() {
    // Example usage
    // Provide the test case number
    runTestCase(1); // Adjust the number as needed for your actual test case
    return 0;
}