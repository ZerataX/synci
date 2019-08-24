import random

from flask import (
    abort, Blueprint, g, render_template, request, redirect, url_for, jsonify
)
from synci.auth import login_required
from synci.constants import WORD_LIST_PATH

bp = Blueprint("session", __name__, url_prefix="/session")
sessions = []


class Session:
    def __init__(self, name, author):
        self.name = name
        self.author = author
        self.followers = set()
        self.song = None

    def json(self):
        result = {
            "name": self.name,
            "author": self.author,
            "followers": self.followers,
            "song": self.song.url,
            "api_url": self.song.api,
            "timestamp": self.song.timestamp
        }
        return result

    def __str__(self):
        return self.name


class Song:
    def __init__(self, uri, api, timestamp=0):
        self.uri = uri
        self.api = api
        self.timestamp = timestamp


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
        if g.user != session.author:
            session.followers.add(g.user)
        return render_template("pages/session.html")
    sessions.append(session(name, g.user))

    return render_template("pages/session.html")


@bp.route("/<session>/info", methods=("GET", "PUT"))
@login_required
def info(session):
    session = get_session(session)
    if not session:
        abort(404)
    if request.method == "PUT":
        if session.author == g.user:
            data = request.json
            session.name = data.name
            if (
                data.author not in session.followers and
                data.author != session.author
               ):
                abort(400)
            session.author = data.author
            followers = set(data.followers)
            for follower in followers:
                if follower not in session.followers:
                    abort(400)
            session.followers = followers
            session.song = Song(data.song, data.api_url, data.timestamp)
    return jsonify(session.json())
