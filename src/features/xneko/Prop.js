import { PropTemplate } from "./PropTemplate.js";
import { Z_INDEX_BASE } from "./constants.js";

export class Prop {
  constructor(inventory, x, y, propTemplate) {
    this.inventory = inventory;
    this.width = propTemplate.width;
    this.height = propTemplate.height;
    this.propTemplate = propTemplate;
    this.spots = this.propTemplate.spots.map(spot => spot.clone());
    this.elt = this.propTemplate.create();
    this.onChanges = [];

    this.moveTo(x, y);
    document.body.appendChild(this.elt);

    this.onPointerDown = this.onPointerDown.bind(this);

    this.elt.addEventListener('pointerdown', this.onPointerDown, { passive: true });

  }

  addOnChange(fn) {
    this.onChanges.push(fn);
  }

  removeOnChange(fn) {
    this.onChanges = this.onChanges.filter(f => f !== fn);
  }

  remove() {
    document.body.removeChild(this.elt);
  }

  onPointerDown() {
    this.inventory.pickUp(this);
  }

  serialize() {
    return {
      x: this.x,
      y: this.y,
      propTemplate: this.propTemplate.serialize(),
    };
  }

  static deserialize(prop, inventory) {
    let { x, y, propTemplate: propTemplateSerialized } = prop;
    let propTemplate = PropTemplate.deserialize(propTemplateSerialized);
    return new Prop(inventory, x, y, propTemplate);
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
    this.z = this.y + this.height;
    if (this.propTemplate.isFloorProp) {
      this.z = this.y;
    }
    this.elt.style.top = `${this.y}px`;
    this.elt.style.left = `${this.x}px`;
    this.elt.style.zIndex = Math.round(Z_INDEX_BASE + this.z);

    this.onChanges.forEach(onChange => {
      onChange(this);
    });
  }
}
