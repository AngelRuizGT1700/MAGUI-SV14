// 1. Ponemos la fecha en el texto
document.getElementById('date').textContent =
  '02 de febrero del 2025 a las 20:35';
const fechaInicio = new Date('2025-02-02T20:35:00');

// 2. Calculamos los valores reales exactos en este preciso instante
const ahora = new Date();
const diferencia = ahora - fechaInicio;

const diasReales = Math.floor(diferencia / (1000 * 60 * 60 * 24));
const horasReales = Math.floor(
  (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
);
const minutosReales = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
const segundosReales = Math.floor((diferencia % (1000 * 60)) / 1000);

// 3. Creamos un objeto "falso" con valores en cero para que Anime.js los anime
const contadorAnimado = {
  dias: 0,
  horas: 0,
  minutos: 0,
  segundos: 0,
};

// 4. ANIMACIÓN INICIAL CON ANIME.JS
anime({
  targets: contadorAnimado,
  dias: diasReales,
  horas: horasReales,
  minutos: minutosReales,
  segundos: segundosReales,
  round: 1, // Esto es clave: obliga a Anime.js a usar números enteros (sin decimales)
  duration: 2500, // La animación dura 2.5 segundos
  easing: 'easeOutExpo', // Arranca muy rápido y frena suavemente al acercarse al valor real

  // En cada milisegundo de la animación, pintamos los números en el HTML
  update: function () {
    document.getElementById('days').textContent = contadorAnimado.dias;
    document.getElementById('hours').textContent = contadorAnimado.horas
      .toString()
      .padStart(2, '0');
    document.getElementById('minutes').textContent = contadorAnimado.minutos
      .toString()
      .padStart(2, '0');
    document.getElementById('seconds').textContent = contadorAnimado.segundos
      .toString()
      .padStart(2, '0');
  },

  // 5. Cuando termina el efecto visual, le pasamos el control al reloj normal
  complete: function () {
    setInterval(mantenerRelojVivo, 1000);
  },
});

// 6. Esta es la función clásica que mantiene el reloj vivo segundo a segundo después del efecto
function mantenerRelojVivo() {
  const ahoraVivo = new Date();
  const dif = ahoraVivo - fechaInicio;

  document.getElementById('days').textContent = Math.floor(
    dif / (1000 * 60 * 60 * 24),
  );
  document.getElementById('hours').textContent = Math.floor(
    (dif % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  )
    .toString()
    .padStart(2, '0');
  document.getElementById('minutes').textContent = Math.floor(
    (dif % (1000 * 60 * 60)) / (1000 * 60),
  )
    .toString()
    .padStart(2, '0');
  document.getElementById('seconds').textContent = Math.floor(
    (dif % (1000 * 60)) / 1000,
  )
    .toString()
    .padStart(2, '0');
}

document.addEventListener('DOMContentLoaded', () => {
  const canopy = document.getElementById('canopy');

  // Tu paleta de colores
  const colors = ['#ffb7c5', '#ff9eb5', '#ff758f', '#c9184a'];

  // --- PREPARAR EL SVG ---
  const arbolPath = document.getElementById('arbol-completo');
  arbolPath.setAttribute('fill', 'none');
  arbolPath.setAttribute('stroke', '#442318');
  arbolPath.setAttribute('stroke-width', '4');

  // ==========================================
  // PASO 1: DIBUJAR EL ÁRBOL
  // ==========================================
  const arbolTimeline = anime.timeline({ loop: false });

  arbolTimeline.add({
    targets: '#arbol-completo',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 3500,
  });

  // ==========================================
  // PASO 2: HACER QUE BROTEN LAS HOJAS (EL ÓVALO)
  // ==========================================
  arbolTimeline.finished.then(() => {
    arbolPath.setAttribute('fill', '#442318');
    arbolPath.setAttribute('stroke', 'none');

    // Generamos 60 hojitas que se quedarán en el árbol
    for (let i = 0; i < 600; i++) {
      crearHojaEstatica();
    }

    // Animamos el brote de estas hojas
    anime({
      targets: '.hoja-estatica',
      scale: [
        0,
        function () {
          return 0.5 + Math.random();
        },
      ],
      opacity: [0, 1],
      easing: 'easeOutElastic(1, .6)',
      duration: 1200,
      delay: anime.stagger(15),

      // ==========================================
      // PASO 3: INICIAR LA LLUVIA DE HOJAS
      // ==========================================
      // La función "complete" se ejecuta cuando termina el brote
      complete: function () {
        iniciarLluvia();
      },
    });
  });

  // --- FUNCIONES DE CREACIÓN DE HOJAS ---

  // Función A: Crea las hojas que se quedan en las ramas (Óvalo)
  function crearHojaEstatica() {
    const leaf = document.createElement('div');
    // Usamos la clase base del corazón Y una clase específica
    leaf.classList.add('heart-leaf', 'hoja-estatica');

    const angulo = Math.random() * Math.PI * 2;
    const radio = Math.sqrt(Math.random());
    const escalaExpansion = 51; // Tamaño de la copa

    const randomLeft = 50 + Math.cos(angulo) * radio * escalaExpansion;
    const randomTop = 50 + Math.sin(angulo) * radio * escalaExpansion;

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomRotation = 45 + (Math.random() * 60 - 30);

    leaf.style.left = `${randomLeft}%`;
    leaf.style.top = `${randomTop}%`;
    leaf.style.setProperty('--leaf-color', randomColor);
    leaf.style.transform = `rotate(${randomRotation}deg) scale(0)`; // Empiezan en 0

    canopy.appendChild(leaf);
  }

  // Función B: Activa el bucle de las hojas que caen
  function iniciarLluvia() {
    // Generar una nueva hoja cada 300 milisegundos
    setInterval(crearHojaQueCae, 300);

    // Crear unas cuantas de golpe para que la lluvia empiece rápido
    for (let i = 0; i < 15; i++) {
      setTimeout(crearHojaQueCae, i * 100);
    }
  }

  // Función C: Crea las hojas animadas con CSS que se caen
  function crearHojaQueCae() {
    const leaf = document.createElement('div');
    // Usamos la clase base del corazón Y la clase de caída
    leaf.classList.add('heart-leaf', 'hoja-caida');

    // Hacemos que también nazcan dentro de la forma del óvalo para mayor realismo
    const angulo = Math.random() * Math.PI * 2;
    const radio = Math.sqrt(Math.random());
    const randomLeft = 50 + Math.cos(angulo) * radio * 70;
    const randomTop = 50 + Math.sin(angulo) * radio * 70;

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomScale = 0.6 + Math.random() * 0.4;
    const randomDuration = 3 + Math.random() * 5;

    leaf.style.left = `${randomLeft}%`;
    leaf.style.top = `${randomTop}%`;
    leaf.style.setProperty('--leaf-color', randomColor);

    // Aplicamos la animación CSS de caída
    leaf.style.animation = `falling-heart ${randomDuration}s linear forwards`;
    leaf.style.transform = `rotate(45deg) scale(${randomScale})`;

    canopy.appendChild(leaf);

    // Limpieza IMPORTANTE
    leaf.addEventListener('animationend', () => {
      leaf.remove();
    });
  }
});
