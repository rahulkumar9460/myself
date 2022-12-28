import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';

/*
  0
  * * * * * * -- x
  *
  *
  *
  * 
  y 
*/
interface snake_body {
  x: number,
  y: number
}

interface food {
  x: number,
  y: number
}

@Component({
  selector: 'app-snake-main',
  templateUrl: './snake-main.component.html',
  styleUrls: ['./snake-main.component.css']
})

export class SnakeMainComponent implements OnInit {

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    //console.log(event.key);
    if(this.keysToDirections[event.key])this.changeInputDirection(this.keysToDirections[event.key]);
  }

  constructor() {
    this.gridElementSize = Math.floor(window.innerWidth / 50);
    this.grid = {
      width: Math.floor(window.innerWidth / (this.gridElementSize + 1.1)),
      height: Math.floor((window.innerHeight - 100) / (this.gridElementSize + 1.1)),
    };

    this.height_iterator = Array(this.grid.height).fill(0);
    this.width_iterator = Array(this.grid.width).fill(0);
  }

  directions: Array<string> = ['left', 'right', 'up', 'down'];
  oppDirectionMap: any = {'left': 'right', 'right': 'left', 'up': 'down', 'down': 'up'};
  keysToDirections: any = {'a': 'left', 'd': 'right', 'w': 'up', 's': 'down', 'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left', 'ArrowRight': 'right'};
  grid: any = { height: 20, width: 20 };
  gridElementSize: number = 50;
  height_iterator: Array<any> = [];
  width_iterator: Array<any> = [];

  snake: Array<snake_body> = [];
  snakeSet: Set<string> = new Set();
  wallSet: Set<string> = new Set();
  snakeSpeed: number = 100;
  lastTraveledByTail: snake_body = {x: 0, y: 0};
  initialLengthOfSnake: number = 10;
  inputDirection: string = 'left';
  food: food = {x:0, y:0};

  levels: Array<number> = [1, 2, 3, 4];
  level: number = 1;
  score: number = 0;

  isGameOver: boolean = false;
  isGameStarted: boolean = false;
  isGamePaused: boolean = false;
  interval: any = null;

  ngOnInit(): void {
    //console.log(window.innerHeight, window.innerWidth, this.grid.height, this.grid.width, this.gridElementSize);
    this.initGrid();
  }

  fillHeightAndWidthIterators() {
    //console.log("Filling iterators....");
    for (let i = 0; i < this.height_iterator.length; i++) this.height_iterator[i] = i;
    for (let i = 0; i < this.width_iterator.length; i++) this.width_iterator[i] = i;

  }

  initGrid() {
    this.fillHeightAndWidthIterators();
    this.initSnake();
    this.insertFood();
    //this.showDummySnake();
  }

  showDummySnake() {
    let i = 0;
    this.interval = setInterval(() => {
      //let num =  Math.floor(Math.random() * this.directions.length);
      if(i == this.initialLengthOfSnake) {
        clearInterval(this.interval);
      } else {
        i++;
        this.moveSnake(this.inputDirection);
      }
    }, this.snakeSpeed);
  }

  startGame() {
    console.log("game starting");
    this.isGameOver = false;
    this.isGameStarted = true;
    this.isGamePaused = false;
    this.interval = null;
    this.inputDirection = 'left';
    this.score = 0;
    this.initSnake();
    this.insertFood();
    this.resumeGame();
  }

  pauseGame() {
    this.isGamePaused = true;
    clearInterval(this.interval);
  }

  resumeGame() {
    //console.log("Resuming game");
    this.isGamePaused = false;
    this.interval = setInterval(() => {
      //let num =  Math.floor(Math.random() * this.directions.length);
      if(this.isGameOver || !this.isGameStarted || this.isGamePaused) {
        clearInterval(this.interval);
      } else {
        this.moveSnake(this.inputDirection);
      }
    }, this.snakeSpeed);
  }

  initSnake() {
    //console.log("Init snake..");
    let headY = Math.floor(this.grid.height / 2);
    let headX = Math.floor(this.grid.width / 2 - this.initialLengthOfSnake / 2);

    this.snake = new Array();
    this.snakeSet = new Set();
    for (let i = 0; i < this.initialLengthOfSnake; i++) {
      this.snake.push({ x: headX + i, y: headY });
      this.snakeSet.add(headX + i + '_' + headY);
    }
    //console.log(this.snake);
    //console.log(this.snakeSet);
  }

  isSnakeBody(x: number, y: number) {
    if(this.isSnakeHead(x, y)) {
      return false;
    } else if(this.snakeSet.has(x + '_' + y)) {
      //console.log(this.snakeSet, x, y);
      return true;
    } else {
      return false;
    }
  }

  isWall(x: number, y: number) {
    if(this.wallSet.has(x + '_' + y)) {
      return true;
    } else {
      return false;
    }
  }

  isSnakeHead(x: number, y:number) {
    if(this.snake[0].x == x && this.snake[0].y == y) return true;
    else return false;
  }

  changeInputDirection(dir: string) {
    //console.log("changing input direction");
    if(!this.isAValidInputDir(dir))return;
    let newHead = this.calculateNewHead(dir);
    if (this.isGameOverFun(newHead.x, newHead.y)){
      return;
    } else {
      this.inputDirection = dir;
    }
  }

  insertFood() {
    let success = false;
    while(!success) {
      let i =  Math.floor(Math.random() * this.grid.height);
      let j =  Math.floor(Math.random() * this.grid.width);

      if(!this.isSnakeBody(j, i) && !this.isWall(j, i)){
        this.food = {x:j, y: i};
        success = true;
      }
    }
  }

  isFood(x: number, y: number) {
    if(this.food.x == x && this.food.y == y) return true;
    else return false;
  }

  isAValidInputDir(dir: string) {
    //console.log("Check if inputDir is valid or not... ");
    if(this.inputDirection == dir) return false;
    else if(this.oppDirectionMap[dir] == this.inputDirection) return false;
    return true;
  }

  moveSnake(dir: string) {
    let newHead = this.calculateNewHead(dir);
    //if head reaches to a food location
    if(newHead.x == this.food.x && newHead.y == this.food.y) {
      this.score++;
      this.addNodeToSnakeTail();
      this.insertFood();
    }
    if(this.isGameOverFun(newHead.x, newHead.y)) {
      return;
    } else {
      this.addNewHeadAndRemoveTail(newHead);
    }
  }

  isGameOverFun(x: number, y: number) {
    //console.log("Checking if game is over...");
    if (this.isSnakeBody(x, y) || this.isWall(x, y)){
      console.log("Game over!!!!!!!!!!");
      //console.log(this.snakeSet, x, y);
      this.onGameOver();
      return true;
    }
    return false;
  }

  onGameOver() {
    this.isGameOver = true;
    this.isGameStarted = false;
  }

  calculateNewHead(dir: string) {
    let newHead = { x: 0, y: 0 };
    if (dir == 'left') {
      newHead.x = this.snake[0].x - 1;
      newHead.y = this.snake[0].y;
    }
    else if (dir == 'right') {
      newHead.x = this.snake[0].x + 1;
      newHead.y = this.snake[0].y;
    }
    else if (dir == 'up') {
      newHead.x = this.snake[0].x;
      newHead.y = this.snake[0].y - 1;
    }
    else if (dir == 'down') {
      newHead.x = this.snake[0].x;
      newHead.y = this.snake[0].y + 1;
    }

    newHead.x = (newHead.x + this.grid.width) % this.grid.width;
    newHead.y = (newHead.y + this.grid.height) % this.grid.height;
    return newHead;
  }

  addNewHeadAndRemoveTail(newHead: snake_body) {
    let last = this.snake[this.snake.length - 1];
    this.snakeSet.delete(last.x + '_' + last.y);
    this.snake.splice(-1);

    this.lastTraveledByTail = last;

    this.snakeSet.add(newHead.x + '_' + newHead.y);
    this.snake.unshift(newHead);
    //console.log(this.snake);
  }

  addNodeToSnakeTail() {
    this.snake.push(this.lastTraveledByTail);
    this.snakeSet.add(this.lastTraveledByTail.x + '_' + this.lastTraveledByTail.y);
  }

  ifInGrid(x: number, y: number) {
    if (x < 0 || x >= this.grid.width || y < 0 || y >= this.grid.height) return false;
    return true;
  }

  changeGameLevel(level: number) {
    if(this.isGameStarted) return;
    else {
      this.level = level;
      this.initLevel(level);
    }
  }

  goHome() {
    this.isGameOver = false;
    this.isGameStarted = false;
    this.isGamePaused = false;
    this.initSnake();
    //this.showDummySnake();
  }

  initLevel(level: number) {
    this.wallSet = new Set();
    if(level >= 2) {
      for(let i=0; i<this.grid.height; i++){
        this.wallSet.add(0 + '_' + i);
        this.wallSet.add(this.grid.width-1 + '_' + i);
      }
      for(let i=0; i<this.grid.width; i++){
        this.wallSet.add(i + '_' + 0);
        this.wallSet.add(i + '_' + (this.grid.height-1));
      }
    }
    if(level >= 3) {
      let a = Math.floor(this.grid.width/4);
      let b = Math.floor(this.grid.height/3);
      let len = Math.floor(this.grid.width/2);

      for(let i=a; i-a<len; i++) {
        this.wallSet.add(i+'_'+(b));
        this.wallSet.add(i+'_'+(this.grid.height-b));
      }
    }
    if(level >=4) {
      let a = Math.floor(this.grid.width/2);
      for(let i=2; i<this.grid.height-2; i++) {
        this.wallSet.add(a + '_' + i);
      }
      this.wallSet.delete(a + '_' + (Math.floor(this.grid.height/2)));
    }
    
    return;
  }

}
