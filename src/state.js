let state = {
  clock: null,
  scene: null,
  camera: null,
  loadingManager: null,
  player: null,
  world: null,
  stats: null,
  renderer: null,
  container: null,
  entities: [],
  keyboard: {
    keys: [],
    getKey: function(keyCode) {
      return (typeof this.keys[keyCode] !== "undefined") ? this.keys[keyCode].curr : null;
    }
  },
  materials: {
  	mats: {},
  	get: function(name) {
  		console.log(this.mats);
  		console.log(this.mats[name]);
  		return this.mats[name];
  	}
  },
  loader: {
    items: 0,
    finishedLoading: null,
    changeCount: function (value) {
      this.items += value;
      if (this.items === 0) {
        this.finishedLoading();
      }
    }
  }
};

module.exports = state;
