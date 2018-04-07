var canvas = document.getElementById("myCanvas");
canvas.style.border = "2px solid black";
//We need to store the 2D rendering context
//The 2D rendering Context is the tool used to pain the Canvas
var ctx = canvas.getContext("2d");

//You can run a fucntion over and over again using a JavaScript timing function such as setInterval() or requestAnimationFrame().


var dx = 0;
var dy = 0; //moves ball closer to - or top
var move = false;
// if(move){
	// dy = -3;
	// dx = 3;
// }
//************Adding a user controllable padde to hit the ball
var paddleHeight = 10;
var paddleWidth = 75;
var paddleY =  canvas.height - paddleHeight;
var paddleX = (canvas.width - paddleWidth) / 2; //paddle starting point x-axis
//************Adding Pressed Buttons(User Control)
var rightPressed = false;
var leftPressed = false;
var mouseClicked ={
	activation:false,
	dy: -3,
	dx: 3
};

//*************Adding Ball Radius
//adding a Score
var score = 0;
//adding lives
var lives = 3;
//adding speed
var speed = {
	dy: -3,
	dx: 3
};
//*************Adding Bricks to Break down
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
//*************Creating the Bricks
//Ball Positioning
var ballXStartPos = paddleX+40;
var x = ballXStartPos;
var y = paddleY-paddleHeight+1; //y values are counted from top left = 0
var ballRadius = 10;

var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1
        }; //set x and y coordinate for each brick array piece
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD"; //set fontColor
    ctx.fillText("Score: " + score, 8, 20); //(text,x-coordinate,y-coordinate)
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD"; //set fontColor
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20); //(text,x-coordinate,y-coordinate)
}
function drawSpeed() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD"; //set fontColor
    ctx.fillText("Speed: " + speed, canvas.width/2.2, 20); //(text,x-coordinate,y-coordinate)
}


function drawBall() {
    //drawing the ball
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    //ctx.arc(x-coordinate,y-cooridinate,arc-radius,start angle,end angle,direction(false=clockwise,true=counter))
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}


function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) { //if status is 1, draw, if not, don't
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "00095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}





function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    //making the ball move
    drawPaddle();
    drawBall();
    drawScore();
    drawLives();
    collisionDetection();
	drawSpeed();
	
	 if(y+dy < ballRadius){//top edge
        //if the ball's y position is greater than the height of the Canvas, remember y values are counted from the top left, so the edge starts at 0 and bottom edge is 480px = (canvas.height), reverse the y direction.
        dy = -dy;//if position is <0 move in opposite y direction
    } else if(y > canvas.height-ballRadius/2){ //if ball falls inbetween left width and right width of paddle
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
                // x = canvas.width/2;
                // y=canvas.height-30;
                dy = 0;
				dx = 0;
				if(dy === 0 && dx===0){
					x=paddleX+40;
					y = paddleY-paddleHeight+1;
		}
                // paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
   if(x+dx >canvas.width-ballRadius || x+dx < ballRadius){//if ball hits left or right sides,turn around
        dx = -dx;
    }

    

    if (rightPressed && paddleX < canvas.width - paddleWidth+5) { //if rightKeyPressed and paddlePos is less than width of canvas, paddle can move
        paddleX += 7; //move 7px right if pressed
		if(dy === 0 && dx===0){
		x +=7;
		}
    }
    if (leftPressed && paddleX > 5) { //if leftKeyPressed and paddlePos is greater than left border canvas, or 0, paddelw can and will move
        paddleX += -7; //move 7px left if pressed
		if(dy === 0 && dx===0){
		x +=-7;
		}
    }
	
    console.log(mouseClicked.activation);
    console.log(x);
    console.log(y);
	moveBall(move);
	x +=dx;
    y +=dy;
	
    requestAnimationFrame(draw); //draw() called every 10 milliseconds

}




/*Toggling Keyboard Movement
document.addEventListener("keydown", keyDownHandler, false);
function keyDownHandler(e) { //if key is pressed
    if (e.keyCode == 39) { //39 == right keyboard button
        rightPressed = true;
		
    } else if (e.keyCode == 37) { //37==left keyboard button
        leftPressed = true;
		
    }
}


document.addEventListener("keyup", keyUpHandler, false);

function keyUpHandler(e) { //if key is unpressed
    if (e.keyCode == 39) { //39 == right keyboard button
        rightPressed = false;
    } else if (e.keyCode == 37) { //37==left keyboard button
        leftPressed = false;
    }
}
*/

document.addEventListener("mousemove", mouseMoveHandler, false);


function mouseMoveHandler(e) { //e.clientX returns horizontal position where e, event occured
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
		if(dy === 0 && dx===0){
		x=paddleX+40;
		}
    }
}
//mouse click to move ball
document.addEventListener("click", mouseClickHandler, false);
function mouseClickHandler(e) {
	if(dy === 0){
	mouseClicked.activation = true;
	move = true;
	
	}
    
}

function moveBall(activated){
	if (activated){
		dx = 3;
		dy = -3;

	}
	move= false
}

//forever or until we stop it. positive=slower negative=faster

draw();
