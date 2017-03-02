/**
 * Created by Tom on 23-Jan-17.
 */

var world_object = (function () {
    // Pixi.js shorthand
    var Container = PIXI.Container,
        autoDetectRenderer = PIXI.autoDetectRenderer,
        loader = PIXI.loader,
        resources = PIXI.loader.resources,
        Sprite = PIXI.Sprite;

    var config = {
        // Calculation based information
        'stars': null,
        'empires': null,

        'player_empire': null,
        'selected_star': null,
        'selected_planet': null,
        'selected_colony': null,

        'canvas_size': 6000,
        'scroll_factor': 1,

        // Jquery References
        'main_menu_div': $('#main-menu-div'),

        // Main menu window related to system information
        'set_menu_for': {
            'empire-menu': _set_main_to_empire,
            'system-menu': _set_main_to_system
        },

        'main_menu_header_title': $('#main-menu-header-title'),

        // Pixi.js Canvas display information
        'currently_viewing': 'galaxy_canvas',
        'canvas': $('#canvas'),

        // DragScroll
        'mouse_x': 0,
        'mouse_y': 0,
        'top': 0,
        'left': 0,
        'down': 0,
        'moved': false,

        // Dragscroll + Container positioning
        'container_pan_x': 0,
        'container_pan_y': 0,
        'mouse_scroll_x': 0,
        'mouse_scroll_y': 0,

        // Pixi.js renderers and containers.
        'renderer': null,
        'stage': null,
        'stage_container': null,
        'galaxy_non_star_container': null,  // Contains information about fleets and other occurrences
        'galaxy_star_container': null,  // Contains stars on the galaxy map
        'local_system_body_container': null,  // Contains bodies, such as planets, suns, and asteroids
        'local_system_other_container': null  // Contains information about fleets and other occurrences
    };

    function _get_object_by_ids(object_type, object_ids, is_self) {
        if (is_self) {
            if (object_type == 'star') {
                return config.stars[object_ids['self']]
            } else if (object_type == 'planet') {
                return config.stars[object_ids['star']].planets[object_ids['self']]
            } else if (object_type == 'empire') {
                return config.empires[object_ids['self']]
            } else if (object_type == 'colony') {
                return config.empires[object_ids['empire']].colonies[object_ids['self']]
            } else if (object_type == 'construction_projects') {
                return config.empires[object_ids['empire']].colonies[object_ids['colony']].construction_projects[object_ids['self']]
            }
        } else if (is_self == false) {
            if (object_type == 'star') {
                return config.stars[object_ids['star']]
            } else if (object_type == 'planet') {
                return config.stars[object_ids['star']].planets[object_ids['planet']]
            } else if (object_type == 'empire') {
                return config.empires[object_ids['empire']]
            } else if (object_type == 'colony') {
                return config.empires[object_ids['empire']].colonies[object_ids['colony']]
            } else if (object_type == 'construction_projects') {
                return config.empires[object_ids['empire']].colonies[object_ids['colony']].construction_projects[object_ids['construction_project']]
            }
        }
    }

    function _size_windows() {
        config.main_menu_div.height($(window).height() - 58 - 40).width(($(window).width() - 40)).css({'left': '20px', 'top': '78px'});
        var attribute_list = {
            'height': config.canvas_size,
            'width': config.canvas_size
        };
        config.canvas.attr(attribute_list);
    }

    function _init(server_data) {
        config.empires = server_data['empires'];
        config.stars = server_data['stars'];

        // OPTIMIZE Make so that the data not needed doesn't come in from server.
        for (var planet_id in server_data['planets']) {
            var planet_instance = server_data[planet_id];
            config.stars[planet_instance.ids['star']].planets[planet_instance.ids['self']] = planet_instance;
        }

        for (var colony_id in server_data['colonies']) {
            var colony_instance = server_data[colony_id];
            config.stars
        }

        _size_windows();

        config.renderer = autoDetectRenderer(config.canvas_size, config.canvas_size, {view: config.canvas[0]});

        config.stage = new Container();
        config.galaxy_non_star_container = new Container();
        config.galaxy_star_container = new Container();
        config.local_system_body_container = new Container();
        config.local_system_other_container = new Container();

        config.stage.addChild(config.galaxy_star_container);
        config.stage.addChild(config.galaxy_non_star_container);
        config.stage.addChild(config.local_system_body_container);
        config.stage.addChild(config.local_system_other_container);

        loader.add('/static/images/stars/B_D_1.png')
            .add('/static/images/stars/B_G_1.png')
            .add('/static/images/stars/B_M_1.png')
            .add('/static/images/stars/R_D_1.png')
            .add('/static/images/stars/R_G_1.png')
            .add('/static/images/stars/R_M_1.png')
            .add('/static/images/stars/R_SG_1.png')
            .add('/static/images/stars/Y_M_1.png')
            .load(_setup);
    }

    function _setup() {
        config.local_system_body_container.addChild(new Sprite(resources['/static/images/stars/B_D_1.png'].texture));
        for (var star_key in config.stars) {
            var star = config.stars[star_key];

            var large_star_sprite = new Sprite(
                resources[star.file_path].texture
            );
            large_star_sprite.x = star.coordinates[0] * 32 + ((config.canvas_size / 2) * 32);
            large_star_sprite.y = -star.coordinates[1] * 32 + ((config.canvas_size / 2) * 32);

            config.galaxy_star_container.addChild(large_star_sprite);

            config.container_pan_x = 3000 - ($(window).width() / 2);
            config.container_pan_y = 3000 - ($(window).height() / 2);

            config.galaxy_non_star_container.scale.x = config.scroll_factor;
            config.galaxy_non_star_container.scale.y = config.scroll_factor;
            config.galaxy_star_container.scale.x = config.scroll_factor / 32;
            config.galaxy_star_container.scale.y = config.scroll_factor / 32;

            config.galaxy_non_star_container.x = -(config.container_pan_x);
            config.galaxy_non_star_container.y = -(config.container_pan_y);
            config.galaxy_star_container.x = -(config.container_pan_x);
            config.galaxy_star_container.y = -(config.container_pan_y);

            config.local_system_body_container.visible = false;
            config.local_system_other_container.visible = false;
            config.galaxy_non_star_container.visible = false;
            config.galaxy_star_container.visible = false;
        }
        _renderLoop();
    }

    function _renderLoop() {
        requestAnimationFrame(_renderLoop);

        if (config.currently_viewing == 'galaxy_canvas') {
            config.local_system_body_container.visible = false;
            config.local_system_other_container.visible = false;
            config.galaxy_star_container.visible = true;
            config.galaxy_non_star_container.visible = (config.scroll_factor > 24);
        } else if (config.currently_viewing == 'local_system_canvas') {
            config.galaxy_non_star_container.visible = false;
            config.galaxy_star_container.visible = false;
            config.local_system_body_container.visible = true;
            config.local_system_other_container.visible = true;
        }

        config.renderer.render(config.stage);
    }

    function _set_header(header_text) {
        config.main_menu_header_title.text(header_text)
    }

    function _set_main_to_empire() {
        _set_header('Empire Overview');
        $('#main-menu-empire-screen').removeAttr('hidden');
        $('#main-menu-system-screen').attr({'hidden': ''});
    }

    function _set_main_to_system() {
        _set_header('System View');
        $('#main-menu-system-screen').removeAttr('hidden');
        $('#main-menu-empire-screen').attr({'hidden': ''});
    }

    function _set_menu_for(data_window_target) {
        config.set_menu_for[data_window_target]();
        config.main_menu_div.removeAttr('hidden')
    }

    function _set_view_for(view_target) {
        config.currently_viewing = view_target;
    }

    function _get_config() {
        return config;
    }

    function _post_commands_to_server(command) {
        $.ajax({
            type: 'POST',
            url: '/commands_to_server',
            data: JSON.stringify({
                command: command
            }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (server_data) {
                // Fill in for the refresh shit.
                for (var empire in server_data['empires']) {
                    $.extend(config.empires[empire.id], empire)
                }
                for (var star in server_data['stars']) {
                    $.extend(config.stars[star.id], star)
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {alert('Error: Unable to load page: ' + thrownError);}
        });
    }
    
    function _update_local_system() {
        _set_main_to_system();
        var colony_table = $('#system-colony-table');
        colony_table.empty();
        for (var planet_id in config.selected_star.planets) {
            var planet = config.selected_star.planets[planet_id];
            console.log(planet);
            for (var colony_id in planet.colonies) {
                var colony = planet.colonies[colony_id];
                colony_table.append('<tr><td class="colony-selector" data-colony-id=' + colony.ids['self'] + '>' + colony.name + '</td></tr>');
            }
        }
    }

    return {
        init: _init,
        set_menu_for: _set_menu_for,
        set_view_for: _set_view_for,
        post_commands_to_server: _post_commands_to_server,
        get_config: _get_config,
        update_local_system: _update_local_system
    }
})();