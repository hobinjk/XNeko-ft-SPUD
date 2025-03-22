export default class PropTemplateEditor extends Component {
  state = {
    isFloorProp: false,
    width: 32,
    height: 32,
    spots: [{
      x: 16,
      y: 0,
      allowedActions: ['sleep'],
    }],
  };
  render({ }, state) {
    return (
      <div id="editor">
        <label for="name">Name</label>ad
        <input id="name" type="text" value={name} />
        <label for="isFloorProp">Prop lies flat on floor</label>
        <input id="isFloorProp" type="checkbox" />
        <label for="width">Width</label>
        <input id="width" type="number" />
        <label for="height">Height</label>
        <input id="height" type="number" />
        <div>Spots</div>

        <label for="addSpot">Add Spot</label>
        <input id="addSpot" type="button" />

        <div class="spotEditor">
          <form class="spotEditor">
            <label for="spotX">X</label>
            <input name="spotX" type="number" />
            <label for="spotY">Y</label>
            <input name="spotY" type="number" />
            <label for="allowedActions">Allowed Actions</label>
            <select name="allowedActions">
              <option>Sleep</option>
            </select>
          </form>
        </div>
      </div>
    );
  }
}
