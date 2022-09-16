import {
  BitmapFont,
  createGameLoop,
  createStage,
  createViewport,
  InputEvent,
  PolygonBatch,
  Vector2,
  ViewportInputHandler
} from 'gdxts';
import {CharItem, CharItemStatus} from './charItem';
import {LevelData} from './levelData';
import {LevelUtils} from './levelUtils';

const initCharItems = async (levelData: LevelData, levelUtils: LevelUtils) => {
  const tileWidth: number = 100;
  const tileHeight: number = 100;
  const charItems: CharItem[] = []
  for (let i = 0; i < levelData.chars.length; i++) {
    let row = levelData.chars[i];
    for (let j = 0; j < row.length; j++) {
      const textureName = row[j];
      const position = new Vector2(i * tileWidth, j * tileHeight);
      const characterIndex = levelUtils.characters.indexOf(textureName);
      const randomNumber = 0; // Math.floor(Math.random()*3);
      const charItem = new CharItem(j, i, textureName, position, tileWidth, tileHeight, randomNumber);
      const textureNone = levelUtils.texturesNone[characterIndex];
      const textureSelected = levelUtils.texturesSelected[characterIndex];
      const textureCorrected = levelUtils.texturesCorrected[characterIndex];
      charItem.textures.push(textureNone);
      charItem.textures.push(textureSelected);
      charItem.textures.push(textureCorrected);
      charItems.push(charItem);
    }
  }
  return charItems;
}

const init = async () => {
  const stage = createStage();
  const canvas = stage.getCanvas();

  const viewport = createViewport(canvas, 500, 1000, {
    crop: false
  });
  const gl = viewport.getContext();
  const camera = viewport.getCamera();
  const Y_DOWN = true
  camera.setYDown(Y_DOWN);
  const batch = new PolygonBatch(gl);
  batch.setYDown(true);

  // Set up input handler
  let touched = false;
  let touchedCharItems: CharItem[] = [];
  let touchedCharItemSet = new Set();
  let touchedCharItemsDirection = ''
  const inputHandler = new ViewportInputHandler(viewport);
  inputHandler.addEventListener(InputEvent.TouchStart, (x, y) => {
    const coord = inputHandler.getTouchedWorldCoord();
    for (let charItem of charItems) {
      if (charItem.status === CharItemStatus.Corrected || touchedCharItemSet.has(charItem.getIndex()) || !charItem.isCoverPoint(coord)) {
        continue;
      }
      touchedCharItems.push(charItem)
      touchedCharItemSet.add(charItem.getIndex());
      charItem.status = CharItemStatus.Selected
    }
    touched = true
  });

  inputHandler.addEventListener(InputEvent.TouchMove, (x, y) => {
    const coord = inputHandler.getTouchedWorldCoord();
    if (touched) {
      for (let charItem of charItems) {
        if(touchedCharItems.length > 2 || charItem.status === CharItemStatus.Corrected || touchedCharItemSet.has(charItem.getIndex()) || !charItem.isCoverPoint(coord)) {
          continue;
        }
        if (touchedCharItems.length === 0) {
          touchedCharItems.push(charItem)
          touchedCharItemSet.add(charItem.getIndex());
          charItem.status = CharItemStatus.Selected
        } else if (touchedCharItems.length === 1) {
          if(charItem.isSibling(touchedCharItems[0])) {
            touchedCharItems.push(charItem)
            touchedCharItemSet.add(charItem.getIndex());
            charItem.status = CharItemStatus.Selected
            // find the direction
            touchedCharItemsDirection = charItem.getDirection(touchedCharItems[0]);
          }
        } else {
          const lastTouchedCharItem = touchedCharItems[touchedCharItems.length - 1]
          if(!charItem.isSibling(lastTouchedCharItem) ||  charItem.getDirection(lastTouchedCharItem) !== touchedCharItemsDirection) {
            break;
          }
          touchedCharItems.push(charItem)
          touchedCharItemSet.add(charItem.getIndex());
          charItem.status = CharItemStatus.Selected
        }
        break;
      }
    }
  });

  inputHandler.addEventListener(InputEvent.TouchEnd, (x, y) => {
    console.log('touch end');
    // Validate selected with answer
    let selectedStr = ''
    for (let touchedCharItem of touchedCharItems) {
      selectedStr += touchedCharItem.textureName;
    }
    let selectedStrReversed = selectedStr.split('').reverse().join(''); // Handle the reversed case, eg: vnm or mnv is ok
    for(let answer of levelData.answer) {
      if(answer === selectedStr || answer === selectedStrReversed) {
        for (let touchedCharItem of touchedCharItems) {
          touchedCharItem.status = CharItemStatus.Corrected;
        }
        break;
      }
    }

    touched = false;
    touchedCharItems = [];
    touchedCharItemSet.clear();
    touchedCharItemsDirection = '';

    // Reset char item status
    for (let charItem of charItems) {
      if (charItem.status !== CharItemStatus.Corrected) {
        charItem.status = CharItemStatus.None;
      }
    }
  });


  const levelUtils = new LevelUtils();
  await levelUtils.getTextures(gl);
  const levelData: LevelData = levelUtils.getLevelData();
  const charItems = await initCharItems(levelData, levelUtils)

  // const font = await BitmapFont.load(gl, './arialbm.fnt', Y_DOWN, false);
  // font.draw(batch, 'dcm', 0,0, 100);

  gl.clearColor(0, 0, 0, 1);
  createGameLoop((delta: number) => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    batch.setProjection(camera.projectionView.values);
    batch.begin();

    // Draw the level data content
    for (let charItem of charItems) {
      const texture = charItem.status === CharItemStatus.None ? charItem.textures[0] :
        charItem.status === CharItemStatus.Selected ? charItem.textures[1] : charItem.textures[2];
      batch.draw(texture, charItem.position.x, charItem.position.y, charItem.width, charItem.height);
    }
    batch.end();

    // Draw level question


  });
};

init().then(r => {
});

export {};
