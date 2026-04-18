import { PropList } from './PropList.js';
const storageKey = 'xneko.settings';

export class Settings {
  constructor() {
    this.snapToGrid = true;
    this.propList = new PropList();
    this.gridSize = 16;
    this.maxVisitingCats = 12;
    this.hideBubbles = false;
    this.container = document.createElement('div');
    this.container.innerHTML = `
<div>
  <label for="neko-settings-grid">Grid size (px)</label>
  <select id="neko-settings-grid">
    <option>1</option>
    <option>2</option>
    <option>4</option>
    <option>8</option>
    <option selected>16</option>
  </select>
</div>
<div>
  <label for="neko-settings-visitors">Max cats</label>
  <input type="number" id="neko-settings-visitors" value="12"/>
</div>
<div>
  <label for="neko-settings-hide-bubbles">Hide Starting Info Bubbles</label>
  <input type="checkbox" id="neko-settings-hide-bubbles"></input>
<div>
<div>
  <input type="button" id="neko-open-prop-list" value="Add/Remove Available Props"></input>
<div>
  Cats are from <a href="https://github.com/eliot-akira/neko">eliot-akira's neko archive</a>.
  Additional prop assets from <a href="https://toffeecraft.itch.io/cat-pack">ToffeeCraft</a> and <a href="https://penzilla.itch.io/top-down-retro-interior">Penzilla</a>.
</div>`;

    this.gridSizeSelect = this.container.querySelector('#neko-settings-grid');
    this.gridSizeSelect.addEventListener('change', () => {
      this.gridSize = parseFloat(this.gridSizeSelect.value) || 1;
      this.save();
    });
    this.visitorsInput = this.container.querySelector('#neko-settings-visitors');
    this.visitorsInput.addEventListener('change', () => {
      this.maxVisitingCats = parseInt(this.visitorsInput.value) || 10;
      this.save();
    });
    this.hideBubblesCheckbox = this.container.querySelector('#neko-settings-hide-bubbles');
    this.hideBubblesCheckbox.addEventListener('change', () => {
      this.hideBubbles = this.hideBubblesCheckbox.checked;
      this.save();
    });
    const openPropList = this.container.querySelector('#neko-open-prop-list');
    openPropList.addEventListener('click', () => {
      this.propList.open();
      this.container.parentNode.classList.remove('open');
    });
  }

  async load() {
    const storage = await browser.storage.local.get(storageKey);
    const settingsSerialized = storage?.[storageKey];
    if (typeof settingsSerialized?.gridSize === 'undefined') {
      return;
    }
    this.gridSizeSelect.value = settingsSerialized.gridSize;
    this.gridSize = settingsSerialized.gridSize;
    this.visitorsInput.value = settingsSerialized.maxVisitingCats;
    this.maxVisitingCats = settingsSerialized.maxVisitingCats;
    this.hideBubblesCheckbox.checked = settingsSerialized.hideBubbles;
    this.hideBubbles = settingsSerialized.hideBubbles;
  }

  async save() {
    const settingsSerialized = {
      gridSize: this.gridSize,
      maxVisitingCats: this.maxVisitingCats,
      hideBubbles: this.hideBubbles,
    };
    await browser.storage.local.set({ [storageKey]: settingsSerialized });
  }

  snapXToGrid(x) {
    return Math.round(x / this.gridSize) * this.gridSize;
  }

  snapYToGrid(y) {
    return Math.round(y / this.gridSize) * this.gridSize;
  }
}
