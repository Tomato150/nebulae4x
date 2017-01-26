# The file for the handling of game code.
from game_modules import colonies, construction, empires, galaxy_generation

import flask_handler


class PlayerWorld:
	def __init__(self):
		self.galaxy = galaxy_generation.Galaxy()
		self.player_empire = empires.Empire('Player Empire', 0)

	def get_stars(self):
		return self.galaxy.get_stars()

	def get_canvas_size(self):
		return self.galaxy.get_canvas_size()

	def game_loop(self):
		pass


player_world = PlayerWorld()
