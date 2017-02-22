class Empire:
	def __init__(self, name, empire_id, **kwargs):
		# Empire name and identification
		self.id = empire_id
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

	# GETTERS
	def get_player_empire(self):
		return self

	def get_modifiers(self):
		return self.modifiers

	def get_colonies(self):
		return self.colonies

	def get_fleets(self):
		return self.fleets

	# SETTERS
	def add_fleet(self, fleet_id):
		self.fleets.append(fleet_id)

	def add_colony(self, colony_id):
		self.colonies.append(colony_id)
