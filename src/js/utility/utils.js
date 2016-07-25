/**
 * Created by y3010 on 2016/7/21.
 */

var floorMod = function (x, y) {
    var r = x - floorDiv(x, y) * y;
    return r;
};

/**
 *@param x the dividend
 * @param y the divisor
 */
var floorDiv = function (x, y) {
    var r = Math.floor(x / y);
    // if the signs are different and modulo not zero, round down
    if ((x ^ y) < 0 && (r * y != x)) {
        r--;
    }
    return r;
};
/**
 * 2D position with integer x, y
 * Created by hiking on 2015/12/21.
 */
var IntegerPosition = function (x, y) {
    this.x = x;
    this.y = y;
};

// This is used to function overload
// copy from http://www.imooc.com/article/8621
var addMethod = function (object, name, fn) {
    var old = object[name];
    object[name] = function () {
        if (fn.length === arguments.length) {
            return fn.apply(this, arguments);
        } else if (typeof old === "function") {
            return old.apply(this, arguments);
        }
    }
};

/***canvas method**/
CanvasRenderingContext2D.prototype.drawOval = function drawEllipse(x, y, w, h) {
    var kappa = .5522848,
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle

    this.beginPath();
    this.moveTo(x, ym);
    this.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    this.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    this.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    this.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    this.stroke();
};

CanvasRenderingContext2D.prototype.fillOval = function drawEllipse(x, y, w, h) {
    this.drawOval(x, y, w, h);
    this.fill();
};
CanvasRenderingContext2D.prototype.fillRoundRect = function (x, y, width, height, radius) {

    if (typeof radius === 'undefined') {
        radius = 5;
    }
    radius = {tl: radius, tr: radius, br: radius, bl: radius};

    this.beginPath();
    this.moveTo(x + radius.tl, y);
    this.lineTo(x + width - radius.tr, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    this.lineTo(x + width, y + height - radius.br);
    this.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    this.lineTo(x + radius.bl, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    this.lineTo(x, y + radius.tl);
    this.quadraticCurveTo(x, y, x + radius.tl, y);
    this.closePath();
    this.fill();
};

