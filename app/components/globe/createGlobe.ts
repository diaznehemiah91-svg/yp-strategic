import * as THREE from 'three'
import { createEarthTexture, createBumpTexture, createNightTexture } from './utils'

/**
 * Create the main Earth globe with realistic materials
 */
export function createGlobe(): THREE.Group {
  const globeGroup = new THREE.Group()

  // Create Earth sphere geometry
  const earthGeometry = new THREE.SphereGeometry(2.5, 256, 256)

  // Create materials
  const earthDayTexture = createEarthTexture()
  const earthBumpTexture = createBumpTexture()
  const earthNightTexture = createNightTexture()

  // Main Earth material
  const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthDayTexture,
    bumpMap: earthBumpTexture,
    bumpScale: 0.05,
    emissiveMap: earthNightTexture,
    emissive: new THREE.Color(0xffcc66),
    emissiveIntensity: 0.15,
    metalness: 0.1,
    roughness: 0.8,
  })

  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial)
  earthMesh.castShadow = true
  earthMesh.receiveShadow = true
  globeGroup.add(earthMesh)

  // Add atmosphere
  const atmosphereGeometry = new THREE.SphereGeometry(2.65, 128, 128)
  const atmosphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0x00b4ff) },
      glowPower: { value: 2.5 },
    },
    vertexShader: `
      varying vec3 vertexNormal;
      void main() {
        vertexNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform float glowPower;
      varying vec3 vertexNormal;
      void main() {
        float intensity = pow(0.7 - dot(vertexNormal, vec3(0, 0, 1.0)), glowPower);
        gl_FragColor = vec4(glowColor, intensity * 0.3);
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
  })

  const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
  globeGroup.add(atmosphereMesh)

  // Store reference for animation
  ;(earthMesh as any).isEarth = true
  ;(globeGroup as any).earthMesh = earthMesh

  return globeGroup
}
