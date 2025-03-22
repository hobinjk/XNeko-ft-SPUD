import { Z_INDEX_BASE } from "./constants.js";

export class Prop {
  constructor(x, y, propTemplate) {
    this.x = x;
    this.y = y;
    this.height = propTemplate.height;
    this.z = this.y + this.height;
    if (propTemplate.isFloorProp) {
      this.z = this.y;
    }
    this.propTemplate = propTemplate;
    this.spots = this.propTemplate.spots.map(spot => spot.clone());
    this.elt = this.propTemplate.create();
    this.elt.style.top = `${this.y}px`;
    this.elt.style.left = `${this.x}px`;
    this.elt.style.zIndex = Math.round(Z_INDEX_BASE + this.z);
    document.body.appendChild(this.elt);
  }

  remove() {
    document.body.removeChild(this.elt);
  }
}
