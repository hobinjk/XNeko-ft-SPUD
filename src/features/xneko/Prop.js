import { Z_INDEX_BASE } from "./constants.js";

export class Prop {
  constructor(inventory, x, y, propTemplate) {
    this.inventory = inventory;
    this.width = propTemplate.width;
    this.height = propTemplate.height;
    this.propTemplate = propTemplate;
    this.spots = this.propTemplate.spots.map(spot => spot.clone());
    this.elt = this.propTemplate.create();
    this.moveTo(x, y);
    document.body.appendChild(this.elt);

    this.onPointerDown = this.onPointerDown.bind(this);

    this.elt.addEventListener('pointerdown', this.onPointerDown, { passive: true });
  }

  remove() {
    document.body.removeChild(this.elt);
  }

  onPointerDown() {
    this.inventory.pickUp(this);
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
  }
}
