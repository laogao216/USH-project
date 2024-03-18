from datetime import datetime, timedelta, timezone
from fastapi import FastAPI
from jose import JWTError, jwt
from passlib.context import CryptContext
from secrets import token_hex
from pydantic import BaseModel
from json import loads, dumps
from fastapi.middleware.cors import CORSMiddleware

class New_user(BaseModel):
    username: str
    password: str
    security_question: str
    security_question_answer: str

class Username(BaseModel):
    username:str

class New_password(BaseModel):
    username: str
    security_question_answer: str
    new_password: str

class Login(BaseModel):
    username: str
    password: str

class credentials_exception(Exception):
    'Could not validate credentials'

class Token(BaseModel):
    token: str

class Sign_up(BaseModel):
    token: str
    bs_role: str
    miner_ts_role: str

# load db from json files as lists of dicts
users = []
with open('users.json', 'r') as f:
    users = loads(f.read())['users']
signups = []
with open('signups.json', 'r') as f:
    signups = loads(f.read())['signups']

# freshly generated for each API restart
secret_key = token_hex(32)

crypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

app = FastAPI()

app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
)

# write lists of dicts into json db files
def write_user_db():
    with open('users.json', 'w') as f:
        f.write(dumps({'users': users}, indent=4))

def write_signup_db():
    with open('signups.json', 'w') as f:
        f.write(dumps({'signups': signups}, indent=4))

# make token with secret key
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm='HS256')
    return encoded_jwt

# get username from a valid token, can be used to validate token
def get_user(token: str):
    user = ''
    try:
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        user = username
    except JWTError:
        raise credentials_exception
    if user is None:
        raise credentials_exception
    return user

# register new user, then save to json db file
@app.post('/login/useradd/')
async def useradd(request: New_user):
    for user in users:
        if user['username'] == request.username:
            return {'ret_status': 1, 'msg': 'Username already in use'}
    user = {
        'username': request.username,
        'hashed_password': crypt_context.hash(request.password),
        'security_question': request.security_question,
        'hashed_security_question_answer': crypt_context.hash(request.security_question_answer),
        'privilege_level': 0,
    }
    users.append(user)
    write_user_db()
    return {'ret_status': 0}

# get security question with username
@app.post('/login/security_question/')
async def get_security_question(request: Username):
    for user in users:
        if user['username'] == request.username:
            return {'ret_status': 0, 'security_question': user['security_question']}
    return {'ret_status': 1, 'msg': 'User not found'}

# reset password by answering security question, then save to json db file
@app.post('/login/forget_password/')
async def change_password(request: New_password):
    for user in users:
        if user['username'] == request.username:
            if crypt_context.verify(request.security_question_answer, user['hashed_security_question_answer']):
                user['hashed_password'] = crypt_context.hash(request.new_password)
                write_user_db()
                return {'ret_status': 0}
            else: 
                return {'ret_status': 2, 'msg': 'Incorrect security question answer'}
    return {'ret_status': 1, 'msg': 'User not found'}

# login with username and password, get token
@app.post('/login/')
async def login(request: Login):
    for user in users:
        if user['username'] == request.username:
            if crypt_context.verify(request.password, user['hashed_password']):
                access_token = create_access_token(data={'sub': request.username}, expires_delta=timedelta(minutes=10))
                return {'ret_status': 0, "access_token": access_token, "token_type": "bearer"}
            return {'ret_status': 2, 'msg': 'Incorrect password'}
    return {'ret_status': 1, 'msg': 'User not found'}

# get username from a valid token
@app.post('/login/username/')
async def get_username(request: Token):
    try:
        username = get_user(request.token)
        return {'ret_status': 0, 'username': username}
    except credentials_exception:
        return {'ret_status': 1, 'msg': 'Could not validate credentials'}

# get all signed up, checking token because token is required before and after this so why not  
@app.post('/signup/get/')
async def get_all_signed_up(request: Token):
    try:
        get_user(request.token)
    except credentials_exception:
        return {'ret_status': 1, 'msg': 'Could not validate credentials'}
    return {'ret_status': 0, 'signups': signups}

# sign up the user holding token. If already signed up, edit the record. Ssave to json db file  
@app.post('/signup/post/')
async def signup(request: Sign_up):
    username = ''
    try:
        username = get_user(request.token)
    except credentials_exception:
        return {'ret_status': 1, 'msg': 'Could not validate credentials'}
    for signup in signups:
        if signup['username'] == username:
            signup['bs_role'] = request.bs_role
            signup['miner_ts_role'] = request.miner_ts_role
            write_signup_db()
            return {'ret_status': 0}
    signup = {
        'username': username,
        'bs_role': request.bs_role,
        'miner_ts_role': request.miner_ts_role,
    }
    signups.append(signup)
    write_signup_db()
    return {'ret_status': 0}

# remove user' signup  
@app.post('/signup/cancel/')
async def clear_signup(request: Token):
    username = ''
    try:
        username = get_user(request.token)
    except credentials_exception:
        return {'ret_status': 2, 'msg': 'Could not validate credentials'}
    signupIdx = -1
    for i, signup in enumerate(signups):
        if signup['username'] == username:
            signupIdx = i
            break
    if (signupIdx == -1):
        return {'ret_status': 1, 'msg': 'User not found'}
    signups.pop(signupIdx)
    write_signup_db()
    return {'ret_status': 0}

# user token to check if user is privileged enough, then clear struct and json db file  
@app.post('/signup/clear/')
async def clear_signup(request: Token):
    username = ''
    try:
        username = get_user(request.token)
    except credentials_exception:
        return {'ret_status': 2, 'msg': 'Could not validate credentials'}
    for user in users:
        if user['username'] == username:
            if user['privilege_level'] < 3:
                return {'ret_status': 3, 'msg': 'Only officers can clear signup'}
            else: 
                signups.clear()
                write_signup_db()
                return {'ret_status': 0}
    return {'ret_status': 1, 'msg': 'User not found'}

