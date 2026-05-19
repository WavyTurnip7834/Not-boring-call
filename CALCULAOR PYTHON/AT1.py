
"""Simple calculator — your name, your project."""

OPS = {
    "+": lambda a, b: a + b,
    "-": lambda a, b: a - b,
    "*": lambda a, b: a * b,
    "/": lambda a, b: a / b,
}

def main():
    print("\n  Calculator")
    print("  ───────────")
    try:
        a = float(input("  First number:  "))
        op = input("  Operator (+ - * /): ").strip()
        b = float(input("  Second number: "))
        if op not in OPS:
            print("  Unknown operator.")
            return
        if op == "/" and b == 0:
            print("  Cannot divide by zero.")
            return
        result = OPS[op](a, b)
        print(f"\n  {a:g} {op} {b:g} = {result:g}\n")
    except ValueError:
        print("  Please enter valid numbers.")

if __name__ == "__main__":
    main()
