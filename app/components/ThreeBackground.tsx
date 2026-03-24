'use client';
import { useEffect, useRef } from 'react';

export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let mouseX = 0, mouseY = 0;

    async function init() {
      const THREE = await import('three');
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas: canvas!, antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const count = 8000;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 14;
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({ size: 0.008, color: 0x00ff52, transparent: true, opacity: 0.6 });
      const particles = new THREE.Points(geo, mat);
      scene.add(particles);

      const gridGeo = new THREE.PlaneGeometry(40, 40, 40, 40);
      const gridMat = new THREE.MeshBasicMaterial({ color: 0x00ff52, wireframe: true, transparent: true, opacity: 0.03 });
      const grid = new THREE.Mesh(gridGeo, gridMat);
      grid.rotation.x = -Math.PI / 2;
      grid.position.y = -3;
      scene.add(grid);

      camera.position.z = 4;
      camera.position.y = 0.5;

      const onMouse = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      document.addEventListener('mousemove', onMouse);

      function animate() {
        animId = requestAnimationFrame(animate);
        particles.rotation.y += 0.0008;
        particles.rotation.x += 0.0003;
        camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 0.2 + 0.5 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);
        grid.rotation.z += 0.0005;
        renderer.render(scene, camera);
      }
      animate();

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize);

      return () => {
        cancelAnimationFrame(animId);
        document.removeEventListener('mousemove', onMouse);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
      };
    }

    const cleanup = init();
    return () => { cleanup.then(fn => fn?.()); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
}
