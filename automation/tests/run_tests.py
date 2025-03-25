#!/usr/bin/env python3
import subprocess
import sys
from pathlib import Path

def run_tests():
    """Run all tests with coverage reporting."""
    # Get the project root directory
    project_root = Path(__file__).parent.parent
    
    # Install test dependencies
    print("Installing test dependencies...")
    subprocess.run([
        sys.executable, "-m", "pip", "install", "-r",
        str(project_root / "tests" / "requirements-test.txt")
    ], check=True)
    
    # Run pytest with coverage
    print("\nRunning tests...")
    result = subprocess.run([
        sys.executable, "-m", "pytest",
        "--cov=src",
        "--cov-report=term-missing",
        "--cov-report=html",
        "-v",
        str(project_root / "tests")
    ])
    
    if result.returncode == 0:
        print("\nAll tests passed successfully!")
        print(f"Coverage report generated in {project_root}/htmlcov/index.html")
    else:
        print("\nSome tests failed. Please check the output above for details.")
        sys.exit(1)

if __name__ == "__main__":
    run_tests() 