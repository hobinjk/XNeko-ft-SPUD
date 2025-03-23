import { filterPostElements } from '../utils/interface.js';
import { timelineObject } from '../utils/react_props.js';
import { keyToCss } from '../utils/css_map.js';
import { onNewPosts } from '../utils/mutations.js';

import { ActionManager } from "./xneko/ActionManager.js";
import { Neko } from "./xneko/Neko.js";
import { Inventory } from './xneko/Inventory.js';
import { Settings } from './xneko/Settings.js';
import { bedTemplate, bookshelfTemplate } from './xneko/PropTemplate.js';
import { getBestPaletteAndSpritesheetForImage, getSpritesheetFromSavedResults } from "./xneko/palette.js";

const nekoProcessedClass = 'xneko-processed';
const blogLinkSelector = keyToCss('blogLink');

const alreadyProcessed = postElement =>
  postElement.classList.contains(nekoProcessedClass);

const KEY_SCHEDULED_CATS = 'xneko.scheduledCats';
const KEY_KNOWN_CATS = 'xneko.knownCats';

const storedData = {
  scheduledCats: [],
  knownCats: {},
};

const processPosts = function(postElements) {
  filterPostElements(postElements, { includeFiltered: true }).forEach(async postElement => {
    if (alreadyProcessed(postElement)) return;
    postElement.classList.add(nekoProcessedClass);
    const { postUrl, blog } = await timelineObject(postElement);

    const blogLinks = postElement.querySelectorAll(blogLinkSelector);
    if (blogLinks.length == 0) { return; }

    for (let blogLink of blogLinks) {
      let avatarImg = blogLink.querySelector('img');
      if (!avatarImg) {
        continue;
      }
      // Community? Other strangeness
      if (blog.name.startsWith('@')) {
        continue;
      }
      let time = Date.now(); // todo put them far out in the future
      scheduleNeko(blog.name, time, avatarImg, postUrl);
    }
  });
};

function waitForImgLoad(img) {
  return new Promise((resolve, reject) => {
    if (img.complete) {
      resolve();
      return;
    }
    img.onload = () => {
      resolve();
    }
    img.onerror = () => {
      reject();
    };
  });
}

async function scheduleNeko(name, time, avatarImg, postUrl) {
  await waitForImgLoad(avatarImg);
  await readStoredData(KEY_KNOWN_CATS);
  const avatarSrc = avatarImg.srcset.split(' ')[0];
  let knownCat = storedData.knownCats[name];
  if (!knownCat || knownCat.avatarSrc !== avatarSrc) {
    let coolerImage = new Image();
    coolerImage.crossOrigin = 'anonymous';
    coolerImage.src = avatarSrc;
    await waitForImgLoad(coolerImage);
    let results = await getBestPaletteAndSpritesheetForImage(coolerImage);
    if (!results) {
      console.warn('unable to generate spritesheet');
      return;
    }
    storedData.knownCats[name] = {
      avatarSrc,
      palette: results.palette,
      sheetName: results.sheetName,
      data: {
        avatarSrc,
        postUrl,
      },
    };
    await persistStoredData(KEY_KNOWN_CATS);
  }
  storedData.scheduledCats.push({
    time,
    name,
  });
  await persistStoredData(KEY_SCHEDULED_CATS);
}

async function spawnCat(name) {
  await readStoredData(KEY_KNOWN_CATS);
  const knownCat = storedData.knownCats[name];
  if (!knownCat) {
    console.warn('never seen this cat before in my life', name);
    return;
  }
  let sheetUrl = await getSpritesheetFromSavedResults(knownCat.sheetName, knownCat.palette);
  if (!sheetUrl) {
    console.error('unable to generate spritesheet for cat', knownCat);
    return;
  }
  cats.push(new Neko(actionManager, name, sheetUrl, knownCat.data));
}

async function readStoredData(key) {
  switch (key) {
    case KEY_KNOWN_CATS:
      const { [KEY_KNOWN_CATS]: knownCats = {} } = await browser.storage.local.get(KEY_KNOWN_CATS);
      storedData.knownCats = knownCats;
      break;
    case KEY_SCHEDULED_CATS:
      const { [KEY_SCHEDULED_CATS]: scheduledCats = [] } = await browser.storage.local.get(KEY_SCHEDULED_CATS);
      storedData.scheduledCats = scheduledCats;
      break;
    default: {
      const { [KEY_KNOWN_CATS]: knownCats = {} } = await browser.storage.local.get(KEY_KNOWN_CATS);
      storedData.knownCats = knownCats;
      const { [KEY_SCHEDULED_CATS]: scheduledCats = [] } = await browser.storage.local.get(KEY_SCHEDULED_CATS);
      storedData.scheduledCats = scheduledCats;
    }
      break;
  }
}

async function persistStoredData(key) {
  switch (key) {
    case KEY_KNOWN_CATS:
      await browser.storage.local.set({ [KEY_KNOWN_CATS]: storedData.knownCats });
      break;
    case KEY_SCHEDULED_CATS:
      await browser.storage.local.set({ [KEY_SCHEDULED_CATS]: storedData.scheduledCats });
      break;
    default:
      await browser.storage.local.set({ [KEY_KNOWN_CATS]: storedData.knownCats });
      await browser.storage.local.set({ [KEY_SCHEDULED_CATS]: storedData.scheduledCats });
      break;
  }
}

let running = false;
export const main = async function() {
  await readStoredData();
  onNewPosts.addListener(processPosts);
  running = true;
  update();
};

export const clean = async function() {
  onNewPosts.removeListener(processPosts);
  for (let cat of cats) {
    cat.remove();
  }
  running = false;
}

export const stylesheet = true;

let lastCheckForScheduledCats = Date.now();
let checkDelayMs = 1000;

let cats = [];
// Preview
let actionManager = new ActionManager(cats, [], false);
function update() {
  actionManager.update();
  const now = Date.now();
  if (lastCheckForScheduledCats + checkDelayMs < now) {
    lastCheckForScheduledCats = now;
    checkForScheduledCats();
  }
  if (running) {
    window.requestAnimationFrame(update);
  }
}

async function checkForScheduledCats() {
  await readStoredData(KEY_SCHEDULED_CATS);
  if (storedData.scheduledCats.length === 0) {
    return;
  }
  let nextCat = storedData.scheduledCats[0];
  if (nextCat.time > Date.now()) {
    return;
  }
  let alreadyVisiting = false;
  for (let cat of cats) {
    if (cat.name === nextCat.name) {
      alreadyVisiting = true;
      break;
    }
  }
  if (!alreadyVisiting) {
    spawnCat(nextCat.name);
  }
  storedData.scheduledCats.shift();
  await persistStoredData(KEY_SCHEDULED_CATS);
}

const inventory = new Inventory(
  new Settings(),
  actionManager, [
  bedTemplate,
  bookshelfTemplate,
]);
inventory.add();
