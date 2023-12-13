# models.py
from pydantic import BaseModel, validator
from datetime import datetime, timedelta
from typing import Optional
import uuid

class ToDoItem(BaseModel):
    id: str = str(uuid.uuid4())
    owner: str
    title: str = "Unnamed todo item"
    description: Optional[str] = None
    status: str = "ToDo"
    # due_date: Optional[str] = datetime.utcnow() + timedelta(days=7)

    

    # ToDo: Run a check a todo doesn't already exist with this ID