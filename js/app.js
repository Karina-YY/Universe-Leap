(function boot(global) {
  'use strict';

  var game = null;

  function showFatalError() {
    var errorElement = document.getElementById('fatal-error');
    if (errorElement) {
      errorElement.style.display = 'flex';
      errorElement.textContent = '哎呀，出错了，请重启试试吧~';
    }
  }

  function tick(timestamp) {
    if (!game || !game.running) {
      return;
    }
    try {
      game.step(timestamp);
      global.requestAnimationFrame(tick);
    } catch (error) {
      console.error(error);
      showFatalError();
    }
  }

  global.addEventListener('error', function onError() {
    showFatalError();
  });

  global.addEventListener('DOMContentLoaded', function onReady() {
    try {
      var canvas = document.getElementById('game-canvas');
      var errorElement = document.getElementById('fatal-error');
      game = new global.ULEAP_Game(canvas, errorElement);
      game.running = true;
      global.requestAnimationFrame(tick);
    } catch (error) {
      console.error(error);
      showFatalError();
    }
  });
})(window);
