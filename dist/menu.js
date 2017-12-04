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
