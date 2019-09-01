import random
import time

from flask import (
    abort, Blueprint, g, render_template, request, redirect, url_for, jsonify
)
from synci.auth import login_required
from synci.constants import WORD_LIST_PATH

bp = Blueprint("session", __name__, url_prefix="/session")
sessions = []


class Session:
    def __init__(self, name, host):
        self.name = name
        self.host = host
        self.followers = set()
        self.timestamp = int(round(time.time() * 1000))
        self.song = None

    def json(self):
        result = {
            "host": str(self.host),
            "song": {
                "time": self.song.time,
                "duration": self.song.duration,
                "uri": self.song.uri,
                "href": self.song.href,
                "name": self.song.name,
                "image": self.song.image,
                "artist": self.song.artist,
                "context": self.song.context
            } if self.song else None,
            "timestamp": self.timestamp
        }
        return result

    def __str__(self):
        return self.name


class Song:
    def __init__(self, uri, href, duration, time, name, image, artist, context=None):
        self.href = href
        self.uri = uri
        self.duration = duration
        self.time = time
        self.name = name
        self.image = image
        self.artist = artist
        self.context = context


def random_readable_string(length=3, wordlist=WORD_LIST_PATH):
    with open(wordlist) as f:
        lines = f.read().splitlines()
        string = ""
        for _ in range(length):
            string += random.choice(lines).title()
    return string


def get_session(name):
    for session in sessions:
        if name == session.name:
            return session


@bp.route("/")
@login_required
def index():
    return redirect(url_for('session.join', name=random_readable_string()))


@bp.route("/<name>")
@login_required
def join(name):
    session = get_session(name)
    if session:
        if g.user != session.host:
            session.followers.add(g.user)
        return render_template("pages/session.html")
    sessions.append(Session(name, g.user))

    return render_template("pages/session.html")


@bp.route("/<session>/info", methods=("GET", "PUT"))
@login_required
def info(session):
    session = get_session(session)
    if not session:
        abort(404)
    if int(round(time.time() * 1000)) - session.timestamp > 3* 60 * 1000:
        session.host = None
    if request.method == "PUT":
        if session.host == g.user:
            data = request.json
            host = int(data["host"])
            if not session.host or (
                host not in session.followers and
                host != session.host
               ):
                abort(400)
            session.host = host
            session.timestamp = int(data["timestamp"]) # check timestamp is valid
            song = data["song"]  
            session.song = Song(song["uri"],
                                song["href"],
                                song["duration"],
                                song["time"],
                                song["name"],
                                song["image"],
                                song["artist"],
                                song["context"])
    return jsonify(session.json())
