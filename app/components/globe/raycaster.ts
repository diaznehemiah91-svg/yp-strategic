import * as THREE from 'three'

export interface SelectionData {
  type: 'ticker' | 'hotspot' | 'none'
  data?: any
  position?: THREE.Vector3
}

/**
 * Set up raycasting for interactive globe elements
 */
export function setupRaycasting(
  container: HTMLElement,
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  onSelection: (selection: SelectionData) => void
) {
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  function onMouseClick(event: MouseEvent) {
    // Calculate mouse position in normalized device coordinates
    const rect = container.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera)

    // Get all intersects with objects in scene
    const intersects = raycaster.intersectObjects(scene.children, true)

    if (intersects.length > 0) {
      const object = intersects[0].object as any

      // Check if clicked on a ticker sprite
      if (object.tickerData) {
        console.log('[Raycaster] Ticker selected:', object.tickerData.ticker)
        onSelection({
          type: 'ticker',
          data: object.tickerData,
          position: object.position,
        })
        return
      }

      // Check if clicked on a hotspot
      if (object.hotspotData || object.isHotspotCore || object.isHotspotRing) {
        const hotspotData = object.hotspotData || object.parent?.hotspotData
        if (hotspotData) {
          console.log('[Raycaster] Hotspot selected:', hotspotData.label)
          onSelection({
            type: 'hotspot',
            data: hotspotData,
            position: object.position,
          })
          return
        }
      }
    }

    onSelection({ type: 'none' })
  }

  // Add click listener
  container.addEventListener('click', onMouseClick)

  // Return cleanup function
  return () => {
    container.removeEventListener('click', onMouseClick)
  }
}

/**
 * Highlight a selected object
 */
export function highlightObject(object: THREE.Object3D | null, scene: THREE.Scene) {
  // Remove existing highlights
  scene.traverse((child) => {
    if ((child as any).isHighlight) {
      scene.remove(child)
    }
  })

  if (!object) return

  // Create highlight effect
  const outlineGeometry = new THREE.BufferGeometry()
  if (object instanceof THREE.Sprite) {
    // Highlight sprite with glow
    const origMaterial = object.material as THREE.SpriteMaterial
    if (origMaterial.map) {
      origMaterial.map.minFilter = THREE.LinearFilter
    }
  }

  console.log('[Raycaster] Object highlighted:', object)
}
