"use strict";

class Game {
  constructor() {
    this.field = new Field();
    this.matrix = this.newMatrix();
    this.shapePool = [this.newShape(), this.newShape()];
    this.shape = this.shapePool[0];
    this.steps = 0;
    this.scores = 0;
    this.renderField();
    this.interval = setInterval(() => this.step(), 500);
  }
  get points() {
    let points = [0, 40, 100, 300, 1200];
    return points;
  }
  step() {
    // this.nextFigure();
    this.renderField();
    console.log(this.shape.bottomCoordinate);
    for (let i = 3; i > 0; i--) {
      for (let u = 0; u < 10; u++) {
        if (this.shape.matrix[i][u] == 1 && this.shape.matrix[i][u] == this.matrix[this.shape.bottomCoordinate - (3 - i)][u]) {
          this.addFigureToMatrix(this.shape.bottomCoordinate);
          break;
        }
      }
    }
    this.shape.bottomCoordinate++;
  }
  move(event) {
    let error = false;
    switch(event) { //here is bug, when you can collide figure with ground if press right or left, I will try to find out how to fix it
      case("ArrowRight"):
        for (let i = 3; i > -1; i--) {
          for (let u = 0; u < 10; u++) {
            if (this.shape.matrix[i][u] == 1 && this.matrix[this.shape.bottomCoordinate - (4 - i)][u + 1]) {
              console.log("hit");
              error = true;
              break;
            }
          }
        }
        if (error) break;
        for (let position of this.shape.positions) {
          for (let line of position) {
            if (line[9] == 0) { //I will improve this check
              line.unshift(line.pop());
            }
          }
        }
        break;
      case("ArrowLeft"):
        for (let i = 3; i > -1; i--) {
          for (let u = 0; u < 10; u++) {
            if (this.shape.matrix[i][u] == 1 && this.matrix[this.shape.bottomCoordinate - (4 - i)][u - 1]) {
              console.log("hit");
              error = true;
              break;
            }
          }
        }
        if (error) break;
        for (let position of this.shape.positions) {
          for (let line of position) {
            if (line[0] == 0) { //I will improve this check
              line.push(line.shift());
            }
          }
        }
        break;
      case("Space"):
        this.shape.positionNumber = this.shape.positionNumber == (this.shape.positions.length - 1) ? 0 : ++this.shape.positionNumber;
        this.shape.matrix = this.shape.positions[this.shape.positionNumber];
        break;
    }
  }
  speedUp() {
    clearInterval(this.interval);
    this.interval = setInterval(() => this.step(), 100);
  }
  speedDown() {
    clearInterval(this.interval);
    this.interval = setInterval(() => this.step(), 500);
  }
  addFigureToMatrix(topLine) {
    let newMatrix = this.newMatrix(); //If I use only one matrix it doesn't last more than 49-52 new figures. I don't know why, so atm I create everytime new matrix
    for (let i = 0; i < 24; i++) {
      for (let u = 0; u < 10; u++) {
        newMatrix[i][u] = this.matrix[i][u];
      }
    }
    this.matrix = newMatrix;
    for (let i = 0; i < 4; i++) {
      for (let u = 0; u < 10; u++) {
        if (this.shape.matrix[i][u] == -1) this.shape.matrix[i][u] = 0;
        if (this.matrix[topLine - 4 + i][u] == 0) this.matrix[topLine - 4 + i][u] = this.shape.matrix[i][u];
      }
    }
    console.log(this.steps);
    this.burnALine();
    for (let i = 0; i < 4; i++) {
      for (let u = 0; u < 10; u++) {
        if (this.matrix[i][u] == 1) {
          console.log("Game over");
          console.log(this.matrix);
          this.matrix = this.newMatrix();
          this.scores = this.points[0];
        }
      }
    }
    this.steps++;
    this.shapePool.shift();
    this.shapePool.push(this.newShape());
    this.shape = this.shapePool[0];
  }
  burnALine() {
    let lines = 0;
    for (let i = this.matrix.length - 2; i > 3; i--) {
      if (!this.matrix[i].includes(0)) {
        for (let u = i; u > 0; u--) {
          this.matrix[u] = this.matrix[u - 1];
        }
        i++;
        lines++;
      }
    }
    this.scores += this.points[lines];
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
    for (let i = 0; i < 24; i++) {
      let line = [];
      for (let u = 0; u < 10; u++) {
        if (i == 23) {
          line.push(1);
        } else {
          line.push(0);
        }
      }
      matrix.push(line);
    }
    return matrix;
  }
  newShape() {
    let pool = [IShape, OShape, LShape, JShape, ZShape, SShape, TShape];
    let num = Math.floor(Math.random() * pool.length)
    return new pool[num]();
  }
  renderField() {
    this.field.scores.innerText = "Scores: " + this.scores;
    for (let i = 0; i < 24; i++) {
      for (let u = 0; u < 10; u++) {
        this.field.fieldBlocks[i * 10 + u].innerText = 0;
        this.field.fieldBlocks[i * 10 + u].className = "empty-block";
      }
    }
    for (let i = 0; i < 4; i++) {
      for (let u = 0; u < 4; u++) {
        this.field.nextFigureBlocks[i * 4 + u].className = "empty-block";
      }
    }
    for (let i = 0; i < 4; i++) {
      for (let u = 0; u < 4; u++) {
        if (this.shapePool[1].matrix[i][u + 3] == 1) {
          this.field.nextFigureBlocks[i * 4 + u].classList.add(this.shapePool[1].constructor.name);
        }
      }
    }
    for (let i = 0; i < 24; i++) {
      for (let u = 0; u < 10; u++) {
        if (this.matrix[i][u] == 1) this.field.fieldBlocks[i * 10 + u].classList.add("ground");
        this.field.fieldBlocks[i * 10 + u].innerText = this.matrix[i][u];
        if (i > this.shape.bottomCoordinate - 5 && i < this.shape.bottomCoordinate) {
          if (this.shape.matrix[i - this.shape.bottomCoordinate + 4][u] == 1) {
            this.field.fieldBlocks[i * 10 + u].innerText = this.shape.matrix[i - this.shape.bottomCoordinate + 4][u];
            this.field.fieldBlocks[i * 10 + u].classList.add(this.shape.constructor.name);
          }
        }
      }
    }
  }
}

class Field {
  constructor() {
    this.gameField = document.createElement("div");
    this.gameField.id = "field";
    document.querySelector("#gameContainer").append(this.gameField);
    for (let i = 0; i < 24; i++) {
      let line = document.createElement("div");
      line.className = "line";
      for (let u = 0; u < 10; u++) {
        let block = document.createElement("div");
        block.className = "empty-block";
        //block.innerText= i * 10 + u;
        if (i < 3 || i == 23) block.hidden = true; //uncomment it when will add gravity functionality
        line.append(block);
      }
      this.gameField.append(line)
    }
    this.nextFigure = document.createElement("div");
    this.nextFigure.id = "nextFigure";
    this.nextFigure.innerHTML = "Next Figure<br>";
    document.querySelector("#gameContainer").append(this.nextFigure);
    for (let i = 0; i < 16; i++) {
      let newBlock = document.createElement("div");
      newBlock.className = "empty-block";
      this.nextFigure.append(newBlock);
    }
    this.scores = document.createElement("div");
    this.scores.id = "scores";
    this.rules = document.createElement("div");
    this.rules.id = "rules";
    this.rules.innerHTML = "<hr><center>Buttons:</center>⇦ - move left<br>⇨ - move right<br>⇩ - speed up<br>⎵ - turn the figure<hr>";
    this.nextFigure.append(this.scores);
    this.nextFigure.append(this.rules);
    this.fieldBlocks = this.gameField.querySelectorAll(".empty-block");
    this.nextFigureBlocks = this.nextFigure.querySelectorAll(".empty-block");
  }
}

class Tetromino { //all tetrominoes will be extended from this class
  constructor() {
    this.bottomCoordinate = 3; //add it to render martix
  }
  // move(event) {
  //   // if (event.repeat) return;
  //   console.log(event);
  //   switch(event) { //here is bug, when you can collide figure with ground if press right or left, I will try to find out how to fix it
  //     case("ArrowRight"):
  //       for (let position of this.positions) {
  //         for (let line of position) {
  //           if (line[9] == 0) { //I will improve this check
  //             line.unshift(line.pop());
  //           }
  //         }
  //       }
  //       break;
  //     case("ArrowLeft"):
  //       for (let position of this.positions) {
  //         for (let line of position) {
  //           if (line[0] == 0) { //I will improve this check
  //             line.push(line.shift());
  //           }
  //         }
  //       }
  //       break;
  //     case("Space"):
  //       this.positionNumber = this.positionNumber == (this.positions.length - 1) ? 0 : ++this.positionNumber;
  //       this.matrix = this.positions[this.positionNumber];
  //       break;
  //   }
  // }
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
        [0, 0, -0, 1, 1, 1, 1, 0, 0, 0]
      ]
    ];
    this.positionNumber = Math.floor(Math.random() * (this.positions.length));
    this.matrix = this.positions[this.positionNumber];
  }
}
class OShape extends Tetromino {
  constructor() {
    super();
    this.positions = [
      [
        [0, 0, 0, 0, -1, -1, 0, 0, 0, 0],
        [0, 0, 0, 0, -1, -1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0]
      ]
    ];
    this.positionNumber = Math.floor(Math.random() * (this.positions.length));
    this.matrix = this.positions[this.positionNumber];
  }
}
class LShape extends Tetromino {
  constructor() {
    super();
    this.positions = [
      [
        [0, 0, 0, 0, -1, -1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, -1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, -1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, -1, 0, -1, 0, 0, 0],
        [0, 0, 0, 0, -1, 0, -1, 0, 0, 0],
        [0, 0, 0, 0, -1, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, -1, -1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, -1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, -1, 1, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, -1, 0, -1, 0, 0, 0],
        [0, 0, 0, 0, -1, 0, -1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, -1, -1, 0, 0, 0]
      ]
    ];
    this.positionNumber = Math.floor(Math.random() * (this.positions.length));
    this.matrix = this.positions[this.positionNumber];
  }
}
class JShape extends Tetromino {
  constructor() {
    super();
    this.positions = [
      [
        [0, 0, 0, 0, -1, -1, 0, 0, 0, 0],
        [0, 0, 0, 0, -1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, -1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, -1, 0, -1, 0, 0, 0],
        [0, 0, 0, 0, -1, 0, -1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, -1, -1, 1, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, -1, -1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, -1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, -1, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, -1, 0, -1, 0, 0, 0],
        [0, 0, 0, 0, -1, 0, -1, 0, 0, 0],
        [0, 0, 0, 0, 1, -1, -1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0]
      ]
    ];
    this.positionNumber = Math.floor(Math.random() * (this.positions.length));
    this.matrix = this.positions[this.positionNumber];
  }
}
class ZShape extends Tetromino {
  constructor() {
    super();
    this.positions = [
      [
        [0, 0, 0, 0, -1, 0, -1, 0, 0, 0],
        [0, 0, 0, 0, -1, 0, -1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, -1, 0, 0, 0],
        [0, 0, 0, 0, -1, 1, 1, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, -1, -1, 0, 0, 0, 0],
        [0, 0, 0, 0, -1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, -1, 0, 0, 0, 0]
      ]
    ];
    this.positionNumber = Math.floor(Math.random() * (this.positions.length));
    this.matrix = this.positions[this.positionNumber];
  }
}
class SShape extends Tetromino {
  constructor() {
    super();
    this.positions = [
      [
        [0, 0, 0, 0, -1, 0, -1, 0, 0, 0],
        [0, 0, 0, 0, -1, 0, -1, 0, 0, 0],
        [0, 0, 0, 0, -1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, -1, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, -1, -1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, -1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, -1, 1, 0, 0, 0, 0]
      ]
    ];
    this.positionNumber = Math.floor(Math.random() * (this.positions.length));
    this.matrix = this.positions[this.positionNumber];
  }
}
class TShape extends Tetromino {
  constructor() {
    super();
    this.positions = [
      [
        [0, 0, 0, 0, -1, 0, -1, 0, 0, 0],
        [0, 0, 0, 0, -1, 0, -1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, -1, 1, -1, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, -1, -1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, -1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, -1, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, -1, 0, -1, 0, 0, 0],
        [0, 0, 0, 0, -1, 0, -1, 0, 0, 0],
        [0, 0, 0, 0, -1, 1, -1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, -1, -1, 0, 0, 0, 0],
        [0, 0, 0, 0, -1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, -1, 1, 0, 0, 0, 0]
      ]
    ];
    this.positionNumber = Math.floor(Math.random() * (this.positions.length));
    this.matrix = this.positions[this.positionNumber];
  }
}

let myGame = new Game();
let moveFigure = function(event) {
  if (event.repeat) { //multiple left-right moves don't work, but at least plummet works
    return;
  } else {
    myGame.move(event.code);
    myGame.renderField();
  }
};
let speedUp = function(event) {
  if (event.repeat) {
    return;
  } else if (event.code == "ArrowDown") {
    myGame.speedUp();
  }
}
let speedDown = function(event) {
  if (event.code == "ArrowDown") myGame.speedDown();
}
document.addEventListener("keydown", moveFigure);
document.addEventListener("keydown", speedUp);
document.addEventListener("keyup", speedDown);
