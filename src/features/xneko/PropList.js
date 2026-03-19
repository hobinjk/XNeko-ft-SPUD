import { requireBase64Image } from './PropTemplate.js';
import { templates } from './Templates.js';

// RemixIcons
const deleteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ff3333"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path></svg>`;
const yesSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#33ff33"><path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path></svg>`;
const noSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ff3333""><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>`;

export class PropList {
  constructor() {
    this.container = document.createElement('div');
    this.container.innerHTML = `
    <div id="neko-prop-list-container">
      <div id="neko-prop-list"></div>
      <div class="neko-prop-list-base">
        <div></div>
        <button id="neko-prop-list-import">+ Import From Clipboard</button>
        <button id="neko-prop-list-close">Close</button>
      </div>
    </div>`;

    this.list = this.container.querySelector('#neko-prop-list');
    this.importButton = this.container.querySelector('#neko-prop-list-import');
    for (const propTemplate of templates.get()) {
      this.addPropTemplate(propTemplate);
    }
    this.importFromClipboard = this.importFromClipboard.bind(this);
    this.importButton.addEventListener('click', this.importFromClipboard);
    this.preventClick = (event) => {
      event.stopPropagation();
    };
    this.close = this.close.bind(this);
    this.closeButton = this.container.querySelector('#neko-prop-list-close');
    this.closeButton.addEventListener('click', this.close);
  }

  addPropTemplate(propTemplate) {
    propTemplate.addSpotMarkers();
    const elt = propTemplate.create();
    propTemplate.removeSpotMarkers();
    const container = document.createElement('div');
    container.classList.add('neko-prop-list-item');
    elt.classList.add('neko-prop-list-prop');

    const delIcon = document.createElement('button');
    delIcon.innerHTML = deleteSvg;
    delIcon.classList.add('neko-prop-list-item-delete');

    const deleteConfirm = document.createElement('div');
    deleteConfirm.classList.add('neko-prop-list-item-delete-confirm');

    const deleteConfirmYes = document.createElement('button');
    deleteConfirmYes.innerHTML = yesSvg;
    deleteConfirmYes.classList.add('neko-prop-list-item-delete-confirm-yes');
    const deleteConfirmNo = document.createElement('button');
    deleteConfirmNo.innerHTML = noSvg;
    deleteConfirmNo.classList.add('neko-prop-list-item-delete-confirm-no');
    deleteConfirm.style.display = 'none';
    deleteConfirm.appendChild(deleteConfirmYes);
    deleteConfirm.appendChild(deleteConfirmNo);
    delIcon.addEventListener('click', () => {
      deleteConfirm.style.display = '';
      delIcon.style.display = 'none';
    });
    deleteConfirmYes.addEventListener('click', () => {
      templates.remove(propTemplate);
      this.list.removeChild(container);
    });
    deleteConfirmNo.addEventListener('click', () => {
      deleteConfirm.style.display = 'none';
      delIcon.style.display = '';
    });
    container.appendChild(elt);
    container.appendChild(delIcon);
    container.appendChild(deleteConfirm);

    this.list.appendChild(container);
    return container;
  }

  setBounds() {
    const elts = Array.from(this.list.querySelectorAll('.neko-prop-list-prop'));
    elts.forEach((elt) => {
      let { left, right, top, bottom } = elt.getBoundingClientRect();
      for (let spot of elt.querySelectorAll('.spot-marker')) {
        let bounds = spot.getBoundingClientRect();
        left = Math.min(bounds.left, left);
        right = Math.max(bounds.right, right);
        top = Math.min(bounds.top, top);
        bottom = Math.max(bounds.bottom, bottom);
      }

      let zoom = 120 / Math.max(right - left, bottom - top);
      if (zoom > 1) {
        zoom = 1;
      }
      elt.style.transform = `translate(-50%, -50%) scale(${zoom})`;
    }, 200);
  }

  async importFromClipboard() {
    try {
      let templateRaw = await navigator.clipboard.readText();
      let template = JSON.parse(templateRaw);
      if (!requireBase64Image(template.src)) {
        throw new Error('invalid template image');
      }
      let propTemplate = templates.add(template);
      let elt = this.addPropTemplate(propTemplate);
      elt.scrollIntoView();
    } catch (e) {
      alert(`Invalid template! Make sure you copied the right text. ${e}`);
    }
  }

  open() {
    document.body.appendChild(this.container);
    this.setBounds();
    this.container.addEventListener('click', this.preventClick);
    setTimeout(() => {
      document.body.addEventListener('click', this.close);
    }, 50);
  }

  close() {
    document.body.removeChild(this.container);
    document.body.removeEventListener('click', this.close);
  }
}
