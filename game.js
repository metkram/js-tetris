"use strict";

class Game {
  constructor() {
    this.field = new Field();
    this.matrix = this.newMatrix();
    this.shapePool = [this.newShape(), this.newShape()];
    this.shape = this.shapePool[0];
    this.renderField();
    setInterval(() => this.step(), 500);
    setTimeout(() => this.shape.move("right"), 1000);
    setTimeout(() => this.shape.move("right"), 2000);
    setTimeout(() => this.shape.move("right"), 3000);
    setTimeout(() => this.shape.move("left"), 11000);
    setTimeout(() => this.shape.move("left"), 12000);
    setTimeout(() => this.shape.move("left"), 13000);
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
  addFigureToMatrix(topLine) {
    for (let i = 0; i < 4; i++) {
      for (let u = 0; u < 10; u++) {
        if (this.shape.matrix[i][u] == -1) this.shape.matrix[i][u] = 0;
        this.matrix[topLine - 4 + i][u] += this.shape.matrix[i][u];
      }
    }
    for (let i = 0; i < 4; i++) {
      for (let u = 0; u < 10; u++) {
        if (this.matrix[i][u] == 1) {
          console.log("Game over");
          this.matrix = this.newMatrix();
        }
      }
    }
    this.burnALine();
    this.shapePool.shift();
    this.shapePool.push(this.newShape());
    this.shape = this.shapePool[0];
  }
  burnALine() {
    for (let i = this.matrix.length - 2; i > 3; i--) {
      if (!this.matrix[i].includes(0)) {
        for (let u = i; u > 0; u--) {
          this.matrix[u] = this.matrix[u - 1];
        }
      }
    }
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
    for (let i = 0; i < 24; i++) {
      for (let u = 0; u < 10; u++) {
        this.field.fieldBlocks[i * 10 + u].innerText = 0;
        this.field.fieldBlocks[i * 10 + u].className = "empty-block";
      }
    }
    for (let i = 0; i < 24; i++) {
      for (let u = 0; u < 10; u++) {
        if (this.matrix[i][u] == 1) this.field.fieldBlocks[i * 10 + u].classList.add("ground");
        this.field.fieldBlocks[i * 10 + u].innerText = this.matrix[i][u];
        if (i > this.shape.bottomCoordinate - 5 && i < this.shape.bottomCoordinate) {
          if (this.matrix[i][u] != 1 && this.shape.matrix[i - this.shape.bottomCoordinate + 4][u] == 1) {
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
    document.body.append(this.gameField);
    for (let i = 0; i < 24; i++) {
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
    this.bottomCoordinate = 3; //add it to render martix
  }
  move(event) {
    console.log(event);
    switch(event) { //here is bug, when you can collide figure with ground if press right or left
      case("ArrowRight"):
        for (let position of this.positions) {
          for (let line of position) {
            if (line[9] == 0) { //I will improve this check
              line.unshift(line.pop());
            }
          }
        }
        break;
      case("ArrowLeft"):
        for (let position of this.positions) {
          for (let line of position) {
            if (line[0] == 0) { //I will improve this check
              line.push(line.shift());
            }
          }
        }
        break;
      case("Space"):
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
  myGame.shape.move(event.code);
  myGame.renderField();
};
document.addEventListener("keydown", moveFigure);
