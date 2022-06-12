// setup 

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const para = document.querySelector('.score');
const paraLevel = document.querySelector('.level');

const paraHighest = document.querySelector('.highest-score');
const paraTime = document.querySelector('.timer');

paraDefault = para.textContent;
paraTimeDefault = paraTime.textContent
paraLevelDefault = paraLevel.textContent;

const startButton = document.querySelector('.start-button');
const killButton = document.querySelector('.kill-button');
const endMenu = document.querySelector('.game-menu');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight-100;

//local storage

let prevHighest = localStorage.getItem('highest-score');
if(prevHighest) paraHighest.textContent += localStorage.getItem('highest-score');

let ballCount = 0;
let score = 0;
let level = 1;

//initial canvas style

ctx.fillStyle = 'rgb(0, 0, 0)';
ctx.fillRect(0, 0, width, height);


// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

//objects definitions


function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;

  }

  function Ball(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
  }
  Ball.prototype = Object.create(Shape.prototype);
  Ball.prototype.constructor = Ball;

  
  function EvilCircle(x, y, exists) {
    Shape.call(this, x, y, 20, 20, exists);
    this.color = 'white';
    this.size = 10;
  }
  EvilCircle.prototype = Object.create(Shape.prototype);
  EvilCircle.prototype.constructor = EvilCircle;

  //methods

  Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

 //update position

  Ball.prototype.update = function() {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }
  
    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }
  
    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }
  
    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }
  
    this.x += this.velX;
    this.y += this.velY;
  }

  //ball collision - add physics?

  Ball.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
      if (!(this === balls[j]) && balls[j].exists) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + balls[j].size) {
          //enough color contrast with background
          balls[j].color = this.color = 'rgb(' + random(95, 255) + ',' + random(95, 255) + ',' + random(95, 255) +')';
        }
      }
    }
  }

  EvilCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  EvilCircle.prototype.checkBounds = function() {
    if ((this.x + this.size) >= width) {
      this.x= this.x - this.size;
    }
  
    if ((this.x - this.size) <= 0) {
      this.x = this.x + this.size;
    }
  
    if ((this.y + this.size) >= height) {
      this.y = this.y - this.size;
    }
  
    if ((this.y - this.size) <= 0) {
      this.y = this.y + this.size;
    }
  }

  EvilCircle.prototype.setControls = function(){
    let _this = this;
    window.onkeydown = function(e) {
        if (e.code === 'KeyA' || e.code === "ArrowLeft" ) {
          _this.x -= _this.velX;
        } else if (e.code === 'KeyD' || e.code === "ArrowRight") {
          _this.x += _this.velX;
        } else if (e.code === 'KeyW' || e.code === "ArrowUp") {
          _this.y -= _this.velY;
        } else if (e.code === 'KeyS' || e.code === "ArrowDown") {
          _this.y += _this.velY;
        }
      }
  }

  EvilCircle.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
      if ( balls[j].exists) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + balls[j].size) {
          balls[j].exists = false;
           ballCount--;
          para.textContent  = para.textContent.replace(score,++score);
        }
      }
    }
  }



//game
let balls = [];

function game(){ 
  balls = [];

  while (balls.length < level) {
    let size = 15;
    let ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the edge of the canvas, to avoid drawing errors
      random(0 + size,width - size),
      random(0 + size,height - size),
      random(-level/2 + 1,level/2 + 1),
      random(-level,level),
      true,
      'rgb(' + random(95,255) + ',' + random(95,255) + ',' + random(95,255) +')',
      size
    );

    balls.push(ball);
  }

  ballCount = balls.length;



  let evilCircle = new EvilCircle(20,20,true);
  evilCircle.setControls(); 

  loop();

  //animation

  function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
 

    for (let i = 0; i < balls.length; i++) {
      if(balls[i].exists) {
      
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();

      }


    } 

    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();

  
    animation = requestAnimationFrame(loop);
    if(ballCount===0) updateLevel();

    updateTime(Date.now()); 
  }

}

//update level
 
function updateLevel(){
  cancelAnimationFrame(animation);
  paraLevel.textContent = paraLevel.textContent.replace(level,++level);
  if(level>30) endGame();
  game();

}

 // time update

 function updateTime(time){
  const diff =  Math.floor((time- startingTime)/1000);
  if (diff >= 120) {
    paraTime.textContent = 'Time: 00:00';
    endGame();
  }
    else if (diff>0) {
      let seconds = (120 - diff)%60;
      let minutes = 1- (Math.floor(diff/60));
      paraTime.textContent = 'Time: 0'+minutes+':'+seconds.toString().padStart(2, '0');
    }

}

//buttons event listeners

  startButton.addEventListener('click', ()=>{
    endMenu.style.display = 'none'; 

    paraTime.textContent = paraTimeDefault; 
    para.textContent = paraDefault;
    paraLevel.textContent = paraLevelDefault;


    if(paraHighest.classList.contains('new-record')) paraHighest.classList.remove('new-record');

    score = 0;
    level = 1;

    para.textContent += score; 
    paraLevel.textContent += level;
     
    startingTime = Date.now();
    killButton.style.display = 'block';
    game();
    
  }
  );

 killButton.addEventListener('click',endGame);



//end game 

function endGame(){
 cancelAnimationFrame(animation);
 killButton.style.display = 'none';
 endMenu.style.display = 'block';

 if(!prevHighest){
  localStorage.setItem('highest-score', score);
  paraHighest += score;
 }
 else if(score > prevHighest) {
   paraHighest.textContent =  paraHighest.textContent.replace(prevHighest, score);
   paraHighest.classList.add('new-record');

   localStorage.setItem('highest-score', score);
   prevHighest = score;

 }

ctx.fillStyle = 'rgb(0, 0, 0)';
ctx.fillRect(0, 0, width, height);

}