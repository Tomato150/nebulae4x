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

    config.empires[this.ids['empire']].colonies[this.ids['self']] = this;
    config.stars[this.ids['star']].planets[this.ids['planet']].colonies[this.ids['self']] = this;
}

Colony_object.prototype.delete_instance = function () {
    var config = this.world.get_config();

    delete config.empires[this.ids['empire']].colonies[this.ids['self']];
    delete config.stars[this.ids['star']].planets[this.ids['planet']].colonies[this.ids['self']];
};
