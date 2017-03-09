/**
 * Created by Tomca on 9/03/2017.
 */

function Star_object(ids, name, coordinates, star_type, file_path, planets, world) {
    this.world = world;

    this.name = name;
    this.ids = ids;

    this.coordinates = coordinates;

    this.star_type = star_type;
    this.file_path = file_path;

    this.planets = planets;

    var config = world.get_config();

    config.stars[this.ids['self']] = this
}

function _create_star(star_instance, world) {
    new Star_object(
        star_instance.ids,
        star_instance['name'],
        star_instance.coordinates,
        star_instance.star_type,
        star_instance.file_path,
        {},
        world
    );
}
