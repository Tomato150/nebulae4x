from flask import *

from player_world import player_world

import sqlite3
import json
import os
import pickle
import datetime


# JSON default argument for nested objects
def to_json(obj):
	try:
		return obj.serialize()
	except AttributeError:
		return obj.__dict__

# Flask Config
app = Flask(__name__)
app.config.from_object('flask_config')

app.config.update(dict(
	DATABASE=os.path.join(app.root_path, 'player_database.db')
))


def connect_db():
	# Connects to the specific database.
	rv = sqlite3.connect(app.config['DATABASE'])
	rv.row_factory = sqlite3.Row
	return rv


def init_db():
	db = get_db()
	with app.open_resource('schema.sql', mode='r') as f:
		db.cursor().executescript(f.read())
	db.commit()


@app.cli.command('initdb')
def initdb_command():
	# Initializes the DB
	init_db()
	print('Initialized the database.')


def get_db():
	# Opens a new database connection if there is none for the current app context.
	if not hasattr(g, 'sqlite_db'):
		g.sqlite_db = connect_db()
	return g.sqlite_db


@app.teardown_appcontext
def close_db(error):
	if hasattr(g, 'sqlite_db'):
		g.sqlite_db.close()


@app.route('/', methods=['GET', 'POST'])
def index():
	return render_template('index.html')


@app.route('/get_stars', methods=['GET'])
def get_stars():
	return_vals = player_world.get_all_objects()
	return_vals.update({'canvas_size': player_world.get_canvas_size()})

	return json.dumps(return_vals, default=to_json)

if __name__ == '__main__':
	app.run(host='0.0.0.0')
