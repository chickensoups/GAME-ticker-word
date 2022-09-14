import {createGameLoop, createStage, createViewport, PolygonBatch, Texture, Vector2} from 'gdxts';
import {CharItem, CharItemStatus} from './charItem';
import {LevelData} from './levelData';
import {LevelUtils} from './levelUtils';


const init = async () => {
  const stage = createStage();
  const canvas = stage.getCanvas();

  const viewport = createViewport(canvas, 500, 1000, {
    crop: false
  });
  const gl = viewport.getContext();
  const camera = viewport.getCamera();
  camera.setYDown(true);

  const batch = new PolygonBatch(gl);
  batch.setYDown(true);

  const levelUtils = new LevelUtils();

  const tileWidth: number = 100;
  const tileHeight: number = 100;
  const charItems: CharItem[] = [];
  await levelUtils.getTextures(gl);
  const levelData: LevelData = levelUtils.getLevelData();

  for (let i = 0; i < levelData.chars.length; i++) {
    let row = levelData.chars[i];
    for (let j = 0; j < row.length; j++) {
      const textureName = row[j];
      const position = new Vector2(i * tileWidth, j * tileHeight);
      const characterIndex = levelUtils.characters.indexOf(textureName);
      const randomNumber = 0; // Math.floor(Math.random()*3);
      const charItem = new CharItem(textureName, position, tileWidth, tileHeight, randomNumber);
      const textureNone = levelUtils.texturesNone[characterIndex];
      const textureSelected = levelUtils.texturesSelected[characterIndex];
      const textureCorrected = levelUtils.texturesCorrected[characterIndex];
      charItem.textures.push(textureNone);
      charItem.textures.push(textureSelected);
      charItem.textures.push(textureCorrected);
      charItems.push(charItem);
    }
  }

  gl.clearColor(0, 0, 0, 1);
  createGameLoop((delta: number) => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    batch.setProjection(camera.projectionView.values);
    batch.begin();
    for (let charItem of charItems) {
      const texture = charItem.status === CharItemStatus.None ? charItem.textures[0] :
        charItem.status === CharItemStatus.Selected ? charItem.textures[1] : charItem.textures[2];
      batch.draw(texture, charItem.position.x, charItem.position.y, charItem.width, charItem.height);
    }
    batch.end();
  });
};

init().then(r => {
});

export {};
