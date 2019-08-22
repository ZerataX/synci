import functools
import urllib.parse
import random

from flask import (
    Blueprint, flash, g, redirect, request, session, url_for,
    current_app
)

# from synci.db import get_db

SCOPES = "user-read-playback-state user-modify-playback-state"

bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/register')
def register():
    # https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow
    session.clear()
    session.state = random.getrandbits(128)
    auth_url = f"https://accounts.spotify.com/authorize" + \
               f"?client_id={current_app.config['CLIENT_ID']}" + \
               f"&redirect_uri={url_for('auth.login', _external=True)}" + \
               f"&scope={urllib.parse.quote(SCOPES)}" + \
               f"&state={session.state}&response_type=token"
    return redirect(auth_url)


@bp.route('/login')
def login():
    error = request.args.get('error')
    state = request.args.get('state')
    if 'state' in session and session.state == state and not error:
        session['user_id'] = 3  # autoinc user id?
        return redirect(url_for('index'))
    flash(error)


@bp.before_app_request
def load_logged_in_user():
    g.user = session.get('user_id')


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.register'))

        return view(**kwargs)

    return wrapped_view
