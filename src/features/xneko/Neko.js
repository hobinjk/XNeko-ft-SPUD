import { Z_INDEX_BASE } from "./constants.js";

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

export const allCatNames = [
  'ace',
  'air',
  'anik',
  // 'alien',
  'black',
  'black2',
  // 'blue-marine',
  'blue-tabby',
  'blue',
  'boobookitty',
  // 'brown-bsd-daemon',
  'brown-dog',
  'calico-tabby',
  'calico',
  // 'captain-goodnight',
  // 'caz',
  // 'coke-bottle',
  // 'colourful',
  // 'dave',
  'deedee',
  'dog',
  // 'doom',
  'earth',
  // 'face',
  'fancy',
  // 'ff3mog',
  'fire',
  // 'ghetto',
  'ghost',
  'gray',
  // 'green-ghost',
  // 'holiday',
  'jess',
  'kina-nothoughts',
  'kuramecha',
  'lucky',
  // 'lucy-dog',
  'lucy',
  'marmalade',
  'mermaid',
  // 'metroid',
  'mike',
  // 'mini',
  'moka',
  // 'multi',
  // 'nekocool',
  'neon',
  'orange',
  // 'pac-man',
  'peach',
  // 'penguin-2',
  // 'penguin',
  'pink-nose-neko',
  'pink',
  // 'rainbow',
  // 'red-bsd-daemon',
  'robot',
  // 'rocket',
  'rose',
  'royal',
  'silver',
  'silversky',
  // 'skunk',
  'socks',
  // 'sonic',
  'spirit',
  'spooky',
  'tabby',
  // 'tentacle',
  // 'tie-fighter',
  // 'turtle',
  'usa',
  'valentine',
  'water',
  'white',
  // 'worms',
  // 'zelda3',
];

const ANIMATION_FPS = 10;
export const Actions = {
  sleep: 'sleep',
  itch: 'itch',
  scratch: 'scratch',
  wscratch: 'wscratch',
  escratch: 'escratch',
  wash: 'wash',
  alert: 'alert',
  still: 'still',
  yawn: 'yawn',
};

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
  constructor(name, url, data) {
    this.name = name;
    this.data = data;
    this.x = Math.random() * innerWidth;
    this.y = Math.random() * innerHeight;
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
    visits.textContent = 4;

    this.elt.appendChild(this.infoCard);
  }

  update() {
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

  updateMovement() {
    this.elt.style.top = `${this.y}px`;
    this.elt.style.left = `${this.x}px`;
    this.elt.style.zIndex = Math.round(this.z + Z_INDEX_BASE);
  }
}
