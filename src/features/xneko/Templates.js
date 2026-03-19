import { PropTemplate, defaultTemplatesSerialized } from './PropTemplate.js';

const storageKey = 'xneko.propTemplates';

class Templates {
  #templates = [];

  constructor() {
    this.onChanges = [];
  }

  async load() {
    let storage = await browser.storage.local.get(storageKey);
    let templatesSerialized = storage?.[storageKey];
    if (!templatesSerialized?.length) {
      console.warn('reverting to default', templatesSerialized);
      templatesSerialized = defaultTemplatesSerialized;
    }
    for (let templateSerialized of templatesSerialized) {
      if (!templateSerialized.id) {
        templateSerialized.id = crypto.randomUUID();
      }
    }
    this.#templates = templatesSerialized.map(templateSerialized => {
      return PropTemplate.deserialize(templateSerialized);
    });
    this.#callOnChanges();
  }

  get() {
    return this.#templates;
  }

  add(template) {
    if (!template.id) {
      template.id = crypto.randomUUID();
    }
    let propTemplate = PropTemplate.deserialize(template);
    this.#templates.push(propTemplate);
    this.save();
    this.#callOnChanges();
    return propTemplate;
  }

  remove(templateToRemove) {
    this.#templates = this.#templates.filter(template => template.id !== templateToRemove.id);
    this.save();
    this.#callOnChanges();
  }

  async save() {
    let templatesSerialized = this.#templates.map(template => template.serialize());
    await browser.storage.local.set({ [storageKey]: templatesSerialized });
  }

  #callOnChanges() {
    for (const onChange of this.onChanges) {
      onChange(this.get());
    }
  }

  addOnChange(onChangeFn) {
    this.onChanges.push(onChangeFn);
  }

  removeOnChange(onChangeFn) {
    this.onChanges = this.onChanges.filter(ocfn => ocfn !== onChangeFn);
  }
}

export const templates = new Templates();
