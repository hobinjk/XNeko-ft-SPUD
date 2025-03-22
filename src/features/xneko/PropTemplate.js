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
    image.draggable = false;
    image.style.width = width + 'px';
    image.style.height = height + 'px';
    // TODO xss prevention by forcing it to be a data base64 url
    image.src = prop.src;
    let template = new PropTemplate(width, height, spots, isFloorProp);
    template.container.appendChild(image);
    return template;
  }

  serialize() {
    let { width, height, isFloorProp } = this;
    let spots = this.spots.map(spot => {
      return {
        x: spot.x,
        y: spot.y,
        allowedActions: spot.allowedActions,
      };
    });

    let src = 'unknown';
    let image = this.container.querySelector('img');
    if (image) {
      src = image.src;

    }
    return {
      width,
      height,
      isFloorProp,
      spots,
      src
    };
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

export const bedTemplate = PropTemplate.deserialize({
  width: 32,
  height: 27,
  isFloorProp: true,
  spots: [
    { x: 16, y: 0, allowedActions: [Actions.sleep] },
  ],
  src: 'dithers/brownbed.png',
});

export const bookshelfTemplate = PropTemplate.deserialize({
  width: 64,
  height: 172,
  isFloorProp: false,
  spots: [
  ],
  src: 'dithers/shelf.png',
  spots: [
    {
      x: 22,
      y: 176,
      allowedActions: [
        "sleep",
        "sleep",
        "itch"
      ]
    },
    {
      x: 42,
      y: 144,
      allowedActions: [
        "sleep"
      ]
    },
    {
      x: 22,
      y: 112,
      allowedActions: [
        "sleep"
      ]
    },
    {
      x: 42,
      y: 80,
      allowedActions: [
        "sleep"
      ]
    },
    {
      x: 22,
      y: 48,
      allowedActions: [
        "sleep"
      ]
    },
    {
      x: 42,
      y: 16,
      allowedActions: [
        "sleep"
      ]
    },
    {
      x: -16,
      y: 156,
      allowedActions: [
        "escratch"
      ]
    },
    {
      x: 80,
      y: 156,
      allowedActions: [
        "wscratch"
      ]
    }
  ],
});
