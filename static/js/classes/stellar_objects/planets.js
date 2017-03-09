/**
 * Created by Tomca on 9/03/2017.
 */

function Planet_object (name, ids, orbit_index, orbital_distance, eccentricity, planet_type, file_path, colonies, resources, world) {
    this.world = world;

    this.name = name;
    this.ids = ids;

    this.orbit_index = orbit_index;
    this.orbital_distance = orbital_distance;
    this.eccentricity = eccentricity;

    this.planet_type = planet_type;
    this.file_path = file_path;

    this.colonies = colonies;
    this.resources = resources;

    var config = this.world.get_config();
    this.parent_star = config.stars[this.ids['star']];

    this.parent_star.planets[this.ids['self']] = this;
}

function _create_planet(planet_instance, world) {
    new Planet_object(
        planet_instance['name'],
        planet_instance.ids,
        planet_instance.orbit_index,
        planet_instance.orbital_distance,
        planet_instance.eccentricity,
        planet_instance.planet_type,
        planet_instance.file_path,
        {},
        planet_instance.resources,
        world
    )
}
