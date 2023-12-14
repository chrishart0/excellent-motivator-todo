# models.py
from pydantic import BaseModel, validator
from datetime import datetime, timedelta
from typing import Optional
import uuid

class ToDoItem(BaseModel):
    title: str = "Unnamed todo item"
    description: Optional[str] = None
    status: str = "ToDo"

    # ToDo: Run a check a todo doesn't already exist with this ID