/**
 * Created by Tomca on 3/03/2017.
 */

var mouse_handlers_object = (function () {

    function _mouse_scroll(e, world) {
        var config = world.get_config();
        var old_scroll_factor = config.scroll_factor;
        var mouse_x = e.pageX;
        var mouse_y = e.pageY;

        if (e.originalEvent.wheelDelta >= 0) {
            // Scrolled up
            config.scroll_factor = Math.min(32, config.scroll_factor + 1);
            if (config.scroll_factor != old_scroll_factor) {
                config.container_pan_x += ((config.container_pan_x + mouse_x) / (config.canvas_size * (config.scroll_factor - 1))) * config.canvas_size;
                config.container_pan_y += ((config.container_pan_y + mouse_y) / (config.canvas_size * (config.scroll_factor - 1))) * config.canvas_size;
             }
        } else {
            // Scrolled Down
            config.scroll_factor =  Math.max(1, config.scroll_factor - 1);
            if (config.scroll_factor != old_scroll_factor) {
                config.container_pan_x -= ((config.container_pan_x + mouse_x) / (config.canvas_size * (config.scroll_factor + 1))) * config.canvas_size;
                config.container_pan_y -= ((config.container_pan_y + mouse_y) / (config.canvas_size * (config.scroll_factor + 1))) * config.canvas_size;
            }
        }

        config.galaxy_non_star_container.scale.x = config.scroll_factor;
        config.galaxy_non_star_container.scale.y = config.scroll_factor;
        config.galaxy_star_container.scale.x = config.scroll_factor / 32;
        config.galaxy_star_container.scale.y = config.scroll_factor / 32;

        config.galaxy_non_star_container.x = -(config.container_pan_x);
        config.galaxy_non_star_container.y = -(config.container_pan_y);
        config.galaxy_star_container.x = -(config.container_pan_x);
        config.galaxy_star_container.y = -(config.container_pan_y);
    }

    function _canvas_mouse_click_down(e, world) {
        e.preventDefault();
        var config = world.get_config();

        // Left Mouse
        config.mouse_x = e.pageX;
        config.mouse_y = e.pageY;
        if (e.which == 1) {
            var x_coord = Math.floor((config.container_pan_x + config.mouse_x) / config.scroll_factor - (config.canvas_size / 2));
            var y_coord = -Math.floor((config.container_pan_y + config.mouse_y) / config.scroll_factor - (config.canvas_size / 2));
            var old_star = config.selected_star;
            for (var star_inx in config.stars) {
                if (old_star == config.selected_star) {
                    // Star selected.
                    var star = config.stars[star_inx];
                    if (star.coordinates[0] == x_coord && star.coordinates[1] ==  y_coord) {
                        config.selected_star = star;
                    }
                }
            }
        }
        // Middle Mouse
        else if (e.which == 2) {
            config.moved = false;
            config.down = true;
        }
    }

    function _canvas_double_click(world) {
        var config = world.get_config();

        console.log(Math.floor((config.container_pan_x + config.mouse_x) / config.scroll_factor - (config.canvas_size / 2)));
        console.log(-Math.floor((config.container_pan_y + config.mouse_y) / config.scroll_factor - (config.canvas_size / 2)));

        var x_coord = Math.floor((config.container_pan_x + config.mouse_x) / config.scroll_factor - (config.canvas_size / 2));
        var y_coord = -Math.floor((config.container_pan_y + config.mouse_y) / config.scroll_factor - (config.canvas_size / 2));
        var old_star = config.selected_star;

        for (var star_inx in config.stars) {
            if (old_star == config.selected_star) {
                // Star selected.
                var star = config.stars[star_inx];
                if (star.coordinates[0] == x_coord && star.coordinates[1] ==  y_coord) {
                    config.selected_star = star;
                    config.currently_viewing = 'local_system_canvas';
                    world.update_local_system();
                }
            }
        }
    }

    function _mouse_move(e, world) {
        var config = world.get_config();

        if (config.down) {
            config.moved = true;
            var newX = e.pageX;
            var newY = e.pageY;

            config.mouse_scroll_x = 0 - newX + config.mouse_x;
            config.mouse_scroll_y = 0 - newY + config.mouse_y;

            config.galaxy_non_star_container.x = -(config.container_pan_x + config.mouse_scroll_x);
            config.galaxy_non_star_container.y = -(config.container_pan_y + config.mouse_scroll_y);

            config.galaxy_star_container.x = -(config.container_pan_x + config.mouse_scroll_x);
            config.galaxy_star_container.y = -(config.container_pan_y + config.mouse_scroll_y);
        }
    }

    function _mouse_click_up(world) {
        var config = world.get_config();

        config.down = false;
        if (config.moved){
            config.moved = false;

            config.container_pan_x = (config.container_pan_x + config.mouse_scroll_x);
            config.container_pan_y = (config.container_pan_y + config.mouse_scroll_y);
        }
    }

    return{
        mouse_scroll: _mouse_scroll,
        canvas_mouse_click_down: _canvas_mouse_click_down,
        canvas_double_click: _canvas_double_click,
        mouse_move: _mouse_move,
        mouse_click_up: _mouse_click_up
    }
})();