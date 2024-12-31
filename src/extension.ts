import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { fetchTestCases } from './fetchTestCases';
import { executeCode } from './executeCode';
import { CommandTreeDataProvider } from './commandTreeDataProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('LeetCode Helper Extension Activated!');

    const baseDirectory = path.join(context.extensionPath, 'dist', 'test_cases');
    // Ensure base directory exists
    if (!fs.existsSync(baseDirectory)) {
        fs.mkdirSync(baseDirectory, { recursive: true });
    }

    // Command: Fetch LeetCode Test Cases
    const fetchCommand = vscode.commands.registerCommand(
        'leetcode-cph-helper-by-ashish.fetchLeetCodeTestCases',
        async () => {
            const url = await vscode.window.showInputBox({
                prompt: 'Enter the LeetCode problem URL',
                placeHolder: 'https://leetcode.com/problems/example-problem/description',
            });

            if (!url) {
                vscode.window.showWarningMessage('No URL provided!');
                return;
            }

            vscode.window.withProgress(
                { location: vscode.ProgressLocation.Notification, title: 'Fetching LeetCode Test Cases...' },
                async () => {
                    try {
                        // Delete only the input and output files fetched previously
                        const files = fs.readdirSync(baseDirectory);
                        files.forEach(file => {
                            if ((file.startsWith('input_') || file.startsWith('output_')) && !file.includes('_user_')) {
                                fs.unlinkSync(path.join(baseDirectory, file));
                            }
                        });

                        await fetchTestCases(url);
                        vscode.window.showInformationMessage('Test cases fetched successfully!');
                    } catch (error) {
                        vscode.window.showErrorMessage(`Failed to fetch test cases: ${error}`);
                    }
                }
            );
        }
    );

    // Command: Get IO File Directory
    const getIOFileDirectoryCommand = vscode.commands.registerCommand(
        'leetcode-cph-helper-by-ashish.getIOFileDirectory',
        async () => {
            try {
                // Copy the directory path to the clipboard
                await vscode.env.clipboard.writeText(baseDirectory);
                vscode.window.showInformationMessage(`I/O text file directory path copied to clipboard: ${baseDirectory}`);
            } catch (error) {
                vscode.window.showErrorMessage(`Error: ${error}`);
            }
        }
    );

    // Command: Get Solution File Directory
    const getSolutionFileDirectoryCommand = vscode.commands.registerCommand(
        'leetcode-test-case-manager.getSolutionFileDirectory',
        async () => {
            try {
                const solutionDir = path.join(baseDirectory, 'dist', 'test_cases');
                await vscode.env.clipboard.writeText(solutionDir);
                vscode.window.showInformationMessage(`Solution directory path copied to clipboard: ${solutionDir}`);
            } catch (error) {
                vscode.window.showErrorMessage(`Error copying solution directory path: ${error}`);
            }
        }
    );

    // Command: Write Solution File
    const writeSolutionFileCommand = vscode.commands.registerCommand(
        'leetcode-cph-helper-by-ashish.writeSolutionFile',
        async () => {
            try {
                const language = await vscode.window.showQuickPick(['python', 'cpp'], {
                    placeHolder: 'Choose the programming language (python or cpp)',
                });

                if (!language) {
                    vscode.window.showWarningMessage('No language selected!');
                    return;
                }

                const baseFileName = language === 'python' ? 'solution.py' : 'solution.cpp';
                let filePath = path.join(baseDirectory, baseFileName);

                if (fs.existsSync(filePath)) {
                    const action = await vscode.window.showQuickPick(['Overwrite', 'Create New File'], {
                        placeHolder: `File '${baseFileName}' already exists. What would you like to do?`,
                    });

                    if (action === 'Create New File') {
                        let counter = 1;
                        while (fs.existsSync(filePath)) {
                            const newFileName = language === 'python' ? `solution_${counter}.py` : `solution_${counter}.cpp`;
                            filePath = path.join(baseDirectory, newFileName);
                            counter++;
                        }
                        vscode.window.showInformationMessage(`Creating new file: ${path.basename(filePath)}`);
                    } else if (action === 'Overwrite') {
                        vscode.window.showInformationMessage(`Overwriting existing file: ${baseFileName}`);
                    } else {
                        throw new Error('File creation cancelled.');
                    }
                }

                const boilerplate = language === 'python'
                    ? `import os; run_test_case=lambda n,f: print((lambda p: (lambda a: f(*a))(eval(l.strip()) for l in open(p).read().strip().splitlines()) if os.path.isfile(p) else f"Error: File not found at {p}. Check the file path and try again.")((lambda d: os.path.join(d, 'test_cases', f"input_{n}.txt"))(os.path.dirname(os.path.dirname(file)))))
#WRITE YOUR CODE LOGIC HERE

#---------------------------------------------------------------------------------------
# Example usage
# Provide the test case number and function name
#run_test_case(TEST_CASE_NUMBER, FUNCTION_NAME);
run_test_case()`


                    : `#include <bits/stdc++.h>
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
    }
    
    // YOUR SOLUTION LOGIC GOES HERE
    
    
}

int main() {
    // Run single test case
    run_test_case<vector<int>>(1, solution);
    
   
    return 0;
}`;



                fs.writeFileSync(filePath, boilerplate, 'utf-8');

                const document = await vscode.workspace.openTextDocument(filePath);
                await vscode.window.showTextDocument(document);

                vscode.window.showInformationMessage(`Solution file '${path.basename(filePath)}' is ready in ${baseDirectory}.`);
            } catch (error) {
                vscode.window.showErrorMessage(`Error: ${error}`);
            }
        }
    );

    // Command: Run Test Cases
    const runCommand = vscode.commands.registerCommand(
        'leetcode-cph-helper-by-ashish.runTestCases',
        async () => {
            try {
                const activeEditor = vscode.window.activeTextEditor;

                if (!activeEditor) {
                    vscode.window.showWarningMessage('No active editor detected. Please open your solution file first.');
                    return;
                }

                const filePath = activeEditor.document.fileName;
                const language = filePath.endsWith('.py') ? 'python' : filePath.endsWith('.cpp') ? 'cpp' : null;

                if (!language) {
                    vscode.window.showWarningMessage('Unsupported file type. Only Python and C++ files are supported.');
                    return;
                }

                if (!fs.existsSync(baseDirectory)) {
                    vscode.window.showErrorMessage('Test cases directory not found.');
                    return;
                }

                const inputFiles = fs.readdirSync(baseDirectory)
                    .filter((file) => file.startsWith('input_') && file.endsWith('.txt'));

                const totalTestCases = inputFiles.length;

                if (totalTestCases === 0) {
                    vscode.window.showWarningMessage('No test cases found to run.');
                    return;
                }

                const testCaseOptions = inputFiles.map((file, index) => ({
                    label: `Test Case ${index + 1}`,
                    description: file,
                    index: index + 1
                }));

                const selectedTestCase = await vscode.window.showQuickPick(testCaseOptions, {
                    placeHolder: 'Select a test case to run'
                });

                if (!selectedTestCase) {
                    vscode.window.showWarningMessage('No test case selected!');
                    return;
                }

                const testCaseNumber = selectedTestCase.index;

                vscode.window.withProgress(
                    { location: vscode.ProgressLocation.Notification, title: 'Running Test Case...' },
                    async () => {
                        try {
                            const results: string[] = [];

                            try {
                                const output = await executeCode(filePath, language, testCaseNumber);
                                const expectedOutputPath = path.join(baseDirectory, `output_${testCaseNumber}.txt`);
                                let expectedOutput = fs.existsSync(expectedOutputPath) ? fs.readFileSync(expectedOutputPath, 'utf-8').trim() : null;

                                // Remove quotes from the expected output if it is a string
                                if (expectedOutput && expectedOutput.startsWith('"') && expectedOutput.endsWith('"')) {
                                    expectedOutput = expectedOutput.slice(1, -1);
                                }

                                // Normalize the outputs for comparison
                                const normalize = (str: string) => str.replace(/\s+/g, ' ').trim();
                                const normalizedResult = normalize(output);
                                const normalizedExpectedOutput = expectedOutput ? normalize(expectedOutput) : null;

                                const resultMessage = normalizedExpectedOutput
                                    ? (normalizedResult === normalizedExpectedOutput
                                        ? `✅🗿 Test Case ${testCaseNumber}: Passed! 🗿\n`
                                        : `❌😭 Test Case ${testCaseNumber}: Failed! 😭\n`)
                                    : `Output for Test Case ${testCaseNumber}: ${normalizedResult}`;

                                results.push(expectedOutput
                                    ? `${resultMessage}Expected Output: ${normalizedExpectedOutput}\nActual Output: ${normalizedResult}`
                                    : resultMessage);
                            } catch (innerError) {
                                const errorMessage = innerError instanceof Error ? innerError.message : String(innerError);
                                const actualOutput = 'N/A';
                                results.push(`❌😭 Test Case ${testCaseNumber}: Failed! 😭 \nError: ${errorMessage}\nActual Output: ${actualOutput}`);
                            }

                            const summary = results.join('\n\n');
                            vscode.window.showInformationMessage(`Test Case Summary:\n\n${summary}`, { modal: true });

                        } catch (error) {
                            vscode.window.showErrorMessage(`Error running test case: ${String(error)}`);
                        }
                    }
                );
            } catch (error) {
                vscode.window.showErrorMessage(`Error: ${error}`);
            }
        }
    );

    // Command: Show LeetCode Problem Links
    const showLeetCodeProblemLinksCommand = vscode.commands.registerCommand(
        'leetcode-cph-helper-by-ashish.showLeetCodeProblemLinks',
        async () => {
            const problemLinksFilePath = path.join(context.extensionPath, 'leetcode_problems_link.txt');
            // Open the file in the editor
            const document = await vscode.workspace.openTextDocument(problemLinksFilePath);
            await vscode.window.showTextDocument(document);
        }
    );

    // Register commands in context
    context.subscriptions.push(fetchCommand,showLeetCodeProblemLinksCommand, getIOFileDirectoryCommand, getSolutionFileDirectoryCommand, writeSolutionFileCommand, runCommand);
    const commandTreeDataProvider = new CommandTreeDataProvider();
    vscode.window.registerTreeDataProvider('leetcodeHelperCommands', commandTreeDataProvider);

    // Open the LeetCode Helper: Commands view automatically
    vscode.commands.executeCommand('workbench.view.extension.leetcodeHelper');
}

export function deactivate() {
    console.log('LeetCode Helper Extension Deactivated!');
}