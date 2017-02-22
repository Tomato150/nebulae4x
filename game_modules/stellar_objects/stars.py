from game_data.constants import galaxy_generation_constants as constants, general_constants

import random


def name_creator(mini, maxi, syl):
	name = ""
	for i in range(0, syl):
		name = name + random.choice(general_constants.CONSONANTS)
		for j in range(1, random.randint(mini, maxi)):
			if name[i-1] in general_constants.CONSONANTS:
				name = name + random.choice(general_constants.VOWELS)
			else:
				name = name + random.choice(general_constants.CONSONANTS)
	return name.capitalize()


class Star:
	def __init__(self, star_id, x, y, **kwargs):
		# System General information
		self.id = star_id
		self.name = name_creator(random.randint(2, 3), random.randint(3, 5), random.randint(1, 2))

		# System Location Information
		self.coordinates = [int(x), int(y)]

		# Star type information
		star = random.choice(constants.STARS[0])
		self.star_type = star[0]
		self.file_path = random.choice(star[1])

		# System Contents information:
		self.planets = {}  # A dict of {id's: instances} of planet keys.

		# Update kwargs
		self.__dict__.update(kwargs)

	# GETTERS:
	def get_coordinates(self):
		# [x, y]
		return self.coordinates

	def get_id(self):
		return self.star_id

	# SETTERS:
	def add_planet(self, planet_id):
		self.planets.append(planet_id)