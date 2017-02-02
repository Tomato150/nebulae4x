from game_data.constants import colonies_constants as constants

class Colony:
	def __init__(self, colony_id, planet_id, empire_id):
		# Colony Location and General information
		self.colony_id = colony_id
		self.parent_planet_id = planet_id
		self.parent_empire_id = empire_id

		# Colony Type information
		self.colony_type = 'mixed'

		# Colony buildings information
		self.quantity_buildings = {
			# Quantity buildings (Can keep expanding more facilities)
			'mines': 100,
			'factories': 100,
		}
		self.quality_buildings = {
			# Lists of buildings, each having a level
			# These are for buildings where having a 'backup' may be good in case of attacks/necessity
			'space_stations': [1, 4]  # E.G., A level 1 and a level 4 space station in orbit
		}

		self.construction_queue = []  # A list of keys of all construction projects assigned to the colony.

		# Colony Storage
		self.resource_storage = {
			'water': {
				'max': 999999999999,
				'current': 999999999
			},
			'building_materials': {
				'max': 999999999999,
				'current': 999999
			}
		}

	def update_construction(self, galaxy, empire):
		for construction_project in self.construction_queue:
			galaxy.construction_projects[construction_project].tick_construction(empire, self)

	# GETTERS
	def get_id(self):
		return self.colony_id

	# SETTERS
	def add_buildings(self, building, index):
		if building in self.quantity_buildings:
			self.quantity_buildings[building] += 1
		else:
			self.quality_buildings[building][index] += 1
