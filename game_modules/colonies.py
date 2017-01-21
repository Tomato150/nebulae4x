from game_data.constants import colonies_constants as constants

class Colony:
	def __init__(self, name, planet_instance):
		# Colony Location and General information
		self.name = name
		self.parent_planet = planet_instance

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

		self.construction_queue = [
			ConstructionProject('mines', 10, constants.mines_cost, 50, 100)
		]

		# Colony Storage
		self.resource_storage = {
			'water': {
				'max': 999999999999,
				'current': 0
			},
			'building_materials': {
				'max': 999999999999,
				'current': 0
			}
		}

	def update_construction(self):
		for construction_project in self.construction_queue:
			construction_project.tick_construction()


class ConstructionProject(object):
	def __init__(self, target, amount, cost, current_completed, delegation):
		self.target = target
		self.amount = int(amount)
		self.cost = cost
		self.current_completed = int(current_completed)
		self.delegation = int(delegation)  # Amount of factories working on this project

	def tick_construction(self):  # Daily tick based.
		pass
