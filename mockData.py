import requests
import json
import random
import time

# Constants
DEVICE_ID = "65eb8e8019a6f336ba03a433"  # Replace with actual device ID
DEVICE_API_KEY = "api"
JOB_STATUS_ID = "65eb8e8919a6f336ba03a436"  # Replace with actual job status ID
TAG = "s1"  # Replace with actual tag
API_BASE_URL = "http://localhost:8080/api"  # Replace with actual API base URL
USERNAME = "admin"  # Replace with actual username
PASSWORD = "admin"  # Replace with actual password


# Function to get JWT token
def get_jwt_token():
    response = requests.post(f"{API_BASE_URL}/user/login/{USERNAME}/{PASSWORD}")
    if response.status_code == 200:
        return response.text
    else:
        raise Exception("Failed to login and retrieve token.")


# Function to update job status
def update_job_status(token):
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # Generate random data for the request body
    random_data = {"tag": TAG, "value": random.uniform(0, 10)}

    request_body = {
        "retCode": "JOB_PROCESSING",
        "code": "JOB_PROCESSING",
        "currentStep": 1,
        "currentCycle": 1,
        "data": [random_data],
    }

    response = requests.post(
        f"{API_BASE_URL}/device/updateJobStatus/{DEVICE_ID}/{DEVICE_API_KEY}/{JOB_STATUS_ID}",
        headers=headers,
        data=json.dumps(request_body),
    )

    return response.status_code, response.text


# Main function to run the script
def main():
    token = get_jwt_token()
    print(f"Token: {token}")
    while True:
        status_code, response = update_job_status(token)
        print(f"Status Code: {status_code}, Response: {response}")
        time.sleep(1)


main()
