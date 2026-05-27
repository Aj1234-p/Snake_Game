const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.game-over');
const restartButton = document.querySelector('.btn-restart');

const highScoreElement = document.querySelector('#high-score');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');

const blockHeight = 50;
const blockWidth = 50;

console.log(board.clientHeight, board.clientWidth);  
console.log(board);

// to fetch the client display height clientHeight = 1576/30 = 52.5 = 52
const cols = Math.floor(board.clientWidth/blockWidth);
// to fetch the client display width  clientWidth = 1146/30 = 38.2  = 38
const rows = Math.floor(board.clientHeight/blockHeight);

// three variable to display on the top of it
let score =0;
let highScore = localStorage.getItem("highScore") || 0;
let time = `00-00`;

// update high score
highScoreElement.innerText = highScore;

// now think there is my board and I know how many blocks make inside there (rows*cols) but how to
// first think <div class='board'> <div class='block'></div> </div>
/* now thing rows*cols = 52*38 = 1972 blocks in my pc but if I started manually can I made it if
   your answer yes okk but you know your screen/display width but did not about any other client 
   who's have an different size so manually it's impossible. So what to do Loop and every iteration 
   to made like this type of things <div class='block'>.
*/
//  for(let i=0;i<rows*cols;i++){
//   let block = document.createElement('div');
//   block.classList.add('block');
//   board.appendChild(block);
//  }

/* Grids are coming that's good with the help of java script but you can see some spaces are 
remaining why? you can see my screen size width 1576.800 but I take approaximatly 1576 and 1146.200
but i take approximately 1146 so if divide to in a 1576.800/30 = 52.56 and 1146.200/30 = 38.20 
so here calculate in only floor value but according 0.56 and 0.20 left each and every block
so here when we started to iteration 52*38 = 1972 blocks but actual 52.56 * 38.20 = 2008 so how can 
fix it? using a minmax function 
our problem space so here pixel size of blocks fix what if used if space is empty or remaining then
accordingly to distributed. so same as problem here some space are their inside the grid height and 
width so that use minmax,
How does it work minmax(30px,1fr) => minimum of size 30 and maximum of 1 fr so when space remaining
that automatically each and every block to distributed space.
*/


// maintain a array for cordinating
// in java script 2d array does not create so we create an 1d array and in a runtime to make 2d array
const blocks = [];
// snake object intially length of snake is three
let snake = [{
    x:1,y:2
}]

let direction = 'down';
let intervalId = null;
let timerIntervalId = null;
let food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};

// making a blocks
for(let row=0;row<rows;row++){
  for(let col =0;col<cols;col++){
    let block = document.createElement('div');
    block.classList.add('block');
    board.appendChild(block);
    block.innerText = `${row}-${col}`;
    blocks[`${row}-${col}`] = block;
  }
}

// in a snake to fetch the object and inside object to found a co-ordinate
// Now thing about inside a blocks array what the fill row and coloumn
// I want to show the snake in front of end user but how? We have an two array first is blocks in blocks array inside an row and column details and in a snake array to inside a object and each and every object on a coordinate(x,y), I know co-ordinate to snakes but how to show them? With the help of blocks array but how can access it an index it's just iterate on snake fetch the object and each and object co-ordinate(x,y) and access it; 
function render(){
  // 1
    let head = null;
    // 5 randomly food shown
    blocks[`${food.x}-${food.y}`].classList.add("food");

    if(direction==='right'){
      head = {x:snake[0].x, y:snake[0].y+1};
    }
    else if(direction==='left'){
      head = {x:snake[0].x, y:snake[0].y-1};
    }
    else if(direction==='up'){
      head = {x:snake[0].x-1, y:snake[0].y};
    }
    else if(direction==='down'){
      head = {x:snake[0].x+1, y:snake[0].y};
    }

    // when snake goes on out of bound on the grid/blocks
    if(head.x<0 || head.x >=rows || head.y<0 || head.y>=cols){

      // alert("Game Over");
      // just break the interval like many times to run the interval after reach on the out of 
      // bound just stop 
      clearInterval(intervalId);

      modal.style.display = 'flex';
      startGameModal.style.display = 'none';
      gameOverModal.style.display = 'flex';
      return;
    }
    
    // When snake consume a food then 
    if(head.x==food.x && head.y == food.y){
       blocks[`${food.x}-${food.y}`].classList.remove("food");
       food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};
       blocks[`${food.x}-${food.y}`].classList.add("food");
       snake.unshift(head);

       score+=10;
       scoreElement.innerText = score;
       if(score>highScore){
        highScore = score;
        // when any value to store on local
        localStorage.setItem("highScore",highScore.toString());
       }
    }

    // 4 for remove the class according pop 
    snake.forEach(segment=>{
      blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    })

    //2 just add on head 
    snake.unshift(head);
    //3 but the problem is back to does not clear tail
    snake.pop();

  snake.forEach(segment=>{
    // console.log(segment);
    blocks[`${segment.x}-${segment.y}`].classList.add('fill');
  })
} 

// 1. I want to every 3ms to recalculate(reload)
// using a set interval for every 3 second
// 2. According to the direction to move on the snake as well as 

// start button logic here 
// when user click on the start button then start game
startButton.addEventListener('click',()=>{
    // when user click the start button then remove the display
    modal.style.display = "none";
     intervalId = setInterval(()=>{ render() },300); 
     timerIntervalId = setInterval(()=>{
      let [min,sec] = time.split('-').map(Number);
      if(sec==59){
        min+=1;
        sec =0;
      }
      else{
        sec+=1;
      }
      time = `${min}-${sec}`;
      timeElement.innerText = time;
     },1000);
})

// restart button logic here 
restartButton.addEventListener('click',restartGame);
function restartGame(){
  // 2.before restart button your everything food and all of those vanish
     score =0;
     scoreElement.innerText = score;
     time=`00-00`;
     timeElement.innerText = time;
     blocks[`${food.x}-${food.y}`].classList.remove("food");
     direction ="down";
     snake.forEach(segment=>{
      blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    })

  // 1. That type of problem to come when made a restart button so how can solved it 
    modal.style.display = 'none'
    snake = [{  x:1,y:2 }];
    food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};
    intervalId = setInterval(()=>{ render() },300);
}

// when user clicks on the screen then accordingly to move if user press on key left, right, up or down it could be anything then show on a key 
// ArrowUp, ArrowDown, ArrowLeft, ArrowRight
addEventListener("keydown",(event)=>{
  // console.log(event.key);
  if(event.key==='ArrowUp'){
    direction = 'up'
  } 
  else if(event.key==='ArrowDown'){
    direction = 'down'
  } 
  else if(event.key==='ArrowLeft'){
    direction = 'left'
  } 
  else if(event.key==='ArrowRight'){
    direction = 'right'
  } 
})
