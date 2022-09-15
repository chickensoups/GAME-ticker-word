import {LevelData} from './levelData';
import {Texture} from 'gdxts';

export class LevelUtils {
  characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  texturesNone: Texture[] = [];
  texturesSelected: Texture[] = [];
  texturesCorrected: Texture[] = [];

  getLevelData() {
    const chars = [
      ['f', 'p', 't', 'd', 'e'],
      ['v', 'g', 'h', 'i', 'j'],
      ['c', 'l', 'm', 'n', 'o'],
      ['i', 'q', 'r', 's', 't'],
      ['u', 'v', 'v', 'n', 'm']
    ];
    const question = ['Công ty cổ phần FPT', 'Chứng khoán Bản Việt', 'Công ty sữa Vinamilk'];
    const answer = ['fpt', 'vci', 'vnm'];
    return new LevelData(1, chars, question, answer);
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
