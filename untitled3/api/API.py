import time
import threading
from uuid import uuid4
from random import shuffle
import random as rand
from datetime import datetime, timedelta

from fastapi import FastAPI, HTTPException
from fastapi.params import Query
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware


middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins = ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
]
app = FastAPI(middleware=middleware)

IDList = {}
leaderboards = {
    1: [],
    2: [],
    3: [],
    4: []
}
MultiList = {}

lock = threading.Lock()

PING_INTERVAL = 60
CHECK_DELAY = 1


@app.get("/")
def read_root():
    return list(IDList.keys())


@app.get("/init_id/{difficulty}/{multi}")
def init_id(difficulty: int, multi: bool, code: int = Query(default=None)):
    with lock:
        if multi:
            if code not in MultiList:
                raise HTTPException(status_code=404, detail="Multiplayer room not found")

            room = MultiList[code]
            if room["contplayer"] >= 1:
                raise HTTPException(status_code=400, detail="Room already initialized")

            # Create solution and store in MultiList
            if difficulty == 1:
                tries = 10
                solution = list(range(1, 4))
                shuffle(solution)
            elif difficulty == 2:
                tries = 8
                solution = list(range(1, 8))
                shuffle(solution)
                solution = solution[:4]
            elif difficulty == 3:
                tries = 6
                solution = list(range(1, 9))
                shuffle(solution)
            else:
                raise HTTPException(status_code=400, detail="Invalid difficulty")

            ID = str(uuid4())
            MultiList[code].update({
                "solution": solution,
                "tries": tries,
                "difficulty": difficulty,
                "contplayer": 1,
                "players": [ID],
                "winner": None
            })

            IDList[ID] = {
                'difficolta': difficulty,
                'tentativi': tries,
                'soluzione': solution,
                'last_ping': datetime.utcnow(),
                'time': time.time(),
                'start': None  # Will be set when second player joins
            }

            return {"id": ID, "status": "waiting for second player", "code": code}

        # Singleplayer fallback
        if difficulty == 1:
            tries = 10
            solution = list(range(1, 4))
            shuffle(solution)
        elif difficulty == 2:
            tries = 8
            solution = list(range(1, 8))
            shuffle(solution)
            solution = solution[:4]
        elif difficulty == 3:
            tries = 6
            solution = list(range(1, 9))
            shuffle(solution)
        else:
            raise HTTPException(status_code=400, detail="Invalid difficulty")

        ID = str(uuid4())
        IDList[ID] = {
            'difficolta': difficulty,
            'tentativi': tries,
            'soluzione': solution,
            'last_ping': datetime.utcnow(),
            'time': time.time(),
            'start': time.time()
        }
        return {"id": ID}


@app.get("/create")
def create_multi(difficulty: int = Query(...)):
    randnum = rand.randint(1000, 9999)

    if difficulty == 1:
        solution = list(range(1, 4))
        shuffle(solution)
    elif difficulty == 2:
        solution = list(range(1, 8))
        shuffle(solution)
        solution = solution[:4]
    elif difficulty == 3:
        solution = list(range(1, 9))
        shuffle(solution)
    else:
        raise HTTPException(status_code=400, detail="Invalid difficulty")

    MultiList[randnum] = {
        "contplayer": 0,
        "solution": solution,
        "difficulty": difficulty,
        "players": [],  # To track all player IDs
        "winner": None
    }
    return randnum


@app.get("/join/{code}")
def join(code: int):
    with lock:
        if code not in MultiList:
            raise HTTPException(status_code=404, detail="Room not found")

        room = MultiList[code]

        if room["contplayer"] != 1:
            raise HTTPException(status_code=400, detail="Room not available or already full")

        # Second player joins
        ID = str(uuid4())
        room["contplayer"] += 1
        room["players"].append(ID)

        # Set start time for both players
        start_time = time.time()

        for player_id in room["players"]:
            if player_id in IDList:
                IDList[player_id]["start"] = start_time

        IDList[ID] = {
            'difficolta': room["difficulty"],
            'tentativi': room["tries"],
            'soluzione': room["solution"],
            'last_ping': datetime.utcnow(),
            'time': start_time,
            'start': start_time
        }

        return {"id": ID, "status": "game started", "players": room["players"]}



@app.get("/check/{ID}")
def check_ID(ID: str):
    with lock:
        if ID not in IDList:
            return "KO"
        else:
            return "OK"

@app.get("/gettime")
def gettime(ID: str):
    if ID not in IDList:
        raise HTTPException(status_code=404, detail="Invalid ID")

    player_data = IDList[ID]
    difficulty = player_data["difficolta"]
    elapsed_time = time.time() - player_data["start"]

    # Check if the player is in a multiplayer room
    for code, room in MultiList.items():
        if ID in room['players']:
            if room["winner"] is None:
                # First to finish
                room["winner"] = ID
                leaderboards[difficulty].append(elapsed_time)
                leaderboards[difficulty].sort()
                return {"status": "won", "time": elapsed_time}
            elif room["winner"] == ID:
                return {"status": "won", "time": elapsed_time}
            else:
                return {"status": "lost", "winner": room["winner"]}

    # Singleplayer fallback
    leaderboards[difficulty].append(elapsed_time)
    leaderboards[difficulty].sort()
    return {"status": "finished", "time": elapsed_time}

@app.get("/getlb")
def getLB():
    with open("leaderboard.txt", "r") as f:
        return f.readlines()

@app.get("/ping/{ID}")
def ping(ID: str):
    with lock:
        if ID not in IDList:
            raise HTTPException(status_code=404, detail="ID not found")
        IDList[ID]['last_ping'] = datetime.utcnow()
    return {"status": "pong", "id": ID, "timestamp": IDList[ID]['last_ping'].isoformat()}


def cleanup_inactive_ids():
    while True:
        time.sleep(PING_INTERVAL + CHECK_DELAY)  # 35 s
        cutoff = datetime.utcnow() - timedelta(seconds=PING_INTERVAL + CHECK_DELAY)
        with lock:
            inactive_ids = [id_ for id_, data in IDList.items() if data['last_ping'] < cutoff]
            for id_ in inactive_ids:
                print(f"Removing inactive ID: {id_}")
                del IDList[id_]



threading.Thread(target=cleanup_inactive_ids, daemon=True).start()
@app.get("/checkcolor/{ID}")
def check_colour(ID: str, player_colour: list[int] = Query()):

    correct_colour = IDList[ID]['soluzione']

    risposte = [0,0]
    with lock:
            for i in range(len(player_colour)):
                for y in range(len(correct_colour)):
                    if player_colour[i] == correct_colour[y]:
                        if i == y:
                            risposte[0] += 1
                        else:
                            risposte[1] += 1
                        break  # exit inner loop after a match
    return list(risposte)

@app.get("/profile/add/{user}")
def add_profilo(user: str, password: str = Query():
    exist = -1
    with open("profili.txt","a+") as file:
        for line in file:
            if user == line.split(",")[0]:
                exist = 1
        if exist == -1:
            uniqueID = str(uuid4())
            file.write(f"{user},{password}," + uniqueID)
            return uniqueID
        else:
            return -1

@app.get("/profile/get/{user}")
def get_profilo(user: str, password: str = Query()):
    with open("profili.txt","r") as file:
        for line in file:
            if line.find(user) != -1:
                temp = line.split(",")
                if password == temp[1]:
                    print("pass giusto")
                    return temp[2] #password giusta
                else:
                    print("pass sbagliata")
                    return 0 #password sbagliata
    return -1 #account non trovato