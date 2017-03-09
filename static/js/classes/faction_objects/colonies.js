/**
 * Created by Tomca on 9/03/2017.
 */

function Colony_object (name, ids, colony_type, buildings, installations, construction_projects, resource_storage, world) {
    this.world = world;

    this.name = name;
    this.ids = ids;

    this.colony_type = colony_type;

    this.buildings = buildings;
    this.installations = installations;

    this.construction_projects = construction_projects;

    this.resource_storage = resource_storage;

    var config = this.world.get_config();

    var parent_empire = config.empires[this.ids['empire']];
    var parent_planet = config.stars[this.ids['star']].planets[this.ids['planet']];
    parent_empire.colonies[this.ids['self']] = this;
    parent_planet.colonies[this.ids['self']] = this;

    this.parent_empire = parent_empire;
    this.parent_planet = parent_planet;
}

Colony_object.prototype.delete_instance = function () {
    delete this.parent_empire.colonies[this.ids['self']];
    delete this.parent_planet.colonies[this.ids['self']];

    for (var installation_id in this.installations) {
        delete this.installations[installation_id].parent_colony;
    }

    for (var construction_project in this.construction_projects) {
        delete this.construction_projects[construction_project].parent_colony;
    }
};

function _create_colony(colony_instance, world) {
    new Colony_object(
        colony_instance['name'],
        colony_instance.ids,
        colony_instance.colony_type,
        colony_instance.buildings,
        {},
        {},
        colony_instance.resource_storage,
        world
    )
}
