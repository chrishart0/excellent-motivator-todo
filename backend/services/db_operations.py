# ddb_operations.py
import os
import boto3
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2 import sql
from fastapi import HTTPException
from botocore.exceptions import ClientError
from datetime import datetime

# Initialize Boto3 DynamoDB
dynamodb = boto3.resource('dynamodb', endpoint_url="http://dynamodb-local:8000")
table = dynamodb.Table('ToDoItems')

# Connect to PostgreSQL
# Establish a connection to the PostgreSQL database
def get_db_connection(use_dict_cursor=False):
    conn = psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB"), 
        user=os.getenv("POSTGRES_USER"), 
        password=os.getenv("POSTGRES_PASSWORD"), 
        host=os.getenv("POSTGRES_HOST"),
    )
    if use_dict_cursor:
        conn.cursor_factory = RealDictCursor # Return results as a list of dicts instead of tuples
    return conn


def create_todo(item):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
         # Prepare the SQL query
        cur.execute(
            sql.SQL("INSERT INTO todo_items (id, title, description, status, created_at, updated_at, owner) VALUES (%s, %s, %s, %s, %s, %s, %s);"),
            (item['id'], item['title'], item['description'], item['status'], item['created_at'], item['updated_at'], item['owner'])
        )
        conn.commit()
        return True
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()

def get_all_todos():
    conn = get_db_connection(use_dict_cursor=True)
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM todo_items;")
        items = cur.fetchall()
        return items  # Convert to a list of dicts if needed
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()

def get_todo(id):
    conn = get_db_connection(use_dict_cursor=True)
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM todo_items WHERE id = %s;", (id,))
        item = cur.fetchone()
        if item:
            return item  # Convert to dict if necessary
        raise HTTPException(status_code=404, detail="Item not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()

def update_todo(id, todo_update):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # Prepare the SQL query for updating
        cur.execute(
            sql.SQL("UPDATE todo_items SET title = %s, description = %s, status = %s, updated_at = %s WHERE id = %s;"),
            (todo_update['title'], todo_update['description'], todo_update['status'], datetime.utcnow(), id)
        )
        conn.commit()
        return get_todo(id)  # Retrieve the updated item
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()


def delete_todo(id):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM todo_items WHERE id = %s;", (id,))
        conn.commit()
        return {"message": "Item deleted successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()
