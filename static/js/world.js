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
        'stars': [],
        'selected_star': null,
        'selected_planet': null,
        'canvas_size': 6000,
        'scroll_factor': 1,

        // Jquery References
        'contextual_window': $('#contextual-window'),

        // Contextual window related to system information
        'contextual_window_system': $('#system-container'),
            'system_overview_planets': $('#system-overview-tab-planets'),
            'system_overview_planet_card_template': __get_planet_card_template,

        // Contextual window related to planetary information
        'contextual_window_planetary': $('#planetary-container'),
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

        'renderer': null,
        'stage': null,
        'stage_container': null,
        'small_star_container': null,
        'large_star_container': null
    };

    function _init() {

        $.ajax({
            type: 'GET',
            url: '/get_stars',
            dataType: 'json',
            contentType: 'application/json',
            success: function (server_data) {
                config.stars = server_data['stars'];
                config.canvas_size = server_data['canvas_size'];
                loader.add('/static/images/white.png')
                    .add('/static/images/stars/B_D_1.png')
                    .add('/static/images/stars/B_G_1.png')
                    .add('/static/images/stars/B_M_1.png')
                    .add('/static/images/stars/R_D_1.png')
                    .add('/static/images/stars/R_G_1.png')
                    .add('/static/images/stars/R_M_1.png')
                    .add('/static/images/stars/R_SG_1.png')
                    .add('/static/images/stars/Y_M_1.png')
                    .load(_setup);
            },
            error: function (xhr, ajaxOptions, thrownError) {alert('Error: Unable to load page: ' + thrownError);}
        });

        config.contextual_window.height($(window).height() - 100).width((config.contextual_window.height() - 100) /1.3);
        config.canvas.attr({
            'height': config.canvas_size,
            'width': config.canvas_size
        });

        config.renderer = autoDetectRenderer(config.canvas_size, config.canvas_size, {view: config.canvas[0]});
        config.stage = new Container();
        config.stage_container = new Container();
        config.small_star_container = new Container();
        config.large_star_container = new Container();

        config.stage_container.addChild(config.large_star_container);
        config.stage_container.addChild(config.small_star_container);
        config.stage.addChild(config.stage_container);
    }

    function __get_planet_card_template() {
        return $.templates('#planet-card-template')
    }

    function _setup() {
        for (var star_identity in config.stars) {
            var star_sprite = new Sprite(
                resources['/static/images/white.png'].texture
            );
            var star = config.stars[star_identity];
            star_sprite.x = star.coordinates[0] + (config.canvas_size / 2);
            star_sprite.y = -star.coordinates[1] + (config.canvas_size / 2);

            config.small_star_container.addChild(star_sprite);

            var large_star_sprite = new Sprite(
                resources[star.file_path].texture
            );
            large_star_sprite.x = star.coordinates[0] * 32 + ((config.canvas_size / 2) * 32);
            large_star_sprite.y = -star.coordinates[1] * 32 + ((config.canvas_size / 2) * 32);

            config.large_star_container.addChild(large_star_sprite);
        }
        _renderLoop();
    }

    function _renderLoop() {
        requestAnimationFrame(_renderLoop);

        if (config.scroll_factor < 8) {
            config.small_star_container.visible = true;
            config.large_star_container.visible = false;
        } else {
            config.small_star_container.visible = false;
            config.large_star_container.visible = true;
        }

        config.renderer.render(config.stage);
    }

    function _get_config() {
        return config;
    }
    return {
        init: _init,
        get_config: _get_config
    }
})();