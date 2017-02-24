def game_loop(galaxy):
	# Whole Game Events
	for empire in galaxy.world_objects['empires']:
		# Empire Wide Events
		for colony_id, colony in empire.colonies.items():
			# Colony Wide Events
			for construction_project_id, construction_project in colony.construction_projects.items():
				# Construction Project Events
				construction_project.construction_tick(galaxy)
