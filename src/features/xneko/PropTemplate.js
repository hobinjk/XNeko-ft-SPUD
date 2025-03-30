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

export const bedTemplate = PropTemplate.deserialize({
  width: 32,
  height: 27,
  isFloorProp: true,
  spots: [
    { x: 16, y: 0, allowedActions: [Actions.sleep] },
  ],
  src: browser.runtime.getURL('/features/xneko/dithers/brownbed.png'),
});

export const bookshelfTemplate = PropTemplate.deserialize({
  width: 64,
  height: 172,
  isFloorProp: false,
  spots: [
  ],
  src: browser.runtime.getURL('/features/xneko/dithers/shelf.png'),
  spots: [
    {
      x: 22,
      y: 176,
      allowedActions: [
        "sleep",
        "sleep",
        "itch"
      ]
    },
    {
      x: 42,
      y: 144,
      allowedActions: [
        "sleep"
      ]
    },
    {
      x: 22,
      y: 112,
      allowedActions: [
        "sleep"
      ]
    },
    {
      x: 42,
      y: 80,
      allowedActions: [
        "sleep"
      ]
    },
    {
      x: 22,
      y: 48,
      allowedActions: [
        "sleep"
      ]
    },
    {
      x: 42,
      y: 16,
      allowedActions: [
        "sleep"
      ]
    },
    {
      x: -16,
      y: 156,
      allowedActions: [
        "escratch"
      ]
    },
    {
      x: 80,
      y: 156,
      allowedActions: [
        "wscratch"
      ]
    }
  ],
});

export const templates = [
  bedTemplate,
  bookshelfTemplate,
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
    "src": "data:image/png;base64,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",
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
];
