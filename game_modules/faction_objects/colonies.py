class Colony:
	def __init__(self, colony_id, name, planet_instance, empire_instance):
		# Colony Location and General information
		self.id = colony_id
		self.name = name

		#Parent ID's
		self.parent_ids = {
			'star': planet_instance.parent_ids['star'],
			'planet': planet_instance.id,

			'empire': empire_instance.id
		}

		# Colony Type information
		self.colony_type = 'mixed'  # Military, Mixed, Civilian

		# Colony buildings information
		self.buildings = {
			# Quantity buildings (Can keep expanding more facilities)
			'mines': 100,
			'factories': 100,
		}
		self.installations = {
			# The are buildings that have instances attached with special and unique stats for each building.
			# 'name': id
		}

		self.construction_queue = {}  # A dict of {id's: instance} of all construction projects assigned to the colony.

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
	def add_buildings(self, building, galaxy):
		if type(building) == str:
			self.buildings[building] += 1
		else:
			galaxy.add_objects({'installations': building})
			self.installations[building.name] = building.id


class Installation:
	def __init__(self, name, installation_id):
		# General information and identification of the installation.
		self.name = name
		self.id = installation_id

		self.stats = {}
