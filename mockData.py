import requests
import json
import random
import time
import math

# Constants
DEVICE_ID = "65f9c121f4d19b06e8225044"  # Replace with actual device ID
DEVICE_API_KEY = "api"
JOB_STATUS_ID = "65f9c12cf4d19b06e8225048"  # Replace with actual job status ID
TAG = "s3"  # Replace with actual tag
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


TREND_SLOPE = 0.5
TREND_CYCLE = 100
TREND_AMPLITUDE = 5
current_step = 0
NOISE_MEAN = 0
NOISE_STD_DEV = 1


def generate_trended_data():
    global current_step
    linear_part = current_step * TREND_SLOPE
    cyclical_part = TREND_AMPLITUDE * math.sin(
        math.pi * 2 * (current_step / TREND_CYCLE)
    )
    noise = random.gauss(NOISE_MEAN, NOISE_STD_DEV)
    trended_value = linear_part + cyclical_part + noise
    current_step += 1
    return trended_value


# Function to update job status
def update_job_status(token):
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    trended_data = generate_trended_data()  # Use the function to generate trended data

    # Use the trended data in the request body
    request_body = {
        "retCode": "JOB_PROCESSING",
        "code": "JOB_PROCESSING",
        "currentStep": 1,
        "currentCycle": 1,
        "data": [{"tag": TAG, "value": trended_data}],
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
        time.sleep(2)


main()
