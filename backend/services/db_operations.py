# ddb_operations.py
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2 import sql
from fastapi import HTTPException
from datetime import datetime, date

# Set up logging
import utils.logger as logger
logger = logger.get_logger()


def item_post_processing(item):
    if 'position' not in item:
        item['position'] = 0
    try:
        logger.info("Checking due status")
        if item['status'] != 'Done' and 'due_date' in item and not item['due_date'] is None:
            due_date = item['due_date']
            if item['due_date'] < date.today():
                logger.info("Due date is in the past")
                item['due_status'] = "today"
                # Due date is in the past, not counting today
                # Round up due date to the next day
                if due_date < date.today():
                    item['due_status'] = "overdue"
            else:
                item['due_status'] = None
        else :
            item['due_status'] = None
    except Exception as e:
        item['due_status'] = None
        logger.error(item['id'])
        logger.error(f"Couldn't process due_status for: {item['id']}")
        logger.error(e)

    return item

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

def get_next_position(conn, status):
    with conn.cursor() as cur:
        #ToDo: Round to nearest 100
        cur.execute("SELECT COALESCE(MAX(position), 0) + 100 FROM todo_items WHERE status = %s;", (status,)) 
        return cur.fetchone()[0]

def create_todo(item):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # Calculate the new position for the given status
        new_position = get_next_position(conn, item['status'])

        # Prepare the SQL query
        cur.execute(
            sql.SQL("INSERT INTO todo_items (id, title, description, status, created_at, updated_at, due_date, owner, position) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);"),
            (item['id'], item['title'], item['description'], item['status'], item['created_at'], item['updated_at'], item['due_date'], item['owner'], new_position)
        )
        conn.commit()

        # Retrieve the newly created item and return it
        return get_todo(item['id'])
    

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
        # if final_item doesn't have position, give it a position of 0
        for item in items:
            item = item_post_processing(item)

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
            item = item_post_processing(item)
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
            sql.SQL("UPDATE todo_items SET title = %s, description = %s, status = %s, position = %s, due_date = %s, updated_at = %s WHERE id = %s;"),
            (todo_update['title'], todo_update['description'], todo_update['status'], todo_update['position'], todo_update['due_date'], datetime.utcnow(), id)
        )
        conn.commit()
        return get_todo(id)  # Retrieve the updated item
    except Exception as e:
        conn.rollback()
        logger.error(e)
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
