import { ActionManager } from './ActionManager.js';
import { Inventory } from './Inventory.js';
import { Neko, catNames } from './Neko.js';
import { bedTemplate, bookshelfTemplate } from './PropTemplate.js';
import { Settings } from './Settings.js';


const cats = catNames.map(name => new Neko(name));
const props = [];

let actionManager = new ActionManager(cats, props, false);

const inventory = new Inventory(
  new Settings(),
  actionManager, [
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
  bedTemplate,
  bookshelfTemplate,
]);
inventory.add();

function update() {
  actionManager.update();
  window.requestAnimationFrame(update);
}

update();
