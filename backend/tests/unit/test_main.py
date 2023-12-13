# test_main.py
import pytest
from httpx import AsyncClient
from moto import mock_dynamodb
import datetime
from main import app
import boto3
from unittest import mock
from models import ToDoItem
from fastapi.testclient import TestClient

client = TestClient(app)

# Set up mock DynamoDB
@pytest.fixture(scope="function")
def aws_credentials():
    """Mocked AWS Credentials for moto."""
    import os
    os.environ["AWS_ACCESS_KEY_ID"] = "testing"
    os.environ["AWS_SECRET_ACCESS_KEY"] = "testing"
    os.environ["AWS_SECURITY_TOKEN"] = "testing"
    os.environ["AWS_SESSION_TOKEN"] = "testing"

# @pytest.fixture(scope="function")
# def dynamodb(aws_credentials):
#     with mock_dynamodb():
#         yield resource('dynamodb', region_name='us-west-2')


# Tests for FastAPI endpoints
# @pytest.mark.asyncio
# @mock_dynamodb
# def test_create_todo():
#     boto3.resource('dynamodb', region_name='us-east-1', endpoint_url="http://dynamodb-local:8000").create_table(
#         TableName='ToDoItems',
#         KeySchema=[
#             {
#                 'AttributeName': 'id',
#                 'KeyType': 'HASH'
#             }
#         ],
#         AttributeDefinitions=[
#             {
#                 'AttributeName': 'id',
#                 'AttributeType': 'S'
#             }
#         ],
#         BillingMode='PAY_PER_REQUEST'
#     )

#     # Mock data for testing
#     todo_item = {
#         "id": "123",
#         "owner": "test_user",
#         "title": "Test ToDo",
#         "description": "Test Description",
#         "status": "ToDo",
#     }

#     # Correct way to use the client fixture
#     response = client.post("/todos", json=todo_item)
#     print(response.json())
#     assert response.status_code == 200

# Add more tests for each endpoint
