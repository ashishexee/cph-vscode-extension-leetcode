import os; run_test_case=lambda n,f: print((lambda p: (lambda a: f(*a))(eval(l.strip()) for l in open(p).read().strip().splitlines()) if os.path.isfile(p) else f"Error: File not found at {p}. Check the file path and try again.")((lambda d: os.path.join(d, 'test_cases', f"input_{n}.txt"))(os.path.dirname(os.path.dirname(file)))))
#WRITE YOUR CODE LOGIC HERE

---------------------------------------------------------------------------------------
# Example usage
# Provide the test case number and function name
run_test_case(2, reverse_words)