import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

interface TestCase {
    input: string | null;
    output: string | null;
}

const RETRY_DELAY = 3000; // 0.1 seconds
const MAX_RETRIES = 5; // Maximum retry attempts

export async function fetchTestCases(url: string): Promise<void> {
    const browser = await puppeteer.launch({ headless: false }); // Run in visible mode for debugging
    const page = await browser.newPage();

    let attempts = 0;
    let testCases: TestCase[] = [];

    const baseDirectory = path.join(__dirname, 'dist', 'test_cases');

    // Ensure base directory exists
    if (!fs.existsSync(baseDirectory)) {
        fs.mkdirSync(baseDirectory, { recursive: true });
    }

    // Delete only input and output files
    const files = fs.readdirSync(baseDirectory);
    for (const file of files) {
        if (file.startsWith('input_') || file.startsWith('output_')) {
            fs.unlinkSync(path.join(baseDirectory, file));
        }
    }

    // Retry mechanism to fetch test cases
    while (attempts < MAX_RETRIES) {
        try {
            console.log(`Attempting to fetch test cases from ${url} (Attempt ${attempts + 1})`);
            testCases = await fetchTestCasesWithRetry(page, url);

            // If test cases are successfully fetched, break out of the loop
            if (testCases.length > 0) {
                break;
            }

            // Wait before retrying
            console.log(`Waiting for ${RETRY_DELAY / 1000} seconds before retrying...`);
            attempts++;
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));

        } catch (error) {
            console.error('Error during test case fetch:', error);
            attempts++;
            if (attempts >= MAX_RETRIES) {
                console.error('Max retries reached. Exiting...');
            }
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY)); // Wait before retrying
        }
    }

    await browser.close();

    // If we fetched test cases, save them
    if (testCases.length > 0) {
        saveTestCasesToFiles(testCases);

        // Prompt the user for additional test cases
        const addMore = await vscode.window.showQuickPick(['Yes', 'No'], {
            placeHolder: 'Do you want to add more test cases?'
        });

        if (addMore === 'Yes') {
            const additionalCount = await vscode.window.showInputBox({
                prompt: 'How many additional test cases do you want to add?',
                validateInput: (value) => {
                    const num = parseInt(value, 10);
                    return isNaN(num) || num < 1 ? 'Please enter a valid number greater than 0' : null;
                }
            });

            if (additionalCount) {
                const count = parseInt(additionalCount, 10);
                await addAdditionalTestCases(count, testCases.length);
            }
        }
    } else {
        console.log('Failed to fetch test cases after maximum retries.');
    }
}
async function fetchTestCasesWithRetry(page: puppeteer.Page, url: string): Promise<any[]> {
    // Load cookies if available
    await loadCookies(page);

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });

    // Check if login is required
    if (page.url().includes('accounts/login')) {
        await loginToLeetCode(page);
    }

    console.log('Waiting for test cases to load...');
    let testCases: TestCase[] = [];
    try {
        await page.waitForSelector('pre', { timeout: 20000 }); // Wait up to 20 seconds for the <pre> tags
        // Extract test cases
        testCases = await page.$$eval('pre', (elements) => {
            return elements.map(pre => {
                const inputMatch = pre.innerText.match(/Input:\s*(.+)/);
                const outputMatch = pre.innerText.match(/Output:\s*(.+)/);
                return {
                    input: inputMatch ? inputMatch[1].trim() : null,
                    output: outputMatch ? outputMatch[1].trim() : null,
                };
            });
        });
    } catch (error) {
        console.error('Failed to extract test cases using <pre> selector:', error);
    }

    if (testCases.length === 0) {
        try {
            // Fallback to the .example-block structure
            console.log('Trying to extract test cases using .example-block structure...');
            await page.waitForSelector('.example-block', { timeout: 5000 }); // Adjust timeout as needed
            testCases = await page.$$eval('.example-block', (blocks) => {
                return blocks.map(block => {
                    const inputElement = block.querySelector('strong:contains("Input:") + span.example-io');
                    const outputElement = block.querySelector('strong:contains("Output:") + span.example-io');

                    return {
                        input: inputElement ? (inputElement as HTMLElement).innerText.trim() : null,
                        output: outputElement ? (outputElement as HTMLElement).innerText.trim() : null,
                    };
                });
            });

            if (testCases.length > 0) {
                console.log('Test cases successfully extracted using .example-block structure.');
            } else {
                console.log('No test cases found using .example-block structure.');
            }
        } catch (error) {
            console.error('Failed to extract test cases using .example-block structure:', error);
        }
    }

    return testCases;
}

async function loginToLeetCode(page: puppeteer.Page): Promise<void> {
    const loginURL = 'https://leetcode.com/accounts/login/';
    await page.goto(loginURL, { waitUntil: 'networkidle2' });

    console.log('Please log in manually within 60 seconds...');

    const cookies = await page.cookies();
    if (cookies.length > 0) {
        fs.writeFileSync('leetcode_cookies.json', JSON.stringify(cookies, null, 2));
        console.log('Login successful! Cookies saved.');
    } else {
        console.error('Failed to save cookies. Please try logging in again.');
    }
}

async function loadCookies(page: puppeteer.Page): Promise<void> {
    const cookieFile = 'leetcode_cookies.json';
    if (fs.existsSync(cookieFile)) {
        const cookieData = fs.readFileSync(cookieFile, 'utf-8');
        if (cookieData) {
            const cookies = JSON.parse(cookieData);
            await page.setCookie(...cookies);
            console.log('Cookies loaded successfully!');
        }
    } else {
        console.log('No cookies file found. Proceeding without cookies.');
    }
}

function saveTestCasesToFiles(testCases: any[]): void {
    const workspacePath = __dirname; // Folder where your script is located
    const testCasesDir = path.join(workspacePath, 'test_cases');

    // Ensure the directory exists and clean it
    if (fs.existsSync(testCasesDir)) {
        fs.readdirSync(testCasesDir).forEach(file => {
            if (file.startsWith('input_') || file.startsWith('output_')) {
                fs.unlinkSync(path.join(testCasesDir, file));
            }
        });
        console.log('Previous test case files deleted.');
    } else {
        fs.mkdirSync(testCasesDir);
    }

    // Save new test cases
    testCases.forEach((testCase, index) => {
        const inputFile = path.join(testCasesDir, `input_${index + 1}.txt`);
        const outputFile = path.join(testCasesDir, `output_${index + 1}.txt`);

        // Process and save the input
        const inputContent = extractRawData(testCase.input);
        fs.writeFileSync(inputFile, inputContent);
        console.log(`Input test case ${index + 1} saved at ${inputFile}`);

        // Remove quotes from the output if it is a string
        let outputContent = testCase.output;
        if (outputContent.startsWith('"') && outputContent.endsWith('"')) {
            outputContent = outputContent.slice(1, -1);
        }
        fs.writeFileSync(outputFile, outputContent);
        console.log(`Output test case ${index + 1} saved at ${outputFile}`);
    });

    console.log(`Test cases saved successfully to ${testCasesDir}`);
}

function extractRawData(input: string): string {
    // Regular expression to match "variable_name = value"
    const regex = /[a-zA-Z_]\w*\s*=\s*(\[.*?\]|{.*?}|".*?"|'.*?'|[^,\s]+)/g;

    // Match all occurrences of the pattern in the input string
    const matches = [...input.matchAll(regex)];

    // Extract only the values from the matches
    const values = matches.map(match => match[0].split('=')[1].trim());

    // Return the values joined by a space
    return values.join(' ');
}


async function addAdditionalTestCases(count: number, existingCount: number): Promise<void> {
    const baseDirectory = path.join(__dirname, 'test_cases');

    for (let i = 0; i < count; i++) {
        const input = await vscode.window.showInputBox({
            prompt: `Enter input for additional test case ${i + 1}`
        });

        if (input) {
            const inputFile = path.join(baseDirectory, `input_${existingCount + i + 1}.txt`);
            fs.writeFileSync(inputFile, input);
            console.log(`Additional input test case ${existingCount + i + 1} saved at ${inputFile}`);
        }
    }
}

// Example usage of saveTestCasesToFiles function
const exampleTestCases = [
    {
        input: 's = "the sky is blue"',
        output: '"blue is sky the"'
    },
    {
        input: 's = "  hello world  "',
        output: '"world hello"'
    },
    {
        input: 's = "a good   example"',
        output: '"example good a"'
    }
];

saveTestCasesToFiles(exampleTestCases);
