# LeetCode Helper Extension
demonstration video explaining all the features of the extension and how to use them - https://www.youtube.com/watch?v=KXRde3BNKEU
## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Extension Settings](#extension-settings)
- [Known Issues](#known-issues)
- [Release Notes](#release-notes)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Badges

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![leetcode](https://img.shields.io/badge/LeetCode-000000?style=for-the-badge&logo=LeetCode&logoColor=#d16c06)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![C++](https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white)
![C](https://img.shields.io/badge/c-%2300599C.svg?style=for-the-badge&logo=c&logoColor=white)
![python](https://img.shields.io/badge/Python-3776AB.svg?style=for-the-badge&logo=Python&logoColor=white)
![javascript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black)
![json](https://img.shields.io/badge/JSON-000000.svg?style=for-the-badge&logo=JSON&logoColor=white)
![cmake](https://img.shields.io/badge/CMake-064F8C.svg?style=for-the-badge&logo=CMake&logoColor=white)


## Overview

LeetCode Helper is a Visual Studio Code extension designed to streamline the process of solving LeetCode problems. It provides a seamless interface to write, test, and debug your solutions directly within VS Code.

## Features

- **Fetch LeetCode Problems**: Quickly fetch problem statements and test cases.
- **Run Test Cases**: Execute your code against provided test cases and see the results instantly.
- **Solution File Management**: Automatically generate and manage solution files.
- **Error Handling**: Detailed error messages to help you debug your code with Expected and Actual results.
- **Panel for running commands**:User can use the panel that is present on the left side to run command instead of using command panel(also added key bindings to all commands).
- **Edit Testcases or add more test cases**: User can either edit/add/delete testcases by going to the directory where the testcases file are saved by using "Get I/O File Directory".


## Installation

1. Open VS Code.
2. Go to the Extensions view by clicking the Extensions icon in the Activity Bar on the side of the window.
3. Search for `LeetCode Helper`.
4. Click Install.

## Usage

1. Open the Command Palette (`Ctrl+Shift+P`) or Directly access from left side panel
2. Type `LeetCode Helper: Fetch Problem` to fetch a new problem(add extra test cases too if you want too).
3. Write your solution in the generated file(in both python and c++).
4. Run your test cases using `LeetCode Helper: Run Test Cases`. / or use CTRL+5.


## Extension Settings

This extension contributes the following settings:

- `leetcodeHelper.enable`: Enable/disable this extension.
- `leetcodeHelper.language`: Set the default programming language for solutions.

## Known Issues

- Some edge cases might not be handled correctly.
- for testing C++ you may need to parse the variables from input files manually depending on the data type inside the run_test_case function (please refer to this page for better understanding - https://stackoverflow.com/questions/9551014/reading-parsing-text-file-input-c) 
- Limited support for languages(only python and cpp)
- All test are not checked in one go you need to check for each test case individually
- a clear falied messege might not show if your test case fails
## Release Notes

### 1.0.0

- Initial release of LeetCode Helper.

## Contributing

We welcome contributions to improve this project. Please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with clear and concise messages.
4. Push your changes to your forked repository.
5. Create a pull request to the main repository.

## Code of Conduct

We expect all contributors to adhere to our Code of Conduct. Please read it before contributing.

## Troubleshooting

If you encounter any issues, try the following steps:

1. Ensure you have the latest version of the extension installed.
2. Check the extension settings to ensure they are configured correctly.
3. Restart VS Code.
4. If the issue persists, please open an issue on the GitHub repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changes Made

- **Error Handling**: Improved error handling in `extension.ts` and `executeCode.ts` to capture actual output even when test cases fail.
- **Output Normalization**: Added normalization for output comparison.
- **Logging**: Enhanced logging for better debugging.
- **Solution File Management**: Automatically generate and manage solution files.

![Thanks for your time](resources/thanks.png)
