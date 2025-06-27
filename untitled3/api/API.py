import time
import threading
from uuid import uuid4
from random import shuffle
from datetime import datetime, timedelta

from fastapi import FastAPI, HTTPException
from fastapi.params import Query
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware


middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins = ["http://localhost:8001"],
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
lock = threading.Lock()

PING_INTERVAL = 60
CHECK_DELAY = 1


@app.get("/")
def read_root():
    return list(IDList.keys())


@app.get("/init_id/{difficulty}")
def init_id(difficulty: int):
    if difficulty == 1:
        tries = 10
        soluzione = list(range(1, 4))
        shuffle(soluzione)
    elif difficulty == 2:
        tries = 8
        soluzione = list(range(1, 8))
        shuffle(soluzione)
        soluzione = soluzione[:4]
    elif difficulty == 3:
        tries = 6
        soluzione = list(range(1, 9))
        shuffle(soluzione)
    elif difficulty == 4:
        tries = 4
        soluzione = list(range(1, 17))
        shuffle(soluzione)
        soluzione = soluzione[:8]
    else:
        raise HTTPException(status_code=400, detail="Invalid difficulty")



    with lock:
        ID = str(uuid4())
        IDList[ID] = {
            'difficolta': difficulty,
            'tentativi': tries,
            'soluzione': soluzione,
            'last_ping': datetime.utcnow(),
            'start': time.time()
        }
    return list(IDList.keys())


@app.get("/check/{ID}")
def check_ID(ID: str):
    with lock:
        if ID not in IDList:
            return "KO"
        else:
            return "OK"

@app.get("/gettime")
def gettime(ID: str):
    t = time.time()- IDList[ID]["start"]
    leaderboards[IDList[ID]["difficolta"]].append(t)
    leaderboards[IDList[ID]["difficolta"]].sort()

    with open("leaderboard.txt", "w") as f:
        for l in range(1,4):
            lb = leaderboards[l][:10]
            for g in lb:
                f.write(g + "-")
            f.write("_")
    return t
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
