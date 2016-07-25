/**
 * Created by y3010 on 2016/7/20.
 * copy from http://gamedevelopment.tutsplus.com/tutorials/an-introduction-to-spritesheet-animation--gamedev-13099
 */

var　SpriteSheet = function(img, frameWidth, frameHeight) {
    this.image = img;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;

    // calculate the number of frames in a row after the image loads
    this.framesPerRow =  Math.floor(this.image.width / this.frameWidth);
};

var Animation = function(spriteSheet, frameSpeed, startFrame, endFrame) {

    this.stop = false;
    var animationSequence = [];  // array holding the order of the animation
    var currentFrame = 0;        // the current frame to draw
    var counter = 0;             // keep track of frame rate

    // create the sequence of frame numbers for the animation
    for (var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++)
        animationSequence.push(frameNumber);

    // Update the animation
    this.update = function() {

        // update to the next frame if it is time
        if (counter == (frameSpeed - 1))
            currentFrame = (currentFrame + 1) % animationSequence.length;

        // update the counter
        counter = this.stop ? 0: (counter + 1) % frameSpeed;
    };

    // draw the current frame
    this.draw = function(x, y,w,h) {
        // get the row and col of the frame
        var row = Math.floor(animationSequence[currentFrame] / spriteSheet.framesPerRow);
        var col = Math.floor(animationSequence[currentFrame] % spriteSheet.framesPerRow);

        var canvas = $("#canvas")[0];
        var ctx = canvas.getContext("2d");
        ctx.drawImage(
            spriteSheet.image,
            col * spriteSheet.frameWidth, row * spriteSheet.frameHeight,
            spriteSheet.frameWidth, spriteSheet.frameHeight,
            x, y,
            w,h);
    };
};
