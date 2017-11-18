function toggle(el) {
  if (el.style.display !== 'block')
    el.style.display = 'block';
  else
    el.style.display = 'none';
}

function showCredits() {
  toggle(document.getElementById('popup'));
  toggle(document.getElementById('credits'));
}

function showInstructions() {
  toggle(document.getElementById('popup'));
  toggle(document.getElementById('instructions'));
}
