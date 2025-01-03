import os; run_test_case=lambda n,f: print((lambda p: (lambda a: f(*a))(eval(l.strip()) for l in open(p).read().strip().splitlines()) if os.path.isfile(p) else f"Error: File not found at {p}. Check the file path and try again.")((lambda d: os.path.join(d, 'test_cases', f"input_{n}.txt"))(os.path.dirname(os.path.dirname(__file__)))))


#WRITE YOUR CODE LOGIC HERE
def reverse_words(s: str) -> str:
    words = s.split()
    reversed_words = words[::-1]
    return ' '.join(reversed_words)

# Example usage
# Provide the test case number and function name

run_test_case(1, reverse_words)
