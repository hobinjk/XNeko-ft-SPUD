import { Spritesheet } from "./Neko.js";

export class ActionManager {
  constructor(cats, props, editorMode) {
    this.cats = cats;
    this.props = props;
    this.actions = new Array(this.cats.length);
    this.lastUpdate = Date.now();
    this.editorMode = editorMode;
  }

  update() {
    let dt = Date.now() - this.lastUpdate;
    for (let i = 0; i < this.cats.length; i++) {
      let cat = this.cats[i];
      let action = this.actions[i];
      if (!action || action.duration < 0) {
        this.actions[i] = this.getAction(cat);
        action = this.actions[i];
      }
      action.update(dt);
      cat.update();
    }
    this.lastUpdate += dt;
  }

  getAction(cat) {
    let directedActions = [];

    let baseDuration = this.editorMode ? 3000 : 20000;
    let scaledDuration = this.editorMode ? 3000 : 40000;
    for (let prop of this.props) {
      for (let spot of prop.spots) {
        if (spot.occupied) {
          continue;
        }
        let duration = Math.random() * scaledDuration + baseDuration;
        directedActions.push(new PropSpotAction(cat, prop, spot, duration));
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
      let duration = Math.random() * 30000 + 5000;
      let frameCount = Spritesheet[animation].length;
      if (frameCount === 1) {
        duration = Math.random() * 2000 + 1000;
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
  animate: 'animate',
};

const runSpeed = 0.05;

class UndirectedAction extends Action {
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
  constructor(cat, prop, spot, duration) {
    super(cat);
    this.prop = prop;
    this.spot = spot;
    this.phase = ActionPhase.runTo;
    this.spotOffGround = false;
    if (spot.y <= prop.height - 16) {
      this.spotOffGround = true;
    }

    this.targetX = prop.x + spot.x;
    this.targetY = prop.y + Math.max(spot.y, prop.height - 16);

    this.targetAnimation = spot.allowedActions[Math.floor(Math.random() * spot.allowedActions.length)];
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
        }
        this.cat.z = this.prop.z + 5;
        break;
      case ActionPhase.climbTo:
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
