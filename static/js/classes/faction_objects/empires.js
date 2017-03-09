/**
 * Created by Tomca on 9/03/2017.
 */

function Empire_object (name, ids, modifiers, colonies, fleets, world) {
    this.world = world;

    this.name = name;
    this.ids = ids;

    this.modifiers = modifiers;

    this.colonies = colonies;
    this.fleets = fleets;

    var config = this.world.get_config();

    config.empires[this.ids['self']] = this;
}

Empire_object.prototype.delete_instance = function () {
    var config = this.world.get_config();

    delete config.empires[this.ids['self']];

    for (var colony in this.colonies) {
        delete this.colonies[colony].parent_empire;
    }

    for (var fleet in this.fleets) {
        delete this.fleets[fleet].parent_empire;
    }
};

function _create_empire(empire_instance, world) {
    new Empire_object(
        empire_instance['name'],
        empire_instance.ids,
        empire_instance.modifiers,
        {},
        {},
        world
    )
}
