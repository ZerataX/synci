import random

from flask import (
    Blueprint, g, render_template, request, redirect, url_for, jsonify
)
from synci.auth import login_required
from synci.constants import WORD_LIST_PATH

bp = Blueprint("session", __name__, url_prefix="/session")
sessions = []


def random_readable_string(length=3, wordlist=WORD_LIST_PATH):
    with open(wordlist) as f:
        lines = f.read().splitlines()
        string = ""
        for _ in range(length):
            string += random.choice(lines).title()
    return string


def get_session(name):
    for session in sessions:
        if name == session["name"]:
            return session


@bp.route("/")
@login_required
def index():
    return redirect(url_for('session.join', session=random_readable_string()))


@bp.route("/<session>")
@login_required
def join(session):
    for x in sessions:
        if session == x["name"]:
            return render_template("session.html")
    sessions.append({
        "name": session,
        "author": g.user,
        "followers": [],
        "song": None,
        "api_url": None,
        "timestamp": 0
    })

    return render_template("session.html")


@bp.route("/<session>/info", methods=("GET", "PUT"))
@login_required
def info(session):
    if request.method == "PUT":
        session = get_session(session)
        if session and session["author"] == g.user:
            pass  # set song and playtime

    if request.method == "GET":
        return jsonify(get_session(session))
