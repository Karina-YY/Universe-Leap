(function boot(global) {
  'use strict';

  var game = null;
  var prefersReducedMotion = false;
  var gateScreen = null;
  var gateTitle = null;
  var gateSubtitle = null;
  var gateButton = null;
  var victoryScreen = null;
  var victoryButton = null;
  var victoryShown = false;

  function showFatalError() {
    var errorElement = document.getElementById('fatal-error');
    if (errorElement) {
      errorElement.style.display = 'flex';
      errorElement.textContent = '哎呀，出错了，请重启试试吧~';
    }
  }

  function showOverlay(el) {
    if (!el) {
      return;
    }
    if (el.style.display === 'none') {
      el.style.display = 'flex';
    }
    if (!prefersReducedMotion) {
      global.requestAnimationFrame(function () {
        el.classList.add('overlay--show');
        el.classList.remove('overlay--hide');
      });
    } else {
      el.classList.add('overlay--show');
      el.classList.remove('overlay--hide');
    }
  }

  function hideOverlay(el, onDone) {
    if (!el) {
      if (onDone) {
        onDone();
      }
      return;
    }
    if (prefersReducedMotion) {
      el.classList.remove('overlay--show');
      el.classList.add('overlay--hide');
      el.style.display = 'none';
      if (onDone) {
        onDone();
      }
      return;
    }
    el.classList.remove('overlay--show');
    el.classList.add('overlay--hide');
    var done = false;
    function finish() {
      if (done) {
        return;
      }
      done = true;
      el.style.display = 'none';
      if (onDone) {
        onDone();
      }
    }
    el.addEventListener('transitionend', finish, { once: true });
    global.setTimeout(finish, 520);
  }

  function showGate(title, subtitle, buttonText, onConfirm) {
    if (!gateScreen || !gateTitle || !gateSubtitle || !gateButton) {
      return;
    }
    gateTitle.textContent = title;
    gateSubtitle.textContent = subtitle;
    gateButton.textContent = buttonText;
    gateButton.disabled = false;
    gateButton.onclick = function () {
      gateButton.disabled = true;
      hideOverlay(gateScreen, function () {
        if (onConfirm) {
          onConfirm();
        }
      });
    };
    showOverlay(gateScreen);
  }

  function tick(timestamp) {
    if (!game || !game.running) {
      return;
    }
    try {
      game.step(timestamp);
      if (!game.running) {
        return;
      }
      if (!victoryShown && victoryScreen && game.stage === 'formal' && game.status === 'win') {
        victoryShown = true;
        game.running = false;
        showOverlay(victoryScreen);
        return;
      }
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
      var startScreen = document.getElementById('start-screen');
      var startButton = document.getElementById('start-button');
      var storyScreen = document.getElementById('story-screen');
      var storySlide = document.getElementById('story-slide');
      var storyCaption = document.getElementById('story-caption');
      if (global.matchMedia) {
        prefersReducedMotion = global.matchMedia('(prefers-reduced-motion: reduce)').matches;
      }
      gateScreen = document.getElementById('gate-screen');
      gateTitle = document.getElementById('gate-title');
      gateSubtitle = document.getElementById('gate-subtitle');
      gateButton = document.getElementById('gate-button');
      victoryScreen = document.getElementById('victory-screen');
      victoryButton = document.getElementById('victory-button');
      game = new global.ULEAP_Game(canvas, errorElement);

      var originalReset = game.reset.bind(game);
      game.reset = function patchedReset() {
        victoryShown = false;
        return originalReset();
      };

      if (victoryButton) {
        victoryButton.addEventListener('click', function () {
          global.location.reload();
        });
      }

      function startLoop() {
        game.running = true;
        global.requestAnimationFrame(tick);
      }

      function pauseLoop() {
        game.running = false;
      }

      function playStory(onDone) {
        if (!storyScreen || !storySlide || !storyCaption) {
          if (onDone) {
            onDone();
          }
          return;
        }

        showOverlay(storyScreen);

        function renderSlide(index) {
          storyCaption.textContent = '情景画面 ' + index + ' / 2';
          storySlide.style.background =
            index === 1
              ? 'radial-gradient(circle at 25% 25%, rgba(116, 242, 206, 0.14), transparent 38%), radial-gradient(circle at 70% 80%, rgba(255, 191, 105, 0.12), transparent 44%), #04050a'
              : 'radial-gradient(circle at 20% 70%, rgba(255, 217, 102, 0.14), transparent 42%), radial-gradient(circle at 80% 25%, rgba(255, 107, 94, 0.12), transparent 46%), #050414';

          storySlide.classList.remove('story-slide--play');
          void storySlide.offsetWidth;
          storySlide.classList.add('story-slide--play');
        }

        renderSlide(1);
        global.setTimeout(function () {
          renderSlide(2);
          global.setTimeout(function () {
            hideOverlay(storyScreen, function () {
              if (onDone) {
                onDone();
              }
            });
          }, 3200);
        }, 3200);
      }

      if (startScreen && startButton) {
        pauseLoop();
        showOverlay(startScreen);

        function goToStory() {
          startButton.disabled = true;
          hideOverlay(startScreen, function () {
            playStory(function () {
              showGate('确认开始第1关？', '点击确认后进入第1关。', '开始第1关', function () {
                startLoop();
              });
            });
          });
        }

        startButton.addEventListener('click', goToStory);

        global.addEventListener('keydown', function onKeyDown(event) {
          if (event.key === 'Enter' || event.key === ' ') {
            if (startScreen.style.display !== 'none' && startScreen.classList.contains('overlay--show')) {
              event.preventDefault();
              goToStory();
            }
          }
        });
      } else {
        game.running = true;
        global.requestAnimationFrame(tick);
      }
    } catch (error) {
      console.error(error);
      showFatalError();
    }
  });
})(window);
