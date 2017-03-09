/**
 * Created by Tomca on 9/03/2017.
 */

function Construction_object (ids, project_building, project_cost, currently_completed, project_runs, num_of_factories, world) {
    this.world = world;

    this.ids = ids;

    this.project_building = project_building;
    this.project_runs = project_runs;
    this.num_of_factories = num_of_factories;

    this.project_cost = project_cost;
    this.currently_completed = currently_completed;

    var config = this.world.get_config();

    config.empires[this.ids['empire']].colonies[this.ids['colony']].construction_projects[this.ids['self']] = this
}

Construction_object.prototype.delete_instance = function () {
    var config = this.world.get_config();

    delete config.empires[this.ids['empire']].colonies[this.ids['colony']].construction_projects[this.ids['self']];
};