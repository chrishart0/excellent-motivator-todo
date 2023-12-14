import httpx
import pytest
import os

# Define the base URL of your FastAPI application
BASE_URL = "http://localhost:8010"


@pytest.mark.asyncio
async def test_post_todo():
    async with httpx.AsyncClient() as client:
        # Send a request to initiate the download
        response = await client.post(f"{BASE_URL}/todos", json={
                    "title": "Unnamed todo item",
                    "description": "string",
                    "status": "ToDo",
                    "due_date": "2023-12-19T22:40:09.963543"
                    })
        
        # Check that the response status code is 200 (OK)
        print(response.json())
        assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
        
        # Parse the response JSON
        response_json = response.json()

        # Check that the response JSON contains the correct file path
        assert response_json['owner'] == "chris"
        assert response_json['title'] == "Unnamed todo item"
        assert response_json['description'] == "string"

# Warning: This test will fail if you have not yet added any todos the DB
# ToDo: Make a fixture to load data
@pytest.mark.asyncio
async def test_get_all_todos():
    async with httpx.AsyncClient() as client:
        # Send a request to initiate the download
        response = await client.get(f"{BASE_URL}/todos")
        
        # Check that the response status code is 200 (OK)
        print(response.json())
        assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
        
        # Parse the response JSON
        response_json = response.json()

        # Check that the response JSON contains the correct file path
        assert len(response_json) > 0


@pytest.mark.asyncio
async def test_get_todo():
    async with httpx.AsyncClient() as client:
        # Send a request to initiate the download
        response = await client.get(f"{BASE_URL}/todos/684bc66a-cd15-4a95-8c4b-90554e8a8b26")
        
        # Check that the response status code is 200 (OK)
        print(response.json())
        assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
        
        # Parse the response JSON
        response_json = response.json()

        # Check that the response JSON contains the correct file path
        assert response_json['owner'] == "string"
        assert response_json['title'] == "Unnamed todo item"
        assert response_json['description'] == "string"
