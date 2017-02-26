from game_modules.faction_objects import empires, colonies, construction


def start_construction_project(galaxy, colony_id, colony_parent_ids, project_details):
	colony_instance = galaxy.world_objects['empires'][colony_parent_ids['empire']].colonies[colony_id]

	construction_id = galaxy.get_id_counter('construction')
	construction_project_instance = construction.ConstructionProject(construction_id, *project_details)
	colony_instance.construction_projects[construction_project_instance.ids['self']] = construction_project_instance

	return {''}


def remove_construction_project(galaxy, construction_project_id, colony_id, colony_parent_ids):
	colony_instance = galaxy.world_objects['empires'][colony_parent_ids['empire']].colonies[colony_id]

	colony_instance.construction_projects[construction_project_id].remove_construction()
