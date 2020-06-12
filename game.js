"use strict";

class Game {
  constructor() {
    this.field = new Field();
    this.matrix = this.newMatrix();
    this.shape = new IShape();
    this.renderField();
    setInterval(() => this.step(), 1000);
    setTimeout(() => this.shape.move("right"), 7000);
    setTimeout(() => this.shape.move("left"), 9000);
    setTimeout(() => this.shape.move("turn"), 11000);
  }
  step() {
    // this.nextFigure();
    this.shape.bottomCoordinate++;
    console.log(this.shape.bottomCoordinate);
    if (this.shape.bottomCoordinate == 24) this.shape.bottomCoordinate = 4;
    this.renderField();
  }

  // nextFigure() { //maybe I do not need this function if I add bottom figure and renderField will write field
  //   for (let i = 0; i < 4; i++) {
  //     for (let u = 0; u < 10; u++) {
  //       this.matrix[i][u] = this.shape.matrix[i][u];
  //     }
  //   }
  // }
  newMatrix() {
    let matrix = [];
    for (let i = 0; i < 23; i++) {
      let line = [];
      for (let u = 0; u < 10; u++) {
        line.push(0);
      }
      matrix.push(line);
    }
    return matrix;
  }
  renderField() {
    for (let i = 0; i < 23; i++) {
      for (let u = 0; u < 10; u++) {
        this.field.fieldBlocks[i * 10 + u].innerText = 0;
      }
    }
    for (let i = 0; i < 23; i++) {
      for (let u = 0; u < 10; u++) {
        if (i > this.shape.bottomCoordinate - 5 && i < this.shape.bottomCoordinate) {
          this.field.fieldBlocks[i * 10 + u].innerText = this.shape.matrix[i - this.shape.bottomCoordinate + 4][u];
        } else {
          this.field.fieldBlocks[i * 10 + u].innerText = this.matrix[i][u];
        }
      }
    }
  }
}

class Field {
  constructor() {
    this.gameField = document.createElement("div");
    this.gameField.id = "field";
    document.body.append(this.gameField);
    for (let i = 0; i < 23; i++) {
      let line = document.createElement("div");
      line.className = "line";
      for (let u = 0; u < 10; u++) {
        let block = document.createElement("div");
        block.className = "empty-block";
        //block.innerText= i * 10 + u;
        if (i < 3) block.hidden = true; //uncomment it when will add gravity functionality
        line.append(block);
      }
      this.gameField.append(line)
    }
    this.fieldBlocks = this.gameField.querySelectorAll(".empty-block");
  }
}

class Tetromino { //all tetrominoes will be extended from this class
  constructor() {
    this.bottomCoordinate = 4; //add it to render martix
  }
  move(direction) {
    switch(direction) {
      case("right"):
        for (let position of this.positions) {
          for (let line of position) {
            if (line[9] == 0) { //I will improve this check
              line.unshift(line.pop());
            }
          }
        }
        break;
      case("left"):
        for (let position of this.positions) {
          for (let line of position) {
            if (line[0] == 0) { //I will improve this check
              line.push(line.shift());
            }
          }
        }
        break;
      case("turn"):
        this.positionNumber = this.positionNumber == (this.positions.length - 1) ? 0 : ++this.positionNumber;
        this.matrix = this.positions[this.positionNumber];
        break;
    }
  }
}

class IShape extends Tetromino {
  constructor() {
    super();
    this.positions = [
      [
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, -1, 0, 0, -1, 0, 0, 0],
        [0, 0, 0, -1, 0, 0, -1, 0, 0, 0],
        [0, 0, 0, -1, 0, 0, -1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0]
      ]
    ];
    this.positionNumber = Math.round(Math.random() * (this.positions.length - 1));
    this.matrix = this.positions[this.positionNumber];
  }
}


let myGame = new Game();
