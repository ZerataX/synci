import os

from flask import Flask, render_template
from flask_assets import Environment, Bundle
from webassets.filter import register_filter

from synci.filters import SassFilter

register_filter(SassFilter)


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        CLIENT_ID='spotify client id',
    )

    # build static files
    assets = Environment(app)
    assets.url = app.static_url_path
    sass = Bundle('styles/main.sass', filters='pysass', output='all.css')
    assets.register('sass_all', sass)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # from . import db
    # db.init_app(app)

    from . import auth, session
    app.register_blueprint(auth.bp)
    app.register_blueprint(session.bp)

    @app.route('/', methods=('GET', 'POST'))
    def index():
        return render_template('pages/index.html')

    return app
