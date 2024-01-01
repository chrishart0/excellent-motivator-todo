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
    owner TEXT NOT NULL
);
"""

# Execute the statement and commit changes
cur.execute(create_table_query)
conn.commit()

# Close the cursor and connection
cur.close()
conn.close()
