import { filterPostElements } from '../utils/interface.js';
import { timelineObject } from '../utils/react_props.js';
import { keyToCss } from '../utils/css_map.js';
import { onNewPosts } from '../utils/mutations.js';

import { ActionManager } from "./xneko/ActionManager.js";
import { Neko } from "./xneko/Neko.js";
import { Inventory } from './xneko/Inventory.js';
import { Settings } from './xneko/Settings.js';
import { bedTemplate, bookshelfTemplate } from './xneko/PropTemplate.js';
import { getBestSpritesheetForImage } from "./xneko/palette.js";

const nekoProcessedClass = 'xneko-processed';
const blogLinkSelector = keyToCss('blogLink');

const alreadyProcessed = postElement =>
  postElement.classList.contains(nekoProcessedClass);

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
      scheduleNeko(blog.name, avatarImg, postUrl);
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

function sleep(ms) {
  return new Promise(res => {
    setTimeout(res, ms);
  });
}

let knownCats = {};
async function scheduleNeko(name, avatarImg, postUrl) {
  if (knownCats[name]) {
    // console.log('the cat is already spawning or spawned');
    return;
  }
  knownCats[name] = true;
  await sleep(10000 * Math.random() + 1000);

  // console.log('weee spawn', blogHref, avatarImg, postUrl);

  await waitForImgLoad(avatarImg);
  let coolerImage = new Image();
  coolerImage.crossOrigin = 'anonymous';
  const avatarSrc = avatarImg.srcset.split(' ')[0];
  coolerImage.src = avatarSrc;
  await waitForImgLoad(coolerImage);
  let sheetUrl = await getBestSpritesheetForImage(coolerImage);
  console.log('got', name, sheetUrl);
  cats.push(new Neko(name, sheetUrl, {
    avatarSrc,
    postUrl,
  }));
}

let running = false;
export const main = async function() {
  onNewPosts.addListener(processPosts);
  running = true;
  update();
};

export const clean = async function() {
  onNewPosts.removeListener(processPosts);
  running = false;
}

export const stylesheet = true;

let cats = [];
// Preview
let actionManager = new ActionManager(cats, [], false);
function update() {
  actionManager.update();
  if (running) {
    window.requestAnimationFrame(update);
  }
}

const inventory = new Inventory(
  new Settings(),
  actionManager, [
  bedTemplate,
  bookshelfTemplate,
]);
inventory.add();
