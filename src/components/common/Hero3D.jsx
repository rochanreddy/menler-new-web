import { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Interactive 3D object for the home hero — a round wireframe sphere with vertex
// points, an orbit ring and coloured dots. Auto-spins; drag to rotate (with
// inertia). Brand palette: lavender / specialist / placed / parchment.
export default function Hero3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || 480;
    let height = mount.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 21; // pulled back so the orbit ring + labels never clip the edges

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    const el = renderer.domElement;
    el.style.cursor = 'grab';
    el.style.touchAction = 'none';
    mount.appendChild(el);

    const group = new THREE.Group();
    scene.add(group);

    const RADIUS = 4.6;
    const ORBIT = 6.8; // larger ring; < camera half-extent so it fits

    // Sphere geometry (shared for wireframe, solid core and points)
    const geo = new THREE.SphereGeometry(RADIUS, 22, 16);

    // Faint solid core
    const solidMat = new THREE.MeshStandardMaterial({ color: 0x534AB7, roughness: 0.4, metalness: 0.25, transparent: true, opacity: 0.2, flatShading: false });
    const solid = new THREE.Mesh(geo, solidMat);
    solid.scale.setScalar(0.99);
    group.add(solid);

    // Wireframe sphere
    const wire = new THREE.WireframeGeometry(geo);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xAFA9EC, transparent: true, opacity: 0.45 });
    const lines = new THREE.LineSegments(wire, lineMat);
    group.add(lines);

    // Vertex points
    const ptsMat = new THREE.PointsMaterial({ color: 0xEEEDFE, size: 0.06 });
    const pts = new THREE.Points(geo, ptsMat);
    group.add(pts);

    // Orbit ring + dots share one tilted plane, so the dots travel along the
    // single visible ring line.
    const ringGroup = new THREE.Group();
    ringGroup.rotation.x = Math.PI / 2.3;
    group.add(ringGroup);

    // Glowing ring — a crisp core line plus soft additive halo layers (same
    // lavender glow as the GenAI toolstack chips).
    const ringGeos = [];
    const ringMats = [];
    const ringLayers = [
      { tube: 0.022, opacity: 0.95 },
      { tube: 0.075, opacity: 0.30 },
      { tube: 0.16, opacity: 0.15 },
      { tube: 0.28, opacity: 0.07 },
    ];
    ringLayers.forEach((L) => {
      const g = new THREE.TorusGeometry(ORBIT, L.tube, 12, 200);
      const m = new THREE.MeshBasicMaterial({ color: 0xAFA9EC, transparent: true, opacity: L.opacity, blending: THREE.AdditiveBlending, depthWrite: false });
      ringGroup.add(new THREE.Mesh(g, m));
      ringGeos.push(g); ringMats.push(m);
    });

    // Named domain dots, evenly spaced on the ring; each carries a camera-facing label.
    const dotsSpin = new THREE.Group();
    ringGroup.add(dotsSpin);
    const DOMAINS = ["Founder's Office", 'Product Management', 'Engineering', 'Finance', 'Marketing', 'HR', 'Operations', 'Analytics'];
    const dotColors = [0xAFA9EC, 0x1D9E75, 0xEEEDFE, 0x534AB7, 0xBA7517];
    const dotGeo = new THREE.SphereGeometry(0.085, 16, 16);
    const dotMats = [];
    const labelTex = [];

    const makeLabel = (text) => {
      const pad = 34, fs = 46;
      const c = document.createElement('canvas');
      let cx = c.getContext('2d');
      cx.font = `700 ${fs}px 'DM Sans', sans-serif`;
      const w = Math.ceil(cx.measureText(text).width);
      c.width = w + pad * 2; c.height = fs + pad * 2;
      cx = c.getContext('2d');
      cx.font = `700 ${fs}px 'DM Sans', sans-serif`;
      cx.textAlign = 'center'; cx.textBaseline = 'middle';
      const mx = c.width / 2, my = c.height / 2;
      // Lavender glow halo (multiple passes build up the glow)
      cx.shadowColor = 'rgba(175,169,236,0.95)';
      cx.shadowBlur = 18; cx.shadowOffsetY = 0;
      cx.fillStyle = '#CFC9FF';
      cx.fillText(text, mx, my);
      cx.fillText(text, mx, my);
      cx.shadowBlur = 0;
      // Dark outline so the text stays readable over the bright globe/ring
      cx.lineJoin = 'round';
      cx.lineWidth = 7;
      cx.strokeStyle = 'rgba(8,6,16,0.92)';
      cx.strokeText(text, mx, my);
      // Crisp bright core on top
      cx.fillStyle = '#FFFFFF';
      cx.fillText(text, mx, my);
      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearFilter; tex.anisotropy = 4;
      labelTex.push(tex);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false });
      dotMats.push(mat);
      const sp = new THREE.Sprite(mat);
      const s = 0.0046;
      sp.scale.set(c.width * s, c.height * s, 1);
      return sp;
    };

    DOMAINS.forEach((name, i) => {
      const mat = new THREE.MeshBasicMaterial({ color: dotColors[i % dotColors.length] });
      dotMats.push(mat);
      const d = new THREE.Mesh(dotGeo, mat);
      const a = (i / DOMAINS.length) * Math.PI * 2;
      d.position.set(Math.cos(a) * ORBIT, Math.sin(a) * ORBIT, 0); // on the ring circle
      dotsSpin.add(d);
      const lr = ORBIT + 0.3; // label sits just outside the dot
      const label = makeLabel(name);
      label.position.set(Math.cos(a) * lr, Math.sin(a) * lr, 0);
      dotsSpin.add(label);
    });

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const p1 = new THREE.PointLight(0xAFA9EC, 70); p1.position.set(5, 5, 6); scene.add(p1);
    const p2 = new THREE.PointLight(0x534AB7, 45); p2.position.set(-5, -3, 2); scene.add(p2);

    // Interaction state
    let rotX = 0.25, rotY = 0;
    let velX = 0, velY = 0.003;
    let dragging = false, lastX = 0, lastY = 0;

    const onDown = (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; el.style.cursor = 'grabbing'; el.setPointerCapture?.(e.pointerId); };
    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      velY = dx * 0.005; velX = dy * 0.005;
      rotY += velY; rotX += velX;
    };
    const onUp = () => { dragging = false; el.style.cursor = 'grab'; };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('pointerleave', onUp);

    let raf;
    const animate = () => {
      if (!dragging) {
        rotY += velY; rotX += velX;
        velX *= 0.95; velY *= 0.95;
        if (Math.abs(velY) < 0.0018) velY += (0.0018 - velY) * 0.04; // settle to gentle auto-spin
      }
      rotX = Math.max(-1.2, Math.min(1.2, rotX));
      group.rotation.x = rotX;
      group.rotation.y = rotY;
      dotsSpin.rotation.z += 0.006; // dots travel along the ring line
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      width = mount.clientWidth || width;
      height = mount.clientHeight || height;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('pointerleave', onUp);
      if (el.parentNode) el.parentNode.removeChild(el);
      geo.dispose(); wire.dispose(); dotGeo.dispose();
      solidMat.dispose(); lineMat.dispose(); ptsMat.dispose();
      ringGeos.forEach(g => g.dispose());
      ringMats.forEach(m => m.dispose());
      dotMats.forEach(m => m.dispose());
      labelTex.forEach(t => t.dispose());
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="hero-3d" aria-hidden="true" />;
}
