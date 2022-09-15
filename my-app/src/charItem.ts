import {Texture, Vector2} from 'gdxts';

export enum CharItemStatus {
  None,
  Selected,
  Corrected
}

export class CharItem {
  public row: number;
  public col: number;
  public position: Vector2;
  public width: number;
  public height: number;
  public status: CharItemStatus;
  public textureName: string;
  public textures: Texture[];

  constructor(row: number, col: number, textureName:string, position: Vector2, width: number, height: number, status: CharItemStatus = CharItemStatus.None) {
    this.row = row;
    this.col = col;
    this.textureName = textureName;
    this.textures = [];
    this.position = position;
    this.width = width;
    this.height = height;
    this.status = status;
  }

  isCoverPoint(point: Vector2) {
    return this.position.x < point.x && point.x < this.position.x + this.width && this.position.y < point.y && point.y < this.position.y + this.height;
  }

  getIndex() {
    return this.row + '_' + this.col;
  }

  getDirection(other: CharItem) {
    if (this.row === other.row) {
      return 'x'
    } else if (this.col === other.col) {
      return 'y'
    }
    return ''
  }

  isSibling(other: CharItem) {
    return Math.abs(this.row - other.row + this.col - other.col) === 1;
  }
}
