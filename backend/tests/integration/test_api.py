import httpx
import pytest
import os
from datetime import datetime

# Define the base URL of your FastAPI application
BASE_URL = "http://localhost:8010"

@pytest.fixture
async def create_todo(request):

    async with httpx.AsyncClient() as client:
        response = await client.post(f"{BASE_URL}/todos", json={
            "title": "Integration test todo item",
            "description": "Integration test todo item",
            "status": "ToDo",
            "due_date": "2024-01-05T01:52:50"
        })
        assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
        todo_id = response.json()['id']

        return todo_id

# Generic cleanup fixture
@pytest.fixture
async def cleanup_todo():
    todo_ids = []

    # Function to add todo item to the cleanup list
    def add_todo_for_cleanup(todo_id):
        todo_ids.append(todo_id)

    yield add_todo_for_cleanup

    # Cleanup logic after the test finishes
    async with httpx.AsyncClient() as client:
        for todo_id in todo_ids:
            await client.delete(f"{BASE_URL}/todos/{todo_id}")


#############
### Tests ###
#############
    
@pytest.mark.asyncio
async def test_post_todo():
    async with httpx.AsyncClient() as client:
        # Send a request to initiate the download
        response = await client.post(f"{BASE_URL}/todos", json={
                    "title": "Integration test todo item POST test",
                    "description": "Integration test todo item POST test",
                    "status": "ToDo",
                    "due_date": "2024-01-05T01:52:50"
                    })
        
        # Check that the response status code is 200 (OK)
        print(response.json())
        assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
        
        # Parse the response JSON
        response_json = response.json()

        assert response_json['title'] == "Integration test todo item POST test"
        assert response_json['description'] == "Integration test todo item POST test"
        assert response_json['due_date'] == "2024-01-05"

        # Check that there is a position and it is greater than 0
        assert response_json['position'] > 0

        # Cleanup
        todo_id = response.json()['id']
        async with httpx.AsyncClient() as client:
            await client.delete(f"{BASE_URL}/todos/{todo_id}")

@pytest.mark.asyncio
async def test_post_todo_without_due_date():
    async with httpx.AsyncClient() as client:
        # Send a request to initiate the download
        response = await client.post(f"{BASE_URL}/todos", json={
                    "title": "Integration test todo item POST test",
                    "description": "Integration test todo item POST test",
                    "status": "ToDo",
                    })
        
        # Check that the response status code is 200 (OK)
        print(response.json())
        assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
        
        # Parse the response JSON
        response_json = response.json()

        assert response_json['due_date'] == None

        # Cleanup
        todo_id = response.json()['id']
        async with httpx.AsyncClient() as client:
            await client.delete(f"{BASE_URL}/todos/{todo_id}")

# Warning: This test will fail if you have not yet added any todos the DB
# ToDo: Make a fixture to load data
@pytest.mark.asyncio
async def test_get_all_todos(create_todo):
    todo_id = await create_todo  # Await the fixture
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

        # Cleanup
        async with httpx.AsyncClient() as client:
            await client.delete(f"{BASE_URL}/todos/{todo_id}")


@pytest.mark.asyncio
async def test_get_todo(create_todo, cleanup_todo):
    todo_id = await create_todo  # Await the fixture
    async with httpx.AsyncClient() as client:
        # Send a request to initiate the download
        response = await client.get(f"{BASE_URL}/todos/{todo_id}")
        
        # Check that the response status code is 200 (OK)
        print(response.json())
        assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
        
        # Parse the response JSON
        response_json = response.json()

        # Check that the response JSON contains the correct file path
        # assert response_json['owner'] 
        assert response_json['title'] == "Integration test todo item"
        assert response_json['description'] == "Integration test todo item"

        # Cleanup
        async with httpx.AsyncClient() as client:
            await client.delete(f"{BASE_URL}/todos/{todo_id}")

@pytest.mark.asyncio
async def test_update_todo(create_todo, cleanup_todo):
    todo_id = await create_todo  # Await the fixture to create a new todo
    
    # Define the update data
    update_data = {
        'title': 'Updated test todo item',
        'description': 'Updated description for test todo item',
        'status': 'InProgress'
        # Add other fields you wish to update
    }
    
    async with httpx.AsyncClient() as client:
        # Send a request to update the todo
        update_response = await client.put(f"{BASE_URL}/todos/{todo_id}", json=update_data)
        
        # Check that the update response status code is 200 (OK)
        assert update_response.status_code == 200, f"Unexpected status code: {update_response.status_code}"
        
        # Get the updated todo to verify changes
        get_response = await client.get(f"{BASE_URL}/todos/{todo_id}")
        
        # Check that the get response status code is 200 (OK)
        assert get_response.status_code == 200, f"Unexpected status code: {get_response.status_code}"
        
        # Parse the response JSON
        response_json = get_response.json()

        # Check that the response JSON contains the updated values
        assert response_json['title'] == update_data['title'], "Title was not updated correctly"
        assert response_json['description'] == update_data['description'], "Description was not updated correctly"
        assert response_json['status'] == update_data['status'], "Status was not updated correctly"

        # Cleanup
        async with httpx.AsyncClient() as client:
            await client.delete(f"{BASE_URL}/todos/{todo_id}")

@pytest.mark.asyncio
async def test_delete_todo(create_todo):
    # Create a new todo item
    todo_id = await create_todo

    # Delete the created todo item
    async with httpx.AsyncClient() as client:
        delete_response = await client.delete(f"{BASE_URL}/todos/{todo_id}")
        assert delete_response.status_code == 200, "Failed to delete the todo item"

        # Try to fetch the deleted todo item
        get_response = await client.get(f"{BASE_URL}/todos/{todo_id}")
        
        # Assert that the item no longer exists
        assert get_response.status_code == 400, "Todo item was not deleted as expected"