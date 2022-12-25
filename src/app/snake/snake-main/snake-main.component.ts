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

@Component({
  selector: 'app-snake-main',
  templateUrl: './snake-main.component.html',
  styleUrls: ['./snake-main.component.css']
})

export class SnakeMainComponent implements OnInit {

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    console.log(event.key);
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
  keysToDirections: any = {'a': 'left', 'd': 'right', 'w': 'up', 's': 'down', 'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left', 'ArrowRight': 'right'};
  grid: any = { height: 20, width: 20 };
  gridElementSize: number = 50;
  height_iterator: Array<any> = [];
  width_iterator: Array<any> = [];

  snake: Array<snake_body> = [];
  snakeSet: Set<string> = new Set();
  snakeSpeed: number = 70;
  inputDirection: string = 'left';

  ngOnInit(): void {
    //console.log(window.innerHeight, window.innerWidth, this.grid.height, this.grid.width, this.gridElementSize);
    this.fillHeightAndWidthIterators();
    this.initSnake();

    setInterval(() => {
      //let num =  Math.floor(Math.random() * this.directions.length);
      this.moveSnake(this.inputDirection);
    }, this.snakeSpeed);
  }

  fillHeightAndWidthIterators() {
    for (let i = 0; i < this.height_iterator.length; i++) this.height_iterator[i] = i;
    for (let i = 0; i < this.width_iterator.length; i++) this.width_iterator[i] = i;

  }

  initSnake() {
    let initialLengthOfSnake = 5;
    let headY = Math.floor(this.grid.height / 2);
    let headX = Math.floor(this.grid.width / 2 - initialLengthOfSnake / 2);

    for (let i = 0; i < initialLengthOfSnake; i++) {
      this.snake.push({ x: headX + i, y: headY });
      this.snakeSet.add(headX + i + '_' + headY);
    }
    //console.log(this.snake);
    //console.log(this.snakeSet);
  }

  isSnakeBody(x: number, y: number) {
    //console.log(x, y);
    return this.snakeSet.has(x + '_' + y) ? true : false;
  }

  changeInputDirection(dir: string) {
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
    if (this.isSnakeBody(newHead.x, newHead.y)) return;
    this.inputDirection = dir;
  }

  moveSnake(dir: string) {
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
    if (this.isSnakeBody(newHead.x, newHead.y)) return;
    this.addNewHeadAndRemoveTail(newHead);
  }

  addNewHeadAndRemoveTail(newHead: snake_body) {
    this.snakeSet.add(newHead.x + '_' + newHead.y);
    this.snake.unshift(newHead);

    let last = this.snake[this.snake.length - 1];
    this.snakeSet.delete(last.x + '_' + last.y);
    this.snake.splice(-1);
    //console.log(this.snake);
  }

  ifInGrid(x: number, y: number) {
    if (x < 0 || x >= this.grid.width || y < 0 || y >= this.grid.height) return false;
    return true;
  }

  onKeydown(event: any) {
    console.log(event.key);
    window.alert(event.key);
  }

}
