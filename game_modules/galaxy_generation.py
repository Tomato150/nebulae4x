from game_data.constants import galaxy_generation_constants as constants, general_constants

from random import randint, random, uniform, choice
import math


def name_creator(mini, maxi, syl):
	name = ""
	for i in range(0, syl):
		name = name + choice(general_constants.CONSONANTS)
		for j in range(1, randint(mini, maxi)):
			if name[i-1] in general_constants.CONSONANTS:
				name = name + choice(general_constants.VOWELS)
			else:
				name = name + choice(general_constants.CONSONANTS)
	return name.capitalize()


class Galaxy:
	def __init__(self):
		# Constants to change to fuck with the shape of the galaxy
		self.num_of_stars = 50000
		self.num_of_arms = 5  # 6
		self.arm_offset_max = 0.5  # 0.5
		self.rotation_factor = 3
		self.size_of_canvas = 6000
		self.x_y_rand_offset = 20
		self.galactic_center_cutoff = 0

		self.stars = []

		self.star_quadrants = {}

		bounds = [int(self.size_of_canvas / 20 * -1), int(self.size_of_canvas / 20)]
		for x in range(bounds[0], bounds[1]):
			self.star_quadrants[str(x)] = {}
			for y in range(bounds[0], bounds[1]):
				self.star_quadrants[str(x)][str(y)] = []

		arm_separation = (2 * math.pi) / self.num_of_arms

		for inx in range(0, self.num_of_stars):
			# Get distance from galactic center
			distance = random() ** 2

			if not distance < self.galactic_center_cutoff:

				# Get angle based on unit circle
				angle = random() * 2 * math.pi
				arm_offset = random() * self.arm_offset_max
				arm_offset -= self.arm_offset_max / 2
				arm_offset *= (1 / distance)

				if inx % 2 == 0 or inx % 3 == 0:
					squared_arm_offset = arm_offset ** 2 + (uniform(-1, 1) / 5)
				else:
					squared_arm_offset = arm_offset ** 2
				if arm_offset < 0:
					squared_arm_offset *= -1
				arm_offset = squared_arm_offset

				rotation = distance * self.rotation_factor

				angle = int((angle / arm_separation)) * arm_separation + arm_offset + rotation

				# Translate to cartesian coordinates
				star_x = int(math.cos(angle) * distance * self.size_of_canvas / 2)
				star_y = int(math.sin(angle) * distance * self.size_of_canvas / 2)

				# Random Offset
				if inx % self.x_y_rand_offset == 0:
					offset_star_x = 20 * self.x_y_rand_offset * uniform(-1, 1)
					offset_star_y = 20 * self.x_y_rand_offset * uniform(-1, 1)
				else:
					offset_star_x = self.x_y_rand_offset * uniform(-1, 1)
					offset_star_y = self.x_y_rand_offset * uniform(-1, 1)

				star_x += offset_star_x
				star_y += offset_star_y

				# Ensuring that no bounds are overstepped from the random element
				half_canvas = self.size_of_canvas / 2
				if star_x < half_canvas * -1:
					star_x = half_canvas * -1 + 1
				elif star_x > half_canvas:
					star_x = half_canvas - 1

				if star_y < half_canvas * -1:
					star_y = half_canvas * -1 + 1
				elif star_y > half_canvas:
					star_y = half_canvas - 1

				if inx == 0:
					star_x = 0
					star_y = 0

				star_x = int(star_x)
				star_y = int(star_y)

				quadrant_x = int(star_x / 10)
				quadrant_y = int(star_y / 10)
				star_collision = False

				if -200 <= quadrant_x < 200 and -200 <= quadrant_y < 200:
					for quad_x in range(quadrant_x - 1, quadrant_x + 2):
						if quad_x in range(bounds[0], bounds[1]):
							for quad_y in range(quadrant_y - 1, quadrant_y + 2):
								if quad_y in range(bounds[0], bounds[1]):
									for star in self.star_quadrants[str(quad_x)][str(quad_y)]:
										coordinates = star.get_coordinates()
										if -1 <= coordinates[0] - star_x <= 1 and -1 <= coordinates[1] - star_y <= 1:
											star_collision = True
								else:
									continue
						else:
							continue

				# Appending to right dictionary
				if not star_collision:
					star_object = Star(star_x, star_y)
					self.star_quadrants[str(quadrant_x)][str(quadrant_y)].append(star_object)
					self.stars.append(star_object)

		print('Done: Galaxy Generation')

		self.stars[0].name = 'Sol'
		self._generate_earth_system(self.stars[0])

	def _generate_earth_system(self, solar_system):
		solar_system.add_planet(TerrestrialBody('Earth', solar_system, 0))

	# GETTERS
	def get_stars(self):
		return self.stars

	def get_canvas_size(self):
		return self.size_of_canvas


class Star:
	def __init__(self, x, y, **kwargs):
		# System General information
		self.name = name_creator(randint(2, 3), randint(3, 5), randint(1, 2))

		# System Location Information
		self.coordinates = [int(x), int(y)]

		# Star type information
		star = choice(constants.STARS[0])
		self.star_type = star[0]
		self.file_path = choice(star[1])

		# System Contents information:
		self.planets = []

		# Update kwargs
		self.__dict__.update(kwargs)

	# GETTERS:
	def get_coordinates(self):
		# [x, y]
		return self.coordinates

	# SETTERS:
	def add_planet(self, planet):
		self.planets.append(planet)


class TerrestrialBody:
	def __init__(self, name, star_instace, orbit_index, **kwargs):
		# Planet Location and General Information
		self.name = name
		self.parent_body = star_instace  # The instance of the star/planet that it orbits
		self.orbit_index = orbit_index  # 0, 1, 2 ... n

		# Planet Type information
		self.planet_type = 'terrestrial'
		self.file_path = '/path/to/file.png'

		# Planet contents information
		self.colonies = []
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

	# SETTERS
	def add_colony(self, colony):
		self.colonies.append(colony)

	def serialize(self):
		return_values = self.__dict__
		return_values.pop('parent_body', None)
		return return_values
