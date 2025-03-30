import { Actions } from './ActionManager.js';

export class PropTemplate {
  constructor(width, height, spots, isFloorProp) {
    this.width = width;
    this.height = height;
    this.spots = spots;
    this.isFloorProp = isFloorProp;
    this.container = document.createElement('div');
    this.container.classList.add('prop');
  }

  create() {
    return this.container.cloneNode(true);
  }

  static deserialize(prop) {
    let { width, height, isFloorProp } = prop;
    let spots = prop.spots.map(spot => new Spot(spot.x, spot.y, spot.allowedActions));
    let image = document.createElement('img');
    image.draggable = false;
    image.style.width = width + 'px';
    image.style.height = height + 'px';
    // TODO xss prevention by forcing it to be a data base64 url
    image.src = prop.src;
    let template = new PropTemplate(width, height, spots, isFloorProp);
    template.container.appendChild(image);
    return template;
  }

  serialize() {
    let { width, height, isFloorProp } = this;
    let spots = this.spots.map(spot => {
      return {
        x: spot.x,
        y: spot.y,
        allowedActions: spot.allowedActions,
      };
    });

    let src = 'unknown';
    let image = this.container.querySelector('img');
    if (image) {
      src = image.src;

    }
    return {
      width,
      height,
      isFloorProp,
      spots,
      src
    };
  }

  addSpotMarkers() {
    for (let spot of this.spots) {
      let elt = document.createElement('div');
      elt.classList.add('spot-marker');
      elt.style.top = spot.y + 'px';
      elt.style.left = spot.x + 'px';
      this.container.appendChild(elt);
    }
  }
}

class Spot {
  constructor(x, y, allowedActions) {
    this.x = x;
    this.y = y;
    this.allowedActions = allowedActions;
    this.occupied = false;
  }

  clone() {
    return new Spot(this.x, this.y, this.allowedActions);
  }
}

const bedTemplate = PropTemplate.deserialize({
  width: 32,
  height: 27,
  isFloorProp: true,
  spots: [
    { x: 16, y: 0, allowedActions: [Actions.sleep] },
  ],
  src: browser.runtime.getURL('/features/xneko/dithers/brownbed.png'),
});

export const templates = [
  PropTemplate.deserialize({
    "width": 128,
    "height": 128,
    "isFloorProp": false,
    "spots": [
      {
        "x": 101,
        "y": 11,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 48,
        "y": 39,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 101,
        "y": 69,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": 25,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 48,
        "y": 70,
        "allowedActions": [
          "sleep"
        ]
      },
      {
        "x": -16,
        "y": 99,
        "allowedActions": [
          "escratch"
        ]
      }
    ],
    "src": "data:image/png;base64,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"
  }),

  PropTemplate.deserialize({
    "width": 128,
    "height": 128,
    "isFloorProp": false,
    "spots": [
      {
        "x": 101,
        "y": 11,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 48,
        "y": 39,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 101,
        "y": 69,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": 25,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 48,
        "y": 70,
        "allowedActions": [
          "sleep"
        ]
      },
      {
        "x": -16,
        "y": 99,
        "allowedActions": [
          "escratch"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAABhxJREFUeJzt3c9LHGcYB/Dvho021bjErRLXS4iYg+lSBW2FBSHSbWDxUMixlKaQQ3sI/QcKodD/oIf0kEMh9NibLEiCgYAQ6oIpa+xBIu0hKqZrXOPWrJZMD+tsdt3Z3Xd2Zt55Z97v5zSus7Oj7/O+88z7YxYgIiIiIiIiIiIiIiKi0Ip08qZMasSwej279Lyj41GANCv8dr+jEGhXwLc+H2cAhJVI7WYLEFKiBcsWIITs1Gq2AMFzxs2DJQbOu3k48pvdGs0WIHiibhzELPjEwPnqNvsEgqFpAGRSI4ZIIWZSI8Zm77XKDy8foTjaX3kdEHo/+ctRDlBb+ImDR8guPY/E1ncBAMXRfl4SAsCyhorWfnNfoL7J52UAyKRnlAr+7IPHlmXhKAcYv37LyC7ci5jbTxfuRVI3p4zsL8sRAEjdnDKWTrZ1kknPGB+OXUHyctzvUwEA5DcKAGBYBUFDANip/T1DfzRsl7Y+ArDcsK2b5OU4BgfUCIAkgNU16985ygFqa7e5/fSkRTi9TWqqCwA7tZ/CwdWeQAoeVzqCqFF+o4Ck3ydx4iQJtMQA8MBJtm00S7z84MltIDXX7B9+WiY9Y/THehA7Z2Dwgwst9433dVe3/9zYRvEwgt1iSfizrDAHCJDCftn1YzIANMcACBi3W4FqAGRSI8bsJ1c4gKMZtgCaYwBoLgq8G7pczJeA94eRSQ9Luww4uYXRlZt5QNTPoctWw5QkRxTwb+iy1TAlycEcQHMMAM0xADTHANBcFPBv7LrVODXJEfV77Jq3gP5q+c83x6pLL35HT/cZjE582vaA6ysPUSq/Rc/wx47HqoNCtTUAorIPHkc4IcQhsyPt0sU+v0/Flr+29wHAsBUA6ysPvTmbgLt0sQ/xC8FbGr+6ZnNKWKn8tu0+Pd363lice6/L71MQcvjmqLptKwDGpz9ru49brYTM66qbeUp311m3DuWJ8tFx3c9K5gAyB6h0H5BSNgeQNUCl+4AUcwDNKZsDkBxK5gCAvO5pFbujnyyvWL4+PTXh+mcpmQPI7p5WIQGsLfSl/Fbb/d0KBmVzAKtC8XsZlRfMghcpdKt9nAZCaHOAwn65LghU9GR5RajgrdS+z0kQKJsDhJmdWt+O00BQMgdwi4qtgJNa34yTIFA2ByA5QpsDqMiL2l/LPLadVoDVVRKvC9+0lN9q2o9gJdQ5AODNQxXChDmABLJqv8nOpYA5gOZYXTUX+hzAb7Kbf5PoZYA5gOaYA2iO1VVzzAE0xxxAc8wBNMfq6rHpqQmkkkPSPzeVHHK/J5C1O3yYA2iu7kGRVnaLJaD3KsoAILDszdyvXCyh3bFVm6DpFbMpltUjKNr8AzUPipS9vt1cn65LEKgqClTWtw/GY9I/XKc1ebJaATu1HwAimfSMMTc7icF4DN3dcpY2l8vH2CkUMb+Yk/J59M43X1zH4ZsjFF69xvxirjEJ7Drr7Uzxo+P/AADzizmo9PWqOshvFPDzrwv46sa16mu+rgtQ6etVdWC1FL6jAJC5eJG8ZSsARFe0MBCCQygARAv+9O8ZCOprGwCdTGkSXaqk0ter6sDqWQgtA8DpfLZW89LmZicxv5jTqi9ABeZtoMn31cF2egLtPB+g1s4/r4SfD+DGMwi++3pO+NxkE35MnFuzWTtZrxYUzVYfn/4nq8z3FiCMaptY1VkGgNtz2XVrBQqvXvt0NuK2X+4BYAvgiaCMcfBx8R5RLbFthdN3NMcAcEGQn0HAANCcZQC4PZXZ7iwVkoctgOaa3gW4NYfNbu2fHEtUZxHn1jY5YdRjSt0GTo4ljLu3xzEYq8xNvPHjssEg8FbLS4DTXMBO7Z8cSxg/fHkVO3vHWP37X+wUj/Hb91N1LQK5r20LUFuAopcDM2jsFn6tnb3KgMrd2+P49iewJfCI0CXgdEE2CwS7Bd+OGQTkHVs5QLuC5a1e8HSUBLpd0Lm1zcid+2i4DADAnfvPeDfgIWX6ASpB8KzuNRa+95S6DTRbgtqf/TwfHUT8/urz3t7hjt97cPDC88/wmujf0IzKfxsREREREZHmMukZ8Wm/REREREREREREbvofm5TLpRDQP50AAAAASUVORK5CYII=",
  }),

  PropTemplate.deserialize({
    "width": 40,
    "height": 50,
    "isFloorProp": false,
    "spots": [
      {
        "x": 48,
        "y": 37,
        "allowedActions": [
          "wscratch"
        ]
      },
      {
        "x": -15,
        "y": 36,
        "allowedActions": [
          "escratch"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAyCAYAAAAus5mQAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHRcnFbY99gMAAAIXSURBVFjDY2SgAOioqv5H5l+5fZuRYTAAHVXV/+iOg4nX1dUZDbjjyHE8uYCRVMchR6OinBTZDrn/6BkjVR2IzXG9LWVkh0xxTRdRjiTLgciO4+PlItlxnz5/I9qRLJSkDyFhIQZ+fgGS9bGwfWB49/YdUWqZGAY5GB4ORM8goyE4IhzYNncORRYTq5+iECzp6qK5PhZKoyC1umpgoxhXDq5KTqHIYmL1UxTFPWVlNNdHcRTPbm0jWc/Hjx9GixmGujnrKbKYWP0UhWBO51ya66M4DcZW9Q7OKG5KCaTIYmL1UxTFU8qTaa6P4ihe3FY8cMXMQLYDKY7i5bMOU2QxsfpRotjCXgXez/3yjJHgUMbU9o0MVR3xJDtuavtG0tOghb3K/6wqJ7jEtLZ9DAy3iWjXVSykfRSjO46BgYEhq8oJJUTRQWSaLUUWE6ufCZvjYCA62wivI7Mr/clyHCn6WCgtCshJg6QUMyyUaKZ7MUOK41onHaXIYmL1M504eIdxWts+rI5bOvUcQ3PrYmNcmovrN5PlOFL0MSIXM9HZRiiOO3HwDtZyUFFO6r+QmDXF0ffu1VHiR7egjvmPxscJqvOsKYrm6jxrhuKao6SlwRMH7zDCMDGW9Db6kuU4UvRR3JqZMyF2tNM06sBRB446cCg7EGdVNhgcd//RM0ZGbI7z83IZFKG3adse7DXJo8ePR6OY2CgGAClO3nc0WUGSAAAAAElFTkSuQmCC"
  }),

  PropTemplate.deserialize({
    "width": 36,
    "height": 54,
    "isFloorProp": false,
    "spots": [
      {
        "x": -6,
        "y": 41,
        "allowedActions": [
          "escratch"
        ]
      },
      {
        "x": 43,
        "y": 41,
        "allowedActions": [
          "wscratch"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAA2CAYAAACvHjsIAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHRcrB+kxyEcAAAGqSURBVFjD7ZkxSwNBEEZ35bAQNHJ2KU4StI8QG0EiYmchloJBsBBUBMEQjAZEiEZCBEFUsBAkgqVY2IkYLA1oZ6EkeEW08UgUbM8/cMJ8s0EW3Knv7Tzm2ymWkwKoiBP2BbNqbl1SvpOIzG4uzfURK9kCSUqiMl2dHbDM59c3WcpCDrZ7bBEKdcNCVntDeB8e6ds2oVkZISP0Z0JuyVNqROWhCT3uvbBkEM5CDy9vVvSIzEnaSo2oPBRZbLmPJYNwcGSJjTgs1Gw2/sHav3pXSo2oPDShh+cSSwbh4Dt0W9nXI7Jee1ypEZWHIhvoT7JkEA6ObCS+ZNY+sM6P75QaUXloQgf5S5YMwsF3aHv1VI/IpuaGlRpReSiyxcwESwbh4MjWdmbM2gfWUVWtEZWHJrR1z3t5IBx8h9LXVT0im4+qNaLyUGTrg7yXB8LBkRXGombtg5/DxROlRlQemtBNpsiSQTj4Dl0sZPWILJaaVWpE5aHIRvMplgzCwZFNHubM2hshI2SEWllSCLU/ha2smluXVsQJ+0PTCT3Gc1b2LSGEeHt6N5H9FtkP8Eh/+8r0tgMAAAAASUVORK5CYII="
  }),

  PropTemplate.deserialize({
    "width": 36,
    "height": 54,
    "isFloorProp": false,
    "spots": [
      {
        "x": -6,
        "y": 41,
        "allowedActions": [
          "escratch"
        ]
      },
      {
        "x": 43,
        "y": 41,
        "allowedActions": [
          "wscratch"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAA2CAYAAACvHjsIAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHRctBshsX1cAAAGgSURBVFjDY2QgASjKSf1nIBPcf/SMkRh1jKQ4preljFz3MBTXdBHlKEZSHcPHy0WyYz59/ka0o1hIMVhIWIiBn1+AZAexsH1gePf2HVFqmRgGGRh10KiD6Oag6Ucps4hY/SSFUOumd2Q5hhR9LKQaXrb43uCIskxryiwiVj9JUVbtJ0SWY0jRR3KUdcUqkeygjx8/jIRs/+4UZdmeSP2kZfvbO8jL9iToIz3bn1kxSLK9kBll2Z5I/aRle1UP8rI9CfpIz/YmEaPZHitYPuswRRYRq5+kEJravpEsx5Cij+Q01FaxcHBEWWSaLUUWEaufpCjLrvQnyzGk6CM5yqo64kezPVawaDFlFhGrn6QQmjCBvEY+KfpITkONjYOkkR8XS5lFxOonKcoKCshr5JOij+Qoq68fbeRjBw/fbaXIImL1kxRC52+TVxiRoo/kNHTgzOTBEWXyQt4UWUSsfpKizFCVvMKIFH0kR5mDSe5oth910KiDRh1ETcDIwEDZTCE1wf1HzxgZFeWk/le7dA6K0GndUw4pqe88vj0aZbiiDADshH2zTige8wAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 36,
    "height": 54,
    "isFloorProp": false,
    "spots": [
      {
        "x": -6,
        "y": 41,
        "allowedActions": [
          "escratch"
        ]
      },
      {
        "x": 43,
        "y": 41,
        "allowedActions": [
          "wscratch"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAA2CAYAAACvHjsIAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHRcuFWf/TUoAAAGeSURBVFjDY2QgASjKSf1nIBPcf/SMkRh1jKQ4preljFz3MBTXdBHlKEZSHcPHy0WyYz59/ka0o1hIMVhIWIiBn1+AZAexsH1gePf2HVFqmRgGGRh10KiD6Oagh++2UmQRsfpJCqHztxeT5RhS9LGQaviBM5MHR5TJC3lTZBGx+kmKMkPVWLIcQ4o+kqPMwSSXZAd9/PhhBGT7R4vfUWQRsfpJCqELE+6Q5RhS9JGchg42nhkcUSYXK0SRRcTqJynKDApUyHIMKfpIjjL7epPRbI8VLJ91mCKLiNVPUghNbd9IlmNI0UdyGmqrWDg4oiwyzZYii4jVT1KUZVf6k+UYUvSRHGVVHfGj2R4rmH6PMouI1U9SCLWeJq8JQoo+ktNQ2Z57gyPKMpUos4hY/SRFWbUpeU0QUvSRHGVdLkqj2R5HI52yvj2x+kls5JPXtydFHxmN/EHSt5eLpaxvT6x+Ehv55PXtSdFHRiN/tG8/6qBRB406iKqAkYGBsplCaoL7j54xMirKSf33SOgcFKGzY0E5pKT+8Pz6aJThijIABn1/x7wsws4AAAAASUVORK5CYII="
  }),

  PropTemplate.deserialize({
    "width": 22,
    "height": 19,
    "isFloorProp": true,
    "spots": [
      {
        "x": 36,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -14,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": -17,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 11,
        "y": 15,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHRcxC1CqfrcAAAJNSURBVDjLrZRdSJNxFMZ/7zZk21ujxJaBgQ1cWxFzkCJFRHRTSIawC2+EbibSoBtJggqkMEIKgpgX7SYcRMIg6iIiQujCspR0GbgPdMMPBC1m0+3dFLcuxrv2aWo+l4dzfv+H5/w5AlvotdOZ5h+66nAIpepCOWBMktiuRI2m6AHhf4BbwYVy0HGfL28wHAgCUGusy6tbTaaScIVcLAUNB4Is+2foOp/ktmWTO43rhANBbNrvnEt+zfbK/TFJyu5FVeg2FwrguKjlyf0xpqv1gBKXvYHESghdaJ2ZLxMMK0VqjXWM+3xYTaasQVWuWxlqXBrl7s3LKFMpXH1DTFfrcV47SUWFCvuzUa5fOkX/2CQnqKT3gpaEQsI9p8mLSFW4hHAgiKFKz8CLYeKLCUaVIl1nqtAZDzHiGQMg8HkE94NmVudmiUwtMfTeD+b6PI6i1IKiU0E+LihorM84ffzpJ5033uL8toa7+xgffoskwhF+hEQqj4i0dZqL/3GPzZY2NjVlo2jZ8HK88SiOwV+4OiyMz6bofzeJuBYntk+bN3zvtI7kRoRer5LWlisAzHu9xCUpE8W810uNxYLVZOL5yArRwWUetlSgPhDFHFnFZW8gsjjF0wE/Hc16FGo9yv0xbr2JAn+hRY61mkzwNRYLAEuvXgJgMKxz+KCaRxOaosGzmzEA9K1tWaey4pKUD86F70S5UBmsKte0nQcKgUW3oq+9Pc0eqtvtFhSy9b2SzMoeocKsdwvt8XiEkvd4N7HkArc89D02247ghVCAP472E0Cs8r6aAAAAAElFTkSuQmCC"
  }),

  PropTemplate.deserialize({
    "width": 22,
    "height": 19,
    "isFloorProp": true,
    "spots": [
      {
        "x": 36,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -14,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": -17,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 11,
        "y": 15,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHRc2LlTvPDcAAAJISURBVDjLrdRfSFNhGMfx79nGWi1lypqL0cUsouzfEBP6B+WVIe2yvBHqYmJRQrSGFHURJUOMLsIu3J0jiaibpFgRo1DL5oitP4rVOqnVZoy21NmQdF3EDtvZZmb+Ll/O+Tzv+7znPAIL5Lb/Q4q/5HDVBiHfulAI1JcZWWyiE5GcAsL/gAvhQiH0Wpsz60VNsBeA5I59WeunHS15cQn2jk+n5Kgm2Is2pcTZaCLiExFWzHHZp8Zu+clELIlLZ80pkMYF+W4zUQBHTRF3u0OEjAYAXLadJOMiMXGWhy/C9Cu10inSeM261YIKQI5aR3s4cvYgyvl5XG1eQkYDHUe3oFarsHUOcqJ2Gzf8r6mglCsHVpFUiJyPmrNapJJfgibYyy+9ga7ufmbCSQaVWs7s1lO8cQ0Dd/wAvHs+gLu1jqnxMWLD3/A+GoHKbFiR74Imh9/z9IuCasufnV59FqWp+QEdL6dxO8w8/qEl+SnGG1FL6Vot9U2bc74Shd3tkS4tsXUXzeYZjp2sBMBStZ63kazaNLSJANg6gxijo3we+sop15jU377AEHa3JyXY3Z5Usa6UvZYKAFovnKPkYxCnVY1pk4m4OIVGZyYWHuZ61wiNdQYUGgPKogQt92YBOH7zvlS4LzDEZPw7EgxI+Kv6/QCUl89SVqKhPbAy56h75hIAbL/1RALTyYEz8X9JJpqGVYUeWkwBOZgzKy71+FIsYy4eqhYU6a0vV9KWNCvkvV4q2t5QK+Sdx0tpSya44KDP/GkWEzkK8BsJygBgFgQe0gAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 22,
    "height": 19,
    "isFloorProp": true,
    "spots": [
      {
        "x": 36,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -14,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": -17,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 11,
        "y": 15,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHRc1AdQTUq0AAAJKSURBVDjLrZRdSFNhGMd/ZxtrdVBKdBnlhYbCkmhEhtRVmaIMBt1EBIFdTETMLrLV1YioMLGLYXrhIERhUBSBUJRf1IW1nERSNpaMlbNmUzg1PxqCWxfjjO1s2jL/d+/L+/yer/d5BDbQw+EnMf6iM6dOC5nuhfWAYkEu2Wp5PpzmQPgf4EZwYT3oyMBgimFgyAVAUXVlyn2VuSYjPAF+OjkSU0IDQy7EmJq2hr3MjfsRtq1xc1xLq/E3P6QIL8vq0hzIcEEZbTIUwHoyh8dOH75CPQAOSwWRn34k/yov3gYZU4uJLGS46VCVoAFQQg3u51y/Uoc6GsXRPoqvUE9XfTlarQZLj5um2oN0T3zgAHncOrGDSHSWXtW+lBJplE0IDLkozdfT5xxjJRjBrRa5fCyf3LICXI8mAPj8xkX/bROLgRkkT4jRQS/UpoJVmRoU9kzz6puKo8Z4pHdfL9DY8oyud0v0W4sZ/iUS+SLx0S+St0fkbKMh7ZeorHZbomlF1ZW0FK9wofkwAMYj+5maS/HN+XY/AJaeSQoXvjL76TsXHTOJ+nqmPFjttphGPhjKDVSZa7jfK7H0wEubWYtuZxiDtIjDUoEU9NDZ56XBpEel06POWebaQBhQU99pS588q90W0xfEO24oj6c03XQVgJKSVXbv0tHxfnua4fG1ZQBKu+8kIpUVmg+lgpPh/6JkqAzWrPcoGwdKYNqu6HDei7GFaj3XLKjk0LdKMiuxK5S13iy0/dINIeM+3kxZkoEbLvrkoclGSijAH5xq/WgjjX9PAAAAAElFTkSuQmCC"
  }),

  PropTemplate.deserialize({
    "width": 22,
    "height": 19,
    "isFloorProp": true,
    "spots": [
      {
        "x": 36,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -14,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": -17,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 11,
        "y": 15,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHRc1InZ0I98AAAJLSURBVDjLrZRPSJNxGMc/794xVy+GjbUWnTRtaiQyMrBO2aUQCjpUHoISJtofwazRpVN/kJF1CBs46KBgFNWhQ1GE0ME0lVFW6tKxMmsqo3fNtGXp20Hetb2vLjO/t/fH+3y+z/v9vc8jkEY1rjqFv8jruyYsdC4sBizKL2Wp6hvs1BkI/wNMBxcWg/YNdqYURgJ+AKwOZ8q5tkaFJ8DexjuKFhoJ+JEUkYaqjYx1hxAyZrnYbeJM8XfG5TiPzLt1Bipc0HabDAVwl2Vyry1I0G4DwOcqIR4NIYdmePwiTIcoJb5CZdTUHxSMWjcA53g7h87uRZybw+dpJ2i30XR0CyaTEVdzD8f3bOVG72sKsXBp12rihgm8o7aUiIzaS4gE/Pyy2mhp62A6HKdHlKjfYWXN5nV03e0F4F1nF62Xy5n8OII8MEH7kwAUpoINC11QbGCIZ58MbC+e77TxeYTq2oc0+b/R6s7m6VeJ+HuZNyEJywaJw9UFur/EUFnxZwisDie12dMcOzmfWfG2TbwdS/HmiCcEgKv5FfbIB0b7P3PKN5KIc2g4QGVFnWJUH/JyHRTll+LtivHz9jAN+0yYs2IUyJP4XCXI4QGutwSoKrdhMNsQM6c49yAGiJTtP6GfvMqKOiUrywJAXq4DgB/3PQDk5Mywfq2ZKy9X6Qp3zk4BkHHAnehUVTT6JRWcDP8XJUNVsHGxl5ZioAXqdsXpmgsKK6ir3vOCQW19paSyErtCm/VyoTdvaZaQquXEkgxMu+iTh2Yp0kIBfgORQvzPmkaHiwAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 22,
    "height": 19,
    "isFloorProp": true,
    "spots": [
      {
        "x": 36,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -14,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": -17,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 11,
        "y": 15,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHRc2CIbiucoAAAJFSURBVDjLrZTPSxRhGMc/s7Ns1mSUutuEJw0CW1okskMdYr1YCMJepMtKHlYkyksl/QEVInVJjHDp0C4IDdWSh2AjXDpYtkqUtYmFbFnm5g+m1rRF0OkgM+zMrGbm9/a+vM/n+fU+j8A6SqVSGn+R1+sVCt0LawFlWWajymQyNgfC/wDXgwtrQWOxmMkwHokCUNcUNN0HAoGCcAM8NzenWaHxSBRJE+loKSeTTCNsW+ZK0sXF6t98V3NMn2izOdDhgjXafChAe20xD3rHGZc9AIRDNeR+pFHTS8RfTjEgSkYWOry0tFRwAlihWl8Xdy6dQlxZIdzZz7jsofuMF5fLSahniLMnD3Fr+C0HKeGqfwe5yQTJcr+pRE5rE+KRKLVlHiK9AyxO5RgSJS4cK2PXATeD94cB+PBikOi1eua/TKCOTtP/ZIydzWawo1CDsqMfeTbp4Gj1aqQ3ns/S2vaY7le/iLZX8PSnRO6Tyru0RMk+idOtVbZf4lAUxWhaXVOQtopFms8dBqD6yH5SGZNvgp1pAEI9b5BnP/P1/TfOhyeM+o6MjKAoiubUDz6fj0AgwN1slpv3HtHR4KJod5YqdZ5wqAZ1apSuyBgt9R4cRR7E4gUu92UBkduxh/bJUxRFc7vdAPh8PgCiDXUAVFYusXdPEddfb7cZHl9eWM2gL25EqmtmZsYMzof/i/KhOti51qONOLACbbsikUhobKH8fr/g0EPfKuksY1dYa71ZaGNjo1BwH2+mLPnAdRd9/tBsRFYowB8JIQCrdA5beAAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 22,
    "height": 19,
    "isFloorProp": true,
    "spots": [
      {
        "x": 36,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -14,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": -17,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 11,
        "y": 15,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHRc3EfuSIEsAAAJcSURBVDjLrZRbSJNhGMd/3zZm9mGRLnMpoWYDG+aITEgIlQojKAgUb4JEDInaTemNhkkaInkj2IUHggQDy4tuokysCA85iaTMWo2Zh82JY1k2h6FfF7KP7ds0M/+X7+H3fw7v+wiso1HLc4m/yJhxUgi3LqwFTNgby0Y15ZgNMRD+B7geXFgLeqOqOuii0+oGQG+ICVq/VV0VFi6D56dHJCXUaXUjSmrqLsUzM2RHiFimZkjLddMiLo+PnoiUEAM/XFBGGwgFKM+NoqvDhi1udb+lJAPfdzse+xLP3jjpU4tyFn74zvh0QQOghKbN2qgpO416ZYWW+l5scbE0XTSi1WooabZwOS+Nu8PvOUg0tTnb8akiaZ1cDCqRRtkEp9VNqi6W+x19eJ0+LGqRa8d07DDsZvDRMADWgUHab5/h5+QEnrFZers/Q+q+II4qXIN+jH3h1bSKo6bVSBv65yg1P6Hp7QLt5Un0zIv4xj18sItE60UKS1NDXomq0pwvN01viMGc5KXoymEATEf2MzoT5M2FejsAJc0jxM19Y+qjg6stE3J9Xz7tpNKcL6mPZxpv/l6YITHFSG5ONg3dA3T1z1N3Vkt0QgRRXjfns4xkJi7yadBOWW4kJw7oOHVohYoXXl67VLQ+aJSNx7+O4nC5ESrN+VJGugGA7LwCAO4VFAOQnLzEnl3buPMuMiTVrOVfABR1tsmR+mUZsQaDA+H/okCoH6xZ69BGDJTAkFnxuK1CYgt1rrhWUPlD3yr5WfKsUNZ6s9CaxodC2Hm8mbIEAtcd9IGfZiNSQgH+AD7UAn1NSmTeAAAAAElFTkSuQmCC"
  }),

  PropTemplate.deserialize({
    "width": 22,
    "height": 19,
    "isFloorProp": true,
    "spots": [
      {
        "x": 36,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -14,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": -17,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 11,
        "y": 15,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgAAIt+Z+3IAAAHtSURBVDjLrdS7ixNBHMDx78xmd7OXxz04ObEWFSsLsfIPOLiHCmLnHyEEURGFE0REsBcr011hoU1AsLISCyurQ8TLQUSNee4muzM7FmFDSDYxd96vm9fntzM78xPMiN1Pe4Z/xI2Lp0Vav5gGrq6dZN749aM2kUD8DzgLF9PQ50+fzAXeun0nFR/C7/c75rBoWoIEl+M/KQ3VWrGlqmituBZWU+FkXbJrOdpIBrVWaK3Y6OwRtFtsxgeE/ZBt/zuv1BpBu8W6GSSaFplpAxuqii8FV9wmvh/hGoGSgutmH5F1BnNkDd3o8G7p3MR6mbbt0PfByWCFMVEQIoXAcR2CZhu/2cX0Q2wFrh/yxjqV+uWZUrliRtHN8ACzYBFHhp5WWJaN6kf47S6FE8u0fv8hjvpYvQAn52HZebaDr5zZeQnAh89fKJUrRiYNgNLd+7xWy0RRSK/RYqGYRyIo5DxWVhep137iFXN4hRyZxTy2MVzV34Zo6lEk+L1Hj7FdB7voIZWGWBHEil5fkc06SCGQQhB2fYzncvbhi+H6xAAQpXLFFJdWhh2XL5w/9B0eBQFajfrkrUgmzZNgHJyoFTtvPxqOMR5sXRq8vFajfmxoYg1rxfhZHxV9dnNdpNbjoxzLKDiz0I8+mnliHAX4C92L+7O4Mn5iAAAAAElFTkSuQmCC"
  }),

  PropTemplate.deserialize({
    "width": 22,
    "height": 19,
    "isFloorProp": true,
    "spots": [
      {
        "x": 36,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -14,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": -17,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 11,
        "y": 15,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHRc7DDQhA54AAAHjSURBVDjLrdQ9ixNBGMDx/8wmu7e3lxwel+sUIUcwnJWCX0CxFARREARBrlO0kJQpLMUm4GewsBEEG/EqSwuxOFIpHucF94JZ87bJvmTHQjbkkt3c69PNzs5vZp6ZZwRz4u2nd4pD4u6N2yLpu0gDrUKeo0a/2ZmZQJwGnIeLNHTr/ccjgddv3UzEx/CHb1vquGjSBDEupw8pDb3UsAG4/MtO7I/HxbuWk41ptPRjB6flsL7XwPd8St93+byo47QcirY9dweZtI7i7h6uFFzxPNxhgKEEoRRcbfcQug4ZKNo2o3aPn6XizHiZhDotB/QMmh8RDHykEOiGzqDdxW33UZ5PNgTD9fm6upK84kqteqAI1ncaKF0jGimGoxBNyxJ6AW63T65wjs4fhyjw0IYDdMscp+z8s00A6tt1KrWqknEjPtkvOZMg8Bn+7bCYX0IiyFkmK6vLtH43MfMWZs4is7xEVimudXtjNDEVMX7n4T2yhk42byLDEUQhgyhk6IUsLOhIIZBC4PddlGlw4cmj8fjYmDm8+nad8kaZi5sPjnWHJ8HUWxH/VN4onwg8UNKv3rxWnGE8v//4f+XtN/fPDI2t8VtRqVXVWmHt1OjLpy9E4nt8krRMgnMf+umiOSymUYB//AneXAjDKQcAAAAASUVORK5CYII="
  }),

  PropTemplate.deserialize({
    "width": 22,
    "height": 19,
    "isFloorProp": true,
    "spots": [
      {
        "x": 36,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -14,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": -17,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 11,
        "y": 15,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHRc7KAgi508AAAHaSURBVDjLrZSxb9NAFIe/Oyd2TJqkVGRkQGrVIqWtGCo1SJ2RmBBb1kgMHcPOxA5jByRW/glGpDJ3oVW7A2qJ7ZTYiX3JMRRbrmMnhfY3+e7e++7de35PMEf7r3qaBTr48F7k7Ysi4NZGm5vq6Phw5gJxG+A8uCiCHh0f3giY9YnhssjgXyKN7bc22kldZLZIRdAnJQeAHekUXpAOUKYXWei2+o7nDtg0LgjHIdvRTz73DTx3QMty5r6kVHTQEuf4UtBuKnw/wtICJQVPawHCNK9sLIeJ95tvlYcz/jIP6rkDMEsY4ZQoCJFCYFomgXeJ7w3R45CyAssP+Tpq5Efc7Vxvgk19gW4aTCPNaKIwjDJqHOFfDqk17zP45TCNxhijALNqJynTrZcAnJ6d0O30tIwXca6/eCZRFDJyB9yrLyER1Ko2Kw8a9H+cY9er2LUqpcYSZa3ZawQJNDcVMXxv9xlly6Rct5FqAlNFMFWMxopKxUQKgRSCcOijbQsev0j8Y8ZM8U7PTlhbXUc+eo71d89Onae/6xm/hX9FbLS2ur6wOfKA11r69f5bzR3q3cEbIQFct39n0JiVDKFup6eXl1duDf346WoIzczj/0lLGjh30GebZpGyUIA/10vbBFE7HiAAAAAASUVORK5CYII="
  }),
  PropTemplate.deserialize({
    "width": 22,
    "height": 19,
    "isFloorProp": true,
    "spots": [
      {
        "x": 36,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -14,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": -17,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 11,
        "y": 15,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHRc6LWFTIoEAAAHQSURBVDjLrZSxctNAEIa/O1sny4rtQBiqFA4eGDNhxoShcM8D0KjNE6Sndk2fJ0ibhoegZBh16XHBDBNjJ7ZkSScfhUcaY0t2cPi729v97m53bwVb9OXy0rBDHy8uRJFdlAFnYchD5TrOxgHiMcBtcFEG/X5z8yDgWbdbCJeZcR9o5pv5z8Iwr4tcL1IZ9KWlAXhd0aUHrF5Qri7WoZ10ymg85qQaEUcxHR3w9XZpa9f01pdUyzback5gBG+fuwRBhG0EWgrOmgqh1NKnpkknU37Yhxvxsgg6Go9BVanEC5IwRgqBshXh5J5gMsNEMZYGO4jxS5pIDDzPvOr381ScEGFUhUVqCO6nVJSFjhJ0ktA4OuTu9jdWTVFJFyjXYUidTjqlefoegKHvE4Th8sZD389b59s4JEli5uM76s0DJIKG6/D0WYvRz184TRen4VJtHWAZwwuCHFqYigz+od/HshVW00HqFBaacKGZR5paTSGFQApBPAswjk2r+y6PzxgbxRv6Pse9Hk/ab3b279Fa3M6uyJyOe72d8CLgX1/68/m54T/q09WVkADBnoOnSBkrH0IDzzN1x3k0dHB9LQrn8T5pWQVuHfQDz/sn+DoU4A/zROT8TbwwfAAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 22,
    "height": 19,
    "isFloorProp": true,
    "spots": [
      {
        "x": 36,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -14,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": -17,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 11,
        "y": 15,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgAACXMlAjIAAAHMSURBVDjLrdTPbhJBHMDx7wzsbrcUmhpJeAMTSUh69WK4eeUgV57HpDfjS+yFFzBiE0yMYlKJePIBSDZomQrsn2HHg9kNLgultb/bzOx8Zuc3Mz/BnphMJoZbotlsiqJ+sQtsNBocGtPpdGsB8T/gPlzsQvv9/kFgp9MpxDN4NpuZu6JFC6S4zB/SLjT5MgRAfh4Wjqfz0l3LzUYe1R/eopQiGl0ShRF6+I7rJy2UUoRXw707KO8aCD+9J5QC68dXlkGMYwRaCuxvI4RtQxnCqyHr+W+On7/Ymi+LUKUU2GVKUUK8ipBCYDs2q/kNy/kCE0ZYGpxlhD5/VvzHnuf98wiij5c4dolkbQjWmlLJQocxy5sF1foZavaLJA4pBSvsipul7OXFGwDG4zGe5xmZNtKTDZ6eE8cRwbXiuHaCRFCtuDx6fMrPqY9bq+BWK5RPT7CMwf0+ytDCVKR4r9fDcmysmovUa0g0q0QThJqjIxspBFIIosUS4zp0X73O5qcGgPA8z9Tr9ayj1Wrd+Q5vggC+72/fivSjQxbIg1u1YjAYGB4w2u3235fn+/6DoamV1Yp8ru+LdrtdUViP75OWTXBvoc8/mtsijwL8ASEf5x63nY8vAAAAAElFTkSuQmCC"
  }),

  PropTemplate.deserialize({
    "width": 22,
    "height": 19,
    "isFloorProp": true,
    "spots": [
      {
        "x": 36,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -14,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": -17,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 11,
        "y": 15,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgABA4rr2m0AAAHWSURBVDjLrdS9TxRBGMDh38zefrHcgkYsjLUQxEhDT2NCZ3UkGjv7S6wM8Qy5iDFa2vsPYEVHYkNrqK6gMZZqDAb1wNub/RwLspvjbvf4fLvZmXlm5515RzAm9nY/aU6Ju0sPRNl3UQXevnWTs8a3H/sjC4jLgONwUYW+XG+fCXzVXi/FC7j7vaPPi5YtkONy+JCq0AXTB2DR8Ev783n5ruVgYxidTy1CpZireURhxHzi8Lm3T6gUs44/dge1qo5ZOUGgUxb8GYIgxNaCRAruWdMIyzoe4/ik3X98tbOR+bIMDZUCq4YRZcT9CCkElm3R7x4RdHvoMMJMwA4i9nRQ/setZuNEEczhoX2fLNaoNMEwTJIwJjjqUZ+5xuHBH7I4xFB9LM8tUvZoYw2Ane1NWs2GlnkjP9mOOiCOI9TfQyb8SSSCuudy/cYUv3/+wvU93LpHbWoSU2sWnekCLU1Fjr97+wbTtjB9F5mkkCX0swQVJjiOhRQCKQRRL0C7No/bz4v5uTFyeDvbmyyvrPJk7dm57vAgWHkr8kHLK6sXAk+U9NaHF5orjIdPXx9X3m7ny5WhuVW8Fa1mQy/dv3NpdOP9R1H6Hl8kLYPg2Id+uGhOi2EU4D/2p9DB3wRVMAAAAABJRU5ErkJggg=="
  }),
  PropTemplate.deserialize({
    "width": 22,
    "height": 19,
    "isFloorProp": true,
    "spots": [
      {
        "x": 36,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -14,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": -17,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 11,
        "y": 15,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgAIIY5JIMAAAAF2SURBVDjLrZSvT0MxEMe/1+y9vocghJDAH4BCIQiKPwCDBIcl/AHTCDR/wDI7xyRmCjVFEFNTOAwkZFkWwvsx0pvYWrq2e4yxU23T+9z1vtcjVNj98wvjF7s42qfQOS0C7uzuYVn7eH/zAtB/gFVwWgRtNNtLAa+vzoNwA358/WQXGicpAKDMMxAJA4ikRJlnwQAaLlyR7EzLPEOZZ4iTFJGUiKQEs/Kgtp9+dc3eNJptEAnESQIAYJ7GGxfFjyizzHXWcZIGA9XmlCQBIoFxUc7ACswq6Kz3IagHtkHjovCguuba7Jcwq3lwvdXxPoF+onYWombWNsAWV4vX7fVRb3VY6I3bOlo4O6NISsh0w7tj+2kzPeTCdb2ZFZT6Nt1QZF/BNuv2+oYBAFRvdXhza9scnBwe/PnX2UAAGA0H8+LZl5YJ4AK9WXH78MRYo92cHU+7fTQcrA2qWWZWuLVeFXp3eUrBebxKWWxg5aAPfZoqc6EAMAFpU+HsKN22BQAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 22,
    "height": 19,
    "isFloorProp": true,
    "spots": [
      {
        "x": 36,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -14,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": -17,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 11,
        "y": 15,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgACCtgaMQoAAAFsSURBVDjLrZS/TsMwEMY/W02cgMTWjuxRX4MXQEIMLLwAEgvq2IERsVTiBbowoEpMbPAQDFH2ju2GBPmHfAztuW7shqrtN+Ui3+/Od+cTaNHL+yvhH12enQvff7EJeNw9wbb6nn85AcQ+wDa42AQdT6ZbAa8vTr1wA377/KAmNIxiAEBV5BBCGkCgFKoi9wZguGw2yc60KnJURY4wihEohUApEGkHavvxrTu2MZ5MIYREGEUAAKJFvLosV01ZZs5Zh1HsDdRZ66SQEEKiLqslWINIe53Z9kEdsA2qy9KBcs1Z9k2I9Dp4MBo6j4CvyM5Sdsy3DbCby83L0gyD0ZAkG83R4cbZGQVKQcVHzhnbj2VmqAnnehNpaP1rpqHMf7xjlqWZYTg1ztIMST/xZtAmG+gF24eSfrITcO1JPz4/EQ6ou6ubxbTP5rODQZlldsVgNKRet7c39OH2Xnj38S5lsYGti973aNrUhALAHxuM3kojzWzpAAAAAElFTkSuQmCC"
  }),

  PropTemplate.deserialize({
    "width": 22,
    "height": 19,
    "isFloorProp": true,
    "spots": [
      {
        "x": 36,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -14,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": -17,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 11,
        "y": 15,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgACJATMPMUAAAFqSURBVDjLrZS/TsMwEMY/V02dwBLxDK3aqRMMHXmMrpEYOoadiR3GDkisPEZHdiai5BmqLCVxgnwMqY0bu6G0PSmDrfPv/nyXY+iwxV1M+MOWL8/Mdc/2AaeTGQ61j893KwA7BdgFZ/ugq3xzEPA2vHTCe+rSBR34AQZ+0GTAevpTd8pX+U8nM61Lry2SmWlVFqjKAgM/gMc5PM5BJFGVhZW5CQeAvnlY5ZttRj4AgKiJVwvxKwprivQ410Fdgfo7Sm5LrUW1BUsQSedjdXZBLbAJqoWwoGZv25UQyd05juYx3VzPrP4qSC2ELl8FbvtUZaGnI80S5Pm6ES/NEmt0lHBmRh7n4MGF5WO+U6bHrQ1X/SaSkPJbT4MovpxznGaJZlg9TrMEo+HYmUGXmUAn2HQaDcdHAXd+6fvFI+GM9rR8aOTO8/XZoIqll1A0jykMr06Gvr41S8jax8e0xQR2LvpoHv8L3oYCwA/v+9lADWXAQwAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 22,
    "height": 19,
    "isFloorProp": true,
    "spots": [
      {
        "x": 36,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -14,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": -17,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 11,
        "y": 15,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgABKVFQE7sAAAFcSURBVDjLrZQ9csIwEIWfGGxZpEhBS53WLbdICrecgD616/ScgJaCHEV3cEtBAbLsjDaFkSJbwiGQnXEhzerbn7dehhH73GwIv9jres1i9+wa8KQUbrUnIYIA7BHgGJxdg+6P85uAb8+HKHxiL2PQNBNIM9FlwCbus3fW1/qflHK6TIYi+Zk2tUJTK6SZQMI5Es5BZNDUYbt8OABM/cP+OL9klAEAiLp4rdY/orCuyIRzFzQWaNpT8lJqq5sL2IDIRB/bcwwagH1Qq3UA9Xs7rITI9Oe4LAp6WS6D/lpIq7Ur3wYe+jS1ctNRSYmzUp14lZTB6Fjh/IwSzsHFLPDx31lz4zaE234TGRjz5aZBq3N0jispHSPocSUlFnkezWDMfGAU7Dst8vwuYO+X/litCP9o79ttJ/f5zsUTM8tyS6gsCpoJ8TC03O1YdB/f0xYfOLroy6L4E3wIBYBvKaPixHES7Z0AAAAASUVORK5CYII="
  }),

  PropTemplate.deserialize({
    "width": 22,
    "height": 19,
    "isFloorProp": true,
    "spots": [
      {
        "x": 36,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -14,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": -17,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 11,
        "y": 15,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgADBCa5LUwAAAFUSURBVDjLrZS7bcMwEIb/I2RJTmsI8A4GvIMWcKkd0mWUdNmBZRbQDgS8gwHBbSRKAS+FTYaiKNlxfBVJ8L57H2FBjscj44bsdjuKvdMccLvd4l45nU4TA/Qf4BKc5qCv7593AT/eDlG4A5/PZw6hab4GAPRdCyLhAKssQ9+1UQMWTqG3MU+tAWvklvebzYYSAPChRAJpngMAmC9BDFr/FuXqufU6zddRY8mokiRAJDDo/go2YDZRZXufi2AE9kGD1hOon5IwEmYzBkspJ0NgQ7TKQiTu7AP84tr8KqUgpWRhL2Hr9F07CpPZYJVlyNYvkz++nhXXQyHc5pvZwJhvMBv0XQvdfkU7QSnlGABAUkouisI97Pf7P0+dDwSApmnGxfM/3WMgBE52RV3XjCdKWZaXbm+a5mlQy3K7Isz1o9Cqqii6jx9Jiw9cXPSxoVmSEAoAP4XD2i2M6XByAAAAAElFTkSuQmCC"
  }),

  PropTemplate.deserialize({
    "width": 22,
    "height": 19,
    "isFloorProp": true,
    "spots": [
      {
        "x": 36,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -14,
        "y": 3,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 12,
        "y": -17,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 11,
        "y": 15,
        "allowedActions": [
          "alert",
          "still",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgAIOZ0luJYAAAFxSURBVDjLrZS/TgJBEMa/3XC3dz6AhbG2sTAxoacxobOCFzAkVvcCUsoLWJEYX+Cs7Ehs6ElIKGys1cLOxvuD2bGAWZfb5STAV91cdn4zOzM7AjV6mTwT/tFp80L4/ot1wOOjQ2yqt49PJ4DYBVgHF+ugveF0I+D99bkXbsBf7zOqQsMoBgCUeQYhpAEESqHMM28Ahstqk+xMyzxDmWcIoxiBUgiUApF2oLYf37phG73hFEJIhFEEACBaxJsXxV9Tlplz1mEUewM1VjopJISQmBflEqxBpL3ObPugDtgGzYvCgXLNWfZNiPQquJ90nEfAV2RnKRvm2wbYzeXmjUcp+kmHJBvV0eHG2RkFSkHFB84Z249lZqgK53oTaWj9Y6ahyL69YzYepYbh1Hg8StFqd70Z1MkGesH2oVa7uxVw5Uk/PdwQ9qjLq8Fi2iez171BmWV2RT/pUPPsZGfo7d2j8O7jbcpiA2sXve/R1KkKBYBfg8XcM+r67twAAAAASUVORK5CYII="
  }),

  PropTemplate.deserialize({
    "width": 45,
    "height": 108,
    "isFloorProp": false,
    "spots": [
      {
        "x": -14,
        "y": 93,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      },
      {
        "x": 20,
        "y": 105,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      },
      {
        "x": 51,
        "y": 91,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      },
      {
        "x": 20,
        "y": 72,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "still",
          "wash",
          "yawn",
          "nscratch"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAABsCAYAAAD+HjtTAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgAROQYlEY4AAAUYSURBVHja7Zs9byNFGMf/M16/XJYAyt2hBHRI6JAO0aSKro3uKtqTUJSaL0BBQXENUgoKCr4AdeQvAFWkNBSRqzQop7sIiXCxFSKEzlqSjb27FDCr8Xpn531tE48Uyfbuzvzmmf/zzDOPNgQO28OnjzPRtdODI+JqnMAl8Pr25tTv79y/yz5mrsCpT2BfjdYF/OjzJ5XyqQ1a18KuwGndknABTrGAjc7C8WytfXssfauhTSWytPT/Gvrljz+Dhu2lpb1beWap6bB/mX9e3bhXG7CzfJqfgGgSroC9yaM4CZfAXjVdBHe5wQQ+nW7Yv8RF70RssbCNNIpvR8gLXOcFtUPzoKJ8eXB4PD/Qqok9u2dweIzw0QeLtSOub28ievF68bbxWYFPQF/0TipD1LyAl1p63sGFIe+id4L3tj7R6ix68drYOUUhtqz+R/iHyhJzHXAWDnnwq9+rt3O2I6qEWDYBqSPq6Ny0FiJ7joZt0LCdr4Zy9NABV9V3GsVKwPznh08fZ5Q3vSx5MYkuNsCisWhR9CpZlwxcZm0V4KpGRJ6sclqWOeng8Hjq1K0KLDJMGsXlmnZlcVMLy/oVOqIvcBf90boGsnE8LWhVa5cNODg8xlr/HGkUWzuetqV1wG02HR2ZUV96XOufW+2SRsctG/A0irHm2CemoBlslVVY4mJT7XSmaXY2lC0ju26rbxchk5o4lGtw72dEHlz0x5wQAG72f3IGm0YxTg+OiFFZbH17c6r+wYP6aAzYuoTAtz833jfqR+VkxAPn0CxPNjnQqoDbSKQIXGppW3BRMwEvAwYAopI7qywh07iKtlu7nynlzaI3cYhqwq+a9MvAdbQvgtaKHswquvUQEbCCtDJh3UPH2jKrs5RUBKyTQLE8pgguLda4ADcFrgx5pnmzyInK4EyBnZUQdEOkKnDZXqEUp32Bm/QhCntWJQSf6WlVnLYuIdhYWySHKmBpnD49OCJ5pVIhsqjWtE12Qa3NhXWiGhKrwEUykO2ApZuLatOx+ruvfp3INYpxVxfUGFpnI+Kh//r4owlY21eSjU4uulrX0as3S5dJZq1/jrfDTv57FGdIxnG+jbt8U91ZR1ufPsjutJtoBg2MxglG4wTjJAUA9H45czaO87LY3JYQKpeNkMWDpgsJTUlucUoIfM3Bi6YpISCUeLO8H2hK0KAUDerHz63fFvuu28sAoPvNs1Jr8/cAwFc7W2Qm0DxElbVpSkqftQUPXILq9mUKH7iETdMsjyAA0AwauIpHzuGJLnB3b7f85iTGSqeFoDHpfG+ia6AxnVTtPN+f+K4DHqgCM9iw0yq9P4piZFn5ooSdFppBI/8+Gifo7u1OgVtZmgcWwTKI0Tj5D3oIljDxbfh3jJWVt8onen0zAa5q7cpA2t3bRdhpSYFzhSQp0jSb1DghU8/xKyCUm+uQV4QFgDBcRRQN/+00aIASgqt4hM6dUGnCzqGLehQ1Bj5KUlBCpoDZs82gkefd3qBFg5VNJgxXpZYdjRNE1zelUcQaeuf5fq7r4sBVy1zULn+PDWwl9GX/DPc2HkyA884jk0nxGgOtgr3sn9lbuggu3VwkK1bVdICl8mCdMXjbZbWF1XJEvnN+ArMANorTNoMtSwhL6CW0BvQfg99qB9EZM5B1cn/9w7mBVQ55vuBtVjOoY5ClIy6hl9CGxZovvv6+1n+i/OHbL4k1dJ3gOsBSaN/gurDK0L7gTYG1oF2C2wADwD+PoUJi0U+YGgAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 45,
    "height": 108,
    "isFloorProp": false,
    "spots": [
      {
        "x": -14,
        "y": 93,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      },
      {
        "x": 20,
        "y": 105,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      },
      {
        "x": 51,
        "y": 91,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      },
      {
        "x": 20,
        "y": 72,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "still",
          "wash",
          "yawn",
          "nscratch"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAABsCAYAAAD+HjtTAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgATJrkbfvkAAAUcSURBVHja7Zu/b+REFMe/M/b+uJgACj+UC6KAIB2CItXp2oirKJBoKCiQ0lx7DQV/AwVNRBchRaKgRUKCKlIaiihVikM5wR4F3O4qOiHEyiTOrm0KGGvW6/H89u6SHSnS7tqe+cyb73vz5skhcNi279/LRdd6RyfE1TihS+DN3Z2Z31945SX2MXcFTn0C+2q0KeA7H71XK5/GoHUt7AqcNi0JF+AUS9joPBzP1to3x9I3GtpUIitL/6+hf/7+R9Cos7K0dyvPLTUdDZ4Vn9dvv9wYsLN8mp+AaBKugL3JozwJl8BeNV0Gd7nBhD6dbjR4hovTc7HFog6yOLkZIS90nRc0Ds2DivLl4fHZ4kCrJvbsnuHxGaI7ry3Xjri5u4P48dPl28bnBT4FfXF6XhuiFgW80tKLDi4MeRen53j17ttancWPnxo7pyjEVtX/CP9QVWKuA87CIQ9++Xv9ds52RJUQyyYgdUQdnZvWQmTP0agDGnWK1VCOHjrgqvrO4kQJmP+8ff9eTnnTy5IXk+hiAywai5ZFr5J1ycBl1lYBrmtE5Mkqp2WZkw6Pz2ZO3arAIsNkcVKtaVcWN7WwrF+hI/oCd9EfbWogG8fTgla1dtWAw+MzbAz6yOLE2vG0La0DbrPp6MiM+tLjxqBvtUsaHbdswLM4wYZjn5iBZrB1VmGJi02105mm2dlQtozsuq2+XYRMauJQrsG9nxF5cNEfc0IAuP7mB2ewWZygd3RCjMpim7s7M/UPHtRHY8DWJQS+/XF7y6gflZMRD1xAszzZ5ECrAm4jkTJwpaVtwUXNBLwKGACISu6ssoRM4yrabn/8vlLeLHoTh6gm/KpJvwxcR/siaK3owayiWw8RAStIKxfWPXSsLbM6S0lFwDoJFMtjyuDSYo0LcFPg2pBnmjeLnKgKzhTYWQlBN0SqAlftFUpx2he4SR+isGdVQvCZntbFaesSgo21RXKoA5bG6d7RCSkqlQqRRbWmbbILam0urBPVkFgHLpKBbAes3FxUm47VX/zl16lcoxx3dUGNoXU2Ih76z7femIK1fSXZ6OSiq3UdvXqzdJVkNgZ9PB91i9/jJEc6SYpt3OWb6s46uvvO6/mtTgutMMB4kmI8STFJMwDA6U+/ORvHeVlsYUsItctGyPJB06WEpqSwOCUEvubgRdOUEBBKvFneDzQlCChFQP34ufXbYl9/8XkOAPtffVlpbf4eAPjk08/IXKB5iDpr04xUPmsLHroE1e3LFD50CZtleRFBAKAVBrhMxs7hiS7w/uFB9c1pgrVuG2Ew7Xx/xVdAMJtUPdx7MPVdBzxUBWawUbddeX8cJ8jz6kWJum20wqD4Pp6k2D88mAG3sjQPLIJlEONJ+h/0CCxh4tvo7wRra89VT/Tqegpc1dq1gXT/8ABRty0FLhSSZsiyfFrjhMw8x6+AUG6uQ14ZFgCiaB1xPPq30zAAJQSXyRjdW5HShJ1Dl/Uoagx8nGaghMwAs2dbYVDk3d6gRYNVTSaK1qWWHU9SxFfXlVHEGvrh3oNC1+WB65a5rF3+HhvYWuhHvSd4d/vNKXDeeWQyKV9joHWwj3pP7C1dBpduLpIVq2s6wFJ5sM4YvO2y2sJqOSLfOT+BeQAbxWmbwVYlhBX0CloDetjvNw6iM2Yo62Rza2thYJVDni94m9UMmxhk5Ygr6BW0YbFm78MPGv0nysNvvyPW0E2C6wBLoX2D68IqQ/uCNwXWgnYJbgMMAP8AB2k/9Zo2fIgAAAAASUVORK5CYII="
  }),

  PropTemplate.deserialize({
    "width": 45,
    "height": 108,
    "isFloorProp": false,
    "spots": [
      {
        "x": -14,
        "y": 93,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      },
      {
        "x": 20,
        "y": 105,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      },
      {
        "x": 51,
        "y": 91,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      },
      {
        "x": 20,
        "y": 72,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "still",
          "wash",
          "yawn",
          "nscratch"
        ]
      }
    ],
    "src": "data:image/png;base64,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"
  }),

  PropTemplate.deserialize({
    "width": 45,
    "height": 108,
    "isFloorProp": false,
    "spots": [
      {
        "x": -14,
        "y": 93,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      },
      {
        "x": 20,
        "y": 105,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      },
      {
        "x": 51,
        "y": 91,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      },
      {
        "x": 20,
        "y": 72,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "still",
          "wash",
          "yawn",
          "nscratch"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAABsCAYAAAD+HjtTAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgASMrram8UAAAUcSURBVHja7ZtNbxtFGMf/M17HbpbwEmiU8iahIrXiklPVa0RPfACoOCC+Apdyak/hRC58BYQECh8ATpFy6SHKKReUCiIkaOPIrSjCWpKNvbscYFbj9czO+9omHimS7d2d+c0z/+eZZx5tCDy263duF7Jrx7v7xNc4kU/g9c2Nid9fuvoq+1j4AqchgUM12hTwjQ/fr5VPY9CmFvYFTpuWhA9wijlsdBqO52rty2PpSw1tK5GFpf/X0D//8BA07iwsHdzKU0tNB71n5eeVa681Buwtn+YnIJuEL+Bg8qhOwidwUE1XwX1uMFFIpxv0nqF/cCS3WNxBnqSXI+RFvvOCxqF5UFm+fLp3ODvQuok9u+d07xDxjTfma0dc39xA8ujJ/G3j0wIfg+4fHNWGqFkBF1p61sGlIa9/cIS1WzeNOksePbF2TlmIFdX/CP+QKDE3AWfhkAc/e1y/nbMdUSfEsgkoHdFE57a1ENVzNO6Axp1yNbSjhwm4rr7zJNUC5j9fv3O7oLzpVcmLTXRxAZaNRaui18m6VOAqa+sA1zUi82Sd07LKSU/3DidO3brAMsPkSSrWtC+L21pY1a/UEUOB++iPNjWQi+MZQetaWzTg6d4hVnsnyJPU2fGMLW0C7rLpmMiMhtLjau/EaZe0Om65gOdJilXPPjEBzWDrrMISF5dqpzdNs7OhahnZdVd9+wiZ1MahfIMHPyPy4LI/5oQAcPHdj95g8yTF8e4+sSqLrW9uTNQ/eNAQjQE7lxD49se116360TkZ8cAlNMuTbQ60OuAuEqkCCy3tCi5rNuAiYAAgOrmzzhIyjetoe+njD7TyZtmbOEQ34ddN+lXgJtqXQRtFD2YV03qIDFhDWoW07mFibZXVWUoqAzZJoFgeUwVXFmt8gNsC14Y827xZ5kQiOFtgbyUE0xCpCyzaK7TidChwmz5kYc+phBAyPa2L084lBBdry+RQB6yM08e7+6SsVGpEFt2ats0uaLS5sE50Q2IduEwGqh1QuLnoNhOrv/zLr2O5RjXumoJaQ5tsRDz0n+++Mwbr+kqy1cnFVOsmeg1maZFkVnsneDHulr8naYFslJbbuM831b11dOu9t4ornTbaUQvDUYbhKMMoywEABz/97m0c72WxmS0h1C4bIfMHTecSmpLS4pQQhJpDEE1TQkAoCWb5MNCUoEUpWjSMnzu/Lfb9F18XALD97X2htfl7AOCj+5+SqUDzEHXWpjkRPusKHvkENe3LFj7yCZvnRRlBAKAdtXCWDr3DE1Pg7Z0t8c1ZiuXuEqLWuPP9lZwDrcmk6t7dB2PfTcAjXWAGG3eXhPcnSYqiEC9K3F1CO2qV34ejDNs7WxPgTpbmgWWwDGI4yv6DHoAlTHwb/J1iefkF8UTPL8bAda1dG0i3d7YQd5eUwKVCshx5XoxrnJCJ5/gVkMrNd8irwgJAHK8gSQb/dhq1QAnBWTpE90qsNWHv0FU9yhoDH2Y5KCETwOzZdtQq8+5g0LLBRJOJ4xWlZYejDMn5hTCKOEPfu/ug1HV14LplrmqXv8cFtha6//wp1l65OgbOO49KJtVrDLQOtv/8qbulq+DKzUWxYrUFHgNgpTxYZwzedVldYY0cke+cn8A0gK3itMtgixLCAnoBbQD9W/9x4yAmY0aqTt5ee3NmYLVDXih4l9WMmhhk4YgL6AW0ZbHm808+a/SfKL/85iviDN0kuAmwEjo0uCmsNnQoeFtgI2if4C7AAPAP8lVBaYk2lmsAAAAASUVORK5CYII="
  }),

  PropTemplate.deserialize({
    "width": 23,
    "height": 29,
    "isFloorProp": false,
    "spots": [
      {
        "x": 41,
        "y": 14,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      },
      {
        "x": -15,
        "y": 13,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAdCAYAAABBsffGAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgAYJcPm9ogAAATKSURBVEjHrZZLaB1VGMd/Z2buzNx3bm5ykzStSWpTbW2LIuJC6UNEUbTiyiqI6MKdRRBcqKDdqwXFjStBQaW40KKlagWxIKK1PqmKtsY82iadZHIf8zxzjosa7eOmjeJ/dYZz5v//+H/n+74jWCFGR67QS+vfJ/4QK/nHutyBscF12rOa7LhvB6ZsESWKhQ9C3VuCE9/NXVLkkpuF2pC+58ltBEZEo1yhhktqJCQAySLvv3CE/JZhju3/vCuPsRxxvd6vbQHXbhgll3lUzIiGa2O4kJkedinGuGWA47/+TmO4X6/IlsbGMV3oLTK+6UqKJRd0lVWrNlEs2USRxIltsItYKOzEI82ahIU8PWM17Z9YEMvasmHjldrP1dmwdZhin8CJ8xzY/yU5u4e7d27iqvEY3NXsfe1N8vk+Yj/k+ls3kWQhX7/zM4VTATOT06KrLdrNkZUDlEhIOiHTpycomi0Ec5zxWuRy1+D5AWnLouUntNIFmtEUlqnwWx6FRrF7QvtWj+jBLUP0ba5Qdi1K+RwCgZW3aLUkhz86ihUWsfvzdIKYxDrJI7tvI4kXiaWJK4aw2pp3njvI1OTZq2oADI+t0Y4ssejPgwJD1IiSGCUVQepj5hIkEgolOu0A01JYRp44WsDNlegVNiVXka/X6WSSq8cGNYAYHblCP753Nz9OHePtl96lYNXw44C7Hr4RWZB8su9bwk5AwS6TJfDAw7ejcpKZhT8orprFZT3vvXIUMzMJ1SmeefpRqrrM80+9eva2LNpn6FkH12xez8SxRcq5IhPfeMycOc268euIOwlp2kHJDjpqEsQ+UnZAmESxT5IsUs03MK06U50fOOGV0ZZ91hZ/xmfEGeXmrduYVXOofMrkbyeRcxZ+5NGMmwRxSCcKsXJ5MAUqMzE6gxQYIlcVSEeDWaK3MMRAbQAhk7MJbdR7tWH3caowz+id49hxCm1NEpq4oYPMMqSUJFJi9kpqaxwcWWLyiI/qWeCGO67Gdh2mjpzm+IEJbBFyctoXFsCsNy+q1ZIeGKsTBG200mSxQosCwU9TJE7G2JZxImJSI+bE8TnstE0SKmqNfpKWjWmYFMtlHA0zM77o2luqq4a1YaZUByqkrk02Z5I6EWs2DpKaIWlbshAorMSiPTmLU8hD2qZSdoibi0z/8k+VXlT+PRJ0ajJML67I8300RRYkuJlDkLQwQwP31zMow2RzrZ8s0zQjQXs6AmldunGlxGiVMlJvsLbSTzGOKWtF0dA4RobQIDTkMrh72030lyoMVKuYKkMosXzj2rlrj147fi0Ah994AhFCUTjoLGOYEiLyybRNKBWpVhx890NikXHj/S9y79pxAA4d3Kffe+tZ0dWWZrNJpVJBZgqlFA6Cdpby2cdfoFBoqRCGRZZJokKOLNP/bhI1m022P7QXgKOvP8as55FZFmkscR0bTYJpaKSIODU3zdhfUf/rMXfdgy+zvVr9+7u33ljp2L04oa2m93f03TDvzTLvzf438pVgpdH/J/L/JfLlrFkpuia01fQoV+rnCVTPSWq36LtZdVFv2blrj3by5xOVK3Uqlco//ecCoSXyQwf3sVRAyz6Kdu7aowHOFbmUwNGvPgU4j/iyL64lkcvhQtIl/AlviyoQOIQRiAAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 23,
    "height": 29,
    "isFloorProp": false,
    "spots": [
      {
        "x": 41,
        "y": 14,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      },
      {
        "x": -15,
        "y": 13,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAdCAYAAABBsffGAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgAaCLQPyH8AAAS+SURBVEjHrZZLaFxVHMZ/59479955ZTKZZJLMWJNoo7Y2RRFxoVgUURQzLgVxows3grjyLQhiQFAEwUVduRBExIUVFR+4URCR+paqaGtMZtomvc1NZuY+zz3HRUlt7aSN4re6z+//5/v+jyPYJqanLtab138s/im28491oQ9mJnZqz9rgprtvwpRdokSx9n6oR0pw5PvV8wY578tCdVLf9cg+AiOiXh6iiktqJCQAyTrvvXiQ/N4mh979YiCPsRVxrTambQFX7Zoml3kMmRF118ZwITM97FKMcfM4h3/7g3pzTG9LlvruGV0YKTK751KKJRd0hUZjD8WSTRRJnNgGu4iFwk480myDsJBneKaq/SNrYktZdu2+VPu5GrtubFIcFThxng/e/YqcPcx8aw+Xz8bgXsRLr71BPj9K7Idcc8sekizk67d/oXAsoLPUFgNl0W6OrBygRELSD2kfX6RodhGscsLrkstdiecHpF2Lrp/QTdfYiJaxTIXf9SjUi4MNHb1oSk/snWR0boiya1HK5xAIrLxFtyv5/ONvsMIi9liefhCTWEe5/6FbSeJ1YmniikmsnubtZz5keelUqRoAzZkd2pEl1v2ToMAQVaIkRklFkPqYuQSJhEKJfi/AtBSWkSeO1nBzJUaETclV5Gs1+pnkipkJDSCmpy7WD7/0ED8tH+LNl9+hYFXx44A777sOWZB8+tZ3hP2Agl0mS+Ce+25D5SSdtT8pNlZwuYwDr3yDmZmE6hhPPfkAFV3mhSdePVUt6/YJhnfClXOXsXhonXKuyOK3Hp0Tx9k5ezVxPyFN+yjZR0cbBLGPlH0QJlHskyTrVPJ1TKvGcv9HjnhltGWfksXv+Ew509xw4z5W1Coqn7L0+1HkqoUfeWzEGwRxSD8KsXJ5MAUqMzH6ExSYJFcRSEeDWWKkMMl4dRwhk1OG1msj2rBHOVY4yfQds9hxCj1NEpq4oYPMMqSUJFJijkiqOxwcWWLpoI8aXuPa26/Adh2WDx7n8AeL2CLkaNsXFsCKd1JUKiU9PlMjCHpopclihRYFgp+XSZyMmb2zRMSkRsyRw6vYaY8kVFTrYyRdG9MwKZbLOBo6HV8MnC2VRlMbZkplfIjUtclWTVInYsfuCVIzJO1J1gKFlVj0llZwCnlIewyVHeKNddq//t2l57T/sASdmjQZwRV5foiWyYIEN3MIki5maOD+dgJlmMxVx8gyzUYk6LUjkNb5B1dKjFYpU7U6lwyNUYxjylpRNDSOkSE0CA25DOb3Xc9YaYjxSgVTZQglth5crVZLz8/PA7B/4XlECEXhoLOMJiVE5JNpm1AqUq348J2PiEXG/Y8+xtzcHAALCwv6wIEDYqAsnXabRrOJzBRKKRwEvSzls0++RKHQUiEMiyyTRIUcWab/3SbqtNs8+PTjALz+3LOseB6ZZZHGEtex0SSYhkaKiGOr7dNZ/+s1d++TT9NoNM5YIrXtrt1zDe10OqezHwTP8/A877+Rbwfbzf4/kf8vmW8lzXYxuFo6ndMmbgY409RB2Q+S6pzZ0mq19OTExFnPGo0GjWbzrPtBPiwsLLDZQFseilqtlgY4M8j5Auzfvx/gLOILnrg2g1wI/yTdxF/1CCmN6FDPNgAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 23,
    "height": 29,
    "isFloorProp": false,
    "spots": [
      {
        "x": 41,
        "y": 14,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      },
      {
        "x": -15,
        "y": 13,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAdCAYAAABBsffGAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgAZEIxOA+oAAATHSURBVEjHrZZJiBxVHMZ/r6q6qnqbnu6e6ZnJJM6MyUQTk+CCeFAMiiiKy0UQBA/xYG5iCIi4QxQ8GAKCBz15ixI8mKAhKl4MiEiMK1GJSSazJJlJd9dMd9f66j0PYbL2JJPgd6qi6n3fn+///otgmRgduUkvPp+YOCmWc8a61g9jg2t03VrggWcewJQtwljR/CrQlQIc/23uqiJX/ZgrD+mnXt6Mb4TUij2UcUmMmBggnufLnYfIbhrmyL4fuvIYSxFXq/3aFnD7ulEyaZ0eM6Tm2hgupGYduxBhPDjAsaMnqA3362XZUls/pnOVPOMbVpMvuKBLrFixgXzBJgwlTmSDncdCYcd1knSBIJeld6ysveNNsaQt69av1l6myrr7h8n3CZwoy/59P5Gxe3niyQ3cMh6Bu5Jdn+wmm+0j8gLuemgDcRrw8+d/kzvtMzM5Lbraot0MadFHiZi4EzB9ZoK82UIwx9l6i0zmNuqeT9KyaHkxraTJQjiFZSq8Vp1cLd89oX0rR/TgpiH6NvZQdC0K2QwCgZW1aLUkB785jBXksfuzdPyI2DrF8y8+TBzNE0kTVwxhtTWfv32AqclzV9UAGB5bpR1ZYN5rgAJDlAnjCCUVfuJhZmIkEnIFOm0f01JYRpYobOJmClSETcFVZKtVOqnk1rFBDSBGR27SL+16kT+njvDZB1+Qs8p4kc/jW+5B5iTf7fmVoOOTs4ukMTy75RFURjLTPEl+xSwua9n74WHM1CRQp3n9tRco6SLvv/rxudsyb5+ldw3ctnEtE0fmKWbyTPxSZ+bsGdaM30HUiUmSDkp20OECfuQhZQeESRh5xPE8pWwN06oy1fmD4/Ui2rLP2eLNeIw4o9x3/2Zm1RwqmzD57ynknIUX1lmIFvCjgE4YYGWyYApUamJ0BskxRKYkkI4Gs0AlN8RAeQAh43MJrVUr2rD7OJ1rMPrYOHaUQFsTByZu4CDTFCklsZSYFUl5lYMjC0we8lC9Te5+9FZs12Hq0BmO7Z/AFgGnpj1hAczWG6JUKuiBsSq+30YrTRoptMjh/zVF7KSMbRonJCIxIo4fm8NO2sSBolzrJ27ZmIZJvljE0TAz44muvaW0YlgbZkJpoIfEtUnnTBInZNX6QRIzIGlLmr7Cii3ak7M4uSwkbXqKDtHCPNP/XKjSK8q/V4JOTIap4Iosv4dTpH6Mmzr4cQszMHCPnkUZJhvL/aSpZiEUtKdDkNbVG1dChFYJI9UaN/f0k48iilqRNzSOkSI0CA2ZFJ7YfC/9hR4GSiVMlSKUWLpxbd22Xa+98y4Adr/5JiKAvHDQacowBUTokWqbQCoSrTjwxddEIuXpt3ZQWz0OwME9n+qPdu0UXW3xGg16KxVkqlBK4SBopwnff/sjCoWWCmFYpKkkzGVIU319k8hrNHju3XcA2PvGK8zW66SWRRJJXMdGE2MaGilCTs9Nn4/6usfckzveo1ipnn/PlivLHbtXJtRv1s9H3w1Bs0HQbNwY+XKw3OhviPx/iXwpa5aLrgn1m3Vy5eolAhcntVv03ay6ords3bZdF0o9l+0vVXorFw5fLrRIfnDPpywW0JJL0dZt2zXAxSJXEzj07dcAlxBfc+NaFLkWLiddxH+bpCnOYyHznQAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 23,
    "height": 29,
    "isFloorProp": false,
    "spots": [
      {
        "x": 41,
        "y": 14,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      },
      {
        "x": -15,
        "y": 13,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAdCAYAAABBsffGAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgAZJdr9x8kAAATOSURBVEjHrZZLbBxVFoa/W1Vdj3643e52+4WxG2KGhCQCBcQCRARCIBCBpSV2sGBGI4Rm5cWABBs2iAgJ8ZBYsUMRYQEIEM8NSAih8EaZQZBgbHeStjtddnfX89a9LCyHQNqJQZxV1a2q///rP/eccwU7jNmZy/XW9c+Lv4idfGNd6oXG+C7dtja4df5WTNklShSdt0M9UoST36xelOSiD/OVCX3fwkECI6JeGqKCS2okJADJOm8dPoa3f4rjb346EMfYDrhaHdW2gGt3z5LL2gyZEXXXxnAhM9vYxRjjtjFO/Pgz9alRvSNb6nsaOj9SYG7vlRSKLugyk5N7KRRtokjixDbYBSwUdtImzTYI8x7DjYr2T3bEtrbs3nOl9nNVdt8yRaEmcGKPd978nJw9zKF79/KPuRjcy3jm5VfwvBqxH3Lg9r0kWcgXr/2f/OmA5tKKGGiLdnNkpQAlEpJ+yMqZRQpmF8Eqa+0uudw1tP2AtGvR9RO6aYeNaBnLVPjdNvl6YXBCa5fN6PH9E9T2DVFyLYpeDoHA8iy6Xckn73+JFRawRz36QUxineLBR+4gideJpYkrJrB6mteeeJflpc2tagBMNaa1I4us+2dBgSEqREmMkoog9TFzCRIJ+SL9XoBpKSzDI446uLkiI8Km6Cq8apV+Jrm6Ma4BxOzM5fo/zzzC98vHOfLs6+StCn4ccM8DNyLzko9e/ZqwH5C3S2QJ3P/AnaicpNn5hcJkC5ereOP5LzEzk1Cd5rFHH6KsSzz935c2d8u6vcbwLrhm31UsHl+nlCuw+FWb5toZds1dR9xPSNM+SvbR0QZB7CNlH4RJFPskyTplr45pVVnuf8fJdglt2Zu2+E2fGWeWm285SEutoryUpZ9OIVct/KjNRrxBEIf0oxAr54EpUJmJ0R8nzwS5skA6GswiI/kJxipjCJlsJrReHdGGXeN0/iyzd89hxyn0NElo4oYOMsuQUpJIiTkiqUw7OLLI0jEfNdzhhruuxnYdlo+d4cQ7i9gi5NSKLyyAVvusKJeLeqxRJQh6aKXJYoUWeYL/LZM4GY39c0TEpEbMyROr2GmPJFRU6qMkXRvTMCmUSjgamk1fDOwt5ckpbZgp5bEhUtcmWzVJnYjpPeOkZkjak3QChZVY9JZaOHkP0h5DJYd4Y52VH36r0gvKf1iCTk2mGMEVHt9Gy2RBgps5BEkXMzRwf1xDGSb7KqNkmWYjEvRWIpDWxRtXSoxWKTPVOlcMjVKIY0paUTA0jpEhNAgNuQwOHbyJ0eIQY+UypsoQSmzfuBbm5/XBAwcAePzFlxAhFISDzjKmKCIin0zbhFKRasW7r79HLDIee+ifXN9oAHD46FH91JEjYqAtzbU1Jms1ZKZQSuEg6GUpH3/wGQqFlgphWGSZJMrnyDL95yZRc22NJx/+FwBPvfAcrXabzLJIY4nr2GgSTEMjRcTp1ZVzqv/0mFv498NMDg+fu5+sVHY6di9M6FKrdU79wL/qdGh2On8NfCexU/V/CfxvUb6dNTuNgQldarWYrtd/R3B+UgepH2TVBb1lYX5eu573u7Xpep3JWu03oD8QbYEfPnqUrQLa9lC0MD+vAc4nuRjBKx9+uFkT5wFf8sS1RXKp+CPoVvwK4gIphgFSqx8AAAAASUVORK5CYII="
  }),

  PropTemplate.deserialize({
    "width": 23,
    "height": 29,
    "isFloorProp": false,
    "spots": [
      {
        "x": 41,
        "y": 14,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      },
      {
        "x": -15,
        "y": 13,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,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"
  }),

  PropTemplate.deserialize({
    "width": 23,
    "height": 29,
    "isFloorProp": false,
    "spots": [
      {
        "x": 41,
        "y": 14,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      },
      {
        "x": -15,
        "y": 13,
        "allowedActions": [
          "alert",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAdCAYAAABBsffGAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgAYCx8w+0cAAATESURBVEjHrZZdjF1TGIaftfc+++f8zpkzc2bmjJoZOmi1DUFckDZECFEuJZJeVJAIETfmAhcuXKGERCQSicQFIi4QpIgbEkTqX4rQms7MaTvT09nnb/+uvZaLplV6ph3ivdora6/3e/N+6/u+JVgnpqfO1ye//5g/JNZzxjrXDzPjG3XL6nDdHddhyi5Rolh9P9TDRTj4/cpZg5x1M1+d0LfP7SAwIuqlMlVcUiMhAUjavLdnH962Sfa/+/lAHmMt4lptVNsCLts0TS5rUTYj6q6N4UJmtrCLMcb1Yxz47Q/qk6N6XbbUN8/o/HCB2S0XUii6oCs0GlsoFG2iSOLENtgFLBR20iLNOoR5j6GZqvYProo1bdm0+ULt52ps2j5JYUTgxB4fvPsVOXuInbdt4eLZGNzzePaV1/C8EWI/5IobtpBkIV+/9Qv5IwHNhSUx0Bbt5shKAUokJP2QpaPzFMwughWOtbrkcpfS8gPSrkXXT+imq3SiRSxT4Xdb5OuFwQkdOW9Kj2+bYGRrmZJrUfRyCASWZ9HtSj776BussIA96tEPYhLrMHc9eCNJ3CaWJq6YwOpp3np8L4sLJ66qATA5s0E7skjbPw4KDFElSmKUVASpj5lLkEjIF+n3AkxLYRkecbSKmysyLGyKrsKr1ehnkktmxjWAmJ46Xz/07IP8tLifN55/m7xVxY8Dbt19NTIv+eTN7wj7AXm7RJbAnbtvQuUkzdVDFBrLuFzEOy98g5mZhOoIjz16LxVd4ulHXjpxW9r2MYY2wqVbL2J+f5tSrsD8ty2ax46ycfZy4n5CmvZRso+OOgSxj5R9ECZR7JMkbSpeHdOqsdj/kYOtEtqyT9jiN32mnGmu3b6DZbWC8lIWfj+MXLHwoxaduEMQh/SjECvngSlQmYnRHyfPBLmKQDoazCLD+QnGqmMImZxIaL02rA17hCP540zfMosdp9DTJKGJGzrILENKSSIl5rCkusHBkUUW9vmooVWuuvkSbNdhcd9RDnwwjy1CDi/5wgJYbh0XlUpRj83UCIIeWmmyWKFFnuDnRRInY2bbLBExqRFz8MAKdtojCRXV+ihJ18Y0TAqlEo6GZtMXA3tLpTGpDTOlMlYmdW2yFZPUidiweZzUDEl7ktVAYSUWvYVlnLwHaY9yySHutFn69a8qPaP8hyTo1GSSYVzh8UO0SBYkuJlDkHQxQwP3t2Mow2RrdZQs03QiQW8pAmmdvXGlxGiVMlWrc0F5lEIcU9KKgqFxjAyhQWjIZbBzxzWMFsuMVSqYKkMosXbjmpvbpbfv2AzA4w+8jAihIBx0ljFJERH5ZNomlIpUK/a+/SGxyHj0ubu58soNADyzZ69+8slXxUBbOu2QcsVDZgqlFA6CXpby6cdfolBoqRCGRZZJonyOLNP/bhJ12iFPvHgPAE/d/yLLrRaZZZHGEtex0SSYhkaKiCMrS6dU/+sx9/AL99FolE+tG43KesfumQltNlun1A9Cs9mm2Wz/N/L1YL3q/xP5/6J8LWvWC2uwshaNRu1vAU5P6iD1g6w6o7fMze3S9Xr5HwdrlCveaevywDw8s2cvJwtozUfR3NwuDXB6kLMFeP21LwD+RnzOF9fJIOfCP0lP4k/TpSo3HGLJhAAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 60,
    "height": 45,
    "isFloorProp": false,
    "spots": [
      {
        "x": 27,
        "y": 13,
        "allowedActions": [
          "sleep"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAtCAYAAADydghMAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgAeC0lqXMEAAAK2SURBVGjezdm9ThtBEAfwGUQSdI6CFCJAFBQU9LxJypSp0iTgRIrgGUBIfCQ0VClT5l14AYSEhJAogvApdiyRAq2zXu/HzO7s7k1n2Wf7tzP7950PoWB9/rD/6Hru+HwPS3wH7AK2JBprI9t2AE3TKwbHWlAfOCcaS2BdKEpJw7FUV9t24D1eX5CcY44l92qoKFOQCsdS+1Sv+4c7AAAYDcfw/MU8AAC8ernEWoBYOEpizVF0QVXp4Bh0DBylO6rQIawNrB7n7DZKY21lw/rAto5TUz6En8t54nH/cOfE2vC+hfKFHiUQSR1OSV8KVO+o2V29zBEP/YT5uo2SUFv6hrqoyoXl4CljjqlYShjp2NNvJzOv39nus+DUva2+Z9P0JmiMPVvyjawC6x21QVPgviTXoWanURprji4F6oL70KPhGN4srcyAQ+ftcyFs2w5YWL1isPpxvj3PufKaCq0Qlpu6KVBOt22/2ZQAw9DlXNsOyCMsCQ3tbVswqn39enHN+j6X1xcwH7pqaZpeMKByQc0R39nuB8fchSWNtF43t1dFu8oZ89FwDJsbW95jLq8vnkLLhLhqdXkdVpfXRUJJquOj4ZiFjTqXVvBaWO5i69gJ+Ob2CqidVnV4UBcMALC5seXtrokFgOnQUmhzdEPor7t96FLZoN6R5na8Rre/H/1gY4N7uOtoLpYUWpxuHx6cVINTsKyU7lK3zXGmYieXh+/efnzkfig12HKEmg7mYH/+Ovt/eZgbLQVPwc78AcBFc8EAAAvPFqcef/ryPiqRqVgF9f6nVQOeI6BMrDO0bC+UCjRVf/7+zor1hparutbplM6SwCmBlroAsZ0MTSdrdGPhJYq6DaPuHnYNzsmc6PvDXUFzAzbpbnpNNBcqAq4Bj4WKgkvBU7Hi4FxoCWg2sCRcEqrqH+/P63jK8yX7AAAAAElFTkSuQmCC"
  }),

  PropTemplate.deserialize({
    "width": 60,
    "height": 45,
    "isFloorProp": false,
    "spots": [
      {
        "x": 27,
        "y": 13,
        "allowedActions": [
          "sleep"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAtCAYAAADydghMAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgAiGlApBcwAAAM8SURBVGje1Zq/axNhGMe/b+iBg7U0R0sGnQJZAg4BESyIo4VOgvoHBNEtk0vBSeji1MmK9B/QsQUdOmSpJRQyCFkCGYpCQ+QMSaQIN8RB3uPNe++9P+7e9y59IHA97i7vJ5/nx10agpzi5btPc9UxH14/I67XQYoGHfS6qNYbuUGXirZq45zCDZssmjfs2jQp0mgSrEtwkmetlit3Fvb9Hv6I9q37G7mAkzyMjoNfC3AUFkBsn8p4VviSLdhBr5sIy4PNgiGupmNcTceYBUPMguHC8fTlorERl3XKL5oFmwQjAMCavxntC8MwlvayVE9jmtgGpY2IhWVBZcCTYIQ1fxOrfiVW67JUNwFfsV2rvFkRrCroOat+JVb7qvWp4Es2YNmao4vja1MV1C4PTq+XVNdJvcM4pVvvv84B4O+fqXaN0vjZ/x5bvCidaciOpcGn+bq/oZzjIttEBstGr9NeuLgIlhoV2eJBD/f30GztZoLWHWMs/IoOLIDowrLOq2P0cH8vtt1s7QqbmKy2dRsou/aY4SRYGpcXg6iJyECpYQrBQsqCGtexLRthsvtzIgOlaXzj5i1cXgwyGzWBVoFPghFu1+4a1zWRWaWQOlazgpoaZ/sEHV869Zw4h3uddjRmPM9TprBNUL6xqeqbXZtsTFXrDbHhXqeN+v1H0bbneVpmbcKq0lw0CcIwBAA83H4ivM7ZyZE8pWn0u6dSWFegMnCR8TAME2GNgEXQrq2a1PYkGOHx86b0nLOTI7PHw1pjC7XGVuGw7PtOgpERLACQ7Rdv5hTIJF7t3EPR8fnbQBs09vDQ755Ka5WPg+NzHByfY1lDBCtMaRNoCn5dYBNr+DpAJ6WzDFbatNKk+DKbjTUt3U69DE2Nt6sDqv2NR9pUz8u4CeyXj2//Py2ZWC7aNmvXFDYyTP9waduGcdXcNf5Oy9S06c0KAPjlcrT99EE1NaiuXV6m0Gze4K7qVpS5iam8jNBpalYbOG0zSwOvArcBqgVsA173AzC9u0sDawScFdp16E4a43G0jNAmYzXTP8SLhk9z/2DlZwR5g6cBtQqcF3QWUOvALqFtgKZ6WspzYa7C2QJt2HbxAf4DUao2Pa5jb2kAAAAASUVORK5CYII="
  }),

  PropTemplate.deserialize({
    "width": 60,
    "height": 45,
    "isFloorProp": false,
    "spots": [
      {
        "x": 27,
        "y": 13,
        "allowedActions": [
          "sleep"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAtCAYAAADydghMAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgAjLfGPkYIAAALSSURBVGje1dm/bxMxFAfw5wiIdJe2KOrPBfEHdIYObIiFvRtbhJgZGRBCDIzMCGVj429g69A5auasFUNVtXeWkoDC5GAcP/s9n8++WurQtL3cx1+/53MqIOE4ffV8hf3sx/efIsU9iC5gU8J7ubGL+TJoYkLHvdyJph4iBXQxX8KD/v2g68Ve4qKLqZoTFBMtUkEX8yXIeu691sPhoNXERYpEr68qKMr+Bhh7zbf8m6BFiuV7fVX99/3tTQ0AALWsoSzK9etb2yU57VC0aLNGdahC6sMEu+BY4+PCRUwstnRtWBfYBvfVNhXfi52sjr29qVEsNgHYRJllYXt4odync0ZevHy68s0sdiMUqJ6wwmKJY2m79nhb4o0eLTHs5eUvL1QB9VRdyxt7X1dHtyUusGR9+6MNi3Vf25L9+u0LAAC8ef2WBeZ0clvawgc1h96UqM1IQRXSNkLg6l44aOHCSllBUQzY9Wk2Hxc0FF7LGg4P99lpC2qy3GbEhXLhNnBR9r11LahYKSv481u0DsXgJtosm4OjIelE1nMBpazWqebA6tczy8R3ULF9kRKmJhsbiqWt79tm6gdHQwAA2N3bsf79dDLz78NFMdjYCsz9NAVWpa3v4ea97O7toFh2Ddv22lRQX1N7cnLs/N3pZPavhjnPumr/29ous2I5vULHAgCIk2fHK+wpxjc+fnqX/UO58XhMxm50ae7p5sP7z3cKi25LXHRuOBXr3Ie7nrYt3elk5sSSjocceM60fVBr06J26dxNzUyXil0fHrjo3HAdzMGen12IJP9Mi7nMXZ2ZnLAabS7vWEmHpHt+diGcH/G0DQcAePR4f+O10WgUvWZ1LArOiY7VjW1YJ7iL6KZYLzgU3mQS1ARwcBQoC9wUTYVzT25cLAscC97WoGCDwF2DU6GNwbnRXGgUcA58KJR8WrqLdZok4bZTjoGNDm4DHguqxl/ooe7OoushqAAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 60,
    "height": 45,
    "isFloorProp": false,
    "spots": [
      {
        "x": 27,
        "y": 13,
        "allowedActions": [
          "sleep"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAtCAYAAADydghMAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgAjFdmNKRwAAAK3SURBVGje1dg9jqswEAfw8dN2SBTUoabIBVJGygn2AFTpU6IcAeUaKSm4Qi6RghpqCkup84onI8fxx4wxhjfVJmJ38+PvmWAziFS32+2Nua6qKrbk5/izNrbrOq8b41s/W0g1ZrG1oV3XQVEU0ZY2i4E1odboaRYr1a7rIEkS69/Y7XbGGxQKzmIs3WEY4PV6fYFN77lWwxw8i9GnwzB8vO77HgAAOOeQpun0fp7n2sRDollIrLoUTVBRKliHDg1noVMVaBfWBNahXcucgmYxelWHtYF1cFvKFDwLiVXLBDWBdTcgy7KPG4iB29BW8OVyedv+gQ4JAPB8Pq3Jcc4/XqdpSkp7TuLMBHUNDluipg8vQ+/3OwAAlGX5AXfVXDjDYNXhIWOxw0hgBVQuX7RrmImNibimqirGsFgZDQAwjiOqN21QXQm8C55lGQCAtr9VqHZJY7CUYaQuXUph0Jxz2O/35OXNQqWqG0Y+WCxcXkV5nqMeSa37YYFMksQJ9Vm6mFIHmynxvu+nJa47VBBVFIUeLD88CHhsrAovy9L61TWO4wQ9nU7aa5qm0R/xyIPAtaVbGqumzTn/ah25TFhSD+uGVSyorbflh5bz+Wz9naZp/oF/f3/fuh2KC805XwWrg2OxE9i0LbPV9XrdxKHc4/FAQb/Arj3pFuFULECAc+m6rqGua/hf6sfWp9RlvoV0TcmiEnY9QqpJr10urLGHsVuztfpbTRcD9ephSuJbrWm3REl6zbTnpNu2LfOe0tS01+7xtm2/TzyWTlnU4XCYfj4ej95TGZOugFrPtKhwH7yMXmIa67BGcMzEKXBqv1qHVij0EmlToDYsCjwHTr0Jc7/2bFAyOAQ6xhQOCt4qHIv1Bm8FToEGAa8F94EGBcdCz4EGBy+NDoENDl4KHQq7CDgkPCRU1F/N1NebkU9B0QAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 60,
    "height": 45,
    "isFloorProp": false,
    "spots": [
      {
        "x": 27,
        "y": 13,
        "allowedActions": [
          "sleep"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAtCAYAAADydghMAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgAhOzdtRlEAAALySURBVGje1di/axsxFAfwJ/sODhsXkiFgMF495C/I3H+gBAodMmZICHQPdCxkLxgvGTMEAqH/QOf+DRmyFQIeYvDF5sAp7tCcq9NJT+/pdLqrRvnH6XPfJ51OAgK26enp1vTZxfW1CDEG0QZsSLRoGrpKU+gPBsHQoslEdeC60aIJJIatu8w7IebvKk2hLU2ESnaVpvA7jgt93c2m0PcuSdDUfaQtQpTwMstKuO5mAwBQ6rOVeFW48IU1JbPMslLf03oNkPcnCQAADHs9beK+0cJnojJahT6t18UvK+BdX5LAsNcrfBUrdS5c+CxfXemWoARw3uTUsbQ5+I5PrDonjVjsBhiqQjc11KcAZZzCFxQbLClhJV256UrcNW1jwtOzsy1EkRv2+Zmepq60LTcvvy72fDeFJYxYtWwWi8KiscRK0JSW9JsvV1fw9fLy32eE1NSkqY8xOXFhg6po8oIkl6qENLUdngCX8abyNu3RhQm7Wiygv7cH8PoKEEWwfHmhL0RK+hjUCLfhswyG+/vkx9eupCmpyqsvB8yBstEaMKXEUXCeKmvVrQBllbqyTozimDSfIyzZ7luyTWExoMubWX8woJX0r7eNPjaY2qCmpDU3YBTHMBmPjf/x4/HRDs7bw3zufa56nd9ZBu8PD1EsadHSwhuAYnAMKmMBADra5JA2OThoHCtfn4PdbS0f5nPgwCfjMdzNZo0f19hKWMWW9tLctNuArnyI97+jTcmib0vcEm8C/fPmxjpfWRsPNe18saKgP56fB0/VuaRZz+GGEtel6x3MLfW72SxIqXPS/XZ///f18PPx8ZZ7IVuJy81nicvpcrGlAwAunIP2AVdLmQrOsdojnrrRAAAjzWvc0clJrVD0TCsEfEQ8i6oyX7UHANiP2oT2gbWCXeE+yp0DpGLJ4CpoKpy7pXXBssBV0XU2CtQJ3EY4B+sMbgOcC/UCDg13RTrvpescSKjmdaB1Je3zhtaSzKcPF97gt9+nXsf4B8S389zO1BXyAAAAAElFTkSuQmCC"
  }),

  PropTemplate.deserialize({
    "width": 60,
    "height": 44,
    "isFloorProp": false,
    "spots": [
      {
        "x": 27,
        "y": 13,
        "allowedActions": [
          "sleep"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAsCAYAAAA5KtvpAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHgAkCPXK0wIAAAKxSURBVGje5di9bhNBEAfwWctKkRS2LNkSPABVQLwABZRUSHSIghrRgURHT5EOpaZAdLQpkyKPQHrLDUhnyfIVd4WF4hSw5rzZmZ3Zz0NMeTk5+7v/3OzdKchUrz5+2nLO+/z+jUq5jkFp7GpZeV0Y3xqWTjR3qRzQ1bKCyXTm9XuxW3wA/1mpXC28WlbOqzv+0wW2joiVtMpxn66XFVxb2gk75mr/ELxKjdXgbm3a5vfxuobxaLQ7fnB4ZE08JlqlQppQjdz7uwGm4Njgk8JVTCzWujYsBbbBx4wpz8EPUiRbqjjrHMQcTOYPbtoGTRdL3OyM687vm7PAZ71kCzx792FLtRK2gOrnD7JVTdh4NBK1N7fFbW2uMCi2R1JYbPraoM9fvAQAgG9fv+zBXRUKVy4oEHsndxhpqEbaygeu1yJBKwq7aZtbV5SCYi1LQX3h67qG2Z274rSdQ0sydGwlwfqcL37w4LQxFx2SLJU2Ng/0cd3enDeyoQtpa2kKGzMhc7BhLb5pGxh21rlCdo/JdIaDNZST7rquk7ZiF46hf7XNDoolXS3m7nv44PAITXld18mxJlz/T9taJtOZs61Z9zC21+aCuqb5vQcPyXOrxfzvlA6dwqXK92Krp6/fbiXDSdejx096Af9+dcVK9taU7ibNwV9enBeHS7Hog4ekzS8vznf4vhSGJZ+0pK92udG2dKvFnMSyHy258JJpu6CiLx59a3MzXS5WBI7xItGHUgAAemuSVKltLCTds9MTtfcBQAovge6Cudiz0xNFfuJJDcde1u8fHydJlfV6KL23fdCSBwmfMrFowqWTDt16MKwTnGugudASKIVlgUPg0osQuu1RUDE4FjxVcbBe4L7BuVCvJ61/NdUoCZdM2wcaFZwLHQKNDk6NjoGNDk4BjwXVdQN9XrGUsDSZJQAAAABJRU5ErkJggg=="
  }),


  // https://penzilla.itch.io/top-down-retro-interior
  PropTemplate.deserialize({
    "width": 42,
    "height": 92,
    "isFloorProp": false,
    "spots": [
      {
        "x": -12,
        "y": 79,
        "allowedActions": [
          "alert",
          "yawn",
          "escratch"
        ]
      },
      {
        "x": 55,
        "y": 80,
        "allowedActions": [
          "alert",
          "yawn",
          "wscratch"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAABcCAYAAAAYuCeHAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgEJDNNPJ8MAAAMsSURBVGje7ZrPaxQxFMfftl3Z0rpTFfagFVEQoVq2iNqeFjx59KIH/4kehJ6tZ8GD/4Z68KYnoaf6g9JiHVChpViLFK27U6uLq10P07eSR94kk8kiycy7LCFNXucz3yTvvUwJDK1RrXZNxi1EUclk3AA4YkOmBG/dmDTz+OhN14SwM0RLuiSvzYwAAMDR8TNWHO9srgEAwLPFPS2y7muUkqS2svTOyGH94jmh3Zt/EbpJZN3VKEfy43ZHaI9UzJ5xr70vtE/WykKb06w7ROn+yJHkCH7Y/KXl6Oz4oUTCHFl3ieqSpASDw3pHd2u3m0hYRdbdfVRFkhKsBeVErf4j15HOh/3oD/1Tsu4R1SVJCbZ2498nCw+lDq43biYSVpF1l2hakpTg8uu3Ugf075CwLll399Gx6oB0f+RIcgTv3J4HAIC79+el/VOXzkvJbrc60v22Ge07plGMUhoQkz11YtCIpK7heJyP0+zGpz9CFOXuyYQkORK2jJsP/SNRf3Im29rkjNeqr5WSfpFMO79/tSeVqU6krOY+UVx9KlJZSeJ4brW7S7RXmQjjGtDliYrWBLY1+Spsu10pUa56Xa32S5vuRfhcB0b+VKsYA9he5Zw2/SOKuRQlQCsjqn2WqznhPJgb+U8UcyjMDrlVqq49QWLdgOZI/kZPmMNgjYmSQ2Kq/ZAjzuVI+YlHaX1Ut4ZPx9GKSH4jfJr31wIzx6h5/4lyZzyeHHgm27aev1B+J+qvRq9cnRK19u1gVR9htMj0v3y+XKx6wb63fse/UdweZB5Z1e8d0eIf/e8aRW0qT56mvB2MFa9etNFgCEYD/RcxN1uHudl6oVGlRnU1+PlLp1j1qQz1d+/BirT/x85WQTSVrb3fKE4mq0TZrPNg9T9+2sx0IuWHqC6xrCTzp1FbxPJLNFxaLSJ8K0SxkrH1NY6GLpyuZHK8ut4uNAoAAMePlQUi2NY1fCNpx/l7c8cRSvtGqHlzc8fWR+nXj2kJpTX0h98I+lcfxVsM+qWsbaM3eM3I132U3n3ik09PDAMAwIvwp5FDOp7O798+qrt/9sv8/UqnX/dJ3sejfwFfHJ5a1twgywAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 98,
    "height": 62,
    "isFloorProp": false,
    "spots": [
      {
        "x": 29,
        "y": 27,
        "allowedActions": [
          "sleep"
        ]
      },
      {
        "x": 63,
        "y": 27,
        "allowedActions": [
          "sleep"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAAA+CAYAAADQ6c6CAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgEMHLOPw+IAAANeSURBVHja7Zy/b9NQEMfP2JGKBBGCsPBjCAOiQrAhpnbIn9AxayUGUP+DjvwHFQxIWTPmT+jQjIwIgVg6IBBSK4RaJBCxCYO5Vn718zs/P9v34vtujuzkfO8+vjv7nAAcabPfX0IDOjg5CXy0x6RLIGKhwBUBL7eiRgzencW5EcnNHiGiK0Rg5DUVcdSI5GZPWTKECCaKXJHw9vBvIwY/GWZjZ3hzycoe9M/uLPUXlQwhwjciTBE3uJK/8FEYAgBAnCRODFZ/9+k9XvaohEiOWLWqSc0NGAG6iGta+x/TKmX0gEfVdPxzmSGDWkUJEb7lCG4koB7fCVnZg/4pW7UJEb4RwY0E1Onv5L99EUsyhIiu9BHaL7Ss022Pu7oWtmKv675EiPCVCFME2EaG7XHUHKGzu2oku+rQhQhfiaBGAHa8qtrqgF1Fbl0SInwj4vA4jfDhICJF/ubdhYYUt2So9thKdx5UqeeD/qI+BBUimOjCcqnTEOoTsOEAV7w48k06+NxzQoaO1LIk7L3aqWTHzou9XP+c2XmUdbV6N1aI4JYjqNMZk/mi0g9+O3W79hh5GIllSXj2fMuJHfg9b17PAABge6NXuL/6TFuI4EJE2TklXGkqGToC7l9LaqmibPXu/RcAAHj08LbV8VQSUOq0hxDha2dd1zXfto7H3FC1D1DJkM5aiMhXL0p3WcRxrYZQr62uVLX6EyK6QsTF6YM/mS3bSTZVn36EVvW/awKx2rHtJ/B4sx+h0I9CBDciqHNL1HkdjHhTtTNa77Wam9AOXWRTj8cOn+rH8xwVCBEsiaDO4aj76SLfFPEm1U0CytY+XYRT/Yh3EiZHiRCxUp111fq/qVzQmoOJc09CBJcFO3tSNE/vAm5vhFYraivXJHAjjOo3IcKXHMF9HqitaqtqbpjM08/lCd2qVU2u3qr0TaY7DGWvJEKEr0TgtQ8gzu0km3rjv22VfSPIlDOECF+JMF37uL5rx72fECK4EnE+xUyTur+r6Wzu0vmJ7r9AiOAo4zS4TtdvXQYAgO9ff2U+H60vO+G4/Q8ByR86yTS4L0SoZOBKo3JWfKxsTzviu8Lz1vlN9y81QoQvfcSN/pqOiDExUqBjhEwNfpM+wsscUVBFjcVtJE2LqiQhgqn+AVKme+lZdFiVAAAAAElFTkSuQmCC"
  }),

  PropTemplate.deserialize({
    "width": 98,
    "height": 62,
    "isFloorProp": false,
    "spots": [
      {
        "x": 29,
        "y": 27,
        "allowedActions": [
          "sleep"
        ]
      },
      {
        "x": 63,
        "y": 27,
        "allowedActions": [
          "sleep"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAAA+CAYAAADQ6c6CAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgExIPYI99sAAAPwSURBVHja7Zy/TxRBFMe/Jz/uIB5KglzuCNHEythgYmWhPTExtvwBNv49NPwB19oYei2sSCQ2NhQaE8gREg2iwh0XLJYH2ccO82Z2dm/2eN9ud293386+z7w3M2+vhkB6Pjd3hhL08fCwVkV7bLoFVRSaDEXA6ptFAMDU1AQAYDAYel2XzifRdS72r+MsyyNN9hSujWx7lIiKquZLgs3jQpFhO39zYx8A8OptO5Mk2/X4ftt9bcfJHlcylIiqxQgbCd+//ivF4PuPZlLbdztTmR5atj1EykX7nMcOKRlKRFWzJnrzO1+O0vub7MKT6ezn9HQYxGDu6UuP65n7TfaY7LAdl9rDidUYMW5ZE8UGykqIBO5xo9K37WMAwIOVRhAPz0vK4HeaDGkWpURULUZISQjliVItPWxk7ne9v8lu15hC7eOatSkRVSNCGhNCkWDyOJ6N7R39BQAsz8/mur/reTZS0BwqETdiHFFUtiE9j+9fuF0vlETX5/C1Q4kYdyJMfbvUY6S/Pzg6AQC0m/VC7C4r+1Mixp0I376zLA8satzjez0lompE7O2d98Xtei5PCT0CttnjmoWNSkpEJLoyI8irIWgFjDTbSd7d4uJ0KeMJm+e6kuqbvbkSRLPCpF+7g9Q2n41VImKLEbY1aVqZ+/DuINkhLBsyjVBd+27T7096CcCTyzJPd7XHlZydrT8AgBevFwBk1GWR1tNr2kpELDFCWqfE9en9TwCXK2NFzS1J+2K+QlfUOMFmh4kEWx2UEhFbjPCtzKOshfrqslVv1TKzlLJEWSSJt5+tYlCzpliJkNaKchEJz17O5yLL5DF5r1P0dSlWuorfX4mIjQiSrfqAV7KFJsHWt7p6OD8emlR6fk6GazsqEbERQW+QqjVM+bfpTUuzA99YFEuMMNlvakeTeDsqEbERMTMvG4HyN23zsKI93TSCNdkV2p4rhAgrIXndkxIRGxG+s455PawoYsqOOdaGtsx5KRGxEHGxUrSZzI+vrDa9PKLor0dDE+B7X99xia2HUSJiHVm79nG+3yOHOr/sGGI7T7r+sb2ZfFqkK3RVI8JUj2QaIdIciu8IWvoPAaMegZtmGLQafNyJcB1pl/XF/6jF5+SkPYqOI8Yla3L1lLFtMJYVSeuoNEZUlQiqypCK/z5vdXbsIrvpuScm0uXD+/t9AMBw6FbVokREIms1uEmdp4nn726liWg9mU55iqtnhFLR9+997qe2G63kuY97fdH5Wg1eFSI4GfSmSRlvfI1td29I21373KZ2M/1LjRJRlXHEvTvpKusfl0SsCT0FN4yQrqXdNGuqZIy4Jota02YTqXtdlqRERKr/dUJv5s0ha+wAAAAASUVORK5CYII="
  }),

  PropTemplate.deserialize({
    "width": 64,
    "height": 64,
    "isFloorProp": false,
    "spots": [
      {
        "x": 29,
        "y": 29,
        "allowedActions": [
          "sleep"
        ]
      },
      {
        "x": -13,
        "y": 50,
        "allowedActions": [
          "escratch"
        ]
      },
      {
        "x": 76,
        "y": 50,
        "allowedActions": [
          "wscratch"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgEOJzCySEQAAAJ3SURBVHja7Zu9TsMwEMcvbSpAggpBkRASQxcEYmZshw48AGPXvkZHXqNrxz5Ch2bkAYpYMiAhJCKGgoRQ0sIQXCkm8Udydgq5m1rFai/+/+58PicOIFm32fwCizZbLByM36lBxc3BUvz2xrXq+HASoRBBBORV3rbiqkTokkAEYCl/56+sOn7VrqGQUHkCcgcyr3hr17HqOP//WUQQAUVzAB/7bOZtKy6z4P0rQYJqLqAcoBtzZSnv1usAABAtl6nXmV+6qxERoDqw7JjPUr6on5UnoGYzhlkcV3IC/l0laCqGsVYFIsAWAVhKlEUUEbBpsU2rwF9dBUzlgul9JLzeO3eJANR+AN/vbx8lD3yuL7esxD5TvnsaCsfNHhuxn634ux8kr/svyVvk+wOUA3jlZf3+kfeJEntYxghhJAw6DeH44SS+T0YC5YC8Jz0jLzRCAov9s/1kjjneWwlzgEz53yRElANQ6gA/iFKzL7Y9v5nRiggoTgDkikFZbqG9QFkEyPrq/BkclvLryvOnonsI6qmrgcx0/ScC+JmT9dVNPwfQu4iJms7DBAmqyuv6TwSwD6onKrZOiBgJqqtGXv/pZIgmoOo5YN0h8eJd4aBT7vldw43TUhhFua4TAbb3AtgmU7ao8iMvriypI4RFANbzeli1PuUA2wTwlZXpvQJ2JUoEbLpCVAnaJoB1eVWNH99u6UGle6qc5Z+637QbFEwHqL//d3CyAwAAr08f3D7e7OuD07mj5EeW0emwjACeBDbDzFJmus99Hxv2Wfh/Wf5mvTdAq4BswGFzO4uAvqJCYImIscRfqgO0coBgVehv+D2NRVmfCODsG5Y0+LGEwSeAAAAAAElFTkSuQmCC"
  }),

  PropTemplate.deserialize({
    "width": 64,
    "height": 64,
    "isFloorProp": false,
    "spots": [
      {
        "x": 29,
        "y": 29,
        "allowedActions": [
          "sleep"
        ]
      },
      {
        "x": -13,
        "y": 50,
        "allowedActions": [
          "escratch"
        ]
      },
      {
        "x": 76,
        "y": 50,
        "allowedActions": [
          "wscratch"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgEyNMf/cGUAAAMGSURBVHja7Vs9bxNBEH3Gdj4EDlgCrKSBIg0NClIqCtJHNLT+AfyjNPkB7pGQfwAFVSQiGpoUIEux7AaUAPlwrFAcG7Qjz83s3u4JKTOVb9d7u7735u3szLmBRPZqbe0aNdqHk5NGivvcwS23VirEd98+jrpPu90EAMxm87CB+7hOwYhbz4BGLPKxiKc2x6B3e+MoJhgDUiH/7ctZrQt/8mx1YftwfxrEBNsFYgdSxNsdYaJW4atXV2Fqz42j83OMMAZU1QDq++7JS4jXbbNTnwlaLTANCPV5Dnmtj6fWAtfe6sbtRsYAdcTVSYMkhyDXH9oeqk3GgNiBHCJaRLX9qbXEGFCVAdyTr4pEKLKp5jMGpPL9VJb7/saAXBqQWp1jdxVjQC4G1K3O9H6UCVrGGANC8wE03/9go+31P91aKWWGdJ07Pvh6eO5d/zieedc0P2AaQJGX8v0f338HAGxu31VFhKk0Qdp1jg5+AQBevu4uPs3+rR9gr6goOSaYBnDI05odvXZMkDQh1pdDfZ5DnjOXMzQN4DpotZar3o7HFwCAi0mtrwdguRdW1rzRAIsDGAZIdXqu3yG/8+Zh6Xjt/bTmNEhr3DzGANog5dVpDS4UeQkRrTnVp0wIXb8xwH04+vyz8E0h/x/7HkBVn5dMW7Ok6zcGuA+rXV22lz5hLaK5kOfWpf2eMYBDOtW5vqrvc+O5yC7UjAE3GZJhcU7e2u0sRJ4yI9d+TxHnxqfSFGOAdB5PndnJpRXa9R4Oi5eJLCMkMUCLOI2sNp/fy3o24CLRWIYaAzhfkuICLrJyZ4pcxkWskhZwu5cxQOtLWh/L/QZpbG2SazcG0AaX5aXWbBYB43zuZ3+n00uvfX19udQ3Y+sFrn80+r2wn1u37QKCidVhzlZ6SwCA88ml1957saSamGOUZJNP/nwb2wXjjg90DLDqsMQAygSHtDOKOIA+uR5kXnPpfNx6uf8N2C4gfeHRfb/6O/rHgL4SIdTEiIGwXtsFgjSgZFfo/+e/aVCm+sYAYn8A50S44frfcy8AAAAASUVORK5CYII="
  }),

  PropTemplate.deserialize({
    "width": 54,
    "height": 26,
    "isFloorProp": true,
    "spots": [
      {
        "x": 24,
        "y": 2,
        "allowedActions": [
          "sleep"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAaCAYAAAD8K6+QAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgERCrg3Gq8AAAE0SURBVFjDY2QgAOz4+P4zDEJw6NMnRnzyTAzDFLAQiqEIF5HB6fI9DP/xxeCwjTFG9JhCj6FX738PSoeLCbKi8FfseYMSc8M3j6HH1I5T7xgYGBgYjFR5URQ+e/+DgYGBgeHFm4GJQQkRSAxJCXKgpKRztz+jlgXQvDdySkVCMWQvZzsgDj346DCKe2AxOFqPwQAsZAYqhtABujtgMTgaYwOdl0iNQVwxN2xjbNRjQzaPwWpyDzMhaAvkMFmlFbXqK2IBzL3obdqRUyqixxwhAItZbWFdihxy9e1lkuwl1PsYvv0xOz6+SCh7GQMDA4OTMT9Z/SJYr4BcgCuvEAv2nf0IY0aNmB40SszBAKkxiKuHS2oeISGGUGLq0KdPy0dGjGGJOQZsMTiIQBQyBxZTw75UBAC8hG/NFLfATAAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 54,
    "height": 26,
    "isFloorProp": true,
    "spots": [
      {
        "x": 24,
        "y": 0,
        "allowedActions": [
          "sleep"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAaCAYAAAD8K6+QAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgE3EfGMUGcAAAE4SURBVFjDY2QgAOz4+P4zDEJw6NMnRnzyTAzDFDASiqH2+sBB6fDKxvV4Y3D4xxgsptBj6Pb9l4PS4aqK4lhjEBZzwzfG0GOqs38jAwMDA0NQgAVqzD18w8DAwMBw7+WdAXGokrgKJKbkRVDE1204wcDAwMBQXuiPEnPDNsZYcEngiiE+GcYBcei9J3dQ3AOLwRFXj+GMMVjIDFQMoQN0d8BicDTGBjovkRqDX5/9H1kxNuqxIZvHYG1CWA0Oa4EQApJm1M2Lz0+R1v2DuRe9TTtySkX0mCMEYDHLqvyXIof8vstMkr2Eeh/DunUfCWUvY2BgYEiKsyKrX0RsniQ1rxAL5i06BmNGjZgeNErMwQCpMYirh0tqHiEhhlBi6tCnT8tHRoxhiTkGbDE4iEAUMgcWU8O+VAQA/BNtGetlVr4AAAAASUVORK5CYII="
  }),

  PropTemplate.deserialize({
    "width": 60,
    "height": 50,
    "isFloorProp": false,
    "spots": [],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAyCAYAAAAA9rgCAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgESF/AcJbUAAAIzSURBVGje7ZnLSxtRFIe/EUkolWmwCUJcRbCgtghdtBUhdFcX3XWlq/onuCl0Ja4E/wQ3dWVXxU033UmgRLtQQtEWRIVCR3xVHStF8bUYb3HCvNpkZhLm/Hb3kXNy7nfPufcmGhGpqOtXxKiSaWoALSRMrVGR7R14HmlgxkoJgHxf0eooz18J4Sh1enZWFzvpVMqbbJWEcLOQrba3v7bgSVYIN5oUsfvdzwLN8yMrhJtNQXeAEG7UL+ZHzm/c7TxOLuG4XzP1lty0FGFFtj1/JxQHv4w/jnffsO7SksN+Vfry9ykAr/o1AObWU57jHypW6re0pW3zetIPAPhM5Z/ISA6HTfjQvASgkLsZWnf+YCGn3cy/AGBybAiAtxNzAGQfZmzzV8vzAGT0eNdYCLtV2cFCv5WTRsVxrR71dXramXjdE2ug4zPfhLCnsnczNTk62bKKwdQn5/P3zQurar9bzQMw2mt42que52dXcrhRpIgpgn7zpEqHRXhz1/64+rry09beOzm0tVWOuZ3D0+Xzqp4fnv6ny/a2m13lN7H/LWlRv4NfPu2KNMCPixvJJvw3hx8/6QjFwdKXbccVVzmn7u71kp/d5BI+Nr1/gdg1jhz7c/l7gRypHFI1o9CRBWDZ3LGN/6+C2pVz2E1BSQZVZ3ubRYKdSO0mjrAELDlcJxV1fbiW8Vr9lkzzvWxpCVgCloCbskqPAKx9P5gNyceIEI5RWlSObp2zsyHvAEf7iT2HrwHLubuSbGF7ZgAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 60,
    "height": 50,
    "isFloorProp": false,
    "spots": [],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAyCAYAAAAA9rgCAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgE0Fd3Mx70AAAJfSURBVGje7Zm9SxxBGMaf1aAneEuiwimiCH5E5LTwC7QQG7G0joX+EXYGlAS0y59goYWS0lJs5ArFz0JFRU8RD8NJUGRPOHP4kWJvxJnsx9yeN2fY9+l2Z/Z9mf3N887MrgZF6tP1Z+RREcPQAKAAPtMHVWRbevod+x2srWQUVzbeS7+1lWcirFIi0ZJgMKvnGcl/yAoiwqrINrQ0AgAuY3FPccQZ4UaWCOdL1TWVHOmvA0nH/lPLJdx1MpHIKB8RViWv3hXJsloQPTghwu/Sw24eFb0OxDmy0jstvxLWVJ1m2Jv+k0oBAE63V7PaaYnVWXZv7T8PM7KBUFFOEtxfpbjr4iIzT31HL3dfJO4m9jyLRx6WrdKB5AMAYKj1CQDwM+qNfLj4MwBgC3uW7SIZNw96rRm0Dos3bg2TbGMo3RSV8+j0xBAAYPz7orluhsvShHlPfdQLuDxexeJkKiJsR7CzttUkdmF6UqzqbeEaxziTo015Hei32WMi7Hxu1XlPZqq7X6cAgB/Lj5btYwOFAIC5I3OmjDTHHOOJ/dzikoffixgxRtCtH1VpVYR39/k3fmnccNfMY3br58y6eFi7cMw3sy63LrO8vv23pKn+qzfYVad0gEub5/4m/OLh9u5QThLsbFxZvvG32lPb7bHt4vqX8O9b5y/+ifid5f1gZalUIuYhVjOqKj6lSVxz7V4lG5fWYTvJkpRVbbn5lfLw7FppXN8RpgGTh99Ifbr+JZv2bPNGDGOBpjQNmAZMA/4vq/QwAMSOjfkc5RgmwnmUpirRq3V2PsczwDK+b9fhvw0h1hz6YjY9AAAAAElFTkSuQmCC"
  }),

  PropTemplate.deserialize({
    "width": 96,
    "height": 64,
    "isFloorProp": true,
    "spots": [
      {
        "x": 25,
        "y": 12,
        "allowedActions": [
          "sleep",
          "nscratch",
          "sscratch"
        ]
      },
      {
        "x": 58,
        "y": 38,
        "allowedActions": [
          "sleep",
          "nscratch",
          "sscratch"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABACAYAAADlNHIOAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgEZKkuAsG8AAAG6SURBVHja7ZyxTgJBEIbnDJ2JFsRYQGNtYw+PQOPb4BPIu0hiwyNobyE1jRbGUEBCjdUlugl6y+7czazf311gYXKZmS///clVEuhufLUXpKb7p1X1/fqEW9KtqrDzr4eDRgf7l+c/rtcfm6g/Pvb853b36+cXZ6em61++vYuIyGRywwRYUO95drsXEZk/vKp2TKjwfNPfb9rhVuuvNZo+VkyAZQbk7pi2O9Zq/TDACwNSd5z3Ha1dPwzAB6SdP+QH8AFIxwek7litjv/re4cmou36YUBpDOhqx6eqLUbAgNIZENsxsR0VduqxE5Gr42EADMAH4AP+MwOsPauJzQXIA1AcA8gDdOqHAV4YQB6gWz8MwAfgA5gATz4gdceSB8CAshjQ1Y5PFXkAysOA2I4hD4AB+AB8AAzwywDygLz1wwDrDCAP0KkfBnhhAHmAbv0wAB+AD2ACPPmA1B1LHgADymJAVzs+VeQBKA8DYjuGPAAG4APwATDALwPIA/LWDwOsM4A8QKd+GOCFAeQBuvXDAHwAPoAJsDABNQMWixeJmYC2n6WU8iyonoD6HdJMgBUGhCxAOuLt6cb0BQUBkAgAakdqAAAAAElFTkSuQmCC"
  }),

  PropTemplate.deserialize({
    "width": 96,
    "height": 64,
    "isFloorProp": true,
    "spots": [
      {
        "x": 25,
        "y": 12,
        "allowedActions": [
          "sleep",
          "nscratch",
          "sscratch"
        ]
      },
      {
        "x": 58,
        "y": 38,
        "allowedActions": [
          "sleep",
          "nscratch",
          "sscratch"
        ]
      }
    ],

    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABACAYAAADlNHIOAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgE7OB+LhwcAAAE9SURBVHja7dwxTgJBFIDht4bGRE9AwR2IsbSysKHhEByDgmNwCBsbCytLY7yDhSeAhHKpSNgNFLMTwqz7/d0kVLP7+LLNq6LV4nlchy7W+uOvOj7fuJLrNmq/+Y8Pk8YP7u9uIyJis92dPCv5nuqIiPnT1AQUMQHvq1kdEfH6+dN4cuee8Lmz0u7pZflWmYACqnINGKoJXe/l6/s3GFCyAV3fgKHVftNTY0ApE3B4EqlfwL4D8ibh8M9jAvpqgPJiQN8NUF4MYAADTAADGGACGMAAMYABYgADxAAGiAEMEAMYIAYwQAxggBjAADGAAWIAA8QABogBDBADGCAGMEAMYICuZYDNWc17YMDQDLAv6PR+IAb03YCuO+OGukOu670woJCyd8Yp7Z7sjPsv3wHKiwGlGdC2QJfJ9vTC2gNp9P45HGwiLwAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 62,
    "height": 30,
    "isFloorProp": true,
    "spots": [
      {
        "x": 10,
        "y": 31,
        "allowedActions": [
          "nscratch"
        ]
      },
      {
        "x": 29,
        "y": 6,
        "allowedActions": [
          "sleep"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAAeCAYAAAB0ba1yAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgEUL45EOq0AAAFASURBVFjDY2SAgkobxf8MFID2I/cZKdFPqf2kupOJYYQCFlhIV9ZEMjAwMDB8/vCGgYGBgYFXQARFIS5xOGhZTlGModsPA7jsI1cdA8Pu/yM6xhnt+PgiGRgYGKz1hJcxMDAwyKsrMzAwMDBEhZqRFMKUytNK3bLVpxgYGBgYHt68y8DAwMBw9NLbqJGdx2ExnZPjOigdSLBsIQB8XZUgDBg9ZfeykR3jsDQPCwlEHhcZEAfBYhazNCYPbN59bzSPD4o8TmneJTWPT4HGOAyM5nFa53Fq511SATxFj/hSfbDX46Ol+lDJ4/QqtUdbbgOVxwe61B7N40O1rT6ax2kd4zhDaJjW46OjrLBSHdco57DL4yN+lBXGoNZMBnp7gNzR1vaW5TTx8IjP44zUNpBaKQfevqASOPTpE0oSGrExDgBQp7R3Nr495QAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 62,
    "height": 30,
    "isFloorProp": true,
    "spots": [
      {
        "x": 10,
        "y": 31,
        "allowedActions": [
          "nscratch"
        ]
      },
      {
        "x": 29,
        "y": 6,
        "allowedActions": [
          "sleep"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAAeCAYAAAB0ba1yAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgIFGoloY8cAAAF3SURBVFjD7Zm/SsNAHMc/sVJDrR1KJpESCkIJIi4FBx9CHIsP4CP5ABI3H0Lc3ERCJwkOTiVD0FIrWIf0JDmjVHNtTe++U+5Ccve7733ur8VUZ/vtCQV0fvdgFfn+t+XH1WcAGuP6n+q5hqZaFy195G0D4DQ2ARjELwCM3HcAhsFb5sNmbQOAlh1Mc4r1GFF+NHzNLUdI1Gcn2srk18a3ADyOvEy+22nKRU30djwIB73ps5/nwKw6PtzNpOUe07GdzPuwHy0kwIur+0xaxKuv457r+D85tmwJ5mXWZ9XpyZ7cA3zDuArGVUk4K4/uhvGyMy7m13mP7oJx2XnD+LwYt8OkbfvuIHc+X5RSzvuG8f88j5tRvSyMy7u8Zcms3FQzLva/LZL98LDaNYyXivGDbhuA+ooEaBiXHf+yhq5UEsZXJECZcXPK+t2ozooyju6nrJ+3H0VvUoRUnbbeBE9zCVh7xi3VP1TVc1LrCyW6juPLdFpbxz8AVe2sJzaXuzkAAAAASUVORK5CYII="
  }),

  PropTemplate.deserialize({
    "width": 64,
    "height": 96,
    "isFloorProp": true,
    "spots": [
      {
        "x": 17,
        "y": 22,
        "allowedActions": [
          "sleep",
          "nscratch",
          "sscratch"
        ]
      },
      {
        "x": 46,
        "y": 63,
        "allowedActions": [
          "sleep",
          "nscratch",
          "sscratch"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABgCAYAAACtxXToAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgEVN4Qzk7oAAAGkSURBVHja7Zw9bsJAFITHiC4SICFCQRpqrsAlOA4ngIOFI6ROkxQkipQgUTtFWCRbtne9abz7vqlsoRFiePN+bD9LN5yOu/J03JVWzh1GMo7CHey369LSDz88vxZEgKTC/fObp5WpH/7y9k4OCBJgvpxqvpxGf8HQ+UQAAhjHuMs7kvR1/mk8D/FeCnwsgADkgG7vOIR6MRW+6ASxAAJUckBonW3zYmp8IgABEKCaA0J77L51eah8IgABECCuD8jlegERgAAI0NwH5DLv+/hcD8ACCFDNAbnN+9wXwAIIEJcD+tbVz8tVkrSYPCTJxwIIYBz3p8QeJ7NGL7XBea+OVPg8JearArmiHjlEQGhd9XkvFT5VAAEQAAEQoKsK+LKn+zy2ExsK/+PyTQQECcC+gJUcENo5tXkxNT4R4JsG2RfgekA/L6bKJwJ83nFgX4BhCAHyzgHsC2ABBLCdA9gXwAIIQB+Q47xPBCAAAvTrA9gXwAIIYDMH5Dbvc18ACyBAXA7IZd5nXwALIMD/ckDdS7EYOp+NEXfAm6XBH6y9Zd58BPwCCl69uT2NizUAAAAASUVORK5CYII="
  }),

  PropTemplate.deserialize({
    "width": 64,
    "height": 96,
    "isFloorProp": true,
    "spots": [
      {
        "x": 17,
        "y": 22,
        "allowedActions": [
          "sleep",
          "nscratch",
          "sscratch"
        ]
      },
      {
        "x": 46,
        "y": 63,
        "allowedActions": [
          "sleep",
          "nscratch",
          "sscratch"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABgCAYAAACtxXToAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgICO4pA5V4AAAEhSURBVHja7dyxbYNQFAXQS+TGUjKBCy9heYIMwBQZhhEySyRP4wlsySVuQkOC8C/5/7wKyne4PKDgJb91GfrxMvRjK+dTvaXx6qaDr8/D2FLj3z/XTgKS7KYrfz4dkyQf7/skye3+qKrRf/oaJQAAgOzm98jSeW2zQALmCZimY0NPAQkwAyTghRmw1Znwah8SUDo1t1LzK+9NsDQBtbwHrCXBxxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACASqrav8fnfUhAaQJq3SAhAUsJWNsis9WtMmt9SEAt93zpTJCA0hlQWxIkwAyQAAAAYrO0BPyp1rbMN5+AJ9KH8RV0hnUZAAAAAElFTkSuQmCC"
  }),

  PropTemplate.deserialize({
    "width": 44,
    "height": 24,
    "isFloorProp": true,
    "spots": [
      {
        "x": 20,
        "y": 0,
        "allowedActions": [
          "sleep"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAYCAYAAACBbx+6AAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgEVBtXtk4AAAABtSURBVFjDY2QgERRomfxnoCKYcO0MIynqmRiGGGAkNSRlBSSp6oDHH56TFPJDP4RhIUvtkCQ35NFDeuiG8GAJWUIhPfRCeLCGLK6QHnIhPOrgUQePOnjUwaM13WhrbYS01kZ7HPQO4dFeM5UAAFdMNvXt4hXmAAAAAElFTkSuQmCC"
  }),

  PropTemplate.deserialize({
    "width": 44,
    "height": 24,
    "isFloorProp": true,
    "spots": [
      {
        "x": 20,
        "y": 0,
        "allowedActions": [
          "sleep"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAYCAYAAACBbx+6AAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgE7I5XuTusAAABtSURBVFjDY2QgEQQbCPxnoCJYe+EDIynqmRiGGGAkNSRFlBip6oA39/6TFPJDP4RhIUvtkCQ35NFDeuiG8GAJWUIhPfRCeLCGLK6QHnIhPOrgUQePOnjUwaM13WhrbYS01kZ7HPQO4dFeM5UAAKw9NrrDXgSLAAAAAElFTkSuQmCC"
  }),

  PropTemplate.deserialize({
    "width": 30,
    "height": 62,
    "isFloorProp": true,
    "spots": [
      {
        "x": 13,
        "y": 21,
        "allowedActions": [
          "sleep"
        ]
      },
      {
        "x": 15,
        "y": -10,
        "allowedActions": [
          "sscratch"
        ]
      },
      {
        "x": 14,
        "y": 71,
        "allowedActions": [
          "nscratch"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAA+CAYAAAA8nKuUAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgEUHt+aOpcAAAE8SURBVFjDY2SAgkobxf8MDAwMRy+9jWJgYGCw1hNehsyHAXRxYvntR+4zIpvDxDBAgAXm05wcV4jIlN3LsPFhgJA6nHyG3f+RfT5wPkYXkFdXxsqPCjUjSh0uPjoYeB/zCohAfSaCogCdjxA3w6sOl74B9/GoxcPfYniq/vzhzWhQD/M4hpVco0E9mo+JBYTSzOBpgVALEArBoZ+PCfkQvbU59OOY1BAbOB/D+zQty/8zMDAwVNZEjpCSi9YtEfQ0MPxKLkIhOXh8TK2WyOAvq2mdikebPsO/5Br+qRodTJmym4GBYTCMc8FG9uhVD4/m4+HTdxoN6uHXdxoN6qGTjzfvvsfAwMDA4OuqRBX+4E/VD29C6k1e6JwDLj4D1EcPb97Fyp8CpREjAYPEx/D5PkJzi6TyYWDQzS0CAICunFaJNymsAAAAAElFTkSuQmCC"
  }),

  PropTemplate.deserialize({
    "width": 30,
    "height": 62,
    "isFloorProp": true,
    "spots": [
      {
        "x": 13,
        "y": 21,
        "allowedActions": [
          "sleep"
        ]
      },
      {
        "x": 15,
        "y": -10,
        "allowedActions": [
          "sscratch"
        ]
      },
      {
        "x": 14,
        "y": 71,
        "allowedActions": [
          "nscratch"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAA+CAYAAAA8nKuUAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgE6Ouie12oAAAHVSURBVFjD7VlBSwJBFP6UsMVMQiQiTBahEBErUegQ/YBO0VGicz+pc8Qeo1N/QsEIWURDlooIMQ+Cy7ZB2yFn253Uxdp1JtfvsnyzM+/xvbfLezMTwAClwqoBAE8NrQQAGTEuAYCsdEqwgB6neWJLkKx2CJcq7YDVThCMsECUnuZ3AQDXelMCgKO9TTJHsi6gx3/w/Be/QFWy2gWqhlU5O8VOE3aKKQBApK8BADq9vm2cnkdwsJ0ba5ed4qgesSnZz6zbeGTEQjMChA+eozg/iqfliEQWaHOiWBM/vPUk85ZjVX6fqmNmiv3n2MxxLLzoM8VJQXbV8IOW4VyxGiq6ajiJMjWyMuPViY5gL1TlTDHpOH6LeHRp7HvSbUb1pjEbOZ40YuwUn9+1yJ7GAIDC4ZonjgQlyOl/nBbinjiqix1b7zX7jUBaiNuiyU+OlXrXFcNiOsZ5PXYbTpGb99XsctxV33ym2LPtsfIKACDVkJ3is1zKAL5Pe/zzVfvvDCTRXfbUUQUvnCkO62WPXfG2W3Tawf8dz/N6zDjHpCu8vKoBAE6Os0N57VEFAGQ3wkM5PZ/g5r7xT+vxbbk1UJgdyglo5dyc0Jv3fU53i5Nyswbwdrf4CWWvrXZ44/SoAAAAAElFTkSuQmCC"
  }),

  PropTemplate.deserialize({
    "width": 60,
    "height": 56,
    "isFloorProp": false,
    "spots": [
      {
        "x": 17,
        "y": -3,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -16,
        "y": 42,
        "allowedActions": [
          "escratch"
        ]
      },
      {
        "x": 75,
        "y": 42,
        "allowedActions": [
          "wscratch"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA4CAYAAAChbZtkAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgETJSHQRXQAAAJvSURBVGje7Zs7bxNBFIU/QxITmdjE2qAII5EoUrBxRFoKRENKGhqKFJQUPH4AFaLiB/AoKFNEEQUUvCqElArKIKRESNgVCBFrAVvBcmIBxe6V2NGsX6sgvHtPtdcz2Zkzn8c7x0lS57LZ3yRIB0iYRuTi2aPrsTZ64dK9ZBJWw2pYDathNayG1bAaVsNqWA2rYTXcMQ8/fb6hhGNNeGbGUcKxJiy6eftJLIwdc7IA3Lh2XglbV6Y49QOAre0cAKX5SQA2P3wDYDS9A8BeK2NtH8erm3h1vlUDwE07gfuHScY1xzHntTg3BsDGx10AMgstAHbe6x62ExaVzx7yVtLf0qfKX3yCaQCO5kYB+PTV3j49cQSAasMjXBj31tb95fWfdUa6EMY6jjmvucJhn7ALwG5jz79DWgl3JPxzqx1Yqeb3kl9XABhrnvTrqrW9eNzbRNXNTKQJLpaLPuGKdV76HB6UcLXWjnTjlz5ZeQ7evf/KWoep136P192++ith8znYjVDYyponnG51N9Iic9x+3xlKWPTwweVI9X4p6jhKWCS/MR/2tKSEwxoWpr304badQBrqV5KeGlkv5UzUc9bUc+b0FABv3m1b05fZ30xjkppEkp6UcFiDkBXNFqIRzk8e9HJtPZiWJBXNn8gHCMt48vNmfzONhRFVwr2eZV+8rgw0QL8ntUFrU3rS8pWSv7W8c+tiYGX+1clpv3Tl6krgHSDfxuoeNlcoblLCveZUJTxsn9JhKeNzrT7UKcmcf/L28Hq9ngIQ0ktLpUCHlbW3crn8n3tZ7TR/8Zm8PWy+YPkvl+Uh87T6dyFkE7uH/wBbqPtiaMOcLQAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 60,
    "height": 56,
    "isFloorProp": false,
    "spots": [
      {
        "x": 17,
        "y": -3,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -16,
        "y": 42,
        "allowedActions": [
          "escratch"
        ]
      },
      {
        "x": 75,
        "y": 42,
        "allowedActions": [
          "wscratch"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA4CAYAAAChbZtkAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgE5H4i3UO4AAAJRSURBVGje7Zs9T9tQFIbfkFjQRjgCMzStCOoHVRmQEMx8iKV/gImBX8DEyA9g7BR1RerAVKldWVqoxMqSIRJLhCwFhGIEVhJR3Kgdrk9V315/3IRKjX3eKSe6se/rx9f3vEqSWzHNn8iQRpAxFejF3s5aqo3uvjvKJmE2zIbZMBtmw2yYDbNhNsyG2TAbZsORefjc6THhVBO+79ww4VQTJu1/rKXC2NMpEwDwdm2GCSuvTG/6DgCQt8cAACXTAADcuh4AwPZEPW14yvGXRQcA8KRjKevV9deREzv+cgYA8AouAMD4Ieb13LoGADScSeW88nNdMZ86r2E1YdLGktiXP9mirljjAICaK67wRNH0H++Ocrw16R+6o67n3zxLRLhcEgRb4jRYWB4VhD+r53XXFqQNfkrHED5pPtY6kO74ftWuD9YRMmHSxcV38dTDWF8HNuxSYB88PDoP1NX3XyM/L38uTLXGtdZ4Jkyi/TSMUFgtE0pax5EmyefVvTOYMGl7azFQz25ZWvW/UtLzHIIJRxOmb8yHPS0x4dD9asYLpBtKLdr7sZ9y5LSkm77klISeTzDvBsb/ls37cDRhIkGi1KIrSjlyWopLX+WySEVXPqlXUwWfsL9GxycAAM2uG7gTuJdOSljuWFrOo75OoNup9Vv/tQ9zpxVDeLZiPWgHpdupDdrZcacVR7j64TSVhplw0pzKhIdEOfkX8XLKaLbcoTIUN//sreFvrpsDACL94mUp7Apt/udeDqLmTz6zt4blNxT/ctkcMk8HfxZENrNr+BdNEuHB5iw7XgAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 92,
    "height": 94,
    "isFloorProp": false,
    "spots": [
      {
        "x": 19,
        "y": -5,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 63,
        "y": -5,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -15,
        "y": 80,
        "allowedActions": [
          "escratch"
        ]
      },
      {
        "x": 106,
        "y": 80,
        "allowedActions": [
          "wscratch"
        ]
      }
    ],
    "src": "data:image/png;base64,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"
  }),

  PropTemplate.deserialize({
    "width": 92,
    "height": 94,
    "isFloorProp": false,
    "spots": [
      {
        "x": 19,
        "y": -5,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 63,
        "y": -5,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "wash",
          "yawn"
        ]
      },
      {
        "x": -15,
        "y": 80,
        "allowedActions": [
          "escratch"
        ]
      },
      {
        "x": 106,
        "y": 80,
        "allowedActions": [
          "wscratch"
        ]
      }
    ],
    "src": "data:image/png;base64,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"
  }),

  PropTemplate.deserialize({
    "width": 92,
    "height": 90,
    "isFloorProp": false,
    "spots": [
      {
        "x": -12,
        "y": 76,
        "allowedActions": [
          "escratch"
        ]
      },
      {
        "x": 102,
        "y": 76,
        "allowedActions": [
          "wscratch"
        ]
      },
      {
        "x": 17,
        "y": 1,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 64,
        "y": 1,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABaCAYAAAA1tjFFAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgETO9vfeBcAAATCSURBVHja7VzfTxRXGD27QpctDvIrlHYSVyUxKqiJibElSlqbxrRv7SN/W33lTR81pq01mKDGhAQ1ig9rXKIGiG3W3SDowtKH735T5jrDzCDLzi7nJGT37v05Z87e/b6zl83AYKKnZxNEwzBdqWQAIEsq9hYdquwr33aTjUbiPjap8CaAhJNwEk6QcBJOkHASTpBwEk7CCRJOwgkSTsIJEk7C9wM69ElpqUY2qPA2VriTJ/dUeDsr/EnpAwBgdYXHU6jwNkJGn+j5lIJ7AACwXK4DAPKHukT579YAAONnD/sG+GumBAAYGSwAAIpvpTzmfJR3TvWL4PphU78o9ZdP+t9Zt5/J0n4cL/jm+fnCIADg5oO3gfU6jvb/5Sd5vPHHZmB/55i8Xn3hny8uZuYW5Poc2SGK1RwAYKhXtFx6vQGAJ6+av4crhg51GoXLHRvoEYW/Mgo/Nbpo3WFRxrDTCwB4syp33DVRT7FulPar9Pt9SsquY+qrUj46eMA3br5b3mGV8pIpS7sR96Ap/yP93D5TXvCNo/03XtZMuTOwf3+frGO9e9M3XlKF/389fh5V4dzD06LwKKyWT1qvzMXqN/vnCfPsEaMUIsUKDx3o0kt5co2kUuHtqPD1u0d8e/T0SqcvHp1d3tnefXb0hMmE53ZlnVdvlRpC5PSbTiq8JTLN86e6fN6KF58bpWoGGvb6WCEXa2IdP2zcT/IDq11UOWocRdL+cdenPDx8usZMM9UKnzj9JVlKspc/fk+Ft0SUor74rfsrZIlxeBsqXN25yXNyT6Zm5dP3u8PyeG9BXrf9cru+4yspry9J+Zu8+Onqi9v+te2T/3Z5BABw/XYRwKd+tt0/zN9Wv1xh+/VR/r09j70uXbf64VR4q2Sar55rPC6Z1NHBDqNgUa7tl9v1/X3mG6QlUYjtm9v+te2THy/0m/oXojzLzx69mDPzfTTzBfvb6pdrvFwsS78rQzWTGedMOwSus5rpMvUfAtdl++FUeLt5Kc3C+/l1RinEHipco5mk7XVvjXLdoty+I6OOfGbMV2J5H9NlmW+iW/dyKS9Wy772ZwZqJgMPyTDpFraql2LdeVshtttmI8yN26mrGHf8sPmW39UC+ye9zrDrpluYVoVHKp2u4baIcgm5h6c9SqFryDi8vRVuu2FhUUNS6Kf692MDAIA7T8QjsV1H+3RqlEtpt1eXUr2RH8b96/h7Rh71dLB3KjZrxqnnguuteajwVt1SXCfrOWKNwIh70HMCAXEd1XkMmn+gp8tzKuO0H3Z6PQcQAL5ey/r+vHHcPt8JWjef9U4CB9Yn5IUKT+se/rpab+hCHswvckshmphpetFKTA8kKex54noZn9s+DDs96cVMk14KvRQiDVFKdbUeeAeJ7WHzxiglrQrXX5doVFTC1J5IR6YZFh8TwYjaEajwtCnci893OQ7XqGev4/tGzRs3iqPC06rwfysbifb6uNFN1Li7Nc9eXQ8V3qoK/9xPZ85DhTPxIeFE8/bwRmWczcpkmzUvFZ42hdMtpMLbU+H6nZxC/zNZsV9/o1Z50Ou3y1R4ypCJamD/Jq1iyy9OTu4zzqa248P+lp4KT7vCbaVvweQ+525qayFK2VR4k/Afmb44DrvLlPEAAAAASUVORK5CYII="
  }),

  PropTemplate.deserialize({
    "width": 92,
    "height": 90,
    "isFloorProp": false,
    "spots": [
      {
        "x": -12,
        "y": 76,
        "allowedActions": [
          "escratch"
        ]
      },
      {
        "x": 102,
        "y": 76,
        "allowedActions": [
          "wscratch"
        ]
      },
      {
        "x": 17,
        "y": 1,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 64,
        "y": 1,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,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"
  }),

  PropTemplate.deserialize({
    "width": 48,
    "height": 50,
    "isFloorProp": false,
    "spots": [
      {
        "x": -6,
        "y": 44,
        "allowedActions": [
          "sleep"
        ]
      },
      {
        "x": 20,
        "y": 54,
        "allowedActions": [
          "sleep"
        ]
      },
      {
        "x": 46,
        "y": 48,
        "allowedActions": [
          "sleep"
        ]
      }
    ],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAyCAYAAAAayliMAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kDHgEvD4mY9V0AAAT5SURBVGje7VldaxxVGH7PzOzsJrs7m20+0BgUFGuxVaOoKGiwKphLtXgheONlf0b/jKIIIvFC6o3kQlSojVWjYEkwX5TQJO0m2a/5OF48zxtypm6h1IvumLk5+86ZOWfO87zfayR3zUWRlQf4Wmy1zHHZkyG/gjzy77xSfbC/+Aexx5kYegZODnBygP/7AYL8jdUb2X+LTB6izBlOGLiDgUo5uT+E7/e6R4aGngEzKBcKRqr3pNPKpZfm5ks5Oc697vNHcvf1+53DgudC+asXVv4VeS9zufNM5iBtyYAxAxbW52yOATKTWW6k8xR9MlB8L6TXeDVyj+i5iPd3bxJqyB4R83M2YXI2YXM6n3K+0phymEmNy0jr9o4S41EBsmIycIe34RhYQNvdA/JxJRQRkZCP+aSgPIoxKuP+B29C/uZ7QNom8vsdjJ0D3E/3tmEi41OkgNtzX6PfQ4aswZcV0AY81/96vot8GgJzAixhCfOjpKIeAqJGDeNLZ6G7jcYp2A4Z+OoykN+mmzn0sECyQybGwERCWzhi4BK/0BbNBtS6z4vrbXzrMuHxyOUAcpXIRzXIF+bxwpWrGL0SxtLevoiInHm+T6MZFxGRzxfwXppg4VRtjvtbbhioN3va1ZEC2QCRNg1xkNaIGqhNKPIjkBtVyM0qFph9ahd1xSriCFVbAtqKyktLgLRaQmBocz7W58ic7ee80CRBv1RYL6R3fLUFihxD3q+PAJn35zFeXXKRe/lVyGvXsKDPHGh9py4iIq/PQf56AUwcdsiEr6kW1km58VFu9YY7Fo8BzV00yfSYfloiWGLErfDNkH6/ThtY3wXCj07uiYjI3zeg9H9tIHKcFmSVT7yAjaJ6U0REDtrYJ2lR942lTeQ+9ApBXymKDdgBhzjSuZI42abhD9VRo36eTGWbbTARwJ0tX2c86QHxkXPA0viQX3sL8wtfQvkPjeo+Rj/NHJuUEfd7h5+B82MRoGhSp6NcLczcxWbu3wZ+uyciIj9dhvzxRUTatSVAtfwtSqyUhdS5FyH/sQJbaI/WwERCP8/STJnXOKSVWhAi8MzPyb6ISGyK5oWmzjwjIiK3Nlfu/kIXuUx/DJG222vBKazD+4QzYCr5DdSVmd4vrwL525uY39iG3OkBw6zVGdQoAeNl1OiTjz0uIiJbf/5eFAZo5BNNZIf7W1tuW4YcWYbkrAHk05vw89Nvw3iu/QL5vXcPMP8cdPrH7+DG4pjMWKzTPwDi7TqY63K0LbyfZa6b0Vp6vIn9tuKi2MCgHqR2B446aeWQXQQgGHPsd1nbwgnJF5/VmTth5WCa8YLP+1rrshK7dR1uKmYXRBmyfD7VNDRWb2gK3heqz0wjIm5vEBESQO9Qow2UJ+DHlxbXRETkkSeBRUK/HtCR532K9oFiUt8lspUa1t3fxY3uAZjpsSiuzTzMTp1xbKJ4DEwwO9Q+kMeTlugWoiZynBKL1HAC8ubPv4IZzR6Zy3i5//21tE2o4w/NngXSjMQVpp+GNXLQxxg1xlk7u529AjFw5HdxplM8see73YVUa9RcbjQ1+yx1P3PGQVdCL9Ql0jHlWg39o0oCRuKAkVqTH+3MeQVhwMxF0Yf8/YnTjSCARrsKqfZr3L4NmwrH7muvNNdR0/jCdTXNVy+nY5yq7Lnz3MeyreSV5aNiMKA/jjExFNdiq/VpIRj4B+5TxRGG0GnUAAAAAElFTkSuQmCC"
  }),

  // Posters and dithers
  PropTemplate.deserialize({
    "width": 64,
    "height": 172,
    "isFloorProp": false,
    "spots": [
      {
        "x": 38,
        "y": 28,
        "allowedActions": [
          "sleep"
        ]
      },
      {
        "x": 20,
        "y": -14,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "still",
          "wash",
          "yawn"
        ]
      },
      {
        "x": 75,
        "y": 158,
        "allowedActions": [
          "wscratch"
        ]
      },
      {
        "x": -5,
        "y": 158,
        "allowedActions": [
          "escratch"
        ]
      },
      {
        "x": 47,
        "y": -15,
        "allowedActions": [
          "alert",
          "itch",
          "sleep",
          "still",
          "wash",
          "yawn"
        ]
      }
    ],
    "src": "data:image/png;base64,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"
  }),

  bedTemplate,

  PropTemplate.deserialize({
    "width": 30,
    "height": 35,
    "isFloorProp": false,
    "spots": [],
    "src": "data:image/png;base64,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M4tlEYtQRogIs8X+ECm7S6Yme+xrhxvAEDtrfFKzOU5H237qiP/059978a3zT1ztZnMLNlm27jBglWwxq2azuoqDqm67D9+r58smWbtYkiJrX69hzDlJ0U116wjF9o5P70za8rt/8Eebm9o081gk95xzu5jVdDs/isHaXsESbWG5zHXAZhQpizAcdUPQuM5GAYRJRVJqu5sjF+GiYvbv/907Z7f6P7jdbE8XW9cumU/ECxEpolhORacsBwOLo3PjUayyDH8B3SEAaZtO6TN3AAoReHbLveGeEznllHLYfu7e4YPf/sZr7JSMuvjkYPeNa5e+8VIU3b7y3N71129851evvPbKp53tL05qaSfo9EVVQzDLpAxGWwAiyNS2gDikIwFtlTXk2fx3f/OZVV5YvXj6+rP0dOffby8TX317txhdmT2q73y8LIfFC5f2ntTqr3548s3rZa9/hkRumtAfqsoa9Iy1vzm36l5bL2rnvQf3/v7Dwx/v//Sbr17WEH780dGZG19Znq7qtukOu+VmubnTKUscT+uE+pnzZ4rBmeVssTg50RgRusz2eKmu6gnrubW1eu4X075PvFd87fmLZimETgj6/C9eAeT8t6+Laq/X7+8GFZTd3u4ehfj5vcDqlNbEsufehFi4JwAyGm0ISdLcSPDxF0g6RWxTxv+j/hcbH62NPMfW2gAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 29,
    "height": 34,
    "isFloorProp": false,
    "spots": [],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAiCAIAAAAs3UUgAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHhMoB9egnLYAAAUhSURBVEjH1ZTJbxtVHMffe7PYM56xM+O1ibPVWaBp6qQNULVAlQoJikBICCEhDhUgygUJOHOBGxJI/QuQWASCQqGAAIGQaNImrWmzNCEbbRM3ZHVsNzO2Z30LBzhVND00EeJ7fE/fj776/n7vweFjr4AdEAI7o/8bl9/iTn3taX+tKIiB2k85/lCXd+ZCsD+Loyr9dRz1ZlB3m3fy9O28cOu5xfruLY3NSc0JAKA1vxra2+otbwj1MSe/SmvuFkb43+/DNbO0I9yvuOKOcLuOHt5+bh5XLcvaZu7VFF96qi/A8QP9TdvJ/dEpff/tD5cuXi5tlN5y5+72Xfytd8pTi2u1+/r6IIK2ZZduGn6KCncKdOe8D4vReDS6srycyWSCstzY2MABuA09HFJS2Wy3rmuDAwPJVKo7m0XbwmUA3MjfqG+ob2/LuLY1PDS8Pf1iRjlB+ObMd627W7yJyXRTIyhsxz6cyvCu4+ialkola7WaIAgfRoy7zWv67tjoHMF+LJHcKGxIkjQ7MyOKIghG7oobFgJH+o/Ytq2q6trqSiKVtCyLeBhcw1sbb/tP2gR/knQ9gl2f2LZDqa/Vablcrr29Q9PrEACiIFKCT5TUf7VzL7X33XI0CMtfSOYQM8vGJkQoFJJ1LVIqlSVJTu3apWsRvS5ydvCc53uW64yrdFzFLTdJiBdvzVvGjs4HT2V423VCSmhtdU2PRmvVmhJSGAC+73G8QBgGFFDKAGSMAgAo8TEmfkCSpGCQF3jP8QCEzy+wf/p9szq9UigwQtJuOqrppVIZ+6RSXWrP7A5I4rvvnVQV9cknjt1YXDo/NNzclFbV8MTkJATwjddfHR8fl2TJ9bASCjHGzEoFBDoL1Hl7dQSKorjnnk5FDetaBAA0PjbW07s/n5/P9vQ2pustq4ogzwm8Va06nhsJhxEAjEGeRwihiakpSunExFS1Wunp2ccY/H1qmkPINAyuN9vT2d7WnG42KxVZlgWBT6eSVxfyDxw4ABh1XP/swGA8HgMQrheKcV2zHefjTz/r7cliggmh64VCS0tTVNd4QTTNytEjD9VFIgAyZJpGsVT+bSTH85wiS+eGhgkDUkA4e/78ueGcwHOU0Iu5S9jHpWLRdjyMcSqRtB33Qu7y9fkFwECxVL4+n5dEMRbVhi/mRq9csSyXiyiqrtXVHL+na68clDJtrTE96hPMCFtaWWpuTKthVZICCKKGhnrLrlHG0g315VI5lUiEFLmjrU3XtMZ0OpVMRsLhn3/5Nbt3j1mtcPu6usumEdXqZCm4vLacX8gHJXnTMIvFjYMH73//g4+mpmc6OjtPf31mZGwsGU94nv/5l6enZ2fbOzLE88PhiFmzR0dHdE1DHNgsGwDBRDyJZEW6MjHR2twEIHA9T1ZVH3uLfy729mYx9k68ePzlF47Pzs7s790HIfQ8xzSNxx99RFVCADLLsX1CACPxWIwyggk5/ODBqcmpYIDnZUkCABCCeV5AiK8LBwWeW19bhwDwiKeMMQCS0bgSCTPGYrFYWFUgxz337DM+9hVZ8X2f41AykSCEiEBwPT/AI4QQPz33BwAAE0IpjekRxoBlWfFEwqgYruMm4nEKQX1613qhCACo1moMMkVRCAM1u8YhBKCPfUeSgp6HCWWEYJGDc9fm4WNH+4ubxqZhQAAZoBgTRimEECEOAMbznO04NcuxbSumRw3DEAKBkCwT7IcVFSFY3DQYpbF43HNdORRCkJqFNSGk/gWfSIx5XPn1SgAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 34,
    "height": 24,
    "isFloorProp": false,
    "spots": [],
    "src": "data:image/png;base64,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"
  }),

  PropTemplate.deserialize({
    "width": 25,
    "height": 31,
    "isFloorProp": false,
    "spots": [],
    "src": "data:image/png;base64,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"
  }),

  PropTemplate.deserialize({
    "width": 120,
    "height": 86,
    "isFloorProp": false,
    "spots": [],
    "src": "data:image/png;base64,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"
  }),

  PropTemplate.deserialize({
    "width": 60,
    "height": 88,
    "isFloorProp": false,
    "spots": [],
    "src": "data:image/jpeg;base64,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"
  }),

  PropTemplate.deserialize({
    "width": 42,
    "height": 41,
    "isFloorProp": false,
    "spots": [],
    "src": "data:image/png;base64,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"
  }),

  PropTemplate.deserialize({
    "width": 15,
    "height": 18,
    "isFloorProp": false,
    "spots": [],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAASCAYAAACEnoQPAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHhQWOVJLjOUAAAOeSURBVDjLJcNbbFMFAIDh/9x67u3punYXRtmcmhmuTxIhMQLy4KOExARjfNAEowmg8CAxqC9eiIkG76JBH4wxIcZbJBCFYUAkeMGMQQS20gFb121de1pOz07PaY8PfsknXPju/dgPAqIojDsdBE3TUCQB1/OJ4w7dKZ2Z8iJu4w75/hxXJm+hCNBuR4iGqCJOxZi6IXR1dfH6B99T+7bIu3Pr6AgqCc1G1h1iyaAw02Cgvw/NstEtG7F+ysP7p4p75g5xRyCZ1EldP8/unw/zbHEYRJEwikioCfp7HWRZId+ToTtlIs4WJyAKsaptbs832LFtC7uDFurMDR63PDaO3Ydp6KSSNqKkoGkJas0lwlhAPHDtNHvHjqEmEqTPuqRtkzCKMPuGeOzHr1mjiMyHFmpCxtJ1JEEiaeiokowYtFq02iHNzTZqby9hOyKKImbLU9TnbnJoeIxdt+8hjDqUK1XKlRr1xh3qnodomSayJNE63WCxXWPn/kNIkkjWb2FLMmGlwdu5cfZd7qHW8Onussk4NknL6MiKrPDizu1cc13eOnwUURDZn8tzpj5D35b7GfjsOJ3tG6iqQ/y7IOM1pjE1MHRVFJflIKV8TO7meYjbvJPOoAUBa5sx+uAAaStDylT5KD/OEftBfp9LYBkG9WYYCOee2BfHg38T1DXm0/eiDQ7y5LVBjg5fJTx4hHTXctznHiGmzWy1xd7qKvTA40CuUBdGX1sXV+MRjBUjeL5CveFT8DQ+Nx/my+UXODm+xCfOZj61j9OKQmJRZs/UEI86TUQ3UNCnS9R//QURCFoha7Ix5amrPH8+wdZVKkxd5JnyerxmgBAFHMxeIl64OS+mS9uI+0ssRl0UJotoCvjNJm9kLjPtDNNpR+x3xnDLk7xQW0+x5FKpuvS2b5dFbWuJQnsHRlAlf6pERtfIJA3WrkghBA1eGcvS4xh8OFwidud4M3yAVysrmazJplj5wmfNDYXuhQGcER9n+gccSyMKQ17OFrkoO5h2EpUl3rurSOAtEnRivJ7VlvDVvq3xpJ+HbDeLMymM6eNMhjIPbVxNrttiT20TS1fOsnFhFEUW/68ohKJxRdbaHkrhOtZfi6xaVkdeGbDS97F7khw7c4n8xAkqG57mj6FdjIx/g1IrUPd8+nqzEwLAbz8dfqp5a/Qlr1Yduj579zkzN5eYKIhzV6dmDEtXTVfJSqHqrJU0vVROZJZtav0paIZ54j+oXZuwQmACTAAAAABJRU5ErkJggg=="
  }),

  PropTemplate.deserialize({
    "width": 24,
    "height": 28,
    "isFloorProp": false,
    "spots": [],
    "src": "data:image/png;base64,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"
  }),

  PropTemplate.deserialize({
    "width": 67,
    "height": 90,
    "isFloorProp": false,
    "spots": [],
    "src": "data:image/png;base64,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"
  }),

  PropTemplate.deserialize({
    "width": 61,
    "height": 40,
    "isFloorProp": false,
    "spots": [],
    "src": "data:image/png;base64,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"
  }),

  PropTemplate.deserialize({
    "width": 25,
    "height": 31,
    "isFloorProp": false,
    "spots": [],
    "src": "data:image/png;base64,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"
  }),

  PropTemplate.deserialize({
    "width": 26,
    "height": 36,
    "isFloorProp": false,
    "spots": [],
    "src": "data:image/png;base64,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"
  }),

  PropTemplate.deserialize({
    "width": 32,
    "height": 23,
    "isFloorProp": false,
    "spots": [],
    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAXCAYAAABqBU3hAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kDHhQiAy9tpqAAAAUaSURBVEjH3ZZ5UNNHHMVfCCGcIoeKR1VAEdBqFQrIoSiICli0eFvvVqwoKtpLB+01MjroaKcqVDyQYjuKR+vUTseqKFOpclgFgYoIQSXQhCSQEELyS17/w2m1U6XamXb/3N238/m+992dBf5PI3pGNJ9VY/3UOw/P5OA2H9Sv3Sb689K61BW87++BM5rzwOkXWOGk9C3cvmYfb8+41FWpz6EEys0Gjj++gd05U9QdUV7uYQppMtyMU+D8xfMor7oj+tfzXrZ0HseGhfKfnmPVHVF1wWE2KbVwcnBEQOBozortPsgzA1BoZcYX38BeaguxWAKJtQRetj1AcwuNbfV8YZZbzB2kqZ00qXmidA21RRcYFBLKiwdLWZUJUi9n+U9FtJhUTFma8HxBqK0nDS2kScvs3dvpYW9L2WURX4ubwetn7chOE2lS0NwhJzuaaGqpoFFZzucSgaz0S0JkA1iJAJEFy5NXQK5pRP65tZgwrD+SkjtgMasAkwWL5i4BaAZgBZFIjDsXM7vvxMLJr/JB6SnKb51ia0MhaVQxYXI4aVKTRg217VUM9PNn3dVymvXNZKeCFm0DLbp6WtQ1pK6C1Zf28krOWl7IWslnciB9cyqP5O6CxFYKZUsjpDZOAIAz574HSBRdLUZLE5C9fzt6DdQjfuYbsFgEwGTC7LmrAFgg6IGFyZ/DRmIPnU6Pvetj+FQAiZFj+V7aRghGPXakH4SjnSNEYiB01EicPZmPqNjZ+GTnHrjQCA/3UOh0bTAKwOTpi7HjQB5O5O2BSGwD0oyv9qVALJZAZ+jE5eJKzAof+PeRWNobyc5msrWa1D2g6m4BawuqmbhwOZvulXPS1FiGBIdSXZJP88NaUqOik5MDIyIiGBcXw9PflTNl/hz+WlLEsGFe3JAUSbFYTLG1iNZWYNaqKfxLB5LeDaBdQTycSyZgSO5S1LQ74NuCYggjBmPZ7HhET0sALQKcXXvg06wTaLDqCY2qBuMnRkEilUJq44hgbwFvZhyEccBIvBIZiZUpu3Dr9g0kjB+HBTNfxzvZhQgPHsvHAHJzXLnvgx+hCy9E88ArkOxths+cDGyu1uM3vQm+Qz3R22MgpHa2cHVzQ3GNAlb3O6GsU6KwoBCEAKPJiAWLl0DV3gEBRFHZAoSMi8KYUQEofyhD2scfofpuJb4+cuhxB+bNawTtDJDEOcAz0AtSiRiKcx9ia2YMbGiAg50L2nQ6aNQatLRqoNfrIG+rxqJ162EwGNDWqkOfPn2gaDdjjLsAtUFAuf9NqNWtsLKyxgBnF7yVvBYlTQLEjg5oqqlgF4DQYWJe7hk0dLgizD4M0xPjMXSQL37IPYb2tHnwd7PGuNgYODu7oG+/vnBz7ongMb4IiZ4oyj50AMNf9oe7qwvqZDIM8vKEj99oBDlqYcpJRVhoAPq498KlG79gSNzbUFrb4uSxozAJwqPsj+ecZK1cy7oWA8saO+i9KYFOy3rz7p1aanWtTElezXUbtnLAS96cGDeFIRERVMrudeU40teTfiP8OH1uIh3detLH05ubUpPYpmqm8n4lPfq5sv/oYFY26Vml6OTPD9tZUNTwqBmvlTSytLiKAQEBVCjlbKq7x+obJZw2NYoVZdc43Hcw4xLn8/3VKQwKCqRGrfhDJ2dnZVAhb+D1m7epkFWxtaGKbarmJ165o5m7V1w9nc/wkOCnfyVzPsug7FYZAWDbptQnCvfvTO+a37FlY8l/5iP7O2S7vIG1hebYAAAAAElFTkSuQmCC"
  }),
];
