const $scene = document.querySelector('#scene');

// Creamos la línea de tiempo. Autoplay false para que no arranque sola.
var timeline = anime.timeline({
  autoplay: false,
});

// PASO 1: Girar el sobre entero (Frente a Reverso)
timeline
  .add({
    targets: '#envelope-container',
    rotateY: '180deg',
    duration: 1000,
    easing: 'easeInOutQuad',
  })

  // PASO 2: Abrir la solapa hacia arriba
  .add({
    targets: '#envelope-flap',
    rotateX: '180deg', // Gira sobre la "bisagra" superior
    opacity: [0, 1], // Esto le dice: "Inicia en 0 y sube progresivamente hasta 1"
    duration: 1000,
    easing: 'easeInOutQuad',
  })

  .add({
    targets: '.letter',
    translateY: [
      { value: '-100%', duration: 2000, easing: 'easeOutQuint' }, // Primero: Sube la carta
      { value: '-10%', duration: 2000, easing: 'easeOutQuint' }, // Segundo: Baja a su posición final
    ],
    begin: function (anim) {
      // 1. Hacemos visible la carta
      document.querySelector('.letter').style.opacity = '1';
      // 2. Por precaución, nos aseguramos de que empiece "adentro" (detrás del frente del sobre)
      document.querySelector('.letter').style.zIndex = '2';
    },
    update: function (anim) {
      // anim.progress va de 0 a 100.
      // El 50% es exactamente el momento en el que termina de subir y empieza a bajar.
      if (anim.progress >= 50) {
        // La pasamos al frente de todo (Asegúrate de que este número sea mayor al del sobre)
        document.querySelector('.letter').style.zIndex = '10';
      }
    },
  });

$scene.addEventListener(
  'click',
  function () {
    timeline.play();
  },
  { once: true },
);

const botonSi = document.querySelector('.btn-yes');

// Le decimos qué hacer cuando le hagan clic
botonSi.addEventListener('click', function () {
  // Cambia la ruta a la de tu nueva página
  window.location.href = './src/contador.html';
});
