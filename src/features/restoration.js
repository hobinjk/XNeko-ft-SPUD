import { buildStyle, filterPostElements, postSelector } from '../utils/interface.js';
import { onNewPosts } from '../utils/mutations.js';

const excludeClass = 'xkit-restoration-done';
const noBlogView = true;

export const styleElement = buildStyle();

const onNewPostsListener = postElements => filterPostElements(postElements, { excludeClass, noBlogView }).forEach(postElement => {
  // something something timestamp
  console.log('new post', postElement);
  let postRestoration = new PostRestoration(postElement.querySelector('article'));
  postRestoration.applyAllLayers();
});

export const main = async function() {
  styleElement.textContent = cursorStyles;
  onNewPosts.addListener(onNewPostsListener);
};

export const clean = async function() {
  onNewPosts.removeListener(onNewPostsListener);

  $(`.${excludeClass}`).removeClass(excludeClass);
};

export const stylesheet = true;

const cursorStyles = `
body.cursor-brush {
  cursor: url(${browser.runtime.getURL('/features/restoration/brush.png')}) 12 8, progress;
}

body.cursor-cotton {
  cursor: url(${browser.runtime.getURL('/features/restoration/cotton.png')}) 20 16, progress;
}

body.cursor-hotair {
  cursor: url(${browser.runtime.getURL('/features/restoration/hotair.png')}) 12 12, progress;
}

body.cursor-towel {
  cursor: url(${browser.runtime.getURL('/features/restoration/towel.png')}) 20 20, progress;
}
`;



// dirt splotches, varnish removal, repair holes, uncrease
const Layers = {
  DIRT: 'dirt',
  HOLES: 'holes',
  VARNISH: 'varnish',
  CREASE: 'crease',
};

function makeNoiseCircle(size, scale, fill, stroke, octaves, freq) {
  const seed = Math.round(Math.random() * 100000);
  const id = 'id' + Math.round(Math.random() * 1000);
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" overflow="visible">
    <filter id="displacementFilter${id}">
      <feTurbulence type="turbulence" result="turbulence" numOctaves="${octaves}" baseFrequency="${freq}" seed="${seed}"></feTurbulence>
      <feDisplacementMap in2="turbulence" in="SourceGraphic" xChannelSelector="R" yChannelSelector="G" scale="${scale}"></feDisplacementMap>
    </filter>

    <g style="filter: url(#displacementFilter${id});" width="${size}" height="${size}">
      <circle fill="${fill}" stroke="${stroke}" cx="${size / 2}" cy="${size / 2}" r="${size / 4}"></circle>
      <circle fill="none" cx="${size / 2}" cy="${size / 2}" r="${size / 2}"></circle>
    </g>
  </svg>
  `;
}

class PostRestoration {
  constructor(container) {
    this.container = container;
    this.paintableMasks = [];
  }

  makeSplotch(x, y) {
    let elt = document.createElement('div');
    elt.classList.add('splotch');
    const scale = Math.random() * 100 + 70;
    const fill = `hsl(26deg 73% 8% / 0.95)`;
    const svg = makeNoiseCircle(200, scale, fill, '', 12, 0.02);

    let splot = {
      x,
      y,
      elt,
    };

    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const image = document.createElement('img');
    image.onload = () => {
      const gfx = canvas.getContext('2d');
      gfx.drawImage(image, 0, 0);
      gfx.globalCompositeOperation = 'destination-out';
      this.paintableMasks.push(new PaintableMask(splot, canvas, Layers.DIRT));
    };
    image.src = 'data:image/svg+xml;base64,' + btoa(svg);
    elt.appendChild(canvas);

    elt.style.position = 'absolute';
    elt.style.top = y + 'px';
    elt.style.left = x + 'px';

    return splot;
  }

  makeHole(x, y) {
    let elt = document.createElement('div');
    elt.classList.add('hole');
    const size = 80;
    const scale = 30;
    const fill = `#001935`; // todo css var
    const stroke = `hsl(26deg 73% 78% / 0.95)`;
    const svg = makeNoiseCircle(size, scale, fill, stroke, 2, 0.01);

    let splot = {
      x,
      y,
      elt,
    };

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const image = document.createElement('img');
    image.onload = () => {
      const gfx = canvas.getContext('2d');
      gfx.drawImage(image, 0, 0);
      gfx.globalCompositeOperation = 'destination-out';
      this.paintableMasks.push(new PaintableMask(splot, canvas, Layers.HOLES));
    };
    image.src = 'data:image/svg+xml;base64,' + btoa(svg);
    elt.appendChild(canvas);

    elt.style.position = 'absolute';
    elt.style.top = y + 'px';
    elt.style.left = x + 'px';

    return splot;
  }

  applyCreaseLayer() {
    let filter = document.createElement('div');
    let id = '-' + Math.round(Math.random() * 10000);
    filter.innerHTML = `
  <svg viewBox="0 0 100 100">
    <filter id="creaseNoise${id}" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02 0.02" result="NOISE" numOctaves="2"/>
      <feDisplacementMap id="creaseDisplacement${id}" in="SourceGraphic" in2="NOISE" scale="20" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
    </filter>
  </svg>`;
    document.body.appendChild(filter);
    this.container.style.filter = `url(#creaseNoise${id})`;
    this.container.classList.add(`creased${id}`);
    this.creaseId = id;
  }

  applyVarnishLayer() {
    const varnish = document.createElement('canvas');
    const { width, height } = this.container.getBoundingClientRect();
    varnish.width = width;
    varnish.height = height;
    let img = document.createElement('img');
    img.onload = () => {
      const imageWidth = 80;
      const imageHeight = 80;
      const gfx = varnish.getContext('2d');
      for (let y = 0; y < height; y += imageHeight) {
        for (let x = 0; x < width; x += imageWidth) {
          gfx.drawImage(img, x, y);
        }
      }
      gfx.globalCompositeOperation = 'destination-out';
    }
    img.src = browser.runtime.getURL('/features/restoration/noise2.png');
    varnish.classList.add('varnish');
    this.container.appendChild(varnish);
    this.paintableMasks.push(new PaintableMask({ x: 0, y: 0 }, varnish, Layers.VARNISH));
  }

  applyHoles() {
    let rect = this.container.getBoundingClientRect();
    const { width, height } = rect;
    for (let i = 0; i < 5; i++) {
      let x = Math.random() * (width - 200);
      let y = Math.random() * (height - 200);
      let splot = this.makeHole(x, y);
      this.container.appendChild(splot.elt);
    }
  }

  applySplotches() {
    let rect = this.container.getBoundingClientRect();
    const { width, height } = rect;
    for (let i = 0; i < 10; i++) {
      let x = Math.random() * (width - 200);
      let y = Math.random() * (height - 200);
      let splot = this.makeSplotch(x, y);
      this.container.appendChild(splot.elt);
    }
  }

  applyAllLayers() {
    let cover = document.createElement('div');
    cover.classList.add('cover');

    this.container.appendChild(cover);
    cover.addEventListener('pointermove', (event) => {
      for (let paintableMask of this.paintableMasks) {
        if (paintableMask.layer !== activeLayer) {
          continue;
        }
        paintableMask.onMouseMove({
          x: event.layerX,
          y: event.layerY,
        });
      }

      if (activeLayer === Layers.CREASE) {
        let amount = (Math.abs(event.movementX) + Math.abs(event.movementY)) / 250;
        uncrease(this.creaseId, amount);
      }
    });


    this.applyCreaseLayer();
    this.applyVarnishLayer();
    this.applyHoles();
    this.applySplotches();
  }
}

let activeLayer = '';

class PaintableMask {
  constructor(splot, canvas, layer) {
    this.x = splot.x;
    this.y = splot.y;
    this.canvas = canvas;
    this.layer = layer;
    this.gfx = this.canvas.getContext('2d');

    this.onMouseMove = this.onMouseMove.bind(this);
  }

  onMouseMove({ x, y }) {
    x = x - this.x;
    y = y - this.y;
    this.gfx.beginPath();
    this.gfx.fillStyle = 'red';
    let brushScale = this.getBrushScale();
    if (this.layer === Layers.VARNISH) {
      x += 50;
      y += 50;
    }
    this.gfx.arc(x - brushScale / 2, y - brushScale / 2, brushScale, 0, 2 * Math.PI);
    this.gfx.fill();
  }

  getBrushScale() {
    switch (this.layer) {
      case Layers.HOLES:
        return 8;
      case Layers.VARNISH:
        return 64;
      case Layers.DIRT:
      default:
        return 24;
    }
  }
}

const palette = document.createElement('div');
palette.classList.add('palette');
function makeButton(label, layer, cursorClass) {
  let button = document.createElement('button');
  button.textContent = label;
  button.onclick = () => {
    Array.from(document.querySelectorAll('button.active')).forEach((btn) => {
      btn.classList.remove('active');
    });

    document.body.classList.remove('cursor-cotton', 'cursor-towel', 'cursor-hotair', 'cursor-brush');
    if (activeLayer === layer) {
      activeLayer = '';
      return;
    }
    document.body.classList.add(cursorClass);
    button.classList.add('active');
    activeLayer = layer;
  };
  palette.appendChild(button);
}

makeButton('water', Layers.DIRT, 'cursor-cotton');
makeButton('varnish remover', Layers.VARNISH, 'cursor-towel');
makeButton('repair', Layers.HOLES, 'cursor-brush');

makeButton('heated table', Layers.CREASE, 'cursor-hotair');

function uncrease(creaseId, amount) {
  let elt = document.getElementById(`creaseDisplacement${creaseId}`);
  let currentScale = parseFloat(elt.getAttribute('scale'));


  currentScale -= amount;
  if (currentScale > 0) {
    elt.setAttribute('scale', currentScale);
  } else {
    // Done, clear crease filter
    document.querySelector(`.creased${creaseId}`).style.filter = '';
  }
}

document.body.appendChild(palette);
