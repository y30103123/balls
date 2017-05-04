$(document).ready(function () {
    initialize();
});


var initialize = function () {
    var ctx = $("#canvas")[0].getContext("2d");
    $(window).resize(function () {var screenWidth = $(window).width();
        $("#canvas")[0].width = $(window).width();
        $("#canvas")[0].height = $(window).height();
    });
    addKeyListener();
    renderThread.start(); // renderThread.js
};

var addKeyListener = function () {
    $(document.body).on("keydown",function (e) {
        KeyManager.onKeydown(e);
    });
    $(document.body).on("keyup",function (e) {
        KeyManager.onKeyup(e);
    });
};

/**
 * Asset pre-loader object. Loads all images and sounds
 */
var assetLoader = (function() {

    // images
    this.imgs        = {
        'man1'        : 'img/Man1.png',
        'man2'        : 'img/Man2.png',
        'man3'        : 'img/Man3.png',
        'man4'        : 'img/Man4.png',
        'dark'   : 'img/room_dark.png',
        'light'  : 'img/room_light.png'
    };

    // create asset, set callback for asset loading, set asset source
    var src  = '';
    for (var img in this.imgs) {
        if (this.imgs.hasOwnProperty(img)) {
            src = this.imgs[img];
            this.imgs[img] = new Image();
            this.imgs[img].src = src;
        }
    }

    return {
        imgs: this.imgs
    };
})();
