export class Settings {
  constructor() {
    this.snapToGrid = true;
  }

  snapXToGrid(x) {
    return Math.round(x / 16) * 16;
  }

  snapYToGrid(y) {
    return Math.round(y / 16) * 16;
  }
}
