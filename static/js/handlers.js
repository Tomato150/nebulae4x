/**
 * Created by Tom on 23-Jan-17.
 */

var handler_object = (function () {
    function __set_contextual_window_star(config) {
        $('#star-system-name').html(
            config.selected_star.name +
            ' <small id="star-system-coordinates" class="text-muted">' + '(' + config.selected_star.coordinates[0] + ', ' + config.selected_star.coordinates[1] + ')' + '</small>'
        );

        var planets_html = '';
        var planets_present = false;
        for (var planet_inx in config.selected_star.planets) {
            planets_present = true;
            var planet = config.selected_star.planets[planet_inx];
            var template = config.system_overview_planet_card_template();
            planets_html += template.render({name: planet.name})
        }
        if (!planets_present) {
            config.system_overview_planets.removeClass('card').html('<p>There are no detected bodies in this system.</p>')
        } else {
            config.system_overview_planets.addClass('card').html(planets_html);
        }
    }

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
        config.small_star_container.scale.x = config.scroll_factor;
        config.small_star_container.scale.y = config.scroll_factor;
        config.large_star_container.scale.x = config.scroll_factor / 32;
        config.large_star_container.scale.y = config.scroll_factor / 32;
        config.small_star_container.x = -(config.container_pan_x);
        config.small_star_container.y = -(config.container_pan_y);
        config.large_star_container.x = -(config.container_pan_x);
        config.large_star_container.y = -(config.container_pan_y);
    }

    function _canvas_mouse_click_down(e, world) {
        var config = world.get_config();
        e.preventDefault();
        // Left Mouse
        config.mouse_x = e.pageX;
        config.mouse_y = e.pageY;
        if (e.which == 1) {
            var x_coord = Math.floor((config.container_pan_x + config.mouse_x) / config.scroll_factor - (config.canvas_size / 2));
            var y_coord = -Math.floor((config.container_pan_y + config.mouse_y) / config.scroll_factor - (config.canvas_size / 2));
            for (var star_inx in config.stars) {
                var star = config.stars[star_inx];
                if (star.coordinates[0] == x_coord && star.coordinates[1] ==  y_coord) {
                    config.selected_star = star;
                    __set_contextual_window_star(config);

                    // Make necessaries visible.
                    config.contextual_window_system.removeAttr('hidden');
                    config.contextual_window_planetary.attr('hidden', '');
                    if (!config.contextual_window.hasClass('visible')) {
                        _slide_click(e, world)
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

    function _mouse_move(e, world) {
        var config = world.get_config();
        if (config.down) {
            config.moved = true;
            var newX = e.pageX;
            var newY = e.pageY;

            config.mouse_scroll_x = 0 - newX + config.mouse_x;
            config.mouse_scroll_y = 0 - newY + config.mouse_y;
            config.small_star_container.x = -(config.container_pan_x + config.mouse_scroll_x);
            config.small_star_container.y = -(config.container_pan_y + config.mouse_scroll_y);
            config.large_star_container.x = -(config.container_pan_x + config.mouse_scroll_x);
            config.large_star_container.y = -(config.container_pan_y + config.mouse_scroll_y);
        }
    }

    function _mouse_click_up(e, world) {
        var config = world.get_config();
        if (config.moved){
            config.down = false;
            config.moved = false;
            config.container_pan_x = (config.container_pan_x + config.mouse_scroll_x);
            config.container_pan_y = (config.container_pan_y + config.mouse_scroll_y);
        }
    }

    function _slide_click(e, world) {
        var config = world.get_config();
        var contextual_window = config.contextual_window;
        if (contextual_window.hasClass('visible')) {
            contextual_window.stop().animate({'left': '-1200px'}, 500).removeClass('visible')
        } else {
            contextual_window.stop().animate({'left': '50px'}, 500).addClass('visible')
        }
    }

    function _planet_card_click(e, world) {
        var config = world.get_config();

        console.log(e);

        config.contextual_window_system.attr('hidden', '');
        config.contextual_window_planetary.removeAttr('hidden');
    }

    return {
        mouse_scroll: _mouse_scroll,
        canvas_mouse_click: _canvas_mouse_click_down,
        mouse_move: _mouse_move,
        mouse_click_up: _mouse_click_up,
        slide_click: _slide_click,
        planet_card_click: _planet_card_click
    }
})();
