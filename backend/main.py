# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import ToDoItem
from datetime import datetime
import uuid

# Utils
import services.db_operations as db

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:3001",  
    "http://192.168.1.216:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/todos")
async def create_todo(todo: ToDoItem):

    # Add created and updated datestamps filter date to just the second
    item = todo.model_dump()

    print(item)
    item['id'] = str(uuid.uuid4())
    item['created_at'] = datetime.utcnow().isoformat().split('.')[0]
    item['updated_at'] = datetime.utcnow().isoformat().split('.')[0]
    item['owner'] = "chris"
    print("item",  item)
    
    final_item = db.create_todo(item)
    print(final_item)

  
    return final_item

@app.get("/todos")
async def get_all_todos():
    return db.get_all_todos()

@app.get("/todos/{id}")
async def get_todo(id: str):
    return db.get_todo(id)

@app.put("/todos/{id}")
async def update_todo(id: str, todo_update: ToDoItem):
    item = todo_update.model_dump()
    item['updated_at'] = datetime.utcnow().isoformat().split('.')[0]
    print("update_todo:", item)
    return db.update_todo(id, item)

@app.delete("/todos/{id}")
async def delete_todo(id: str):
    db.delete_todo(id)

###############
### Chatbot ###
###############

# Designing the API for making new chats and sending messages
# POST /chat/new
# POST /chat
# GET /chat
# GET /chat/{id}
    

@app.post("/chat/new")
async def create_chat():
    return "chat created"
    
@app.post("/chat")
async def send_message(message: str):
    return message
