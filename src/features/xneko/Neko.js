import { Z_INDEX_BASE } from "./constants.js";
import { UndirectedAction } from "./ActionManager.js";

// Minimal list since each evaluation takes time
export const catNames = [
  'ace',
  'air',
  'earth',
  'fire',
  'kina-nothoughts',
  'marmalade',
  'pink',
  'rose',
  'spirit',
  'water',
];

const ANIMATION_FPS = 10;

export const Spritesheet = {
  alert: [{ x: 32, y: 0 }],
  itch: [{ x: 0, y: 64 }, { x: 32, y: 64 }],
  sleep: [{ x: 0, y: 32 }, { x: 32, y: 32 }],
  still: [{ x: 0, y: 96 }],
  wash: [{ x: 0, y: 0 }],
  yawn: [{ x: 32, y: 96 }],
  nscratch: [{ x: 0, y: 224 }, { x: 32, y: 224 }],
  escratch: [{ x: 0, y: 192 }, { x: 32, y: 192 }],
  sscratch: [{ x: 0, y: 160 }, { x: 32, y: 160 }],
  wscratch: [{ x: 0, y: 128 }, { x: 32, y: 128 }],
  nrun: [{ x: 0, y: 480 }, { x: 32, y: 480 }],
  nerun: [{ x: 0, y: 448 }, { x: 32, y: 448 }],
  erun: [{ x: 0, y: 416 }, { x: 32, y: 416 }],
  serun: [{ x: 0, y: 384 }, { x: 32, y: 384 }],
  srun: [{ x: 0, y: 352 }, { x: 32, y: 352 }],
  swrun: [{ x: 0, y: 320 }, { x: 32, y: 320 }],
  wrun: [{ x: 0, y: 288 }, { x: 32, y: 288 }],
  nwrun: [{ x: 0, y: 256 }, { x: 32, y: 256 }],
};

export class Neko {
  constructor(actionManager, name, url, visitDuration, data) {
    this.actionManager = actionManager;
    this.visitDurationLeft = visitDuration;
    this.name = name;
    this.data = data;
    this.x = Math.random() * innerWidth;
    this.y = Math.random() * innerHeight;

    // Place off the screen
    let offX = Math.random() < 0.5;
    if (offX) {
      this.x = this.x < innerWidth / 2 ?
        -100 :
        innerWidth + 100;
    } else {
      this.y = this.y < innerHeight / 2 ?
        -200 :
        innerHeight + 200;
    }

    this.z = this.y;
    this.elt = document.createElement('div');
    this.elt.classList.add('cat');
    if (url) {
      this.elt.style.backgroundImage = `url(${url})`;
    } else {
      this.elt.style.backgroundImage = `url(spritesheets/${name}.png)`;
    }
    document.body.appendChild(this.elt);
    this.lastFrame = -1;
    this.animation = 'wrun';
    this.animationIndex = 0;
    this.animationScale = 1;

    this.createInfoCard();

    this.infoCard.classList.add('info-card-open');
    this.showingInitialInfoCard = true;
    this.closeInfoCardTimeout = null;

    this.createHeart();

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);

    this.elt.addEventListener('pointermove', this.onPointerMove);
    this.elt.addEventListener('pointerdown', this.onPointerDown);
  }

  remove() {
    document.body.removeChild(this.elt);
    this.actionManager = null;
  }

  createInfoCard() {
    this.infoCard = document.createElement('div');
    this.infoCard.classList.add('info-card');
    const template = `
      <div class="info-card-header">
        <img src="" class="info-card-avatar" />
        <p class="info-card-name"></p>
      </div>
      <div class="info-card-likes">Likes: <a class="info-card-post" target="_blank"></a></div>
      <div class="info-card-visits">Visits: <span class="info-card-visit-count"></span></div>
    `;
    this.infoCard.innerHTML = template;
    let avatar = this.infoCard.querySelector('.info-card-avatar');
    avatar.src = this.data.avatarSrc;
    let name = this.infoCard.querySelector('.info-card-name');
    name.textContent = this.name;

    let post = this.infoCard.querySelector('.info-card-post');
    post.textContent = 'this post';
    post.href = this.data.postUrl;

    let visits = this.infoCard.querySelector('.info-card-visit-count');
    visits.textContent = this.data.visitCount || 1;

    this.elt.appendChild(this.infoCard);
  }

  createHeart() {
    this.heart = document.createElement('img');
    this.heart.src = browser.runtime.getURL(`/features/xneko/sprites/redheart.png`);

    this.heart.classList.add('cat-heart');
    this.elt.appendChild(this.heart);
  }


  onPointerMove() {
    this.openInfoCard();
    this.closeInfoCard(5000);
  }

  onPointerDown() {
    let action = new UndirectedAction(
      this,
      'alert',
      1500,
      this.x,
      this.y,
    );
    this.actionManager.setAction(this, action);
    this.heart.classList.add('shown');
    setTimeout(() => {
      this.heart.classList.remove('shown');
    }, 1200);
  }

  update(dt) {
    this.visitDurationLeft -= dt;
    this.updateMovement();
    this.updateAnimation();
  }

  updateAnimation() {
    if (Date.now() - this.lastFrame < 1000 * this.animationScale / ANIMATION_FPS) {
      return;
    }
    this.lastFrame = Date.now();

    const sprites = Spritesheet[this.animation];
    const sprite = sprites[this.animationIndex];
    this.animationIndex = (this.animationIndex + 1) % sprites.length;
    this.elt.style.backgroundPosition = `${sprite.x}px ${512 - sprite.y}px`;
  }

  setAnimation(animation) {
    this.animation = animation;
    this.animationIndex = 0;
    this.animationScale = 1;
    switch (this.animation) {
      case 'sleep':
        this.animationScale = 5;
        break;
      case 'itch':
      case 'wscratch':
      case 'sscratch':
      case 'escratch':
      case 'nscratch':
        this.animationScale = 2;
        break;
      default:
        break;
    }
    this.lastFrame = 0;
    this.updateAnimation();
  }

  openInfoCard() {
    this.infoCard.classList.add('info-card-open');
  }

  closeInfoCard(delayMs) {
    if (this.closeInfoCardTimeout) {
      clearTimeout(this.closeInfoCardTimeout);
    }
    this.closeInfoCardTimeout = setTimeout(() => {
      this.infoCard.classList.remove('info-card-open');
    }, delayMs);
  }

  updateMovement() {
    if (this.showingInitialInfoCard) {
      if (this.x > 0 && this.y > 0 && this.x < innerWidth && this.y < innerHeight) {
        this.showingInitialInfoCard = false;
        this.closeInfoCard(10000);
      }
    }
    this.elt.style.top = `${this.y}px`;
    this.elt.style.left = `${this.x}px`;
    this.elt.style.zIndex = Math.round(this.z + Z_INDEX_BASE);
  }
}
