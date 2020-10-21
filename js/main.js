let focusedCalc;

window.onload = function() {
  focusedCalc = new Calculator();
}

window.onkeydown = function(e) {
  focusedCalc.onKeyDown(e);
}
