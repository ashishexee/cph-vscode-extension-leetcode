# LeetCode Helper Extension

![LeetCode Helper]

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
- [FAQs](#faqs)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Badges

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

## Overview

LeetCode Helper is a Visual Studio Code extension designed to streamline the process of solving LeetCode problems. It provides a seamless interface to write, test, and debug your solutions directly within VS Code.

## Features

- **Fetch LeetCode Problems**: Quickly fetch problem statements and test cases.
- **Run Test Cases**: Execute your code against provided test cases and see the results instantly.
- **Solution File Management**: Automatically generate and manage solution files.
- **Error Handling**: Detailed error messages to help you debug your code.

![Features]

## Installation

1. Open VS Code.
2. Go to the Extensions view by clicking the Extensions icon in the Activity Bar on the side of the window.
3. Search for `LeetCode Helper`.
4. Click Install.

## Usage

1. Open the Command Palette (`Ctrl+Shift+P`).
2. Type `LeetCode Helper: Fetch Problem` to fetch a new problem.
3. Write your solution in the generated file.
4. Run your test cases using `LeetCode Helper: Run Test Cases`.

![Usage]

## Extension Settings

This extension contributes the following settings:

- `leetcodeHelper.enable`: Enable/disable this extension.
- `leetcodeHelper.language`: Set the default programming language for solutions.

## Known Issues

- Some edge cases might not be handled correctly.
- Limited support for languages other than Python and C++.

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

## FAQs

**Q: How do I fetch a LeetCode problem?**
A: Use the command `LeetCode Helper: Fetch Problem` from the Command Palette.

**Q: How do I run test cases?**
A: Use the command `LeetCode Helper: Run Test Cases` from the Command Palette.

**Q: What languages are supported?**
A: Currently, Python and C++ are supported.

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

![Footer]
