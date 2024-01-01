import httpx
import pytest
import os

# Define the base URL of your FastAPI application
BASE_URL = "http://localhost:8010"

@pytest.fixture
async def create_todo(request):

    async with httpx.AsyncClient() as client:
        response = await client.post(f"{BASE_URL}/todos", json={
            "title": "Integration test todo item",
            "description": "Integration test todo item",
            "status": "ToDo",
            "due_date": "2023-12-19T22:40:09.963543"
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
                    "due_date": "2023-12-19T22:40:09.963543"
                    })
        
        # Check that the response status code is 200 (OK)
        print(response.json())
        assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
        
        # Parse the response JSON
        response_json = response.json()

        # Check that the response JSON contains the correct file path
        assert response_json['title'] == "Integration test todo item POST test"
        assert response_json['description'] == "Integration test todo item POST test"

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
        # Depending on your implementation, this might be a 404 Not Found or another appropriate response
        assert get_response.status_code == 404, "Todo item was not deleted as expected"