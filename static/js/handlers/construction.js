/**
 * Created by Tomca on 3/03/2017.
 */

// DONE, create an init function for construction costs.
var construction_handlers_object = (function () {

    var construction_costs = {};

    function _init (construction_costs_server) {
        construction_costs = construction_costs_server;
    }

    function _select_building_for_construction (e, selected_building) {
        e.preventDefault();

        $('#construction-project-building').val(selected_building);
    }

    function _create_construction_project (e, world) {
        e.preventDefault();
        var config = world.get_config();

        world.post_commands_to_server(world.create_command(
            'start_construction_project',
            config.selected_colony.ids,
            {
                'building': $('#construction-project-building').val().toLowerCase(),
                'runs': $('#construction-project-runs').val(),
                'num_of_factories': $('#construction-project-factories').val()
            }
        ))
    }

    return{
        _init: _init,
        select_building_for_construction: _select_building_for_construction,
        create_construction_project: _create_construction_project
    }
})();