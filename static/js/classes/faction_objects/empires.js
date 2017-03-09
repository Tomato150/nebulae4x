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

    delete config.empires[this.ids['self']]
};