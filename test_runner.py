import os
import subprocess

    #Define the base directory containing solution.cpp and test cases
base_directory = r"C:\\Users\\ASUS\\leetcodehelperbyashish\\dist\\test_cases"

    #Function to compile the C++ code
def compile_cpp(file_path):
    compile_command = f"g++ -std=c++17 -o {os.path.join(base_directory, 'solution')} {file_path}"
    result = subprocess.run(compile_command, shell=True, capture_output=True)
    if result.returncode != 0:
        print(f"Compilation failed:\n{result.stderr.decode()}")
        return False
    return True

    #Function to normalize output by removing spaces and trimming
def normalize_output(output: str) -> str:
    return ''.join(output.split())

    #Function to run the compiled code with a specific input file and compare the output
def run_test_case(test_case_index):
    input_file = os.path.join(base_directory, f"input_{test_case_index}.txt")
    expected_output_file = os.path.join(base_directory, f"output_{test_case_index}.txt")
    actual_output_file = os.path.join(base_directory, f"actual_output_{test_case_index}.txt")
    
    #Run the compiled program with input redirection
    run_command = f"{os.path.join(base_directory, 'solution')} < {input_file} > {actual_output_file}"
    result = subprocess.run(run_command, shell=True, capture_output=True)
    if result.returncode != 0:
        print(f"Runtime error:\n{result.stderr.decode()}")
        return False
    
    #Compare the actual output with the expected output
    with open(actual_output_file, 'r') as actual, open(expected_output_file, 'r') as expected:
        actual_output = actual.read().strip()
        expected_output = expected.read().strip()
        normalized_actual = normalize_output(actual_output)
        normalized_expected = normalize_output(expected_output)
        
        if normalized_actual == normalized_expected:
            print(f"Test case {test_case_index} passed.")
            return True
        else:
            print(f"Test case {test_case_index} failed. Expected: {normalized_expected}, Actual: {normalized_actual}")