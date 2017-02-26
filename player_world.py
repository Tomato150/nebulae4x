# The file for the handling of game code.
from game_modules import player_event_handlers, game_loop

from game_modules.stellar_objects import galaxy


class PlayerWorld:
	def __init__(self):
		# The Galaxy Object is the base container for all other objects in the game.
		self.galaxy = galaxy.Galaxy()
		self.galaxy.generate_galaxy()
		self.player_command_mapping = {
			'start_construction_project': player_event_handlers.start_construction_project,
			'remove_construction_project': player_event_handlers.remove_construction_project
		}

	def generate_mock_game(self):
		empire = self.galaxy.create_new_empire('Player Faction')
		planet_id = self.galaxy.world_objects_id['planets']
		self.galaxy.world_objects['stars']['0'].generate_planets(self.galaxy)
		self.galaxy.create_new_colony('Earth', self.galaxy.world_objects['stars']['0'].planets[planet_id], empire)

	def handle_player_input(self, commands):
		refresh_list = []
		for command in commands:
			refresh_list.append(self.player_command_mapping[command.name](self.galaxy, *command.args))

		return refresh_list

	def game_loop(self):
		game_loop.game_loop(self.galaxy)

	# GETTERS
	def get_all_objects(self):
		return self.galaxy.world_objects

	def get_canvas_size(self):
		return self.galaxy.get_galaxy_creation_parameters('size_of_canvas')

	def run_game_loop(self):
		pass


player_world = PlayerWorld()
player_world.generate_mock_game()
