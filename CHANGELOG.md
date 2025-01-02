# Changelog

All notable changes to the "LeetCode Test Case Manager" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Modifications #1

### Added
- New command "Get Solution File Directory" to copy solution file path

- Improved C++ boilerplate code for better usability

- Support for multiple test case handling

### Changed
- Modified C++ boilerplate for enhanced readability

- Updated extension name and command identifiers

- Improved error handling in test case execution

### Fixed
- Issue with solution file deletion during test case updates

- Path handling for cross-platform compatibility

----------------------------------------------------------------------------------------------------------

## Modifications #2

### Added
- Added Leetcode helper:Command in commandTreeDataProvider.ts file to view all the command directly from the pannel(manually seleting the command from command palette feature is also available by ctrl+shift+P)

- Added the new feature asking the user if he/she wants to add more TestCases(how many extra testcases the user wants to add and what will be the contents of those text files) 

### Changed
- updated the logic for executeCode.ts file to execute the additional input provided by the user and then return the output for that input

- updated the logic for the fetchTestCases.ts to ensure proper execution

- modified extension.ts file for proper functioning of Leetcode Helper:Command and whenever the extension is started it automaticall opens that pannel

- updated the package.json file for proper functioning of Leetcode Helper:Command pannel(also added the icon)

### Fixed
- updated the logic for fetching test cases

----------------------------------------------------------------------------------------------------------

## Modifications #3

### Added
- added a new command show leetcode problems where links of every question on leetcode is availabe you can run this command and a text file will get opened and you can use (ctrl+f) to search for the specific leetcode question
- added test_runner.py just 


### Changed 
- updated extension.ts to ensure proper execution of showleetcodeproblem command
- updated commandTreeDataProvider.ts to add a new command to the panel
- updated package.json file too
- updated the logic for fetchTestCases.ts (basically adding logic for second selector to account for every question on leetcode)

### Fixed
- change python version to python3 (install python3 to execute the code)