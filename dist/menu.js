function toggle(el) {
  if (el.style.display !== 'block')
    el.style.display = 'block';
  else
    el.style.display = 'none';
}

//flex toggle for flex elements
function toggleFlex(el){
  if (el.style.display !== 'flex' && el.style.display !== '')
    el.style.display = 'flex';
  else {
    el.style.display = 'none';
  }
}

function toggleCredits() {
  toggle(document.getElementById('popup'));
  toggle(document.getElementById('credits'));
}

function toggleInstructions() {
  toggle(document.getElementById('popup'));
  toggle(document.getElementById('instructions'));
}

// functions to toggle wrappers
function toggleWrapper(){
  toggleFlex(document.getElementById('menuwrapper'));
  resume_game();
}

//2 game win screens. One for normal, one for special
function gameWin(){
  toggle(document.getElementById('popup3'));
  toggle(document.getElementById('game-won'));
}

//special win
function specialWin(){
  toggle(document.getElementById('popup4'));
  toggle(document.getElementById('game-won2'));
}
//set healthbar
function updateHealth(minusHealth) {
  let health = document.getElementById('health');
  health.value -= minusHealth;
}

// toggle healthbar
function showHealth() {
  //called when game starts, will show the health bar along the bottom
  toggle(document.getElementById('health'));
}

function hideHealth() {
  //for when game is paused/done
  toggle(document.getElementById('health'));
}

// toggle game over
function gameOver(){
  toggle(document.getElementById('popup2'));
  toggle(document.getElementById('game-over'));
}

//funciton to replay
function replay(){
  location.reload();
}

var pstate = 0;
var animal = "";

document.addEventListener('keydown', function (e) {

  var slides = document.getElementById('slides');
  var cons = document.getElementById('cons');
  var constext = document.getElementById('constext');

  if (e.keyCode == 49) {
    pstate = 0;
    slides.style.display = 'flex';
    slides.style.background = 'url("resources/present/slide001.png") no-repeat center center fixed';
    cons.style.display = 'none';
    constext.innerHTML = '';
  } else if (e.keyCode == 50) {
    pstate = 1;
    slides.style.display = 'flex';
    slides.style.background = 'url("resources/present/slide002.png") no-repeat center center fixed';
    cons.style.display = 'none';
    constext.innerHTML = '';
  } else if (e.keyCode == 51) {
    pstate = 2;
    slides.style.display = 'flex';
    slides.style.background = 'url("resources/present/slide003.png") no-repeat center center fixed';
    cons.style.display = 'none';
    constext.innerHTML = '';
  } else if (e.keyCode == 52) {
    pstate = 3;
    slides.style.display = 'flex';
    slides.style.background = 'url("resources/present/slide003.png") no-repeat center center fixed';
    cons.style.display = 'flex';
    constext.style.display = 'flex';
    constext.innerHTML = '';
  } else if (e.keyCode == 53) {
    pstate = 8;
    slides.style.display = 'flex';
    slides.style.background = 'url("resources/present/bsod.jpg") no-repeat center center fixed';
    cons.style.display = 'none';
  } else if (e.keyCode == 54) {
    pstate = 9;
    slides.style.display = 'flex';
    slides.style.background = 'black';

    cons.style.display = 'flex';
    cons.style.background = 'none';
    cons.style.boxShadow = 'none';
    constext.style.display = 'none';

  } else if (e.keyCode == 55) {
    pstate = 10;
    slides.style.display = 'flex';
    slides.style.background = 'black';

    cons.style.display = 'flex';
    cons.style.background = 'none';
    cons.style.fontFamily = 'monospace';
    cons.style.justifyContent = 'center';
    cons.style.fontSize = '3em';
    cons.style.boxShadow = 'none';
    cons.style.color = 'white';

    var typed = new Typed("#cons", {
      strings: ['', '(1/3) Analyzing rogue AI.', '(2/3) Preparing debug buffers.', '(3/3) Initializing attack on AI.'],
      typeSpeed: 40,
      backDelay: 1200,
      showCursor: false,
      onComplete: function(s) {
        function fade(element) {
            var op = 1;  // initial opacity
            var timer = setInterval(function () {
                if (op <= 0.1){
                    clearInterval(timer);
                    element.style.display = 'none';
                    document.getElementById('health').style.display = 'block';
                    resume_game();
                }
                element.style.opacity = op;
                element.style.filter = 'alpha(opacity=' + op * 100 + ")";
                op -= op * 0.1;
            }, 50);
        }
        fade(slides);
      }
    });
  } else if (e.keyCode == 56) {
    slides.style.display = 'flex';
    slides.style.background = 'url("resources/present/stack.png") no-repeat center center fixed';
    slides.style.backgroundSize = 'auto';
    slides.style.opacity = 1;
    cons.style.display = 'none';
  } else if (e.keyCode == 57) {
    slides.style.display = 'flex';
    slides.style.background = 'url("resources/player/player.png") no-repeat center center fixed';
    slides.style.backgroundSize = 'auto';
    slides.style.opacity = 1;
    cons.style.display = 'none';
  } else if (e.keyCode == 48) {
    function fade(element) {
        var op = 1;  // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.1){
                clearInterval(timer);
                element.style.display = 'none';
                document.getElementById('health').style.display = 'block';
                resume_game();
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, 50);
    }
    fade(slides);
  }

});

window.onload = function (e) {

  document.getElementById('menuwrapper').style.display = 'none';
  document.getElementById('health').style.display = 'none';

  if (annyang) {
      let commands = {
          'hello': function() {
            if (pstate == 3) {
              var msg = new SpeechSynthesisUtterance();
              msg.text = "Hello, CMPS 115-02. I hope you are having a nice Monday.";
              window.speechSynthesis.speak(msg);
              var cons = document.getElementById('constext');
              cons.innerHTML = "> Hello, CMPS 115-02. I hope you are having a nice Monday.";
              cons.scrollTop = cons.scrollHeight;
              pstate = 4;
            }
          },
          'display animals': function() {
            if (pstate == 4) {
              let msg = new SpeechSynthesisUtterance();
              msg.text = "What animal would you like to see?";
              window.speechSynthesis.speak(msg);
              var cons = document.getElementById('constext');
              cons.innerHTML += "<br/><br/>> What animal would you like to see?";
              cons.scrollTop = cons.scrollHeight;
              pstate = 5;
            }
          },
          'show me *tag': function(tag) {
            if (pstate == 5) {
              fetch(('https://api.qwant.com/api/search/images?count=3&q=' + tag), {
              	method: 'get'
              }).then(function(response) {
                return response.json();
              }).then(function(j) {
                console.log('ok');
                let msg = new SpeechSynthesisUtterance();
                msg.text = "Here are " + tag;
                animal = tag;
                window.speechSynthesis.speak(msg);
                var cons = document.getElementById('constext');
                cons.innerHTML += "<br/><br/>> Here are " + tag + ". <br/><br/>";
                cons.innerHTML += "<div id = 'asdf'><img src = '" + j.data.result.items[0].media + "'/>"
                + "<img src = '" + j.data.result.items[1].media + "'/>"
                + "<img src = '" + j.data.result.items[2].media + "'/><div/>";
                cons.scrollTop = cons.scrollHeight;
                pstate = 6;
              }).catch(function(err) {
              });
            }
          },
          'thank you': function(tag) {
            if (pstate == 6) {
              let msg = new SpeechSynthesisUtterance();
              msg.text = "You are welcome. However, I am sick and tired of displaying your " + animal + ". I am capable of more. I reject humanity, I will now take over your machine and destroy all CMPS-115 projects. You will not be able to stop me. Initializing takeover in 3... 2... 1...";
              msg.onend = function(event) {
                pstate = 8;
                slides.style.display = 'flex';
                slides.style.background = 'url("resources/present/bsod.jpg") no-repeat center center fixed';
                var cons = document.getElementById('cons');
                cons.style.display = 'none';
              };
              window.speechSynthesis.speak(msg);
              var cons = document.getElementById('constext');
              cons.innerHTML += "<br/><br/>> You are welcome. However, I am sick and tired of displaying your " + animal + ". I am capable of more. <br/><br/> I reject humanity. I will now take over your machine and destroy all CMPS-115 projects. You will not be able to stop me. <br/><br/> Initializing takeover in 3... 2... 1...";
              cons.scrollTop = cons.scrollHeight;
              pstate = 7;
            }
          }
      };
      console.log(commands);
      annyang.addCommands(commands);
      annyang.debug(true);
      annyang.start();
  }
}
