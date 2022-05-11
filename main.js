// setup 

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const para = document.querySelector('.score');
const startButton = document.querySelector('.start-button');
const paraTime = document.querySelector('.timer');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

//initial canvas style

ctx.fillStyle = 'rgb(0, 0, 0)';
ctx.fillRect(0, 0, width, height);

let ballCount = 0;

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

  Ball.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
      if (!(this === balls[j]) && balls[j].exists) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
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
        if (e.key === 'a') {
          _this.x -= _this.velX;
        } else if (e.key === 'd') {
          _this.x += _this.velX;
        } else if (e.key === 'w') {
          _this.y -= _this.velY;
        } else if (e.key === 's') {
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
          let ballCount0 = ballCount--;
          para.textContent  = para.textContent.replace(ballCount0,ballCount);
        }
      }
    }
  }


  let balls = [];

while (balls.length < 25) {
  let size = random(10,20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    true,
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );

  balls.push(ball);
}

ballCount = balls.length;
para.textContent += ballCount; 


let evilCircle = new EvilCircle(20,20,true);
evilCircle.setControls(); 

let startingTime;

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

    updateTime(Date.now()); 
    requestAnimationFrame(loop);
  }

  startButton.addEventListener('click', ()=>{
    startButton.disabled = true; 
    startButton.style.display = 'none';  
    startingTime = Date.now();
    console.log(startingTime);
    loop();
    
  }
  );

 // loop();

function updateTime(time){
  const diff =  Math.floor((time- startingTime)/1000);
  if (diff >= 120) paraTime.textContent = 'Time: 00:00';
    else if (diff>0) {
      let seconds = (120 - diff)%60;
      let minutes = 1- (Math.floor(diff/60));
      paraTime.textContent = 'Time: 0'+minutes+':'+seconds.toString().padStart(2, '0');
    }

}