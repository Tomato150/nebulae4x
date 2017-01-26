class Empire:
	def __init__(self, name, empire_id, **kwargs):
		# Empire name and identification
		self.empire_name = name
		self.empire_id = empire_id

		# Empire modifiers and stats
		self.modifiers = {
			'building_modifiers': {
				'build_points': 10  # How much each factory is worth each year.
			}
		}

		# Empire entities
		self.colonies = {}
		self.fleets = {}

		self.__dict__.update(kwargs)

	# GETTERS
	def get_modifiers(self):
		return self.modifiers

	def get_colonies(self):
		return self.colonies

	def get_fleets(self):
		return self.fleets

	# SETTERS
	def add_fleet(self, fleet_id, fleet_object):
		self.fleets[fleet_id] = fleet_object

	def add_colony(self, colony_id, colony_object):
		self.colonies[colony_id] = colony_object
