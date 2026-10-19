from fastapi import FastAPI, Depends, status, HTTPException, Response, Request
from database import get_db
from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy import select
from models import Task, User
from schema import Taskread, TaskCreate, TaskUpdate, UserCreate, UserRead
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from security import hash_password, verify_password, create_access_token
from auth import get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Query
import time 
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.get("/db-check")
def db_check(db : Session = Depends(get_db)):
    result = db.execute(text("SELECT 1")).scalar_one()

    return {
        "database": "connected",
        "result": result
    }

@app.middleware("http")
async def measure_request_time(request: Request, call_next):
    start_time = time.perf_counter()

    response = await call_next(request)

    elapsed = time.perf_counter() - start_time

    response.headers["X-Process-Time"] = str(elapsed)

    return response




@app.get("/tasks", response_model=list[Taskread])
def list_tasks( limit: int = Query(default=2,ge=1,le=100) ,
                search: str | None = Query(default=None, min_length=1, max_length=100),
                offset:int =Query(default=0, ge=0),
                completed: bool | None = Query(default=None),
                db: Session = Depends(get_db),
               current_user: User = Depends(get_current_user)):
    
    statement = select(Task).where(Task.user_id == current_user.id)

    if search:
        statement = statement.where(Task.title.ilike(f"%{search}%"))

    if completed is not None:
        statement = statement.where(Task.completed == completed)

    statement = statement.order_by(Task.id.asc()).offset(offset=offset).limit(limit)

    tasks = db.scalars(statement).all()

    return tasks

@app.get("/tasks/{task_id}", response_model=Taskread)
def get_task(task_id : int , db : Session = Depends(get_db),
             current_user: User = Depends(get_current_user)):
    statement = select(Task).where(Task.user_id == current_user.id , Task.id == task_id)
    task = db.scalar(statement)


    if task is None:
        raise HTTPException(status_code=404, detail="task not found")

    return task

@app.post("/tasks",response_model=Taskread, status_code=status.HTTP_201_CREATED)
def crete_task(payload: TaskCreate, 
               db: Session = Depends(get_db),
               current_user: User = Depends(get_current_user)):
    task = Task(
        title = payload.title,
        user_id = current_user.id
        )

    try:
        db.add(task)
        db.commit()
        db.refresh(task)

    except SQLAlchemyError:
        db.rollback()
        raise

    return task

@app.patch("/tasks/{task_id}", response_model=Taskread)
def update_task(task_id : int ,
                payload: TaskUpdate,
                db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):

    statement = select(Task).where(Task.user_id == current_user.id , Task.id == task_id)
    task = db.scalar(statement)

    if task is None:
        raise HTTPException(status_code=404,detail="task not found")

    update_data = payload.model_dump(exclude_unset=True)

    if not update_data:
        return task
    
    for field , value in update_data.items():
        setattr(task, field,value)

    try:
        db.commit()
        db.refresh(task)

    except SQLAlchemyError:
        db.rollback()
        raise

    return task

@app.delete("/tasks/{task_id}",
            status_code=status.HTTP_204_NO_CONTENT,
            response_class=Response)
def delete_task(task_id:int,
                current_user: User = Depends(get_current_user), 
                db: Session = Depends(get_db)) -> Response:
    statement = select(Task).where(Task.user_id == current_user.id , Task.id == task_id)
    task = db.scalar(statement)

    if task is None:
            raise HTTPException(status_code=404,detail="task not found")

    try:
        db.delete(task)
        db.commit()

    except SQLAlchemyError:
        db.rollback()
        raise

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.post("/auth/register", response_model=UserRead,status_code=status.HTTP_201_CREATED)
def regiter_user(payload: UserCreate, db: Session= Depends(get_db) ):
    email = str(payload.email)

    existing_user = db.scalar(select(User).where(User.email == email))

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="email already exists",
        )

    user = User( email = email, password_hash = hash_password(payload.password))

    db.add(user)

    try: 
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        ) from None
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to register user",
        ) from None

    return user

@app.post("/auth/login")
def login( form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    email = form_data.username.strip().lower()

    user = db.scalar(
        select(User).where(User.email == email))

    if not user : 
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="user nahi mila")

    result = verify_password(
                form_data.password,
                user.password_hash,
            )
    
    if not result:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
        )

    token = create_access_token(subject=str(user.id))

    return {
        "access_token": token,
        "token_type": "Bearer",
    }

@app.get("/users/me", response_model= UserRead)
def read_user_me( current_user : User = Depends(get_current_user)):
    return current_user