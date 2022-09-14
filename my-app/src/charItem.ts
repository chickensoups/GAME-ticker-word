import {Texture, Vector2} from 'gdxts';

export enum CharItemStatus {
  None,
  Selected,
  Corrected
}

export class CharItem {
  public position: Vector2;
  public width: number;
  public height: number;
  public status: CharItemStatus;
  public textureName: string;
  public textures: Texture[];

  constructor(textureName:string, position: Vector2, width: number, height: number, status: CharItemStatus = CharItemStatus.None) {
    this.textureName = textureName;
    this.textures = [];
    this.position = position;
    this.width = width;
    this.height = height;
    this.status = status;
  }
}
