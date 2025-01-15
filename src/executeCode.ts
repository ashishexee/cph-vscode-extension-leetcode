import { exec, ExecOptions } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as readline from 'readline';
import * as vscode from 'vscode';

// Function to normalize output by removing spaces and trimming
function normalizeOutput(output: string): string {
    return output.replace(/\s+/g, '').trim();
}

// Function to prompt the user and read input
function askQuestion(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

// Function to create a file based on user input
async function createCodeFile(): Promise<{ fileName: string; language: string }> {
    const language = (await askQuestion("Which language do you want to code in (python/cpp)? ")).toLowerCase();

    if (language !== "python" && language !== "cpp") {
        console.log("Unsupported language! Please choose either 'python' or 'cpp'.");
        process.exit(1);
    }

    const fileName = language === "python" ? "solution.py" : "solution.cpp";
    const filePath = path.resolve(__dirname, fileName);

    if (fs.existsSync(filePath)) {
        console.log(`File '${fileName}' already exists. You can write your code there.`);
    } else {
        fs.writeFileSync(filePath, language === "python" ? "# Write your Python code here\n" : "// Write your C++ code here\n", "utf-8");
        console.log(`File '${fileName}' created. Start writing your ${language.toUpperCase()} code!`);
    }

    return { fileName, language };
}

// Function to execute code for a specific test case
export async function executeCode(fileName: string, language: string, testCaseIndex: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const resolvedFilePath = path.resolve(__dirname, fileName);
        const resolvedInputPath = path.join(__dirname, 'test_cases', `input_${testCaseIndex}.txt`);
        const resolvedOutputPath = path.join(__dirname, 'test_cases', `output_${testCaseIndex}.txt`);

        const options: ExecOptions = { cwd: path.dirname(resolvedFilePath) };

        if (!fs.existsSync(resolvedInputPath)) {
            reject(`Error: input_${testCaseIndex}.txt does not exist!`);
            return;
        }

        let command: string;
        if (language === 'python') {
            const env = { ...process.env, LEETCODE_INPUT_FILE: resolvedInputPath };
            command = `python3 "${resolvedFilePath}"`;
            options.env = env;
        } else if (language === 'cpp') {
            const outputFileName = path.basename(resolvedFilePath, '.cpp');
            const compileCommand = `g++ -std=c++17 -o "${outputFileName}" "${resolvedFilePath}"`;

            exec(compileCommand, options, (compileError, stdout, stderr) => {
                if (compileError) {
                    reject(`Compilation error: ${stderr || stdout}`);
                    return;
                }

                const runCommand = `./${outputFileName} < "${resolvedInputPath}"`;
                exec(runCommand, options, (runError, runStdout, runStderr) => {
                    if (runError) {
                        reject(`Runtime error: ${runStderr || runStdout}`);
                    } else {
                        if (fs.existsSync(resolvedOutputPath)) {
                            compareOutputs(resolvedOutputPath, runStdout, testCaseIndex, resolve, reject);
                        } else {
                            console.log(`Output for Test Case ${testCaseIndex}:\n${runStdout.trim()}`);
                            resolve(runStdout.trim());
                        }
                    }
                });
            });
            return;
        } else {
            reject("Unsupported language");
            return;
        }

        exec(command, options, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${stderr || stdout}`);
            } else {
                if (fs.existsSync(resolvedOutputPath)) {
                    compareOutputs(resolvedOutputPath, stdout, testCaseIndex, resolve, reject);
                } else {
                    console.log(`Output for Test Case ${testCaseIndex}:\n${stdout.trim()}`);
                    resolve(stdout.trim());
                }
            }
        });
    });
}

// Helper function to compare outputs
function compareOutputs(
    expectedOutputPath: string,
    actualOutput: string,
    testCaseIndex: number,
    resolve: Function,
    reject: Function
) {
    const expectedOutput = fs.readFileSync(expectedOutputPath, 'utf-8').trim();
    const normalizedExpected = normalizeOutput(expectedOutput);
    const normalizedActual = normalizeOutput(actualOutput.trim());

    if (normalizedExpected === normalizedActual) {
        console.log(`✅ Test case ${testCaseIndex} passed!`);
        resolve(actualOutput.trim());
    } else {
        console.error(`❌ Test case ${testCaseIndex} failed.`);
        console.error(`Expected Output: "${expectedOutput}"`);
        console.error(`Actual Output: "${actualOutput.trim()}"`);
        reject(`Test case ${testCaseIndex} failed.`);
    }
}

// Main function
async function main() {
    const { fileName, language } = await createCodeFile();

    const testCasesDir = path.join(__dirname, 'test_cases');
    const inputFiles = fs.readdirSync(testCasesDir).filter((file) => file.startsWith('input_') && file.endsWith('.txt'));

    console.log(`Found ${inputFiles.length} input files in '${testCasesDir}'`);

    if (inputFiles.length === 0) {
        console.log('No test cases found to run.');
        return;
    }

    for (const inputFile of inputFiles) {
        const testCaseIndex = parseInt(inputFile.match(/\d+/)?.[0] || '0', 10);
        console.log(`\nRunning Test Case ${testCaseIndex}...`);
        try {
            const result = await executeCode(fileName, language, testCaseIndex);
            console.log(`Raw result for Test Case ${testCaseIndex}:`, result);

            // Read the expected output
            const expectedOutputPath = path.join(testCasesDir, `output_${testCaseIndex}.txt`);
            if (fs.existsSync(expectedOutputPath)) {
                let expectedOutput = fs.readFileSync(expectedOutputPath, 'utf-8').trim();

                if (expectedOutput.startsWith('"') && expectedOutput.endsWith('"')) {
                    expectedOutput = expectedOutput.slice(1, -1);
                }

                // Normalize the outputs for comparison
                const normalize = (str: string) => str.replace(/\s+/g, '').toLowerCase();
                const normalizedResult = result ? normalize(result) : 'N/A';
                const normalizedExpectedOutput = normalize(expectedOutput);

                const resultMessage = normalizedResult === normalizedExpectedOutput
                    ? `✅ Test Case ${testCaseIndex}: Passed!\nExpected Output: ${expectedOutput}\nActual Output: ${result ? result.trim() : 'N/A'}`
                    : `❌ Test Case ${testCaseIndex}: Failed!\nExpected Output: ${expectedOutput}\nActual Output: ${result ? result.trim() : 'N/A'}`;

                console.log(resultMessage);
                vscode.window.showInformationMessage(resultMessage, { modal: true });
            } else {
                console.log(`Output for Test Case ${testCaseIndex}:\nExpected Output: ${expectedOutputPath}\nActual Output: ${result ? result.trim() : 'N/A'}`);
                vscode.window.showInformationMessage(`Output for Test Case ${testCaseIndex}:\nExpected Output: ${expectedOutputPath}\nActual Output: ${result ? result.trim() : 'N/A'}`, { modal: true });
            }
        } catch (error) {
            console.error(error);
        }
    }
}

main().catch((error) => console.error(error));
