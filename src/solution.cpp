#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <sstream>
#include <algorithm>
#include <filesystem>

namespace fs = std::experimental::filesystem;

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

// Function to run a test case
template <typename F>
void run_test_case(int n, F solution_function) {
    fs::path base_dir = fs::path(__FILE__).parent_path().parent_path();
    fs::path input_path = base_dir / "test_cases" / ("input_" + std::to_string(n) + ".txt");

    if (!fs::exists(input_path)) {
        std::cerr << "Error: File not found at " << input_path << ". Check the file path and try again." << std::endl;
        return;
    }

    try {
        std::ifstream input_file(input_path);
        if (!input_file.is_open()) {
            throw std::runtime_error("Could not open input file.");
        }
        std::string line;
        std::getline(input_file, line);

        solution_function(line);

    } catch (const std::exception& e) {
        std::cerr << "Error during test case execution: " << e.what() << std::endl;
    }
}

int main() {
    run_test_case(2, reverse_words);
    return 0;
}