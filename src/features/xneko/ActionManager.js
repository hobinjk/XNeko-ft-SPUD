import { Spritesheet } from "./Neko.js";

export const Actions = {
  sleep: 'sleep',
  itch: 'itch',
  scratch: 'scratch',
  wscratch: 'wscratch',
  escratch: 'escratch',
  nscratch: 'wscratch',
  sscratch: 'escratch',
  wash: 'wash',
  alert: 'alert',
  still: 'still',
  yawn: 'yawn',
};

const ActionBaseDurations = {
  sleep: 30000,
  itch: 10000,
  scratch: 20000,
  wscratch: 20000,
  escratch: 20000,
  nscratch: 20000,
  sscratch: 20000,
  wash: 10000,
  alert: 3000,
  still: 3000,
  yawn: 3000,
};

export class ActionManager {
  constructor(cats, props, editorMode) {
    this.cats = cats;
    this.props = props;
    this.actions = new Array(this.cats.length);
    this.lastUpdate = Date.now();
    this.editorMode = editorMode;

    this.triggerOnChanges = this.triggerOnChanges.bind(this);

    this.onChanges = [];
  }

  addOnChange(fn) {
    this.onChanges.push(fn);
  }

  removeOnChange(fn) {
    this.onChanges = this.onChanges.filter(f => f !== fn);
  }

  triggerOnChanges(prop) {
    this.onChanges.forEach(onChange => {
      onChange(prop);
    });
  }

  addProp(prop) {
    if (!this.props.includes(prop)) {
      this.props.push(prop);
    }
    prop.addOnChange(this.triggerOnChanges);
    this.triggerOnChanges(prop);
  }

  removeProp(prop) {
    this.props = this.props.filter(p => p !== prop);
    prop.removeOnChange(this.triggerOnChanges);
    this.triggerOnChanges(prop);
  }

  removeCatAtIndex(catIndex) {
    let cat = this.cats[catIndex];
    cat.remove();
    this.cats.splice(catIndex, 1);
    this.actions.splice(catIndex, 1);
  }

  update() {
    let dt = Date.now() - this.lastUpdate;
    for (let i = 0; i < this.cats.length; i++) {
      let cat = this.cats[i];
      let action = this.actions[i];
      if (!action || action.duration < 0) {
        if (cat.visitDurationLeft < 0 && (
          cat.x < -100 ||
          cat.x > innerWidth + 100 ||
          cat.y < -100 ||
          cat.y > innerHeight + 100)) {
          this.removeCatAtIndex(i);
          // Repeat this index since we just moved the next cat in line here
          i -= 1;
          continue;
        }
        this.actions[i] = this.getAction(cat);
        action = this.actions[i];
      }
      action.update(dt);
      cat.update(dt);
    }
    this.lastUpdate += dt;
  }

  setAction(cat, action) {
    let index = this.cats.indexOf(cat);
    if (index < 0) {
      return;
    }
    this.actions[index] = action;
  }

  getAction(cat) {
    if (cat.visitDurationLeft < 0) {
      let offX = cat.x < innerWidth / 2 ?
        -200 :
        innerWidth + 200;
      let offY = cat.y < innerHeight / 2 ?
        -200 :
        innerHeight + 200;
      // Have a chance of running in a straight line
      if (Math.random() < 1 / 3) {
        offX = cat.x;
      } else if (Math.random() < 0.5) {
        offY = cat.x;
      }
      return new UndirectedAction(
        cat,
        'sleep',
        1000,
        offX,
        offY
      );
    }
    let directedActions = [];

    for (let prop of this.props) {
      for (let spot of prop.spots) {
        if (spot.occupied) {
          continue;
        }
        let targetAction = spot.allowedActions[Math.floor(Math.random() * spot.allowedActions.length)];
        let duration = (0.5 + Math.random()) * (ActionBaseDurations[targetAction] || 3000);
        directedActions.push(new PropSpotAction(cat, prop, spot, targetAction, duration));
      }
    }
    let actions = directedActions;
    if (directedActions.length === 0 || !this.editorMode) {
      actions = actions.concat(this.getUndirectedActions(cat));
    }
    return actions[Math.floor(Math.random() * actions.length)];
  }

  getUndirectedActions(cat) {
    let animations = [
      'sleep',
      'itch',
      'scratch',
      'sleep',
      'itch',
      'scratch',
      'wash',
      'alert',
      'still',
      'yawn',
    ];

    let actions = [];
    for (let animation of animations) {
      let { x: targetX, y: targetY } = this.getEmptyLocation();
      let duration = (0.5 + Math.random()) * (ActionBaseDurations[animation] || 3000);
      if (animation === 'scratch') {
        const dir = Math.floor(Math.random() * 4);
        if (dir === 0) {
          animation = 'w' + animation;
          targetX = 16;
        } else if (dir === 1) {
          animation = 's' + animation;
          targetY = innerHeight - 16;
        } else if (dir === 2) {
          animation = 'e' + animation;
          targetX = innerWidth - 16;
        } else {
          animation = 'n' + animation;
          targetY = 16;
        }
      }

      actions.push(new UndirectedAction(
        cat,
        animation,
        duration,
        targetX,
        targetY,
      ));
    }
    return actions;
  }

  getEmptyLocation() {
    let tries = 1000;
    let x, y;
    while (tries > 0) {
      x = Math.random() * (innerWidth - 64) + 32;
      y = Math.random() * (innerHeight - 64) + 32;
      let empty = true;
      for (let prop of this.props) {
        // Big objects are ones we can just hide behind
        if (prop.width * prop.height > 64 * 64) {
          continue;
        }
        let dx = x - prop.x + prop.width / 2;
        let dy = y - prop.y + prop.height / 2;

        // Vaguely too close
        if (dx * dx + dy * dy < prop.width * prop.width + prop.height * prop.height) {
          empty = false;
          break;
        }
      }
      if (empty) {
        break;
      }
      tries--;
    }
    return { x, y };
  }
}

class Action {
  constructor(cat) {
    this.cat = cat;
  }

  update(_dt) {
  }

  updateRunTo(dt, targetX, targetY) {
    const speed = runSpeed;
    let dx = targetX - this.cat.x;
    let dy = targetY - this.cat.y;
    let n = dy < -0.5 ? 'n' : '';
    let s = dy > 0.5 ? 's' : '';
    let w = dx < -0.5 ? 'w' : '';
    let e = dx > 0.5 ? 'e' : '';
    let runName = n + s + w + e + 'run';
    if (this.cat.animation !== runName) {
      this.cat.setAnimation(runName);
    }

    // Clamp to at most speed * dt
    let velX = Math.max(Math.min(dx, speed * dt), -speed * dt);
    let velY = Math.max(Math.min(dy, speed * dt), -speed * dt);
    if (Math.abs(dx) < speed * dt) {
      this.cat.x = targetX;
    } else {
      this.cat.x += velX;
    }

    if (Math.abs(dy) < speed * dt) {
      this.cat.y = targetY;
    } else {
      this.cat.y += velY;
    }
    this.cat.z = this.cat.y;
  }

  updateClimbTo(dt, targetX, targetY) {
    const speed = runSpeed / 3;
    let dx = targetX - this.cat.x;
    let dy = targetY - this.cat.y;
    let runName = 'nscratch';
    if (this.cat.animation !== runName) {
      this.cat.setAnimation(runName);
    }

    // Clamp to at most speed * dt
    let velX = Math.max(Math.min(dx, speed * dt), -speed * dt);
    let velY = Math.max(Math.min(dy, speed * dt), -speed * dt);
    if (Math.abs(dx) < speed * dt) {
      this.cat.x = targetX;
    } else {
      this.cat.x += velX;
    }

    if (Math.abs(dy) < speed * dt) {
      this.cat.y = targetY;
    } else {
      this.cat.y += velY;
    }
  }

}

const ActionPhase = {
  runTo: 'runTo',
  jumpTo: 'jumpTo',
  climbTo: 'climbTo',
  descendFrom: 'descendFrom',
  animate: 'animate',
};

const runSpeed = 0.05;

export class UndirectedAction extends Action {
  constructor(cat, targetAnimation, duration, targetX, targetY) {
    super(cat);
    this.phase = ActionPhase.runTo;
    this.targetAnimation = targetAnimation;
    this.duration = duration;
    this.targetX = targetX;
    this.targetY = targetY;
  }

  update(dt) {
    let dx = this.targetX - this.cat.x;
    let dy = this.targetY - this.cat.y;

    if (this.phase === ActionPhase.runTo) {
      let arrived = Math.abs(dx) < 1 &&
        Math.abs(dy) < 1;
      if (arrived) {
        this.phase = ActionPhase.animate;
      }
    }

    if (this.phase === ActionPhase.animate) {
      if (this.cat.animation !== this.targetAnimation) {
        this.cat.setAnimation(this.targetAnimation);
      }
      this.duration -= dt;
    } else {
      this.updateRunTo(dt, this.targetX, this.targetY);
    }
  }
}

class PropSpotAction extends Action {
  constructor(cat, prop, spot, targetAnimation, duration) {
    super(cat);
    this.prop = prop;
    this.spot = spot;
    this.phase = ActionPhase.runTo;
    this.targetX = prop.x + spot.x;
    this.targetY = prop.y + spot.y;

    this.spotOffGround = false;
    if (spot.y <= prop.height - 16 && !prop.propTemplate.isFloorProp) {
      this.spotOffGround = true;
      this.targetY = prop.y + Math.max(spot.y, prop.height - 16);
    }

    this.targetAnimation = targetAnimation;
    this.duration = duration;
  }

  update(dt) {
    let dx = this.targetX - this.cat.x;
    let dy = this.targetY - this.cat.y;
    this.spot.occupied = true;

    let arrived = Math.abs(dx) < 1 &&
      Math.abs(dy) < 1;
    if (arrived) {
      switch (this.phase) {
        case ActionPhase.runTo:
          if (this.spotOffGround) {
            this.phase = ActionPhase.climbTo;
            // Climb mostly up into spot before jumping to end
            this.targetY = this.prop.y + this.spot.y + 8;
          } else {
            this.phase = ActionPhase.animate;
          }
          break;
        case ActionPhase.climbTo:
          // Fix the previous nudge
          this.cat.y -= 8;
          this.phase = ActionPhase.animate;
          break;
        case ActionPhase.descendFrom:
          this.duration = -1;
          break;
        default:
          break;
      }
    }

    switch (this.phase) {
      case ActionPhase.animate:
        if (this.cat.animation !== this.targetAnimation) {
          this.cat.setAnimation(this.targetAnimation);
        }
        this.duration -= dt;
        if (this.duration < 0) {
          this.spot.occupied = false;
          if (this.spotOffGround) {
            this.phase = ActionPhase.descendFrom;
            this.targetY = this.prop.y + this.prop.height - 16;
            this.duration = 1;
          }
        }
        this.cat.z = this.prop.z + 5;
        break;
      case ActionPhase.climbTo:
        this.updateClimbTo(dt, this.targetX, this.targetY);
        this.cat.z = this.prop.z + 10;
        break;
      case ActionPhase.descendFrom:
        this.updateClimbTo(dt, this.targetX, this.targetY);
        this.cat.z = this.prop.z + 10;
        break;
      case ActionPhase.runTo:
      default:
        this.updateRunTo(dt, this.targetX, this.targetY);
        break;
    }
  }
}
