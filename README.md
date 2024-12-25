# LeetCode Helper Extension

![LeetCode Helper](resources/leetcode_helper_banner.png)

## Overview

LeetCode Helper is a Visual Studio Code extension designed to streamline the process of solving LeetCode problems. It provides a seamless interface to write, test, and debug your solutions directly within VS Code.

## Features

- **Fetch LeetCode Problems**: Quickly fetch problem statements and test cases.
- **Run Test Cases**: Execute your code against provided test cases and see the results instantly.
- **Solution File Management**: Automatically generate and manage solution files.
- **Error Handling**: Detailed error messages to help you debug your code.

![Features](resources/features.png)

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

![Usage](resources/usage.png)

## Extension Settings

This extension contributes the following settings:

- `leetcodeHelper.enable`: Enable/disable this extension.
- `leetcodeHelper.language`: Set the default programming language for solutions.

## Known Issues

- Some edge cases might not be handled correctly.
- Limited support for languages other than Python and C++.

## Release Notes

### 1.0.1

- Fixed issue with capturing actual output in failed test cases.
- Improved error handling and logging.

### 1.0.0

- Initial release of LeetCode Helper.

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changes Made

- **Error Handling**: Improved error handling in `extension.ts` and `executeCode.ts` to capture actual output even when test cases fail.
- **Output Normalization**: Added normalization for output comparison.
- **Logging**: Enhanced logging for better debugging.
- **Solution File Management**: Automatically generate and manage solution files.

![Footer](resources/footer.png)
