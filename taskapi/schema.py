from datetime import datetime
from pydantic import BaseModel , ConfigDict, Field, model_validator
from pydantic import EmailStr, field_validator


class Taskread(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title:str
    completed: bool
    created_at : datetime


class TaskCreate(BaseModel):
    title: str = Field(min_length=2, max_length=50)

class TaskUpdate(BaseModel):
    title: str | None = None
    completed: bool | None = None

    @model_validator(mode="after")
    def reject_explicit_nulls(self):
        for field_name in self.model_fields_set:
            if getattr(self, field_name) is None:
                raise ValueError(
                    f"{field_name} cannot be null"
                )

        return self

class UserCreate(BaseModel):
    email : EmailStr
    password : str = Field(min_length=8, max_length=120)

    @field_validator("email", mode= "before")
    @classmethod
    def normalize_email(cls, value):
        if isinstance(value,str):
            return value.strip().lower()
        return value

class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)


    id : int
    email : EmailStr
    created_at: datetime
