import { exec, ExecOptions } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as readline from 'readline';

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

// Function to check which Python version is available
async function getPythonCommand(): Promise<string> {
    return new Promise((resolve) => {
        exec('python --version', (error) => {
            if (!error) {
                resolve('python');
            } else {
                exec('python3 --version', (error) => {
                    if (!error) {
                        resolve('python3');
                    } else {
                        throw new Error('Python is not installed.');
                    }
                });
            }
        });
    });
}

// Function to execute code for a specific test case
export async function executeCode(fileName: string, language: string, testCaseIndex: number): Promise<string> {
    const resolvedFilePath = path.resolve(fileName);
    const pythonCommand = await getPythonCommand();
    const command = language === 'python' ? `${pythonCommand} "${resolvedFilePath}"` : `./"${resolvedFilePath}"`;

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${stderr}`);
            } else {
                resolve(stdout.trim());
            }
        });
    });
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

            // Read the expected output
            const expectedOutputPath = path.join(testCasesDir, `output_${testCaseIndex}.txt`);
            if (fs.existsSync(expectedOutputPath)) {
                let expectedOutput = fs.readFileSync(expectedOutputPath, 'utf-8').trim();

                // Remove quotes from the expected output if it is a string
                if (expectedOutput.startsWith('"') && expectedOutput.endsWith('"')) {
                    expectedOutput = expectedOutput.slice(1, -1);
                }

                console.log(`Expected Output: ${expectedOutput}`);
                console.log(`Actual Output: ${result}`);

                if (expectedOutput === result) {
                    console.log('Test Case Passed');
                } else {
                    console.log('Test Case Failed');
                }
            } else {
                console.log('Expected output file not found.');
            }
        } catch (error) {
            console.log(error);
        }
    }
}

main().catch((error) => console.error(error));
