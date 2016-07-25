/**
 * Created by y3010 on 2016/7/19.
 */

var renderEngine = (function (window,$) {
    var BasicBlock ={
        DARK :0,
        LIGHT:1
    };

    var RenderEngine = function () {
        this.player = new Character(1,30,30);
        this.balls = new Array(10);
        for(var i1 = 0 ; i1 < 10 ; i1++){
            this.balls[i1] = new Array(10);
        }
        for(var i = 0; i < 10; i++){
            for (var j = 0; j < 10; j++) {
                var ballType = Math.floor(Math.random() * 11); // 0~11
                this.balls[i][j] = new BallModel(ballType,i,j);
            }
        }

        this.controlItemMap = createControlItem();

        this.fps = 0;

        this.MAX_VISIBLE_BLOCKS_IN_HEIGHT = 2.5;
        this.MAX_VISIBLE_BLOCKS_IN_WIDTH = 3.5;
        this.playerSize = 12;
        this.DOOR_WIDTH = 33;
        this.WALL_THICKNESS = 5;

        this.MAP_WIDTH = 10;
        this.MAP_HEIGHT = 10;
        this.BLOCK_SIZE = 100;
        this.BALL_RADIUS = this.BLOCK_SIZE * 0.08;

        // Initial player at the 1/4 of (0,0)
        this.playerX = this.BLOCK_SIZE / 4;
        this.playerY = this.BLOCK_SIZE / 4;

        this.BUTTON_SIZE = this.BLOCK_SIZE / 4;

        this.blockImages = [assetLoader.imgs.dark,assetLoader.imgs.light];
    };


    RenderEngine.prototype.update =  function (dt) {
        updatePlayerPos(this,dt);
        updateControlItem(this);
        this.player.update(dt);
    };

    RenderEngine.prototype.draw =  function () {
        var ctx = $("#canvas")[0].getContext("2d");
        ctx.clearRect(0,0,canvas.width,canvas.height);// clear the canvas

        var zoom = getZoomFactor(this);
        var fontSize = Math.floor(5 * zoom).toString();
        ctx.font = fontSize + 'px SupercellMagic';
        drawMap(this,ctx,zoom);
        drawControlPanel(this,ctx,zoom);

        // Draw FPS
        //ctx.fillText('FPS:' + Math.round(this.fps) ,0,10);
    };

    RenderEngine.prototype.setFps =  function (fps) {
        this.fps = fps;
    };

    var createControlItem = function () {
        var names = ["Q", "W", "E", "R"];
        var codes = [KeyManager.Q, KeyManager.W, KeyManager.E, KeyManager.R];
        var rectangles = {};
        for (var i = 0; i < 4; i++) {
            rectangles[codes[i]] = new ControlItem(names[i],i);
        }
        return rectangles;
    };

    var getZoomFactor = function (ref){
        var screenWidth = $(window).width();
        var screenHeight = $(window).height();

        if (screenWidth / screenHeight >
            ref.MAX_VISIBLE_BLOCKS_IN_WIDTH / ref.MAX_VISIBLE_BLOCKS_IN_HEIGHT) {
            return screenWidth / (ref.MAX_VISIBLE_BLOCKS_IN_WIDTH * ref.BLOCK_SIZE);
        } else {
            return screenHeight / (ref.MAX_VISIBLE_BLOCKS_IN_HEIGHT *ref.BLOCK_SIZE);
        }
    };

    var updateControlItem = function (ref) {
        // Travel the shape map
        for (var key in ref.controlItemMap) {
            if (ref.controlItemMap.hasOwnProperty(key)) {
                var item = ref.controlItemMap[key];
                item.update();
            }
        }
    };
    var updatePlayerPos = function (ref,dt) {
        var moveWayX = 0,moveWayY = 0;

        if(KeyManager.isDown(KeyManager.DOWN)){
            moveWayY += 1;
            ref.player.setDirection(0);
        }
        if(KeyManager.isDown(KeyManager.LEFT)){
            moveWayX -= 1;
            ref.player.setDirection(1);
        }
        if(KeyManager.isDown(KeyManager.RIGHT)){
            moveWayX += 1;
            ref.player.setDirection(2);
        }
        if(KeyManager.isDown(KeyManager.UP)){
            moveWayY -= 1;
            ref.player.setDirection(3);
        }

        var unitFactor = Math.sqrt(moveWayX * moveWayX + moveWayY * moveWayY);
        if (unitFactor !== 0) {
            moveWayX /= unitFactor;
            moveWayY /= unitFactor;
        }

        var dx = moveWayX * ref.player.speed * dt / 1000.0;
        var dy = moveWayY * ref.player.speed * dt / 1000.0;

        movePlayer(ref,dx,dy);
        ref.player.setPosition(ref.playerX,ref.playerY);
    };

    var movePlayer = function (ref,dx,dy) {

        var BLOCK_SIZE = ref.BLOCK_SIZE;
        var playerOffsetXBefore = floorMod(ref.playerX, BLOCK_SIZE);
        var playerOffsetYBefore = floorMod(ref.playerY, BLOCK_SIZE);
        var playerOffsetXAfter = floorMod(ref.playerX + dx, BLOCK_SIZE);
        var playerOffsetYAfter = floorMod(ref.playerY + dy, BLOCK_SIZE);
        var playerRadius = ref.playerSize / 2;

        var validLeftBefore = playerOffsetXBefore - playerRadius - ref.WALL_THICKNESS > 0;
        var validRightBefore = playerOffsetXBefore + playerRadius + ref.WALL_THICKNESS < BLOCK_SIZE;
        var validTopBefore = playerOffsetYBefore - playerRadius - ref.WALL_THICKNESS > 0;
        var validBottomBefore = playerOffsetYBefore + playerRadius + ref.WALL_THICKNESS < BLOCK_SIZE;
        var validLeftAfter = playerOffsetXAfter - playerRadius - ref.WALL_THICKNESS > 0;
        var validRightAfter = playerOffsetXAfter + playerRadius + ref.WALL_THICKNESS < BLOCK_SIZE;
        var validTopAfter = playerOffsetYAfter - playerRadius - ref.WALL_THICKNESS > 0;
        var validBottomAfter = playerOffsetYAfter + playerRadius + ref.WALL_THICKNESS < BLOCK_SIZE;

        // Check if player isn't near a door
        var isInsideRoom =
            validLeftAfter && validRightAfter && validTopAfter && validBottomAfter;
        if (isInsideRoom) {
            var isTouchingBall = Math.pow(playerOffsetXAfter - BLOCK_SIZE / 2, 2) +
                Math.pow(playerOffsetYAfter - BLOCK_SIZE / 2, 2) <
                Math.pow(ref.BALL_RADIUS + ref.playerSize / 2, 2);

            if (isTouchingBall) {
                return;
            }
            ref.playerX += dx;
            ref.playerY += dy;
            return;
        }

        // Check door
        var doorSideWallWidth = (BLOCK_SIZE - ref.DOOR_WIDTH) / 2.0;
        var insideXDoorRangeBefore = playerOffsetXBefore - playerRadius > doorSideWallWidth &&
            playerOffsetXBefore + playerRadius < BLOCK_SIZE - doorSideWallWidth;
        var insideYDoorRangeBefore = playerOffsetYBefore - playerRadius > doorSideWallWidth &&
            playerOffsetYBefore + playerRadius < BLOCK_SIZE - doorSideWallWidth;

        if ((!validLeftAfter || !validRightAfter) && !insideYDoorRangeBefore) {
            dx = 0;
        }
        if ((!validLeftBefore || !validRightBefore) &&
            (playerOffsetYAfter - playerRadius < doorSideWallWidth ||
            playerOffsetYAfter + playerRadius > BLOCK_SIZE - doorSideWallWidth)) {
            dy = 0;
        }

        if ((!validTopAfter || !validBottomAfter) && !insideXDoorRangeBefore) {
            dy = 0;
        }
        if ((!validTopBefore || !validBottomBefore) &&
            (playerOffsetXAfter - playerRadius < doorSideWallWidth ||
            playerOffsetXAfter + playerRadius > BLOCK_SIZE - doorSideWallWidth)) {
            dx = 0;
        }

        ref.playerX += dx;
        ref.playerY += dy;

        modPlayerPosition(ref);
    };

    var modPlayerPosition=function (ref) {
        if (ref.playerX < 0 || ref.playerX > ref.MAP_WIDTH * ref.BLOCK_SIZE) {
            ref.playerX = floorMod(ref.playerX, ref.MAP_WIDTH * ref.BLOCK_SIZE);
        }
        if (ref.playerY < 0 || ref.playerY > ref.MAP_HEIGHT * ref.BLOCK_SIZE) {
            ref.playerY = floorMod(ref.playerY, ref.MAP_HEIGHT * ref.BLOCK_SIZE);
        }
    };

    var drawMap = function (ref,ctx,zoom) {
        ctx.imageSmoothingEnabled= false;

        var BLOCK_SIZE = ref.BLOCK_SIZE;
        // Map
        var screenPositionX = (ref.playerX - $(window).width() / zoom / 2.0);
        var screenPositionY =  (ref.playerY - $(window).height() / zoom / 2.0);
        var screenOffsetX = floorMod(screenPositionX, BLOCK_SIZE);
        var screenOffsetY = floorMod(screenPositionY, BLOCK_SIZE);
        var firstVisibleBlockX = floorDiv(screenPositionX,BLOCK_SIZE);
        var firstVisibleBlockY = floorDiv(screenPositionY,BLOCK_SIZE);
        var visibleBlockW =  $(window).width()/ zoom/ BLOCK_SIZE + 2;
        var visibleBlockH =  $(window).height()/ zoom/ BLOCK_SIZE + 2;

        // TODO Remove usage of fake data

        var ballRadius = (ref.BALL_RADIUS * zoom);
        var roomRadius =  (ref.BLOCK_SIZE * zoom / 2);
        var playerRadius =  (ref.playerSize / 2 * zoom);

        for (var screenBlockX = 0; screenBlockX < visibleBlockW; screenBlockX++) {
            for (var screenBlockY = 0; screenBlockY < visibleBlockH; screenBlockY++) {
                // Actual block index in map
                var mapBlockX = floorMod(screenBlockX + firstVisibleBlockX, ref.MAP_WIDTH);
                var mapBlockY = floorMod(screenBlockY + firstVisibleBlockY, ref.MAP_HEIGHT);

                var isInBlock = isPlayerInBlock(ref,mapBlockX, mapBlockY);

                var block = isInBlock ? BasicBlock.LIGHT : BasicBlock.DARK;

                var drawPositionX =  ((screenBlockX * BLOCK_SIZE - screenOffsetX) * zoom);
                var drawPositionY =  ((screenBlockY * BLOCK_SIZE - screenOffsetY) * zoom);
                var drawBlockSize =  Math.ceil(BLOCK_SIZE * zoom);

                ctx.drawImage(ref.blockImages[block], drawPositionX, drawPositionY, drawBlockSize, drawBlockSize);
                // Draw block info
                ctx.fillStyle = isInBlock ? '#35160a' : '#444444';
                ctx.fillText( floorMod(mapBlockX, ref.MAP_WIDTH).toString() + floorMod(mapBlockY, ref.MAP_HEIGHT).toString(), drawPositionX + (5 * zoom), drawPositionY + (10 * zoom));

                // Draw ball
                if (isInBlock) {
                    var ball =  ref.balls[mapBlockX][mapBlockY];
                    ball.draw(ctx,drawPositionX,drawPositionY,roomRadius,ballRadius,zoom);
                }
            }
        }

        // TODO Draw players
        ref.player.draw($(window).width() / 2 - playerRadius,$(window).height() / 2 - playerRadius,2 * playerRadius,2 * playerRadius);
    };

    var drawControlPanel = function (ref,ctx,zoom) {

        var rectangleSize = Math.floor(ref.BUTTON_SIZE * zoom);
        var padding =  Math.floor(5 * zoom);
        var drawRectanglePositionY = $(window).height() - rectangleSize - padding;
        var ballRadius =  Math.floor(ref.BALL_RADIUS * zoom);

        // Travel the shape map
        for (var key in ref.controlItemMap) {
            if (ref.controlItemMap.hasOwnProperty(key)) {
                var item = ref.controlItemMap[key];
                var posX = padding * item.index + item.index * rectangleSize + padding;
                item.draw(ctx,posX,drawRectanglePositionY,rectangleSize,5*zoom,zoom);
            }


            /*   // Draw balls
             ArrayList<BallModel> qwerBall = dom.getQWERState();
             BallModel ball = qwerBall.get(item.getIndex());
             double ballRectPadding = (rectangleSize - ballRadius * 2) / 2.0;

             if (ball.ballType == BallModel.BallType.NONE) {
             g2d.setStroke(
             new BasicStroke(2f * zoom, BasicStroke.CAP_ROUND, BasicStroke.JOIN_MITER,
             2f * zoom, new float[]{6f * zoom}, 0f));
             } else {
             g2d.setColor(new Color(ball.getBallColor()));
             g2d.fillOval((int) (posX + ballRectPadding),
             (int) (drawRectanglePositionY + ballRectPadding), 2 * ballRadius,
             2 * ballRadius);
             g2d.setColor(new Color(0x66ffffff, true));
             g2d.fillOval((int) (posX + ballRectPadding + ballRadius * 1.2f),
             (int) (drawRectanglePositionY + ballRectPadding + ballRadius * .4f),
             (int) (ballRadius * .4f), (int) (ballRadius * .4f));
             g2d.setStroke(new BasicStroke(2 * zoom));
             }
             g2d.setColor(Color.BLACK);
             g2d.drawOval((int) (posX + ballRectPadding),
             (int) (drawRectanglePositionY + ballRectPadding), 2 * ballRadius,
             2 * ballRadius);
             */
        }
    };

   /* var isPlayerInBlock = function() {

    };*/

    /**
     * Check if local player is inside a room
     *
     * @param mapBlockX The x coordinate of the room
     * @param mapBlockY The y coordinate of the room
     */
    var isPlayerInBlock = function(ref, mapBlockX,  mapBlockY) {
        var playerBlock = getLocalPlayerCurrentBlock(ref);
        return playerBlock.x == mapBlockX && playerBlock.y == mapBlockY;
    };
    /**
     * Check if a player is inside a room
     *
     * @param playerX   The x position of the player
     * @param playerY   The y position of the player
     * @param mapBlockX The x coordinate of the room
     * @param mapBlockY The y coordinate of the room
     * @return The local player is inside (mapBlockX, mapBlockY)
     */
    /*var isPlayerInBlock = function( ref,playerX,  playerY,  mapBlockX,  mapBlockY) {
     var playerBlock = getPlayerCurrentBlock(ref,playerX, playerY);
     return playerBlock.x == mapBlockX && playerBlock.y == mapBlockY;
     };*/

    /**
     * Get block coordinates of local player
     */
    var getLocalPlayerCurrentBlock = function(ref) {
        return getPlayerCurrentBlock( ref,ref.playerX, ref.playerY);
    };


    /**
     * Get block coordinates of any player
     */
    var getPlayerCurrentBlock = function( ref,playerX,  playerY) {
        var playerBlockX = floorDiv( playerX,ref.BLOCK_SIZE);
        var playerBlockY = floorDiv( playerY,ref.BLOCK_SIZE);
        return new IntegerPosition(playerBlockX, playerBlockY);
    };

    var render = function () {
        return new RenderEngine();
    };
return{
   RenderEngine : render
};
}(window,jQuery));
