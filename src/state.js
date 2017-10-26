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
    isPressed: function (keyCode) {
      return (typeof this.keys[keyCode] !== "undefined") ? (this.keys[keyCode] >= 1) : false;
    },
    startPressed: function (keyCode) {
      return (typeof this.keys[keyCode] !== "undefined") ? (this.keys[keyCode] === 1) : false;
    },
    update: function (deltaTime) {
      let len = this.keys.length;
      while (len--) {
        if (this.keys[len] >= 1) {
          this.keys[len] += deltaTime;
        }
      }
    }
  },
  materials: {
  	mats: {},
  	get: function (name) {

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
  },
  sounds: {
    pool: {},
    play: function (name) {
      this.pool[name].play();
    }
  }
};

module.exports = state;
