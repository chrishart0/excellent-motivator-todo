# ddb_operations.py

import boto3
from fastapi import HTTPException
from botocore.exceptions import ClientError
from datetime import datetime
import uuid

# Initialize Boto3 DynamoDB
dynamodb = boto3.resource('dynamodb', endpoint_url="http://dynamodb-local:8000")
table = dynamodb.Table('ToDoItems')

def create_todo(item):
    try:
        response = table.put_item(Item=item)
        # return item
        return True
    except ClientError as e:
        raise HTTPException(status_code=400, detail=str(e))

def get_all_todos():
    response = table.scan()
    return response.get('Items', [])

def get_todo(id):
    try:
        response = table.get_item(Key={'id': id})
        item = response.get('Item')
        if item:
            return item
        raise HTTPException(status_code=404, detail="Item not found")
    except ClientError as e:
        raise HTTPException(status_code=400, detail=str(e))

def update_todo(id, todo_update):
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

def delete_todo(id):
    try:
        table.delete_item(Key={'id': id})
        return {"message": "Item deleted successfully"}
    except ClientError as e:
        raise HTTPException(status_code=400, detail=str(e))

