# The file for the handling of game code.
from game_modules.stellar_objects import galaxy


class PlayerWorld:
	def __init__(self):
		# The Galaxy Object is the base container for all other objects in the game.
		self.galaxy = galaxy.Galaxy()
		self.galaxy.generate_galaxy()
		self.player_command_mapping = {
			'start_construction'
		}

	def generate_player_empire(self):
		pass

	def handle_player_input(self, commands):
		pass

	# GETTERS
	def get_all_objects(self):
		return self.galaxy.get_objects()

	def get_canvas_size(self):
		return self.galaxy.get_galaxy_creation_parameters('size_of_canvas')

	def game_loop(self):
		pass


player_world = PlayerWorld()
