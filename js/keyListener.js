/**
 * Created by y3010 on 2016/7/19.
 */
var KeyManager = {
    pressedKeys: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    Q:81,
    W:87,
    E:69,
    R:82,

    isDown: function(keyCode) {
        return this.pressedKeys[keyCode];
    },

    onKeydown: function(event) {
        if ( !event.metaKey ) {
            event.preventDefault();
        }
        this.pressedKeys[event.keyCode] = true;
    },

    onKeyup: function(event) {
        delete this.pressedKeys[event.keyCode];
    }
};
