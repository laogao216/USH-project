from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class Name(BaseModel):
    name: str

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
async def signup(request: Name):
    with open("signup", "a") as f:
        f.write(request.name + "\n")
    return {"status": 200, "name": request}

@app.get('/signup/')
async def getNames():
    names = ""
    with open("signup", "r") as f:
        names = f.read()
    return {"status": 200, "names": names}
