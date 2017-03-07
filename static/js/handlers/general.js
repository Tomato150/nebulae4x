/**
 * Created by Tomca on 3/03/2017.
 */

var general_handlers_object = (function () {

    function _main_menu_toggle (e) {
        e.preventDefault();
        var main_menu = $('#main-menu-div');

        if (main_menu.attr('hidden')) {
            main_menu.removeAttr('hidden')
        } else {
            _main_menu_close()
        }
    }

    function _main_menu_close (e) {
        e.preventDefault();

        $('#main-menu-div').attr({'hidden': ''});
    }

    function _set_main_menu_state (e, world, data_window_target) {
        e.preventDefault();

        world.set_menu_for(data_window_target);
    }

    function _set_canvas_view (e, world, view_target) {
        e.preventDefault();

        world.set_view_for(view_target);
    }

    function _custom_context_menu (e, world) {
        e.preventDefault();
        var config = world.get_config();

        console.log(Math.floor((config.container_pan_x + config.mouse_x) / config.scroll_factor - (config.canvas_size / 2)));
        console.log(-Math.floor((config.container_pan_y + config.mouse_y) / config.scroll_factor - (config.canvas_size / 2)));
    }

    return{
        main_menu_toggle: _main_menu_toggle,
        main_menu_close: _main_menu_close,
        set_main_menu_state: _set_main_menu_state,
        set_canvas_view: _set_canvas_view,
        custom_context_menu: _custom_context_menu
    }
})();