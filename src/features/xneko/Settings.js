import { PropList } from './PropList.js';

export class Settings {
  constructor() {
    this.snapToGrid = true;
    this.propList = new PropList();
    this.gridSize = 16;
    this.maxVisitingCats = 12;
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
  <input type="button" id="neko-open-prop-list" value="Add/Remove Available Props"></input>
<div>
  Cats are from <a href="https://github.com/eliot-akira/neko">eliot-akira's neko archive</a>.
  Additional prop assets from <a href="https://toffeecraft.itch.io/cat-pack">ToffeeCraft</a> and <a href="https://penzilla.itch.io/top-down-retro-interior">Penzilla</a>.
</div>`;

    const gridSizeSelect = this.container.querySelector('#neko-settings-grid');
    gridSizeSelect.addEventListener('change', () => {
      this.gridSize = parseFloat(gridSizeSelect.value) || 1;
    });
    const visitorsInput = this.container.querySelector('#neko-settings-visitors');
    visitorsInput.addEventListener('change', () => {
      this.maxVisitingCats = parseInt(visitorsInput.value) || 10;
    });
    const openPropList = this.container.querySelector('#neko-open-prop-list');
    openPropList.addEventListener('click', () => {
      this.propList.open();
      this.container.parentNode.classList.remove('open');
    });
  }

  snapXToGrid(x) {
    return Math.round(x / this.gridSize) * this.gridSize;
  }

  snapYToGrid(y) {
    return Math.round(y / this.gridSize) * this.gridSize;
  }
}
