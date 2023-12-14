# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import ToDoItem
import boto3
from botocore.exceptions import ClientError
from datetime import datetime
import uuid

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
    try:
        # Add created and updated datestamps filter date to just the second
        item = todo.model_dump()
        item['id'] = str(uuid.uuid4())
        item['created_at'] = datetime.utcnow().isoformat().split('.')[0]
        item['updated_at'] = datetime.utcnow().isoformat().split('.')[0]
        item['owner'] = "chris"
        print(item)
        response = table.put_item(Item=item)
        return item
    except ClientError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/todos")
async def get_all_todos():
    try:
        response = table.scan()
        return response.get('Items', [])
    except ClientError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/todos/{id}")
async def get_todo(id: str):
    try:
        response = table.get_item(Key={'id': id})
        item = response.get('Item')
        if item:
            return item
        raise HTTPException(status_code=404, detail="Item not found")
    except ClientError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/todos/{id}")
async def update_todo(id: str, todo_update: ToDoItem):
    try:
        expression_values = {
            ':t': todo_update.title,
            ':d': todo_update.description,
            ':s': todo_update.status,
            ':u': datetime.utcnow().isoformat().split('.')[0]
        }
        expression_names = {
            '#title': 'title',
            '#desc': 'description',
            '#status': 'status',
            '#updated_at': 'updated_at'
        }
        update_expression = "set #title = :t, #desc = :d, #status = :s, #updated_at = :u"

        if "due_date" in todo_update:
            update_expression += ", #due_date = :dd"
            expression_values[':dd'] = todo_update.due_date.isoformat()
            expression_names['#due_date'] = 'due_date'

        response = table.update_item(
            Key={'id': id},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_values,
            ExpressionAttributeNames=expression_names,
            ReturnValues="UPDATED_NEW"
        )

        # Now retrieve the updated item and return it to ensure it was updated
        updated_item = table.get_item(Key={'id': id}).get('Item')
        print(updated_item)
        return updated_item
    except ClientError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/todos/{id}")
async def delete_todo(id: str):
    try:
        table.delete_item(Key={'id': id})
        return {"message": "Item deleted successfully"}
    except ClientError as e:
        raise HTTPException(status_code=400, detail=str(e))
