from game_data.constants import construction_constants
from game_modules.faction_objects import colonies


class ConstructionProject:
	def __init__(self, project_id, project_building, project_runs, num_of_factories, colony_instance, galaxy, **kwargs):
		# Parents
		self.galaxy = galaxy
		self.parent_colony = colony_instance

		self.ids = {
			'self': project_id,
			'star': colony_instance.parent_ids['star'],
			'planet': colony_instance.parent_ids['planet'],

			'empire': colony_instance.parent_ids['empire'],
			'colony': colony_instance.id
		}

		# Project Info
		self.project_building = project_building  # What you are building
		self.project_cost = construction_constants.building_costs[project_building]  # Individual resource cost per resource

		currently_completed = {}
		for key in self.project_cost:
			currently_completed[key] = 0

		self.currently_completed = currently_completed  # What and how much of a material has been completed.
		self.project_runs = project_runs  # How many copies are to be made.

		self.num_of_factories = num_of_factories

		self.__dict__.update(kwargs)

		colony_instance.construction_projects[self.ids['self']] = self

	def _assign_build_points(self, CP_allocated, CP_to_finish, material, colony_resource):
		remainder_CP = 0
		available_for_extra = False

		# CP_allocated = Limiting
		if colony_resource > CP_allocated and CP_to_finish > CP_allocated:
			self.currently_completed[material] += CP_allocated
			colony_resource -= CP_allocated
			available_for_extra = True

		# Resource = Limiting
		elif CP_allocated > colony_resource and CP_to_finish > colony_resource:
			self.currently_completed[material] += colony_resource
			CP_allocated -= colony_resource
			colony_resource -= colony_resource
			remainder_CP += CP_allocated

		# CP_to_finish = Limiting
		elif CP_allocated >= CP_to_finish and colony_resource >= CP_to_finish:
			self.currently_completed[material] += CP_to_finish
			CP_allocated -= CP_to_finish
			colony_resource -= CP_to_finish
			remainder_CP += CP_allocated

		return remainder_CP, available_for_extra

	def _check_for_built(self, colony):
		self.currently_completed['total'] = 0
		for key, value in self.currently_completed.items():
			if key != 'total':
				self.currently_completed['total'] += value

		if self.project_cost == self.currently_completed:
			for key in self.currently_completed:
				self.currently_completed[key] = 0
			self.project_runs -= 1
			colony.add_buildings(self.project_building)
			return True
		else:
			return False

	def construction_tick(self):
		# Apply what you can, get remainders
		empire_instance = self.galaxy.world_objects[self.ids['empire']]
		colony_instance = empire_instance[self.ids['colony']]

		while True:
			# Get build points for the total phase of construction
			total_CP = self.num_of_factories * empire_instance.modifiers['building_modifiers']['build_points'] / 365
			total_CP_history = total_CP
			available_for_extra_list = []
			# For each material, not including the total
			for material, cost in self.project_cost.items():
				if material != 'total':
					# Get how much is allocated to the current material
					CP_allocated = (cost * total_CP_history) / self.project_cost['total']
					CP_to_finish = self.project_cost[material] - self.currently_completed[material]
					total_CP -= CP_allocated
					# Assign build points, get remainders and add back to pool.
					remainder_CP, available_for_extra = self._assign_build_points(CP_allocated, CP_to_finish, material, colony_instance.resource_storage[material])
					total_CP += remainder_CP
					# Add to extra if available.
					if available_for_extra:
						available_for_extra_list.append(material)

			# Check if it is built, then apply build points again if needed.
			if not self._check_for_built(colony_instance):
				break

		# Use the remainders
		while True:
			# If 0 CP remains, break
			if total_CP <= 0.0001:
				break
			available_for_extra_list_new = []
			# For materials
			for material in available_for_extra_list:
				CP_allocated = total_CP / len(available_for_extra_list)
				CP_to_finish = self.project_cost[material] - self.currently_completed[material]
				remainder_CP, available_for_extra = self._assign_build_points(CP_allocated, CP_to_finish, material, colony_instance.resource_storage[material]['current'])
				total_CP += remainder_CP
				if available_for_extra:
					available_for_extra_list_new.append(material)
			available_for_extra_list = available_for_extra_list_new
			self._check_for_built(colony_instance)

	def remove_construction(self, galaxy, colony_ids):
		pass

	def serialize(self):
		dictionary = dict(self.__dict__)
		del dictionary['galaxy']
		del dictionary['parent_colony']
		return dictionary
