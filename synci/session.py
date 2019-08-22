from flask import (
    Blueprint, g, render_template, request
)
from synci.auth import login_required
# from synci.db import get_db

bp = Blueprint('session', __name__, url_prefix='/session')
sessions = []


@bp.route('/')
@login_required
def create():
    return render_template('session/index.html')



@bp.route('/<session>', methods=('GET', 'POST'))
@login_required
def join(session):
    if request.method == 'POST':
        for x in sessions:
            if session == x['name']:
                session = x
                break

        if session and session['author'] == g.user:
            for user in session['followers']:
                # sync song
                pass

    if request.method == 'GET':
        for x in sessions:
            if session == x['name']:
                return render_template('session/session.html')
        sessions.append({
            "name": session,
            "author": g.user,
            "followers": [],
            "song": None,
            "playtime": 0
        })

        return render_template('session/session.html')
