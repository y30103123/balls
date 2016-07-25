/**
 * Created by y3010 on 2016/7/17.
 */


var Character = function (id,x,y) {
    Sprite.call(this,x,y);
    
    this.id = id;
    this.dir = 0;
    this.speed = 150;

    var speed = 15;
    var img = assetLoader.imgs['man'+this.id.toString()];
    this.spriteSheet = new SpriteSheet(img, 16, 16);
    this.dirAnimation = {
        0: new Animation(this.spriteSheet, speed, 0, 3), // down
        1: new Animation(this.spriteSheet, speed, 4, 7), // left
        2: new Animation(this.spriteSheet, speed, 8, 11), // right
        3: new Animation(this.spriteSheet, speed, 12, 15) // up
    };
    this.animation = this.dirAnimation[0];
};

Character.prototype = new Sprite();
Character.prototype.constructor = Sprite;

Character.prototype.update =  function (delta) {
    var isMove =  this.lastX != this.x || this.lastY != this.y;
    this.animation = this.dirAnimation[this.dir];
    this.animation.stop = !isMove;
    this.animation.update();
};

Character.prototype.draw =  function (x,y,w,h) {
    this.animation.draw(x,y,w,h);
};

Character.prototype.setDirection =  function (dir) {
    this.dir = dir;
};

