import { Z_INDEX_BASE } from "./constants.js";

export class Prop {
  constructor(x, y, propTemplate) {
    this.width = propTemplate.width;
    this.height = propTemplate.height;
    this.propTemplate = propTemplate;
    this.spots = this.propTemplate.spots.map(spot => spot.clone());
    this.elt = this.propTemplate.create();
    this.moveTo(x, y);
    document.body.appendChild(this.elt);
  }

  remove() {
    document.body.removeChild(this.elt);
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
