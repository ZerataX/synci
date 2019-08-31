import functools
import urllib.parse
import random

from flask import (
    abort, Blueprint, flash, g, redirect, request, session,
    url_for, current_app
)

SCOPES = "user-read-playback-state user-modify-playback-state user-read-email"
bp = Blueprint("auth", __name__, url_prefix="/auth")


@bp.route("/login")
def login():
    # https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow
    state = str(random.getrandbits(128))
    auth_url = f"https://accounts.spotify.com/authorize" + \
               f"?client_id={current_app.config['CLIENT_ID']}" + \
               f"&redirect_uri={url_for('auth.callback', _external=True)}" + \
               f"&scope={urllib.parse.quote(SCOPES)}" + \
               f"&state={state}&response_type=token"
    resp = redirect(auth_url)
    resp.set_cookie("state", state)

    return resp


@bp.route("/callback")
def callback():
    error = request.values.get("error")

    if error:
        flash(error)
        if error == "access_denied":
            abort(401)
        abort(500)

    session["user_id"] = random.getrandbits(128)
    # redirect to last visited page (check cookie)
    response = redirect(url_for("index"))
    response.set_cookie('user_id', str(session["user_id"]))

    return response


@bp.before_app_request
def load_logged_in_user():
    g.user = session.get("user_id")


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if "user_id" not in session:
            return redirect(url_for("auth.login"))

        return view(**kwargs)

    return wrapped_view
