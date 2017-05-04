/**
 * Created by y3010 on 2016/7/23.
 */
/**
 * Model of a ball object in game
 * Created by hiking on 2015/12/21.
 */

var BallType = {
    NONE: 0,
    RED: 1,
    YELLOW: 2,
    GREEN: 3,
    BLU0E: 4,
    PURPLE: 5,
    GREY: 6,
    WHITE: 7,
    BLACK: 8,
    BROWN: 9,
    ORANGE: 10
};

var BallColor = [
    '#000000',
    '#e53935',
    '#ffb300',
    '#43a047',
    '#1e88e5',
    '#5e35b1',
    '#6c8697',
    '#eeeeee',
    '#1f2d39',
    '#795548',
    '#ef6c00'];

var BallModel = function (type,x,y) {
    Sprite.call(this,x,y);
    this.ballType = type;
};

BallModel.prototype = new Sprite();
BallModel.prototype.constructor = Sprite;

BallModel.prototype.getBallColor = function () {
    return BallColor[this.ballType === null ? 0 : this.ballType];
};

BallModel.prototype.draw = function (ctx,x,y,roomRadius,ballRadius,zoom) {
    if (this.ballType == BallType.NONE) {
        ctx.strokeWidth = 2 * zoom;
        ctx.strokeLinecap = "round";
        ctx.strokeLinejoin = "miter";
        ctx.strokeMiterlimit = 2*zoom;
        ctx.strokeDasharray = [6*zoom];
        ctx.strokeDashoffset = 0;
    } else {
        ctx.fillStyle = this.getBallColor();
        ctx.fillOval(x + roomRadius - ballRadius, y + roomRadius - ballRadius, 2 * ballRadius, 2 * ballRadius);
        ctx.fillStyle = '#ffff66';
        ctx.drawOval(x + roomRadius + (ballRadius * 0.2), y + roomRadius -(ballRadius * 0.6), (ballRadius * 0.4), (ballRadius * 0.4));
    }
    ctx.lineWidth = 2 * zoom;
    ctx.fillStyle ='#ffffff';
    ctx.drawOval(x + roomRadius - ballRadius, y + roomRadius - ballRadius, 2 * ballRadius, 2 * ballRadius);
};
