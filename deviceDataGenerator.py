import requests
import json
import random
import time

# Konštanty
DEVICE_ID = "6646a55ecf866217c6929dc7"  # ID zariadenia
DEVICE_API_KEY = "api"  #  API kľúč zariadenia
JOB_STATUS_ID = "6646a563cf866217c6929dca"  # ID Job statusu
TAG = "teplota"  # tag datapointu
API_BASE_URL = "http://localhost:8080/api"  # URL k API
USERNAME = "test"  # prihlasovacie meno
PASSWORD = "heslo"  # heslo

# Funkcia na získanie JWT tokenu
def getJwtToken():
    response = requests.post(f"{API_BASE_URL}/user/login/{USERNAME}/{PASSWORD}")
    if response.status_code == 200:
        return response.text
    else:
        raise Exception("Failed to login and retrieve token.")

def generate_random_value():  # Funkcia generujúca náhodnú hodnotu medzi číslami 20 a 22
    return round(random.uniform(20.00, 22.00), 2)

def updateJobStatus(token):   # Funkcia na aktualizáciu job statusu
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    random_value = generate_random_value()
    request_body = {
        "retCode": "JOB_PROCESSING",
        "code": "JOB_PROCESSING",
        "currentStep": 1,
        "currentCycle": 1,
        "data": [{"tag": TAG, "value": random_value}],    # Použitie vygenerovanej hodnoty v tele požiadavky
    }
    response = requests.post(
        f"{API_BASE_URL}/device/updateJobStatus/{DEVICE_ID}/{DEVICE_API_KEY}/{JOB_STATUS_ID}",
        headers=headers,
        data=json.dumps(request_body),
    )
    return response.status_code, response.text

def main():
    token = getJwtToken()     # Hlavná funkcia
    while True:
        status_code, response = updateJobStatus(token)
        time.sleep(1)
main()
