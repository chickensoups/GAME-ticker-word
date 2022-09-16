import {LevelData} from './levelData';
import {Texture} from 'gdxts';
import {tickers} from './tickers';

export enum Direction {
  Row,
  Col
}

export class LevelUtils {
  characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  texturesNone: Texture[] = [];
  texturesSelected: Texture[] = [];
  texturesCorrected: Texture[] = [];
  TICKER_PER_LEVEL = 4;
  CHAR_MATRIX_SIZE = 6;
  TICKER_CODE_SIZE = 3;
  EMPTY_ITEM_SIGN = '-';

  getLevelData() {
    return this.generateLevelData(1);
  }

  isContinuous(arr: number[], direction: Direction, index: number) {
    let continuousCount = 1;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i + 1] - arr[i] === 1) {
        continuousCount++;
        if (continuousCount >= this.TICKER_CODE_SIZE) {
          return true;
        }
      } else {
        continuousCount = 0;
      }
    }
    return false;
  }

  getAvailableRowsAndColumn(matrix: string [][], rows: number[], cols: number[]) {
    if (matrix.length < 1) {
      return;
    }
    for (let row = 0; row < matrix.length; row++) {
      // console.log(row + '-----------')
      let rowAvailableIndexs = [];
      let colAvailableIndexs = [];
      for (let col = 0; col < matrix[0].length; col++) {
        if (matrix[row][col] === this.EMPTY_ITEM_SIGN) {
          rowAvailableIndexs.push(col);
        }
        if (matrix[col][row] === this.EMPTY_ITEM_SIGN) {
          colAvailableIndexs.push(col);
        }
      }
      // console.log('rowAvailableIndexs: ' + rowAvailableIndexs, 'isContinuous: ' + this.isContinuous(rowAvailableIndexs, Direction.Row, row));
      // console.log('colAvailableIndexs: ' + colAvailableIndexs, 'isContinuous: ' + this.isContinuous(colAvailableIndexs, Direction.Col, row));
      if (rowAvailableIndexs.length >= this.TICKER_CODE_SIZE && this.isContinuous(rowAvailableIndexs, Direction.Row, row)) {
        rows.push(row);
      }
      if (colAvailableIndexs.length >= this.TICKER_CODE_SIZE && this.isContinuous(colAvailableIndexs, Direction.Col, row)) {
        cols.push(row);
      }
    }
  }

  getStartIndex(matrix: string [][], direction: Direction, index: number) {
    let items = []
    if (direction === Direction.Row) {
      // extract row index
      for (let i = 0; i < matrix.length; i++) {
        items.push(matrix[index][i]);
      }
    } else {
      // extract col index
      for (let i = 0; i < matrix.length; i++) {
        items.push(matrix[i][index]);
      }
    }
    let satisfiedItems = [];
    for (let i = 0; i < items.length - this.TICKER_CODE_SIZE; i++) {
      let count = 0;
      for (let j = 0; j < this.TICKER_CODE_SIZE; j++) {
        if (items[i + j] == this.EMPTY_ITEM_SIGN) {
          count++;
        }
      }
      if (count >= this.TICKER_CODE_SIZE) {
        satisfiedItems.push(i);
      }
    }
    return satisfiedItems[Math.floor(Math.random() * satisfiedItems.length)];
  }

  generateLevelData(index: number) {
    const tickerList = tickers.sort((a, b) => 0.5 - Math.random()).slice(0, this.TICKER_PER_LEVEL);
    const question = tickerList.map((item) => item.name);
    const answer = tickerList.map((item) => item.code.toLowerCase());
    console.log(question, answer);
    let matrix = [
      ['-', '-', '-', '-', '-', '-'],
      ['-', '-', '-', '-', '-', '-'],
      ['-', '-', '-', '-', '-', '-'],
      ['-', '-', '-', '-', '-', '-'],
      ['-', '-', '-', '-', '-', '-'],
      ['-', '-', '-', '-', '-', '-'],
    ];
    let rowsAvailable = [0, 1, 2, 3, 4, 5];
    let colsAvailable = [0, 1, 2, 3, 4, 5];
    for (let code of answer) {
      // console.log('code: ' + code + ' ------------------ ');
      // console.log('rows available: ' + rowsAvailable);
      // console.log('cols available: ' + colsAvailable);
      let direction = Math.random() > 0.5 ? Direction.Row : Direction.Col;
      if (direction === Direction.Row) {
        let rowToPlace = rowsAvailable[Math.floor(Math.random() * rowsAvailable.length)];
        let startIndex = this.getStartIndex(matrix, direction, rowToPlace);
        // console.log('place row: ' + rowToPlace + ' : ' + startIndex);
        for(let i=0; i<code.length; i++) {
          matrix[rowToPlace][startIndex] = code[i];
          startIndex++;
        }
      } else {
        let colToPlace = colsAvailable[Math.floor(Math.random() * colsAvailable.length)];
        let startIndex = this.getStartIndex(matrix, direction, colToPlace);
        // console.log('place col: ' + colToPlace + ' : ' + startIndex);
        for(let i=0; i<code.length; i++) {
          matrix[startIndex][colToPlace] = code[i];
          startIndex++;
        }
      }
      rowsAvailable = []
      colsAvailable = []
      this.getAvailableRowsAndColumn(matrix,  rowsAvailable, colsAvailable);
    }
    for(let row = 0; row< matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        let item = matrix[row][col];
        if (item === this.EMPTY_ITEM_SIGN) {
          matrix[row][col] = this.characters[Math.floor(Math.random() * this.characters.length)];
        }
      }
    }
    console.log(matrix);
    return new LevelData(index, matrix, question, answer);
  }

  unitTestGetAvailableRowsAndColumn() {
    let matrix = [
      ['s', '-', '-', '-', '-', '-'],
      ['d', '-', '-', '-', '-', '-'],
      ['g', '-', '-', '-', 'a', '-'],
      ['-', '-', '-', '-', 't', '-'],
      ['-', '-', '-', '-', 'p', '-'],
      ['-', '-', '-', '-', '-', '-']
    ]
    let rows: number[] = [];
    let cols: number[] = []
    console.log('*****************************');
    this.getAvailableRowsAndColumn(matrix, rows, cols);
    console.log(matrix);
    console.log(rows);
    console.log(cols);
    console.log('*****************************');
  }

  async getTextures(gl: WebGLRenderingContext) {
    for (let character of this.characters) {
      let texture = await Texture.load(gl, './images/azpink/' + character + '.png')
      this.texturesNone.push(texture);
      texture = await Texture.load(gl, './images/aztran/' + character + '.png')
      this.texturesSelected.push(texture);
      texture = await Texture.load(gl, './images/azblue/' + character + '.png');
      this.texturesCorrected.push(texture);
    }
  }
}
