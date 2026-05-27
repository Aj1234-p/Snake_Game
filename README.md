# 🐍 Snake Game

A fully functional browser-based Snake Game built with **pure HTML, CSS, and JavaScript** — no libraries, no frameworks, no canvas. Built on a **dynamic CSS Grid** that adapts to any screen size.

🔗 **Live Demo:** `coming soon — add your GitHub Pages link here`

---

## 📸 Screenshots

| Start Screen | Game Grid | Coordinate System |


---

## 🎯 What This Project Does

- Dynamic grid that **fits any screen size** automatically
- Snake moves with arrow keys
- Food spawns randomly anywhere on the grid
- Snake grows when it eats food
- **Live score** updates every time food is eaten (+10)
- **High score** saved with localStorage — persists after refresh
- **Timer** tracks how long you've been playing
- Game Over screen when snake hits the wall
- Restart button to play again

---

## 🧠 How I Built It — My Full Thinking Process

---

### Part 1 — The Grid Problem

#### ❌ My First Thought — Fixed Size Blocks
My first instinct was to give every block a fixed size:
```css
.block {
  width: 30px;
  height: 30px;
}
```
**This was wrong.** It only fits MY screen. Every other screen size would break the layout.

---

#### 💡 The Real Solution — Dynamic Grid
Instead I used JavaScript to measure the actual screen size:
```javascript
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
```
Now the grid calculates exactly how many blocks fit based on the **client's actual screen.**

---

#### 🔨 Building Blocks with a Loop
Manually creating 1900+ blocks was impossible. A loop did it automatically:
```javascript
for(let row = 0; row < rows; row++){
  for(let col = 0; col < cols; col++){
    let block = document.createElement('div');
    block.classList.add('block');
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}
```

---

#### 🐛 The Spacing Bug
After building the grid I noticed **gaps around the edges.**

The reason:
```
Screen width:  1576.800px
Block width:   30px
1576.800 / 30 = 52.56  → Math.floor = 52 blocks
0.56 blocks worth of space LEFT OVER → gap appears
```

Same for height:
```
1146.200 / 30 = 38.20  → Math.floor = 38 blocks
0.20 blocks worth of space LEFT OVER → gap appears
```

**The Fix — CSS minmax():**
```css
grid-template-columns: repeat(auto-fill, minmax(30px, 1fr));
grid-template-rows: repeat(auto-fill, minmax(30px, 1fr));
```

`minmax(30px, 1fr)` means:
- Minimum size: 30px
- Maximum size: 1fr (take any remaining space)

So leftover pixels get distributed evenly across all blocks. Gap gone! ✅

---

#### ❓ Can JavaScript Create a 2D Array?

**No — JavaScript does not have native 2D arrays.**

So I created a clever workaround — a **1D array with string keys** that behaves like a 2D array at runtime:

```javascript
const blocks = [];
blocks[`${row}-${col}`] = block;

// Access any block like this:
blocks["3-7"]  // row 3, column 7
blocks["0-0"]  // top left corner
```

This is why I printed coordinates on every block during development — to visually verify the system worked. Screenshot 4 shows this clearly.

---

### Part 2 — Snake and Food

#### 🍎 Food Spawning
Food is just an object with random coordinates:
```javascript
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols)
};
```

To show food on the grid — use coordinates to find the matching block and add a CSS class:
```javascript
blocks[`${food.x}-${food.y}`].classList.add("food");
```

When snake eats food → remove class from old position → generate new random position → add class to new block.

---

#### 🐍 The Snake Data Structure
Snake is an **array of coordinate objects:**
```javascript
let snake = [
  { x: 1, y: 2 }  // head
];
```

Each object = one segment of the snake body.

---

#### 🔄 The render() Function — How Movement Works

Every 300ms `setInterval` calls `render()`:

**Step 1** — Calculate new head based on direction:
```javascript
if(direction === 'right') head = { x: snake[0].x, y: snake[0].y + 1 };
if(direction === 'left')  head = { x: snake[0].x, y: snake[0].y - 1 };
if(direction === 'up')    head = { x: snake[0].x - 1, y: snake[0].y };
if(direction === 'down')  head = { x: snake[0].x + 1, y: snake[0].y };
```

**Step 2** — Remove fill class from all current snake segments

**Step 3** — Add new head to front of array with `unshift()`

**Step 4** — Remove tail with `pop()`

**Step 5** — Add fill class to all new snake segments

This creates the illusion of movement — snake appears to slide forward every 300ms.

---

#### 🍽️ When Snake Eats Food
```javascript
if(head.x == food.x && head.y == food.y){
  snake.unshift(head);  // add head BUT don't pop tail → snake grows by 1
  score += 10;
  // respawn food at new random location
}
```

The key insight: **skip the `pop()`** when food is eaten → tail stays → snake length increases by 1.

---

#### 💀 Game Over Condition
```javascript
if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
  clearInterval(intervalId);  // stop the game loop
  // show game over modal
}
```

---

#### 🏆 High Score with localStorage
```javascript
// Save
localStorage.setItem("highScore", highScore.toString());

// Load on page start
let highScore = localStorage.getItem("highScore") || 0;
```

High score **survives browser refresh** because localStorage persists on the device.

---

## ✨ Features

- Responsive grid — works on any screen size
- Arrow key controls (Up, Down, Left, Right)
- Food spawns randomly on the grid
- Snake grows on eating food
- Live score (+10 per food)
- High score saved with localStorage
- Timer tracks game duration
- Start screen modal
- Game Over modal
- Restart button resets everything

---

## 🛠️ Tech Stack

- **HTML5** — structure, modals, score display
- **CSS3** — dynamic grid with minmax(), block styling
- **JavaScript (Vanilla)**
  - DOM Manipulation — dynamic block creation
  - CSS Grid via JS — responsive layout
  - setInterval — game loop every 300ms
  - Array methods — unshift(), pop(), forEach()
  - Object coordinates — snake and food positioning
  - localStorage — high score persistence
  - keydown events — arrow key direction control

---

## 🚀 Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/Aj1234-p/snake-game.git

# 2. Open in browser
cd snake-game
open index.html
```

> No install needed — just open `index.html` in any browser.

---

## 📁 Project Structure

```
snake-game/
├── sg.html      # Game layout, modals, score display
├── sg.css       # Grid styling, snake/food colors, modals
└── sg.js       # All game logic
    ├── Grid setup         # Dynamic block creation with coordinates
    ├── render()           # Main game loop — movement + collision
    ├── startButton        # Start game + setInterval
    ├── restartGame()      # Reset everything + restart interval
    └── keydown listener   # Arrow key direction control
```

---

## 📖 What I Learned

- How to build a **responsive grid** using `clientWidth` / `clientHeight`
- Why `Math.floor()` causes gaps and how `minmax()` fixes it
- Why **JavaScript has no native 2D arrays** and how to simulate one
- How `unshift()` and `pop()` together create snake movement
- How **skipping `pop()`** makes the snake grow when eating food
- How `setInterval` creates a game loop
- How `localStorage` persists data across browser sessions
- How to use **string keys** as coordinates in an array

---

## 🙋 Author

Built with ❤️ and a lot of grid debugging by **Ajit**

> ⭐ If you learned something from this, give it a star!
