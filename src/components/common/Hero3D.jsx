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
    const labels = [];

    const makeLabel = (text) => {
      // Supersample the canvas (SS×) so the text stays crisp on the spinning ring
      // instead of looking soft when the 1× texture is scaled up.
      const SS = 2;
      const fs = 46, padX = 56, padY = 26;
      const c = document.createElement('canvas');
      let cx = c.getContext('2d');
      cx.font = `700 ${fs}px 'DM Sans', sans-serif`;
      // Measure + a safety buffer so bold glyphs (or a font that loads late) are
      // never clipped at the left/right edges.
      const w = Math.ceil(cx.measureText(text).width) + 8;
      const lw = w + padX * 2, lh = fs + padY * 2; // logical (display) size
      c.width = lw * SS; c.height = lh * SS;        // backing store at SS resolution
      cx = c.getContext('2d');
      cx.scale(SS, SS);                             // draw in logical coords, render at SS
      cx.font = `700 ${fs}px 'DM Sans', sans-serif`;
      cx.textAlign = 'center'; cx.textBaseline = 'middle';
      const mx = lw / 2, my = lh / 2;
      // Solid dark pill behind the text gives consistent contrast over the bright
      // globe and ring, so the name stays readable wherever it sits on the orbit.
      // The pill hugs the text; the wider canvas (padX) is just a safe buffer so
      // bold glyphs are never clipped at the edges.
      const pillPadX = 16, pillH = lh - 34;
      const pillW = w + pillPadX * 2;
      const rr = pillH / 2;
      cx.beginPath();
      cx.roundRect(mx - pillW / 2, my - pillH / 2, pillW, pillH, rr);
      cx.fillStyle = 'rgba(11,8,20,0.6)';
      cx.fill();
      cx.lineWidth = 1.5;
      cx.strokeStyle = 'rgba(175,169,236,0.45)';
      cx.stroke();
      // Crisp bright text on top
      cx.fillStyle = '#FFFFFF';
      cx.fillText(text, mx, my);
      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearFilter; tex.anisotropy = 8;
      labelTex.push(tex);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false });
      dotMats.push(mat);
      const sp = new THREE.Sprite(mat);
      const s = 0.0046;
      sp.scale.set(lw * s, lh * s, 1);             // display size unchanged
      sp.userData.base = sp.scale.clone();         // remembered so we can emphasise the active label
      return sp;
    };

    // Sub-skills revealed when a domain name reaches the front of the orbit.
    const SUBSKILLS = {
      "Founder's Office": ['Strategy', 'Chief of Staff', 'Board Decks', 'Briefings', 'Fundraising'],
      'Product Management': ['PRDs', 'Roadmaps', 'User Research', 'Specs', 'Prioritisation'],
      'Engineering': ['RAG', 'MCP', 'Agents', 'Evals', 'LLMOps', 'Fine-tuning'],
      'Finance': ['Deal Memos', 'Forecasts', 'Reporting', 'Diligence', 'Budgets'],
      'Marketing': ['Content', 'Campaigns', 'SEO', 'Outreach', 'Creative'],
      'HR': ['Hiring', 'SOPs', 'Onboarding', 'Policies', 'Payroll'],
      'Operations': ['Automation', 'Workflows', 'Dashboards', 'Tickets', 'Vendors'],
      'Analytics': ['SQL', 'Insights', 'Pipelines', 'Charts', 'Modelling'],
    };
    // Smaller, lighter label for a sub-skill node.
    const makeSubTexture = (text) => {
      const SS = 2, fs = 30, padX = 26, padY = 16;
      const c = document.createElement('canvas');
      let cx = c.getContext('2d');
      cx.font = `600 ${fs}px 'DM Sans', sans-serif`;
      const w = Math.ceil(cx.measureText(text).width) + 6;
      const lw = w + padX * 2, lh = fs + padY * 2;
      c.width = lw * SS; c.height = lh * SS;
      cx = c.getContext('2d');
      cx.scale(SS, SS);
      cx.font = `600 ${fs}px 'DM Sans', sans-serif`;
      cx.textAlign = 'center'; cx.textBaseline = 'middle';
      const mx = lw / 2, my = lh / 2;
      const pillPadX = 13, pillH = lh - 20, pillW = w + pillPadX * 2, rr = pillH / 2;
      cx.beginPath();
      cx.roundRect(mx - pillW / 2, my - pillH / 2, pillW, pillH, rr);
      cx.fillStyle = 'rgba(11,8,20,0.5)';
      cx.fill();
      cx.lineWidth = 1.2;
      cx.strokeStyle = 'rgba(175,169,236,0.4)';
      cx.stroke();
      cx.fillStyle = 'rgba(238,237,254,0.92)';
      cx.fillText(text, mx, my);
      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearFilter; tex.anisotropy = 8;
      return tex;
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
      labels.push(label);
    });
    const tmpV = new THREE.Vector3();

    // ── Sub-skill "mind-map" burst ──────────────────────────────────────────
    // A camera-facing group that snaps to whichever domain label is at the
    // front of the orbit and fans its sub-skills out on spoke lines, opening as
    // the name reaches the middle and collapsing as it rotates away.
    const MAXSUB = 6;
    const burstGroup = new THREE.Group();
    burstGroup.visible = false;
    scene.add(burstGroup);

    const subSprites = [];
    const subMats = [];
    const subTexs = new Array(MAXSUB).fill(null);
    for (let i = 0; i < MAXSUB; i++) {
      const m = new THREE.SpriteMaterial({ transparent: true, depthTest: false, depthWrite: false, opacity: 0 });
      const sp = new THREE.Sprite(m);
      sp.visible = false;
      burstGroup.add(sp);
      subSprites.push(sp); subMats.push(m);
    }
    const lineGeo = new THREE.BufferGeometry();
    const linePos = new Float32Array(MAXSUB * 2 * 3);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    const burstLineMat = new THREE.LineBasicMaterial({ color: 0xAFA9EC, transparent: true, opacity: 0, depthTest: false, depthWrite: false });
    const burstLines = new THREE.LineSegments(lineGeo, burstLineMat);
    burstGroup.add(burstLines);

    // Lay the active domain's sub-skills out evenly around the centre on spokes.
    const populateBurst = (domain) => {
      const subs = (SUBSKILLS[domain] || []).slice(0, MAXSUB);
      const n = subs.length;
      const seg = (Math.PI * 2) / n;
      const start = Math.random() * Math.PI * 2; // random orientation each time it opens
      for (let i = 0; i < MAXSUB; i++) {
        const sp = subSprites[i];
        if (i < n) {
          const tex = makeSubTexture(subs[i]);
          if (subTexs[i]) subTexs[i].dispose();
          subTexs[i] = tex;
          sp.material.map = tex; sp.material.needsUpdate = true;
          // Even sector per node (keeps them from piling up) + random jitter and
          // varied spoke length so the burst looks scattered, not a neat cross.
          const ang = start + i * seg + (Math.random() - 0.5) * seg * 0.7;
          const r = 2.2 + Math.random() * 1.3;
          const x = Math.cos(ang) * r, y = Math.sin(ang) * r;
          sp.position.set(x, y, 0);
          const aspect = tex.image.width / tex.image.height;
          const h = 0.42;
          sp.scale.set(h * aspect, h, 1);
          sp.visible = true;
          linePos.set([0, 0, 0, x, y, 0], i * 6);
        } else {
          sp.visible = false;
        }
      }
      lineGeo.setDrawRange(0, n * 2);
      lineGeo.attributes.position.needsUpdate = true;
    };

    let activeIdx = -1;   // which domain label currently owns the burst
    let burstOpen = 0;    // 0 = collapsed, 1 = fully fanned out
    const nxArr = new Array(DOMAINS.length).fill(0); // normalised screen x per label (-1 left … +1 right)
    const wzArr = new Array(DOMAINS.length).fill(0); // world z per label (>0 = near side, facing camera)
    // Two mirror edges control the burst, in normalised screen-x (+1 right … -1 left):
    //   RIGHT_EDGE → opening starts here on the right; full open by FULL_RIGHT.
    //   LEFT_EDGE  → closing ends here on the left;  full open until FULL_LEFT.
    // It's fully open across the plateau (FULL_RIGHT … FULL_LEFT) in between.
    // Symmetric about centre: the left close mirrors the right open.
    const RIGHT_EDGE = 0.6, FULL_RIGHT = 0.42;   // open on the right
    const LEFT_EDGE = -0.6, FULL_LEFT = -0.42;   // close on the left (mirror of the right)
    const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const openOf = (i) => {
      if (wzArr[i] <= 0) return 0;                       // behind the globe → closed
      const nx = nxArr[i];
      const rise = smooth(RIGHT_EDGE, FULL_RIGHT, nx);   // 0 at RIGHT_EDGE → 1 by FULL_RIGHT
      const fall = smooth(LEFT_EDGE, FULL_LEFT, nx);     // 0 at LEFT_EDGE  → 1 by FULL_LEFT
      return Math.min(rise, fall);                       // = 1 across the plateau in between
    };

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
      dotsSpin.rotation.z += 0.003; // dots travel along the ring line (slightly quicker pass)
      // Hide a label exactly when the sphere sits between it and the camera.
      // Test the camera→label segment against the sphere (centred at the world
      // origin, radius RADIUS): if its closest point to the centre falls inside
      // the sphere and in front of the label, the label is occluded.
      group.updateWorldMatrix(true, true);
      const cam = camera.position;
      for (const lb of labels) {
        lb.getWorldPosition(tmpV);
        const dx = tmpV.x - cam.x, dy = tmpV.y - cam.y, dz = tmpV.z - cam.z;
        const len2 = dx * dx + dy * dy + dz * dz;
        const t = -(cam.x * dx + cam.y * dy + cam.z * dz) / len2; // closest-point param on the segment
        let occluded = false;
        if (t > 0 && t < 1) {
          const px = cam.x + dx * t, py = cam.y + dy * t, pz = cam.z + dz * t;
          occluded = (px * px + py * py + pz * pz) < RADIUS * RADIUS;
        }
        lb.visible = !occluded;
      }

      // ── Drive the sub-skill burst ──
      // A name opens as it comes in toward the middle (just right of centre),
      // then shrinks and closes as it travels to the LEFT. The burst sticks to
      // one name for its whole pass, then the next name reaching the window
      // takes over.
      let pickIdx = -1, pickOpen = 0;
      for (let i = 0; i < labels.length; i++) {
        labels[i].getWorldPosition(tmpV);
        wzArr[i] = tmpV.z;
        tmpV.project(camera);
        nxArr[i] = tmpV.x;
        const o = openOf(i);
        if (o > pickOpen) { pickOpen = o; pickIdx = i; } // the label most into the open window
      }
      let targetOpen;
      if (activeIdx === -1) {
        targetOpen = 0;
        // Grab the name once it has come in near the centre.
        if (pickIdx >= 0 && pickOpen > 0.4) { activeIdx = pickIdx; populateBurst(DOMAINS[activeIdx]); }
      } else {
        targetOpen = openOf(activeIdx);
        // Released once it has shrunk away to the left / gone behind the globe.
        if (targetOpen < 0.02 && burstOpen < 0.05) activeIdx = -1;
      }
      burstOpen += (targetOpen - burstOpen) * 0.12;

      // Emphasise the active label; reset the rest to their base size.
      for (let i = 0; i < labels.length; i++) {
        const b = labels[i].userData.base;
        if (b) labels[i].scale.copy(b);
      }
      if (activeIdx >= 0 && burstOpen > 0.02) {
        const al = labels[activeIdx];
        if (al.userData.base) al.scale.copy(al.userData.base).multiplyScalar(1 + 0.16 * burstOpen);
        burstGroup.visible = true;
        al.getWorldPosition(tmpV);
        burstGroup.position.copy(tmpV);
        burstGroup.quaternion.copy(camera.quaternion); // face the camera
        burstGroup.scale.setScalar(burstOpen);
        for (const m of subMats) m.opacity = burstOpen;
        burstLineMat.opacity = burstOpen * 0.5;
      } else {
        burstGroup.visible = false;
      }

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
      subMats.forEach(m => m.dispose());
      subTexs.forEach(t => t && t.dispose());
      lineGeo.dispose(); burstLineMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="hero-3d" aria-hidden="true" />;
}
