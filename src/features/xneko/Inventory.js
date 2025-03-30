import { Prop } from './Prop.js';

export class Inventory {
  constructor(settings, actionManager, propTemplates) {
    this.settings = settings;
    this.actionManager = actionManager;
    this.propTemplates = propTemplates;
    this.propTemplatesById = {};
    this.nextPTId = 0;

    this.container = document.createElement('div');
    this.container.classList.add('inventory');

    this.settingsContainer = document.createElement('div');
    this.settingsContainer.classList.add('settings');
    this.settingsContainer.appendChild(settings.container);

    this.openButton = document.createElement('div');
    this.openButton.classList.add('open-button');
    this.openButton.textContent = '+';

    this.openButton.addEventListener('click', () => {
      this.container.classList.toggle('open');
      this.settingsContainer.classList.remove('open');
    });

    this.settingsButton = document.createElement('div');
    this.settingsButton.classList.add('settings-button');
    this.settingsButton.textContent = 's';

    this.settingsButton.addEventListener('click', () => {
      this.settingsContainer.classList.toggle('open');
      this.container.classList.remove('open');
    });


    this.activeDrag = null;
    this.onPropTemplatePointerDown = this.onPropTemplatePointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);

    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerup', this.onPointerUp, { passive: true });


    this.addPropTemplates();
  }

  add() {
    document.body.appendChild(this.openButton);
    document.body.appendChild(this.settingsButton);
    document.body.appendChild(this.container);
    document.body.appendChild(this.settingsContainer);
  }

  addPropTemplates() {
    for (let propTemplate of this.propTemplates) {
      this.addPropTemplate(propTemplate);
    }
  }

  addPropTemplate(propTemplate) {
    let propTemplateContainer = propTemplate.create();
    propTemplateContainer.dataset.id = this.nextPTId;
    this.propTemplatesById[this.nextPTId] = propTemplate;
    this.nextPTId += 1;

    propTemplateContainer.addEventListener('pointerdown', this.onPropTemplatePointerDown);
    this.container.appendChild(propTemplateContainer);
  }

  onPropTemplatePointerDown(event) {
    let ptId = event.currentTarget.dataset.id;
    if (!ptId) {
      console.warn('event without ptId', event);
      return;
    }
    let pt = this.propTemplatesById[ptId];
    if (!pt) {
      console.warn('ptId refers to missing prop', event, this.propTemplatesById);
      return;
    }
    let x = event.clientX;
    let y = event.clientY;
    if (this.settings.snapToGrid) {
      x = this.settings.snapXToGrid(x);
      y = this.settings.snapYToGrid(y);
    }


    let prop = new Prop(this, x, y, pt);
    this.pickUp(prop);
  }

  pickUp(prop) {
    this.container.classList.add('open');
    this.settingsContainer.classList.remove('open');

    this.activeDrag = {
      prop,
    };

    this.bounds = this.container.getBoundingClientRect();
    this.container.classList.add('trash');
  }

  onPointerMove(event) {
    if (!this.activeDrag) {
      return;
    }
    let x = event.clientX;
    let y = event.clientY;
    if (this.settings.snapToGrid) {
      x = this.settings.snapXToGrid(x);
      y = this.settings.snapYToGrid(y);
    }
    let { prop } = this.activeDrag;
    prop.moveTo(x - prop.width / 2, y - prop.height / 2);
  }

  onPointerUp(event) {
    if (!this.activeDrag) {
      return;
    }
    let x = event.clientX;
    let y = event.clientY;

    let prop = this.activeDrag.prop;
    this.activeDrag = null;
    this.container.classList.remove('trash');

    if (x > this.bounds.left && x < this.bounds.right &&
      y > this.bounds.top && y < this.bounds.bottom) {
      // Cancel, prop was dropped in the trash
      prop.remove();
      this.actionManager.removeProp(prop);
      return;
    }

    this.actionManager.addProp(prop);
  }
}
