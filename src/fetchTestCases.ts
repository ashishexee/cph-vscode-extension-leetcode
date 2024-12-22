import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

const RETRY_DELAY = 100; // 7 seconds
const MAX_RETRIES = 5; // Maximum retry attempts

export async function fetchTestCases(url: string): Promise<void> {
    const browser = await puppeteer.launch({ headless: false }); // Run in visible mode for debugging
    const page = await browser.newPage();

    let attempts = 0;
    let testCases = [];

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

    // If we fetched test cases, save them
    if (testCases.length > 0) {
        saveTestCasesToFiles(testCases);
    } else {
        console.log('Failed to fetch test cases after maximum retries.');
    }

    await browser.close();
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
    try {
        await page.waitForSelector('pre', { timeout: 20000 }); // Wait up to 20 seconds for the <pre> tags
    } catch (error) {
        console.error('Failed to find <pre> tags in time:', error);
        return []; // Return empty array if fetching fails
    }

    // Extract test cases
    const testCases = await page.$$eval('pre', (elements) => {
        return elements.map(pre => {
            const inputMatch = pre.innerText.match(/Input:\s*(.+)/);
            const outputMatch = pre.innerText.match(/Output:\s*(.+)/);
            return {
                input: inputMatch ? inputMatch[1].trim() : null,
                output: outputMatch ? outputMatch[1].trim() : null,
            };
        });
    });

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

        // Remove quotes from the output if it is a string
        let outputContent = testCase.output;
        if (outputContent.startsWith('"') && outputContent.endsWith('"')) {
            outputContent = outputContent.slice(1, -1);
        }
        fs.writeFileSync(outputFile, outputContent);
        console.log(`Output test case ${index + 1} saved.`);
    });

    console.log(`Test cases saved successfully to ${testCasesDir}`);
}

function extractRawData(input: string): string {
    if (input.includes("target")) {
        const [numsPart, targetPart] = input.split(", target = ");
        const nums = numsPart.split("=")[1].trim(); // Extract the part after `nums =`
        const target = targetPart.trim(); // Extract the target
        return `${nums}\n${target}`; // Return both as separate lines
    }

    const regex = /=(.+)/; // Matches the `=` sign and everything after it
    const match = input.match(regex);

    if (match && match[1]) {
        return match[1].trim(); // Return everything after the `=` sign, trimmed of whitespace
    }

    return input.trim(); // Return the trimmed input if no match is found
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
