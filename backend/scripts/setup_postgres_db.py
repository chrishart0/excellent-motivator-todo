import psycopg2
import os

# Establish a connection to the PostgreSQL database
conn = psycopg2.connect(
    dbname=os.getenv("POSTGRES_DB"), 
    user=os.getenv("POSTGRES_USER"), 
    password=os.getenv("POSTGRES_PASSWORD"), 
    host=os.getenv("POSTGRES_HOST"),
)
cur = conn.cursor()

# Define the CREATE TABLE statement
create_table_query = """
CREATE TABLE IF NOT EXISTS todo_items (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    owner TEXT NOT NULL,
    position DECIMAL
);
"""

# Execute the statement and commit changes
cur.execute(create_table_query)
conn.commit()

# Create an example item
example_item = {
    "id": "f9f5d7d2-8d4e-4f0a-9b1f-5e6d9d388f7f",
    "title": "Example Item",
    "description": "This is an example item created by initial db setup script.",
    "status": "InProgress",
    "created_at": "2021-06-20 12:00:00",
    "updated_at": "2021-06-20 12:00:00",
    "owner": "chris",
    "position": 1
}

# Define the INSERT statement
insert_item_query = """
INSERT INTO todo_items (id, title, description, status, created_at, updated_at, owner, position)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
"""

# Execute the INSERT statement
cur.execute(insert_item_query, (
    example_item['id'],
    example_item['title'],
    example_item['description'],
    example_item['status'],
    example_item['created_at'],
    example_item['updated_at'],
    example_item['owner'],
    example_item['position']
))
conn.commit()


# Close the cursor and connection
cur.close()
conn.close()
