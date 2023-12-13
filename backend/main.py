# main.py
from fastapi import FastAPI, HTTPException
from models import ToDoItem
import boto3
from botocore.exceptions import ClientError
from datetime import datetime

app = FastAPI()

# Initialize Boto3 DynamoDB
dynamodb = boto3.resource('dynamodb', endpoint_url="http://dynamodb-local:8000")
table = dynamodb.Table('ToDoItems')

@app.post("/todos")
async def create_todo(todo: ToDoItem):
    try:
        # Add created and updated datestamps filter date to just the second
        item = todo.model_dump()
        item['created_at'] = datetime.utcnow().isoformat().split('.')[0]
        item['updated_at'] = datetime.utcnow().isoformat().split('.')[0]
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
        response = table.update_item(
            Key={'id': id},
            UpdateExpression="set #title = :t, #desc = :d, #status = :s, #due_date = :dd, #updated_at = :u",
            ExpressionAttributeValues={
                ':t': todo_update.title,
                ':d': todo_update.description,
                ':s': todo_update.status,
                ':dd': todo_update.due_date.isoformat() if todo_update.due_date else None,
                ':u': datetime.utcnow().isoformat().split('.')[0]
            },
            ExpressionAttributeNames={
                '#title': 'title',
                '#desc': 'description',
                '#status': 'status',
                '#due_date': 'due_date',
                '#updated_at': 'updated_at'
            },
            ReturnValues="UPDATED_NEW"
        )
        return response
    except ClientError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/todos/{id}")
async def delete_todo(id: str):
    try:
        table.delete_item(Key={'id': id})
        return {"message": "Item deleted successfully"}
    except ClientError as e:
        raise HTTPException(status_code=400, detail=str(e))
