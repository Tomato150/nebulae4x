from game_modules.faction_objects import empires, colonies, construction

from game_data.constants import construction_constants


def start_construction_project(galaxy, colony_ids, project_details):

	colony_instance = galaxy.get_object_by_id('colony', colony_ids, True)
	project_cost = construction_constants.building_costs[project_details[0].lower()]

	construction_project = galaxy.create_new_construction_project(*project_details, project_cost, colony_instance)

	return {
		'construction_project': {construction_project.ids['self']: construction_project}
	}


def remove_construction_project(galaxy, construction_project_id, colony_id, colony_parent_ids):
	colony_instance = galaxy.world_objects['empires'][colony_parent_ids['empire']].colonies[colony_id]

	colony_instance.construction_projects[construction_project_id].remove_construction()
