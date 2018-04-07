var canvas = document.getElementById("myCanvas");
canvas.style.border = "2px solid black";
//We need to store the 2D rendering context
//The 2D rendering Context is the tool used to pain the Canvas
var ctx = canvas.getContext("2d");

//You can run a fucntion over and over again using a JavaScript timing function such as setInterval() or requestAnimationFrame().

//Ball Positioning
var x = canvas.width/2;
var y = canvas.height-30;//y values are counted from top left = 0
var ballRadius = 10;

var dx = 2;
var dy = -2;//moves ball closer to - or top
//************Adding a user controllable padde to hit the ball
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2; //paddle starting point x-axis
//************Adding Pressed Buttons(User Control)
var rightPressed = false;
var leftPressed = false;
//*************Adding Ball Radius
//adding a Score
var score = 0;
//adding lives
var lives = 3;
//*************Adding Bricks to Break down
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft= 30;
//*************Creating the Bricks
var bricks = [];
for(c=0; c < brickColumnCount;c++){
    bricks[c] = [];
    for(r=0;r<brickRowCount;r++){
        bricks[c][r] = {
            x: 0, 
            y: 0, 
            status: 1
        }; //set x and y coordinate for each brick array piece
    }
}

function drawScore(){
    ctx.font = "16px Arial"; 
    ctx.fillStyle = "#0095DD";//set fontColor
    ctx.fillText("Score: " + score, 8, 20);//(text,x-coordinate,y-coordinate)
}
function drawLives(){
    ctx.font = "16px Arial"; 
    ctx.fillStyle = "#0095DD";//set fontColor
    ctx.fillText("Lives: " + lives, canvas.width-65,20);//(text,x-coordinate,y-coordinate)
}


function drawBall() {
    //drawing the ball
    ctx.beginPath();
    ctx.arc(x,y,ballRadius,0,Math.PI*2);
    //ctx.arc(x-coordinate,y-cooridinate,arc-radius,start angle,end angle,direction(false=clockwise,true=counter))
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX,canvas.height - paddleHeight,paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}


function drawBricks() {
    for (c=0;c<brickColumnCount;c++){
        for(r=0;r<brickRowCount;r++){
            if(bricks[c][r].status == 1){//if status is 1, draw, if not, don't
                var brickX = (c * (brickWidth+brickPadding)) + brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX,brickY,brickWidth,brickHeight);
                ctx.fillStyle = "00095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}





function collisionDetection(){
    for(c=0;c<brickColumnCount;c++){
        for(r=0;r<brickRowCount;r++){
            var b = bricks[c][r];
            if(b.status == 1){
                if(x > b.x && x < b.x + brickWidth && y>b.y && y<b.y+brickHeight){
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount){
                        alert("You Win, Congratulations!")
                        document.location.reload();
                    }
                }
            }
        }
    }
}
function draw() {
    //clearing the canvas so the ball doesnt leave a trace
    ctx.clearRect(0,0,canvas.width,canvas.height); 
    drawBricks();
    //making the ball move
    drawPaddle();
    drawBall();
    drawScore();
    drawLives();
    collisionDetection();
    //if the y value of the ball is lower than zero, change the direction of the movement on the y axis by setting it equal to itself,reversed.
    if(y+dy < ballRadius){//top edge
        //if the ball's y position is greater than the height of the Canvas, remember y values are counted from the top left, so the edge starts at 0 and bottom edge is 480px = (canvas.height), reverse the y direction.
        dy = -dy;//if position is <0 move in opposite y direction
    } else if(y+dy > canvas.height-ballRadius){ //if ball falls inbetween left width and right width of paddle
        if(x > paddleX && x < paddleX + paddleWidth){
            dy = -dy;
        }
        //if ball hits bottom, gameover
        else {
            lives--;
            if(!lives){
                alert("Game Over");
                document.location.reload();
            }
            else{
                x = canvas.width/2;
                y=canvas.height-30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if(x+dx >canvas.width-ballRadius || x+dx < ballRadius){
        dx = -dx;
    }


    if(rightPressed && paddleX < canvas.width-paddleWidth){//if rightKeyPressed and paddlePos is less than width of canvas, paddle can move
        paddleX += 7; //move 7px right if pressed
    }
    if(leftPressed && paddleX > 0){//if leftKeyPressed and paddlePos is greater than left border canvas, or 0, paddelw can and will move
        paddleX += -7; //move 7px left if pressed
    }
    x +=dx;
    y +=dy;
    requestAnimationFrame(draw); //draw() called every 10 milliseconds

}
//Event Listeners for keyboard and mouse movement
document.addEventListener("keydown",keyDownHandler,false);
function keyDownHandler(e) {//if key is pressed
    if(e.keyCode == 39){ //39 == right keyboard button
        rightPressed = true;
    }
    else if(e.keyCode == 37){//37==left keyboard button
        leftPressed = true;
    }
}

document.addEventListener("keyup",keyUpHandler,false);
function keyUpHandler(e) {//if key is unpressed
    if(e.keyCode == 39){ //39 == right keyboard button
        rightPressed = false;
    }
    else if(e.keyCode == 37){//37==left keyboard button
        leftPressed = false;
    }
}
document.addEventListener("mousemove",mouseMoveHandler,false);
function mouseMoveHandler(e) {//e.clientX returns horizontal position where e, event occured
    var relativeX = e.clientX - canvas.offsetLeft; 
    if(relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX - paddleWidth/2;
    }
}

//forever or until we stop it. positive=slower negative=faster

draw();