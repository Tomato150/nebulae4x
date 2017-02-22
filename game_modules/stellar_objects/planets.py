class TerrestrialBody:
	def __init__(self, planet_id, name, star_id, orbit_index, **kwargs):
		# Planet Location and General Information
		self.id = planet_id
		self.name = name

		# Planet parent body relevant information
		self.parent_ids = {
			'star': star_id
		}
		self.orbit_index = orbit_index  # 0, 1, 2 ... n
		self.orbital_distance = 1.4  # Radius from the center.
		self.eccentricity = 0

		# Planet Type information
		self.planet_type = 'terrestrial'
		self.file_path = '/path/to/file.png'

		# Planet contents information
		self.colonies = {}  # A dict of {id's: instances} of planet objects.
		self.resources = {
			'water': {
				'amount': 999999999999,  # 999,999,999,999
				'availability': 1
			},
			'build_materials': {
				'amount': 999999999999,  # 999,999,999,999
				'availability': 1
			},
		}

		# **kwarg update
		self.__dict__.update(kwargs)

	# GETTERS
	def get_colonies(self):
		return self.colonies

	# SETTERS
	def add_colony(self, colony_id):
		self.colonies.append(colony_id)
