class Empire:
	def __init__(self, empire_id, name, galaxy, **kwargs):
		# Empire name and identification
		self.ids = {'self': empire_id}
		self.name = name

		# Empire modifiers and stats
		self.modifiers = {
			'building_modifiers': {
				'build_points': 10  # How much each factory is worth each year.
			}
		}

		# Empire entities
		self.colonies = {}  # A dict of {ids: instances} for colonies.
		self.fleets = {}  # See above for fleets.

		self.__dict__.update(kwargs)

		galaxy.world_objects['empires'][self.ids['self']] = self

	# GETTERS
	def get_player_empire(self):
		return self

	def get_modifiers(self):
		return self.modifiers

	def get_colonies(self):
		return self.colonies

	def get_fleets(self):
		return self.fleets

	def serialize(self):
		dictionary = dict(self.__dict__)
		dictionary['colonies'] = dict()
		dictionary['fleets'] = dict()
		return dictionary
