import { silhouette, kMeans, distanceSquared, distance } from "./kmeans.js";
import { catNames } from "./Neko.js";

const DEBUG = false;

const usedNames = {};

export async function getBestSpritesheetForImage(image) {
  let canvas = document.createElement('canvas');
  let width = 64;
  let height = 64;
  canvas.width = width;
  canvas.height = height;
  let gfx = canvas.getContext('2d');
  gfx.drawImage(image, 0, 0, width, height);
  let imageData = gfx.getImageData(0, 0, width, height);
  let bestClusters = palettize(imageData);
  let bestScore = 0;
  let bestName = null;
  let scoredNames = [];
  for (let name of Object.keys(spritesheets)) {
    let sheet = spritesheets[name];
    if (!sheet) {
      continue;
    }
    let score = getSpritesheetScore(sheet, bestClusters);
    if (name === 'kina-nothoughts') {
      score += 0.1;
    } else if (name === 'air') {
      score += 0.04;
    } else if (name === 'spirit') {
      score += 0.04;
    }
    scoredNames.push({ score, name });
  }
  scoredNames.sort((a, b) => {
    return a.score - b.score;
  });
  bestScore = scoredNames[0].score;
  bestName = scoredNames[0].name;

  if (bestName) {
    console.log('best', bestName, scoredNames);
    if (!usedNames[bestName]) {
      usedNames[bestName] = 0;
    }
    usedNames[bestName] += 1;
    console.log(usedNames);
    return await getPalettedSpritesheet(spritesheets[bestName], bestClusters);
  } else {
    console.error('unable to find spritesheet');
  }
}

function palettize(imageData) {
  let points = [];
  for (let y = 0; y < Math.min(imageData.height, imageData.width); y++) {
    for (let x = y % 3; x < imageData.width; x += 3) {
      let r = imageData.data[(y * imageData.width + x) * 4 + 0]
      let g = imageData.data[(y * imageData.width + x) * 4 + 1]
      let b = imageData.data[(y * imageData.width + x) * 4 + 2]
      points.push({
        x: r,
        y: g,
        z: b,
      });
    }
  }

  // let bestClusters = null;
  // let bestScore = -100;

  let allClusters = [];
  // for (let k = 2; k < 10; k++) {
  const k = 8;
  let clusters = kMeans(k, points);
  allClusters.push(clusters);
  // let score = silhouette(points, clusters);
  // if (score > bestScore) {
  //   bestScore = score;
  //   bestClusters = clusters;
  // }
  // }
  // bestClusters = allClusters[6];

  // console.log(bestScore, bestClusters);
  if (DEBUG) {
    drawPalettes(allClusters);
  }
  return clusters;
}

function drawPalettes(allClusters) {
  let canvas = document.createElement('canvas');
  let scale = 32;
  canvas.width = scale * allClusters.length;
  canvas.height = scale * allClusters.at(-1).length;
  let gfx = canvas.getContext('2d');
  for (let i = 0; i < allClusters.length; i++) {
    let clusters = allClusters[i];
    for (let j = 0; j < clusters.length; j++) {
      let point = clusters[j];
      gfx.fillStyle = `rgb(${Math.round(point.x)}, ${Math.round(point.y)}, ${Math.round(point.z)})`;
      gfx.fillRect(i * scale, j * scale, scale, scale);
    }
  }

  document.body.appendChild(canvas);
}

function loadSpritesheet(url) {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.src = url;
    // image.crossOrigin = 'anonymous';
    image.onload = () => {
      let canvas = document.createElement('canvas');
      let width = image.naturalWidth;
      let height = image.naturalHeight;
      canvas.width = width;
      canvas.height = height;
      let gfx = canvas.getContext('2d');
      gfx.drawImage(image, 0, 0, width, height);
      let imageData = gfx.getImageData(0, 0, width, height);
      resolve(imageData);
    };
    image.onerror = (error) => {
      console.error('loadSpritesheet error', error);
      reject(error);
    };
  });
}

function getSpritesheetScore(imageData, bestClusters) {
  let score = 0;
  let scoreCount = 0;

  let height = imageData.height;
  let width = imageData.width;
  let uses = new Array(bestClusters.length).fill(0);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let minDist = 256 * 256 * 3;
      let assignment = 0;
      let r = imageData.data[(y * imageData.width + x) * 4 + 0]
      let g = imageData.data[(y * imageData.width + x) * 4 + 1]
      let b = imageData.data[(y * imageData.width + x) * 4 + 2]
      let a = imageData.data[(y * imageData.width + x) * 4 + 3]
      if (a < 10) {
        continue;
      }

      let point = {
        x: r,
        y: g,
        z: b,
      };
      for (let i = 0; i < bestClusters.length; i++) {
        let dist = distance(point, bestClusters[i]);
        if (dist >= minDist) {
          continue;
        }
        assignment = i;
        minDist = dist;
      }
      score += minDist;
      scoreCount += 1;
      uses[assignment] += 1;
    }
  }
  let entropy = 0;
  for (let i = 0; i < bestClusters.length; i++) {
    if (uses[i] === 0) {
      continue;
    }
    entropy -= uses[i] / scoreCount * Math.log(uses[i] / scoreCount);
  }
  console.log('entropy', entropy);
  return -entropy;
  // return score / scoreCount;
}

function getPalettedSpritesheet(imageData, bestClusters) {
  let width = imageData.width;
  let height = imageData.height;
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  let gfx = canvas.getContext('2d');
  let outID = gfx.getImageData(0, 0, width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let minDist = 256 * 256 * 3;
      let assignment = 0;
      let r = imageData.data[(y * imageData.width + x) * 4 + 0]
      let g = imageData.data[(y * imageData.width + x) * 4 + 1]
      let b = imageData.data[(y * imageData.width + x) * 4 + 2]
      let a = imageData.data[(y * imageData.width + x) * 4 + 3]
      if (a < 10) {
        continue;
      }

      let point = {
        x: r,
        y: g,
        z: b,
      };
      for (let i = 0; i < bestClusters.length; i++) {
        let dist = distanceSquared(point, bestClusters[i]);
        if (dist >= minDist) {
          continue;
        }
        assignment = i;
        minDist = dist;
      }
      let newPoint = bestClusters[assignment];

      outID.data[(y * imageData.width + x) * 4 + 0] = newPoint.x;
      outID.data[(y * imageData.width + x) * 4 + 1] = newPoint.y;
      outID.data[(y * imageData.width + x) * 4 + 2] = newPoint.z;
      outID.data[(y * imageData.width + x) * 4 + 3] = a;
    }
  }
  gfx.putImageData(outID, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob(blob => {
      resolve(URL.createObjectURL(blob));
    }, 'image/png');
  });
}


let spritesheets = {};

async function loadSpritesheets() {
  for (let name of catNames) {
    let url = browser.runtime.getURL(`/features/xneko/spritesheets/${name}.png`);
    spritesheets[name] = await loadSpritesheet(url);
  }
  console.log('done', spritesheets);
}

loadSpritesheets();
