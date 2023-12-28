from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class Person(BaseModel):
    name: str
    role: str

class Command(BaseModel):
    cmd: str
    passwd: str

app = FastAPI()

origins = ["*"]

app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
)

@app.post("/signup/")
async def signup(request: Person):
    with open("signup", "a") as f:
        f.write(request.name + "\t" + request.role + "\n")
    return {"status": 200, "person": request}

@app.get("/signup/")
async def getPerson():
    persons = ""
    with open("signup", "r") as f:
        persons = f.read()
    return {"status": 200, "persons": persons}

@app.post("/cmd/")
async def command(request: Command):
    if request.passwd != "cincodemayo":
        return {"status": 403, "response": "wrong password"}
    