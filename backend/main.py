# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import ToDoItem
import boto3
from botocore.exceptions import ClientError
from datetime import datetime
import uuid

# Utils
import services.db_operations as db

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:3001",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize Boto3 DynamoDB
dynamodb = boto3.resource('dynamodb', endpoint_url="http://dynamodb-local:8000")
table = dynamodb.Table('ToDoItems')


@app.post("/todos")
async def create_todo(todo: ToDoItem):

    # Add created and updated datestamps filter date to just the second
    item = todo.model_dump()
    item['id'] = str(uuid.uuid4())
    item['created_at'] = datetime.utcnow().isoformat().split('.')[0]
    item['updated_at'] = datetime.utcnow().isoformat().split('.')[0]
    item['owner'] = "chris"
    print(item)
    db.create_todo(item)

    return item

@app.get("/todos")
async def get_all_todos():
    return db.get_all_todos()

@app.get("/todos/{id}")
async def get_todo(id: str):
    return db.get_todo(id)

@app.put("/todos/{id}")
async def update_todo(id: str, todo_update: ToDoItem):
    return db.update_todo(id, todo_update)

@app.delete("/todos/{id}")
async def delete_todo(id: str):
    db.delete_todo(id)