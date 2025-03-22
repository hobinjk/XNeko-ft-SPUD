import { Actions } from "./Neko.js";

export class PropTemplate {
  constructor(width, height, spots, isFloorProp) {
    this.width = width;
    this.height = height;
    this.spots = spots;
    this.isFloorProp = isFloorProp;
    this.container = document.createElement('div');
    this.container.classList.add('prop');
  }

  create() {
    return this.container.cloneNode(true);
  }

  static deserialize(prop) {
    let { width, height, isFloorProp } = prop;
    let spots = prop.spots.map(spot => new Spot(spot.x, spot.y, spot.allowedActions));
    let image = document.createElement('img');
    image.style.width = width + 'px';
    image.style.height = height + 'px';
    // TODO xss prevention by forcing it to be a data base64 url
    image.src = prop.src;
    let template = new PropTemplate(width, height, spots, isFloorProp);
    template.container.appendChild(image);
    return template;
  }

  addSpotMarkers() {
    for (let spot of this.spots) {
      let elt = document.createElement('div');
      elt.classList.add('spot-marker');
      elt.style.top = spot.y + 'px';
      elt.style.left = spot.x + 'px';
      this.container.appendChild(elt);
    }
  }
}

class Spot {
  constructor(x, y, allowedActions) {
    this.x = x;
    this.y = y;
    this.allowedActions = allowedActions;
    this.occupied = false;
  }

  clone() {
    return new Spot(this.x, this.y, this.allowedActions);
  }
}

export class BedTemplate extends PropTemplate {
  constructor() {
    super(32, 32, [
      new Spot(16, 16 - 16, [Actions.sleep]),
    ], true);
    this.container.style.background = 'url(dithers/brownbed.png)';
    this.container.style.width = '32px';
    this.container.style.height = '27px';
    console.log(this);
  }
}

export class BookshelfTemplate extends PropTemplate {
  constructor() {
    super(64, 172, [], false);
    for (let y = 0; y < this.height / 32; y++) {
      let actions = [Actions.sleep];
      if (y === 0) {
        actions.push(Actions.sleep);
        actions.push(Actions.itch);
      }
      let x = (y % 2) * 20 - 10;
      this.spots.push(new Spot(x + 32, 160 - (y * 32 - 16), actions));
    }
    this.spots.push(new Spot(-16, this.height - 16, [Actions.escratch]));
    this.spots.push(new Spot(this.width + 16, this.height - 16, [Actions.wscratch]));

    this.container.style.background = 'url(dithers/shelf.png)';
    this.container.style.width = `${this.width}px`;
    this.container.style.height = `${this.height}px`;
    console.log(this);
  }
}
