import * as PIXI from 'pixi.js';

let app = new PIXI.Application(window.innerWidth, window.innerHeight, {
  antialias: true,
  transparent: false,
  backgroundColor: 0x1099bb
});
document.getElementById('app').appendChild(app.view);

let bunny = PIXI.Sprite.fromImage('https://pixijs.github.io/examples/required/assets/basics/bunny.png')

bunny.anchor.set(0.5);

bunny.x = app.renderer.width / 2;
bunny.y = app.renderer.height / 2;

app.stage.addChild(bunny);

app.ticker.add(function(delta) {
    bunny.rotation += 0.1 * delta;
});

window.addEventListener("resize", function() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

/*
if (module.hot) {
  module.hot.accept('./print.js', function() {
    console.log('Accepting the updated printMe module!');
    printMe();
  })
}
*/
