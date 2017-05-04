/**
 * Created by y3010 on 2016/7/18.
 */
var Sprite =  function (x,y) {
    this.lastX = x;
    this.lastY = y;
    this.x = x;
    this.y = y;
}

Sprite.prototype.setPosition = function (x,y) {
    this.lastX = this.x;
    this.lastY = this.y;
    this.x = x;
    this.y = y;
};

Sprite.prototype.setSize = function (w,h) {
    this.width = w;
    this.height = h;
};

Sprite.prototype.update = function (dt) {

};

Sprite.prototype.draw = function () {
};



