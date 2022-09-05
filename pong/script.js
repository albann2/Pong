//select canvas
const cvs=document.getElementById("pong");
const ctx=cvs.getContext("2d");

//select color
let col=document.getElementById("col").value
let col2=document.getElementById("col2").value
let col3=document.getElementById("col3").value

//create the user paddle
const user={
    x:0,
    y:cvs.height/2-100/2,
    width:10,
    height:100,
    color: col,
    score:0,
}

//create the com paddle
const com={
    x:cvs.width-10,
    y:cvs.height/2-100/2,
    width:10,
    height:100,
    color:col,
    score:0
}

//create the ball
const ball={
    x:cvs.width/2,
    y:cvs.height/2,
    radius:10,
    speed:5,
    velocityX:5,
    velocityY:5,
    color:col2,
}

//create the net
const net={
    x:cvs.width/2-1,
    y:0,
    width:2,
    height:10,
    color:"WHITE",
}

//draw rect function
function drawRect(x,y,z,t,color){
    ctx.fillStyle=color;
    ctx.fillRect(x,y,z,t);
}

//draw net
function drawNet(){
    for (let i = 0; i < cvs.height; i+=15) {
        drawRect(net.x,net.y+i,net.width,net.height,net.color);
    }
}

//draw Circle
function drawCircle(x,y,z,color){
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.arc(x,y,z,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();    
}

//draw Text
function drawText(text,x,y,color){
    ctx.fillStyle=color;
    ctx.font="45px fantasy";
    ctx.fillText(text,x,y);
}

//render the game
function render() {
    //clear the canvas
    drawRect(0,0,cvs.width,cvs.height,col3);

    //draw the net
    drawNet();

    //draw score
    drawText(user.score,cvs.width/4,cvs.height/5,"WHITE");
    drawText(com.score,3*cvs.width/4,cvs.height/5,"WHITE");

    //draw the user
    drawRect(user.x,user.y,user.width,user.height,user.color);
    drawRect(com.x,com.y,com.width,com.height,com.color);

    //draw the ball
    drawCircle(ball.x,ball.y,ball.radius,ball.color);
}

//control the user paddle
cvs.addEventListener("mousemove", movePaddle);
function movePaddle(evt){
    let rect=cvs.getBoundingClientRect();
    user.y= evt.clientY - rect.top - user.height/2;
}

//collision detection
function collision(a,b){
    a.top=a.y-a.radius;
    a.bottom=a.y+a.radius;   
    a.left=a.x-a.radius; 
    a.right=a.x+a.radius;
    b.top=b.y;
    b.bottom=b.y+b.height;
    b.left=b.x;
    b.right=b.x+b.width;
    return a.right>b.left && a.bottom>b.top && a.left<b.right && a.top<b.bottom;
}

//reset ball
function resetBall(){
    ball.x=cvs.width/2;
    ball.y=cvs.height/2;
    ball.speed=5;
    ball.velocityX=-ball.velocityX;
}

//update
function update(){
    ball.x+=ball.velocityX;
    ball.y+=ball.velocityY;
    let computerLevel=0.1;
    com.y+=(ball.y-(com.y+com.height/2))*computerLevel;
    if (ball.y+ball.radius>cvs.height || ball.y-ball.radius<0) {
        ball.velocityY= -ball.velocityY             
    }
    let player=(ball.x < cvs.width/2) ? user:com;
    if(collision(ball,player)){
        let collidePoint=ball.y-(player.y+player.height/2);
        collidePoint=collidePoint/(player.height/2);
        let angleRad=collidePoint*Math.PI/4;
        let direction=(ball.x<cvs.width/2)?1:-1;
        ball.velocityX=direction*ball.speed*Math.cos(angleRad);
        ball.velocityY=ball.speed*Math.sin(angleRad);
        ball.speed+=0.5;
    }
    if (ball.x-ball.radius<0) {
        com.score++;
        resetBall();    
    }
    else if(ball.x+ball.radius>cvs.width){
        user.score++;
        resetBall();
    }
}

//game init
function game(){
    if(com.score==10){
        alert('CPU win');
        com.score=0
        user.score=0
        update();
        render();
    }
    else if(user.score==10){
        alert('USER win');
        com.score=0
        user.score=0
        update();
        render();
    }
    else{
        update();
        render();
    }
}

//loop
const framePerSecond=50;
setInterval(game,1000/framePerSecond);