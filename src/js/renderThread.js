/**
 * Created by y3010 on 2016/7/19.
 * copy from http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing#panic-spiral-death
 */
var renderThread = (function () {
    function start() {
        var currentTime = +new Date(),
         lastTime = +new Date(),
         FPS_CAP = 60,
         fps = 0,
         smoothedDT = 1000 / FPS_CAP,
         framesThisSecond  = 0,
         delta = 0,
         lastFpsUpdate = 0,
         render = renderEngine.RenderEngine() ;

        function loop() {

            currentTime = +new Date();

            delta += currentTime - lastTime;
            lastTime = currentTime;

            if (currentTime > lastFpsUpdate + 1000) {
                fps = 0.25 * framesThisSecond + 0.75 * fps;
                lastFpsUpdate = currentTime;
                framesThisSecond = 0;
            }
            framesThisSecond++;

            var numUpdateSteps = 0;
            while(delta >= smoothedDT) {
                render.update(smoothedDT);
                delta -= smoothedDT;
                if (++numUpdateSteps >= 240) {
                    delta = 0; // panic
                    break;
                }
            }
            render.setFps(fps);
            render.draw();

        }
        setInterval(loop, 1000 / FPS_CAP);
    }
    return{
        start : start
    };
}());

