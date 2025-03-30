import { filterPostElements } from '../utils/interface.js';
import { timelineObject } from '../utils/react_props.js';
import { keyToCss } from '../utils/css_map.js';
import { onNewPosts } from '../utils/mutations.js';

import { ActionManager } from "./xneko/ActionManager.js";
import { Neko } from "./xneko/Neko.js";
import { Inventory } from './xneko/Inventory.js';
import { Settings } from './xneko/Settings.js';
import { templates } from './xneko/PropTemplate.js';
import { getBestPaletteAndSpritesheetForImage, getSpritesheetFromSavedResults } from "./xneko/palette.js";
import { Prop } from './xneko/Prop.js';

const nekoProcessedClass = 'xneko-processed';
const blogLinkSelector = keyToCss('blogLink');

const alreadyProcessed = postElement =>
  postElement.classList.contains(nekoProcessedClass);

const KEY_SCHEDULED_CATS = 'xneko.scheduledCats';
const KEY_KNOWN_CATS = 'xneko.knownCats';
const KEY_PROPS = 'xneko.props';
const KEY_PROP_SRCS = 'xneko.propSrcs';

const storedData = {
  scheduledCats: [],
  knownCats: {},
  props: [],
  propSrcs: [],
};

const storedDataDefaults = {
  [KEY_PROP_SRCS]: [],
  [KEY_PROPS]: [],
  [KEY_KNOWN_CATS]: {},
  [KEY_SCHEDULED_CATS]: [],
};
const allKeys = Object.keys(storedDataDefaults);

const blogNameReA = /:\/\/([^.]+)\.tumblr\.com/;
const blogNameReB = /:\/\/www\.tumblr\.com\/([^/]+)/;

function getCatDelay() {
  // Short horizon (0-2m)
  if (Math.random() < 0.2 || cats.length === 0) {
    return Math.random() * 120000;
  }
  // Medium horizon (30m-2 h)
  if (Math.random() < 0.3) {
    return (30 + 90 * Math.random()) * 60 * 1000;
  }

  // Long horizon 1-48h
  return (1 + 47 * Math.random()) * 60 * 60 * 1000;
}

const processPosts = function(postElements) {
  filterPostElements(postElements, { includeFiltered: true }).forEach(async postElement => {
    if (alreadyProcessed(postElement)) return;
    postElement.classList.add(nekoProcessedClass);
    const { postUrl } = await timelineObject(postElement);

    const blogLinks = postElement.querySelectorAll(blogLinkSelector);
    if (blogLinks.length == 0) { return; }

    for (let blogLink of blogLinks) {
      let avatarImg = blogLink.querySelector('img');
      if (!avatarImg) {
        continue;
      }
      let blogNameMatchesA = blogNameReA.exec(blogLink.href);
      let blogNameMatchesB = blogNameReB.exec(blogLink.href);
      let blogNameMatches = blogNameMatchesB || blogNameMatchesA;
      if (!blogNameMatches) {
        continue;
      }
      let blogName = blogNameMatches[1];
      if (!blogName) {
        continue;
      }

      if (Math.random() > 1 / 5 && cats.length > 0) {
        // Arbitrarily discard 4/5ths of potential cats
        continue;
      }

      let time = Date.now() + getCatDelay();
      scheduleNeko(blogName, time, avatarImg, postUrl);
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

function insertSorted(scheduledCats, schedCat) {
  if (scheduledCats.length === 0) {
    scheduledCats.push(schedCat);
    return;
  }

  // TODO rewrite as binary search if perf ever becomes a concern
  // but like inserting is O(n) anyway so uhhhh
  let i = 0;
  for (; i < scheduledCats.length; i++) {
    if (scheduledCats[i].time > schedCat.time) {
      break;
    }
  }
  scheduledCats.splice(i, 0, schedCat);
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
        visitCount: 0,
        avatarSrc,
        postUrl,
      },
    };
    await persistStoredData(KEY_KNOWN_CATS);
  }
  console.log('schedule', {
    time,
    name,
  });
  insertSorted(storedData.scheduledCats, {
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
  knownCat.data.visitCount += 1;
  let visitDuration = 30000 + (Math.random() + Math.random()) * 120000;
  cats.push(new Neko(actionManager, name, sheetUrl, visitDuration, knownCat.data));
  await persistStoredData(KEY_KNOWN_CATS);
}

async function readAllStoredData() {
  for (const key of allKeys) {
    await readStoredData(key);
  }
}

async function readStoredData(key) {
  let data = await browser.storage.local.get(key);

  if (!data || !data[key]) {
    data = storedDataDefaults;
  }
  const keyWithoutPrefix = key.split('.')[1];
  storedData[keyWithoutPrefix] = data[key];
}

// async function persistAllStoredData() {
//   for (const key of allKeys) {
//     await persistStoredData(key);
//   }
// }

async function persistStoredData(key) {
  const keyWithoutPrefix = key.split('.')[1];
  await browser.storage.local.set({ [key]: storedData[keyWithoutPrefix] });
}

let running = false;
export const main = async function() {
  await readAllStoredData();
  await restoreProps();
  onNewPosts.addListener(processPosts);
  running = true;
  update();
};

export const clean = async function() {
  onNewPosts.removeListener(processPosts);
  for (let cat of cats) {
    cat.remove();
  }
  cats = [];
  running = false;
}

export const stylesheet = true;

let lastCheckForScheduledCats = Date.now();
let checkDelayMs = 1000;

let cats = [];
// Preview
let actionManager = new ActionManager(cats, [], false);

let scheduledPersistProps = null;

function onPropChange() {
  if (scheduledPersistProps) {
    return;
  }
  scheduledPersistProps = setTimeout(async () => {
    try {
      await persistProps();
    } catch (e) {
      console.error('unable to persist props', e);
    }
    scheduledPersistProps = null;
  }, 500);
}

async function persistProps() {
  let srcs = [];
  let props = [];
  for (let prop of actionManager.props) {
    props.push(prop.serialize());
  }
  for (let prop of props) {
    let internedStrId = srcs.indexOf(prop.src);
    if (internedStrId < 0) {
      internedStrId = srcs.length;
      srcs.push(prop.src);
    }
    prop.src = internedStrId;
  }
  storedData.props = props;
  storedData.propSrcs = srcs;
  await persistStoredData(KEY_PROPS);
  await persistStoredData(KEY_PROP_SRCS);
}

async function restoreProps() {
  for (let prop of storedData.props) {
    let oldSrc = prop.src;
    prop.src = storedData.propSrcs[prop.src];
    actionManager.addProp(Prop.deserialize(prop, inventory));
    prop.src = oldSrc;
  }
  actionManager.addOnChange(onPropChange);
}

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
  storedData.scheduledCats.shift();

  let catCount = cats.length;
  let spawnProbability = (0.05 + (1 - catCount / settings.maxVisitingCats));
  if (Math.random() > spawnProbability) {
    // Arbitrarily don't spawn this cat
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
  await persistStoredData(KEY_SCHEDULED_CATS);
}

const settings = new Settings();
const inventory = new Inventory(
  settings,
  actionManager,
  templates,
);
inventory.add();
