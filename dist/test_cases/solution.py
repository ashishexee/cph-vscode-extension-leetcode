import os; run_test_case=lambda n,f: print((lambda p: (lambda a: f(*a))(eval(l.strip()) for l in open(p).read().strip().splitlines()) if os.path.isfile(p) else f"Error: File not found at {p}. Check the file path and try again.")((lambda d: os.path.join(d, 'test_cases', f"input_{n}.txt"))(os.path.dirname(os.path.dirname(__file__)))))

#WRITE YOUR CODE LOGIC HERE

def reverse_words(s: str) -> str:
    # Split the input string into words, filtering out extra spaces
    words = s.split()
    # Reverse the list of words
    reversed_words = words[::-1]
    # Join the reversed list into a single string with a single space
    return ' '.join(reversed_words)


# Example usage
# Provide the test case number and function name
run_test_case(3, reverse_words)