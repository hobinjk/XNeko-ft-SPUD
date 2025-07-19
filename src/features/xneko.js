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

const DEBUG = false;

const nekoProcessedClass = 'xneko-processed';
const blogLinkSelector = keyToCss('blogLink');

const alreadyProcessed = postElement =>
  postElement.classList.contains(nekoProcessedClass);

const KEY_SCHEDULED_CATS = 'xneko.scheduledCats';
const KEY_KNOWN_CATS = 'xneko.knownCats';
const KEY_PROPS = 'xneko.props';
const KEY_PROP_SRCS = 'xneko.propSrcs';
const MAX_SCHEDULED_CATS = 1024;

const storedData = {
  [KEY_SCHEDULED_CATS]: [],
  [KEY_PROPS]: [],
  [KEY_PROP_SRCS]: [],
};

const storedDataDefaults = {
  [KEY_PROP_SRCS]: [],
  [KEY_PROPS]: [],
  [KEY_KNOWN_CATS]: {},
  [KEY_SCHEDULED_CATS]: [],
};

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

function knownCatsStorageKey(name) {
  let shard = name.substr(0, 3);
  return `${KEY_KNOWN_CATS}.${shard}`;
}

async function scheduleNeko(name, time, avatarImg, postUrl) {
  await waitForImgLoad(avatarImg);
  await readStoredData(knownCatsStorageKey(name));
  const avatarSrc = avatarImg.srcset.split(' ')[0];
  let knownCat = storedData[knownCatsStorageKey(name)][name];
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
    if (DEBUG) console.log('new cat', name);
    storedData[knownCatsStorageKey(name)][name] = {
      avatarSrc,
      palette: results.palette,
      sheetName: results.sheetName,
      data: {
        visitCount: 0,
        avatarSrc,
        postUrl,
      },
    };
    await persistStoredData(knownCatsStorageKey(name));
  }
  if (DEBUG) {
    console.log('schedule', {
      time,
      name,
    });
  }
  let alreadyScheduledLater = false;
  for (let scheduledCat of storedData[KEY_SCHEDULED_CATS]) {
    if (scheduledCat.name !== name) {
      continue;
    }
    if (scheduledCat.time < time) {
      return;
    }
    alreadyScheduledLater = true;
    scheduledCat.time = time;
    break;
  }
  if (storedData[KEY_SCHEDULED_CATS].length > MAX_SCHEDULED_CATS) {
    storedData[KEY_SCHEDULED_CATS].splice(Math.floor((Math.random() + 0.5) * MAX_SCHEDULED_CATS / 4), Math.floor(MAX_SCHEDULED_CATS / 8));
  }
  if (!alreadyScheduledLater) {
    insertSorted(storedData[KEY_SCHEDULED_CATS], {
      time,
      name,
    });
  }
  await persistStoredData(KEY_SCHEDULED_CATS);
}

async function spawnCat(name) {
  await readStoredData(knownCatsStorageKey(name));
  const knownCat = storedData[knownCatsStorageKey(name)][name];
  if (!knownCat) {
    console.warn('never seen this cat before in my life', name);
    return;
  }
  let sheetUrl = await getSpritesheetFromSavedResults(knownCat.sheetName, knownCat.palette);
  if (!sheetUrl) {
    console.error('unable to generate spritesheet for cat', knownCat);
    return;
  }
  if (!knownCat.data.visitCount) {
    knownCat.data.visitCount = 0;
  }
  knownCat.data.visitCount += 1;
  let visitDuration = 30000 + (Math.random() + Math.random()) * 120000;
  cats.push(new Neko(actionManager, name, sheetUrl, visitDuration, knownCat.data));
  await persistStoredData(knownCatsStorageKey(name));
}

async function readStoredData(key) {
  let data = await browser.storage.local.get(key);

  if (!data || !data[key]) {
    data = storedDataDefaults;
    if (key.startsWith(KEY_KNOWN_CATS)) {
      data[key] = storedDataDefaults[KEY_KNOWN_CATS];
    }
  }
  storedData[key] = data[key];
}

async function persistStoredData(key) {
  await browser.storage.local.set({ [key]: storedData[key] });
}

let running = false;
export const main = async function() {
  await readStoredData(KEY_KNOWN_CATS);
  if (Object.keys(storedData[KEY_KNOWN_CATS]).length > 0) {
    await migrateKnownCats();
  }
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
let checkDelayMs = 4000;

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
  storedData[KEY_PROPS] = props;
  if (DEBUG) console.log('yep props', props);
  storedData[KEY_PROP_SRCS] = srcs;
  await persistStoredData(KEY_PROPS);
  await persistStoredData(KEY_PROP_SRCS);
}

async function migrateKnownCats() {
  await readStoredData(KEY_KNOWN_CATS);
  const knownCatShards = {};
  for (const catName in storedData[KEY_KNOWN_CATS]) {
    const key = knownCatsStorageKey(catName);
    if (!knownCatShards.hasOwnProperty(key)) {
      knownCatShards[key] = {};
    }
    knownCatShards[key][catName] = storedData[KEY_KNOWN_CATS][catName];
  }

  Object.assign(storedData, knownCatShards);
  for (const storageKey in knownCatShards) {
    await persistStoredData(storageKey);
  }
  storedData[KEY_KNOWN_CATS] = {};
  await persistStoredData(KEY_KNOWN_CATS);
}

async function restoreProps() {
  await readStoredData(KEY_PROPS);
  await readStoredData(KEY_PROP_SRCS);
  for (let prop of storedData[KEY_PROPS]) {
    let oldSrc = prop.src;
    prop.src = storedData[KEY_PROP_SRCS][prop.src];
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
  if (storedData[KEY_SCHEDULED_CATS].length === 0) {
    return;
  }
  let nextCat = storedData[KEY_SCHEDULED_CATS][0];
  if (nextCat.time > Date.now()) {
    if (DEBUG) console.log(`next cat in ${Math.round((nextCat.time - Date.now()) / 1000)}s`);
    return;
  }
  storedData[KEY_SCHEDULED_CATS].shift();

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
