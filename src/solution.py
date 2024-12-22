import os

def run_test_case(test_case_number, function):
    # Determine the base directory dynamically
    base_directory = os.path.dirname(os.path.dirname(__file__))
    file_path = os.path.join(base_directory, 'test_cases', f"input_{test_case_number}.txt")

    try:
        # Read the input file
        with open(file_path, "r") as file:
            content = file.read().strip().splitlines()  # Read file and split lines

        # Dynamically parse all lines as arguments
        args = [eval(line.strip()) for line in content]  # Parse each line in the file

        # Call the provided function with all parsed arguments
        result = function(*args)  # Unpack the arguments dynamically
        print(result)  # Output the result

    except FileNotFoundError:
        print(f"Error: File not found at {file_path}. Check the file path and try again.")
    except ValueError as e:
        print(f"Error: {e}")
    except SyntaxError as e:
        print(f"Error: Check your input file format. {e}")
    except Exception as e:
        print(f"Unexpected Error: {e}")


# WRITE YOUR FUNCTION HERE 
#-------------------------------------------------------------------------------

#-------------------------------------------------------------------------------




#run_test_case(ENTER THE TESTCASE NUMBER, ENTER THE FUNCTION NAME)
# EXAMPLE:
run_test_case()