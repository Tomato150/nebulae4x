# The file for the handling of game code.
from game_modules import colonies, construction, empires, galaxy_generation


class PlayerWorld:
	def __init__(self):
		self.galaxy = galaxy_generation.Galaxy()

	def generate_player_empire(self):
		counters = self.galaxy.get_id_counter(['empires', 'colonies', 'planets'],)
		empire = empires.Empire('Player Empire', counters['empires'])
		colony = colonies.Colony(counters['colonies'], '0', counters['empires'])
		planet = galaxy_generation.TerrestrialBody(counters['planets'], 'Earth', '0', 0)

		# Add all local references
		self.galaxy.get_objects('stars')['0'].add_planet(counters['planets'])
		planet.add_colony(counters['colonies'])
		empire.add_colony(colony.get_id())

		# Add to global lists.
		self.galaxy.add_objects({'empires': empire, 'colonies': colony, 'planets': planet})

	# GETTERS
	def get_all_objects(self):
		return self.galaxy.get_objects()

	def get_canvas_size(self):
		return self.galaxy.get_galaxy_creation_parameters('size_of_canvas')

	def game_loop(self):
		pass


player_world = PlayerWorld()
player_world.generate_player_empire()
