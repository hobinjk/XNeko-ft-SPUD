import { ActionManager } from './ActionManager.js';
import { Neko, catNames } from './Neko.js';
import { Prop } from './Prop.js';
import { BedTemplate, BookshelfTemplate } from './PropTemplate.js';


const cats = catNames.map(name => new Neko(name));
const props = [];
const bedTemplate = new BedTemplate();
const bsTemplate = new BookshelfTemplate();

for (let i = 0; i < 10; i++) {
  let x = Math.round((Math.random() * 0.8 + 0.1) * window.innerWidth / 16) * 16;
  let y = Math.round((Math.random() * 0.8 + 0.1) * window.innerHeight / 16) * 16;

  props.push(new Prop(x, y, bsTemplate));
}

for (let i = 0; i < 10; i++) {
  let x = Math.round((Math.random() * 0.8 + 0.1) * window.innerWidth / 16) * 16;
  let y = Math.round((Math.random() * 0.8 + 0.1) * window.innerHeight / 16) * 16;

  props.push(new Prop(x, y, bedTemplate));
}

let actionManager = new ActionManager(cats, props, false);
function update() {
  actionManager.update();
  window.requestAnimationFrame(update);
}

update();
