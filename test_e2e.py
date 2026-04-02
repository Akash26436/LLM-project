import requests
import json
import time

BASE_URL = "http://localhost:8000"

def run_test():
    print("Starting End-to-End Test for Agentic Classroom...\n")

    # 1. Register Teacher
    print("1. Registering Teacher...")
    teacher_data = {"name": "Test Teacher", "email": "teacher@test.com", "password": "password123", "role": "teacher"}
    res = requests.post(f"{BASE_URL}/auth/register", json=teacher_data)
    print(f"Status: {res.status_code}, Response: {res.text}")

    # 2. Login Teacher
    print("\n2. Logging in Teacher...")
    login_data = {"username": "teacher@test.com", "password": "password123"}
    res = requests.post(f"{BASE_URL}/auth/login", data=login_data)
    teacher_token = res.json().get("access_token")
    headers = {"Authorization": f"Bearer {teacher_token}"}
    print(f"Status: {res.status_code}, Token obtained: {bool(teacher_token)}")

    # 3. Create Course
    print("\n3. Creating Course...")
    course_data = {
        "title": "Machine Learning 101",
        "description": "An introductory course to ML",
        "teacher_id": 1
    }
    res = requests.post(f"{BASE_URL}/courses/", json=course_data, headers=headers)
    print(f"Status: {res.status_code}, Response: {res.text}")
    try:
        course_id = res.json()["course_id"]
    except:
        course_id = 1

    # 4. Generate Assignment
    print("\n4. Generating Assignment via Agent...")
    res = requests.post(f"{BASE_URL}/assignments/generate/{course_id}", headers=headers)
    print(f"Status: {res.status_code}, Response: {res.text[:100]}...")

    # 5. Register & Login Student
    print("\n5. Registering & Logging in Student...")
    student_data = {"name": "Test Student", "email": "student@test.com", "password": "password123", "role": "student"}
    requests.post(f"{BASE_URL}/auth/register", json=student_data)
    res = requests.post(f"{BASE_URL}/auth/login", data={"username": "student@test.com", "password": "password123"})
    student_token = res.json().get("access_token")
    student_headers = {"Authorization": f"Bearer {student_token}"}
    print(f"Token obtained: {bool(student_token)}")

    # 6. Check Analytics
    print("\n6. Checking Analytics...")
    res = requests.get(f"{BASE_URL}/analytics/platform", headers=headers)
    print(f"Status: {res.status_code}, Response: {json.dumps(res.json(), indent=2)[:300]}...")

    print("\nEnd-to-End Test Complete.")

if __name__ == "__main__":
    try:
        run_test()
    except Exception as e:
        print(f"Error during test: {e}")
