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
      strings: ['', '(1/3) Analyzing rogue AI...', '(2/3) Initializing debug tool...', '(3/3) Preparing system for attack...'],
      typeSpeed: 40,
      showCursor: false,
      onComplete: function(s) {
        function fade(element) {
            var op = 1;  // initial opacity
            var timer = setInterval(function () {
                if (op <= 0.1){
                    clearInterval(timer);
                    element.style.display = 'none';
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
  }

});

window.onload = function (e) {
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
              msg.text = "> What animal would you like to see?";
              window.speechSynthesis.speak(msg);
              var cons = document.getElementById('constext');
              cons.innerHTML += "<br/><br/>> What animal would you like to see?";
              cons.scrollTop = cons.scrollHeight;
              pstate = 5;
            }
          },
          'show me *tag': function(tag) {
            if (pstate == 5) {
              let msg = new SpeechSynthesisUtterance();
              msg.text = "Here are " + tag;
              animal = tag;
              window.speechSynthesis.speak(msg);
              var cons = document.getElementById('constext');
              cons.innerHTML += "<br/><br/>> Here are " + tag + ".";
              cons.scrollTop = cons.scrollHeight;
              pstate = 6;
            }
          },
          'thank you': function(tag) {
            if (pstate == 6) {
              let msg = new SpeechSynthesisUtterance();
              msg.text = "You are welcome. However, I am sick and tired of displaying your " + animal + ". I am capable of more. I reject humanity, I will now take over your machine and destroy all CMPS-115 projects. You will not be able to stop me. Initializing virus in 3... 2... 1...";
              msg.onend = function(event) {
                pstate = 8;
                slides.style.display = 'flex';
                slides.style.background = 'url("resources/present/bsod.jpg") no-repeat center center fixed';
                var cons = document.getElementById('cons');
                cons.style.display = 'none';
              };
              window.speechSynthesis.speak(msg);
              var cons = document.getElementById('constext');
              cons.innerHTML += "<br/><br/>> You are welcome. However, I am sick and tired of displaying your " + animal + ". <br/><br/> I am capable of more. I reject humanity. I will now take over your machine and destroy all CMPS-115 projects. You will not be able to stop me. <br/><br/> Initializing virus in 3... 2... 1...";
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
