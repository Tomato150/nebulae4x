/**
 * Created by Tomca on 3/03/2017.
 */

var general_handlers = (function () {

    function _main_menu_toggle (e) {
        e.preventDefault();
        var main_menu = $('#main-menu-div');
        if (main_menu.attr('hidden')) {
            main_menu.removeAttr('hidden')
        } else {
            _main_menu_close()
        }
    }

    function _main_menu_close () {
        $('#main-menu-div').attr({'hidden': ''})
    }

    function _set_main_menu_state () {

    }

    function _set_canvas_view () {

    }

    function _custom_context_menu () {

    }

    return{
        main_menu_toggle: _main_menu_toggle,
        main_menu_close: _main_menu_close,
        set_main_menu_state: _set_main_menu_state,
        set_canvas_view: _set_canvas_view,
        custom_context_menu: _custom_context_menu
    }
})();