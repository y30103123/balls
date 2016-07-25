/**
 * Created by y3010 on 2016/7/23.
 */

var ControlItem = function (name,index) {
    Sprite.call(this,0,0);
    this.DEFAULT_COLOR = '#607d8b';
    this.PRESSED_COLOR = '#37474f';
    this.name = name;
    this.index = index;

    this.isPressed = false;

};
ControlItem.prototype = new Sprite();
ControlItem.prototype.constructor = Sprite;

ControlItem.prototype.update = function () {
    var codes = [KeyManager.Q, KeyManager.W, KeyManager.E, KeyManager.R];
    this.isPressed = KeyManager.isDown(codes[this.index]);
};
ControlItem.prototype.draw = function (ctx,x,y,size,radius,zoom) {
    var padding = Math.floor(5 * zoom);

    ctx.fillStyle = this.isPressed ? this.PRESSED_COLOR : this.DEFAULT_COLOR;
    ctx.fillRoundRect( x, y, size, size, radius);

    var fontSize = Math.floor(8 * zoom).toString();
    ctx.font = fontSize + 'px SupercellMagic';
    // Draw label
    ctx.fillStyle = '#ffffff';
    ctx.fillText(this.name, x + padding / 2, y + size - padding / 3);
    
};
