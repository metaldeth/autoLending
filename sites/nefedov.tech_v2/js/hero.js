/* ================================================================
   HERO — Three.js constellation particle scene
   Neural-network style: floating particles connected by neon lines.
   Mouse parallax moves the camera subtly.
================================================================ */
(function () {
  'use strict';

  var canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  var isMobile = window.innerWidth < 768;
  var PARTICLE_COUNT     = isMobile ? 55  : 110;
  var CONNECT_THRESHOLD  = isMobile ? 85  : 115;
  var MAX_LINES          = 1800;
  var THRESHOLD_SQ       = CONNECT_THRESHOLD * CONNECT_THRESHOLD;

  /* ---- Renderer ---- */
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: !isMobile, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  /* ---- Scene / Camera ---- */
  var scene  = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 290;

  /* ---- Particle data ---- */
  var pts = [];
  var i;
  for (i = 0; i < PARTICLE_COUNT; i++) {
    pts.push({
      x:  (Math.random() - 0.5) * 560,
      y:  (Math.random() - 0.5) * 370,
      z:  (Math.random() - 0.5) * 160,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      vz: (Math.random() - 0.5) * 0.07,
    });
  }

  /* ---- Particle mesh ---- */
  var pGeo = new THREE.BufferGeometry();
  var pPos = new Float32Array(PARTICLE_COUNT * 3);
  for (i = 0; i < PARTICLE_COUNT; i++) {
    pPos[i * 3]     = pts[i].x;
    pPos[i * 3 + 1] = pts[i].y;
    pPos[i * 3 + 2] = pts[i].z;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

  var pMat  = new THREE.PointsMaterial({ color: 0x00e5ff, size: isMobile ? 1.4 : 2.0, transparent: true, opacity: 0.75 });
  var pMesh = new THREE.Points(pGeo, pMat);
  scene.add(pMesh);

  /* ---- Lines mesh ---- */
  var lPos  = new Float32Array(MAX_LINES * 6);
  var lGeo  = new THREE.BufferGeometry();
  lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));

  var lMat  = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.13 });
  var lMesh = new THREE.LineSegments(lGeo, lMat);
  scene.add(lMesh);

  /* ---- Mouse parallax ---- */
  var targetCamX = 0, targetCamY = 0;
  var camX = 0, camY = 0;

  document.addEventListener('mousemove', function (e) {
    targetCamX =  (e.clientX / window.innerWidth  - 0.5) * 24;
    targetCamY = -(e.clientY / window.innerHeight - 0.5) * 16;
  });

  /* ---- RAF / pause on hidden tab ---- */
  var paused = false;

  document.addEventListener('visibilitychange', function () {
    paused = document.hidden;
    if (!paused) tick();
  });

  function tick() {
    if (paused) return;
    requestAnimationFrame(tick);

    var j, p, q, dx, dy, dz, li;

    /* Update particle positions */
    for (i = 0; i < PARTICLE_COUNT; i++) {
      p     = pts[i];
      p.x  += p.vx;
      p.y  += p.vy;
      p.z  += p.vz;
      if (Math.abs(p.x) > 280) p.vx *= -1;
      if (Math.abs(p.y) > 185) p.vy *= -1;
      if (Math.abs(p.z) > 80)  p.vz *= -1;
      pPos[i * 3]     = p.x;
      pPos[i * 3 + 1] = p.y;
      pPos[i * 3 + 2] = p.z;
    }
    pGeo.attributes.position.needsUpdate = true;

    /* Build connection lines */
    li = 0;
    for (i = 0; i < PARTICLE_COUNT && li < MAX_LINES - 1; i++) {
      p = pts[i];
      for (j = i + 1; j < PARTICLE_COUNT && li < MAX_LINES - 1; j++) {
        q  = pts[j];
        dx = p.x - q.x;
        dy = p.y - q.y;
        dz = p.z - q.z;
        if (dx * dx + dy * dy + dz * dz < THRESHOLD_SQ) {
          lPos[li * 6]     = p.x;
          lPos[li * 6 + 1] = p.y;
          lPos[li * 6 + 2] = p.z;
          lPos[li * 6 + 3] = q.x;
          lPos[li * 6 + 4] = q.y;
          lPos[li * 6 + 5] = q.z;
          li++;
        }
      }
    }
    lGeo.setDrawRange(0, li * 2);
    lGeo.attributes.position.needsUpdate = true;

    /* Camera smooth follow */
    camX += (targetCamX - camX) * 0.04;
    camY += (targetCamY - camY) * 0.04;
    camera.position.x = camX;
    camera.position.y = camY;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  tick();

  /* ---- Resize ---- */
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

}());
