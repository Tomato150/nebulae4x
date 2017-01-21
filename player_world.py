# The file for the handling of game code.
from game_modules import colonies, galaxy_generation

import flask_handler


class PlayerWorld:
	def __init__(self):
		self.galaxy = galaxy_generation.Galaxy()
		self.modifiers = {
			'build_points': 10  # How much each factory is worth each year.
		}

	def get_stars(self):
		return self.galaxy.get_stars()

	def game_loop(self):
		pass


player_world = PlayerWorld()
