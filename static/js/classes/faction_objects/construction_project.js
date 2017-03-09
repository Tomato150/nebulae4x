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

    var parent_colony = config.empires[this.ids['empire']].colonies[this.ids['colony']];
    parent_colony.construction_projects[this.ids['self']] = this;

    this.parent_colony = parent_colony;
}

Construction_object.prototype.delete_instance = function () {
    delete this.parent_colony.construction_projects[this.ids['self']];
};

function _create_construction_project(construction_project_instance, world) {
    new Construction_object(
        construction_project_instance.ids,
        construction_project_instance.project_building,
        construction_project_instance.project_cost,
        construction_project_instance.currently_completed,
        construction_project_instance.project_runs,
        construction_project_instance.num_of_factories,
        world
    )
}