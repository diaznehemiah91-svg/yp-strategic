import * as THREE from 'three'

interface TouchState {
  initialDistance: number
  initialZoom: number
  lastX: number
  lastY: number
}

/**
 * Set up touch and mobile gesture controls for the globe
 */
export function setupMobileControls(
  container: HTMLElement,
  camera: THREE.PerspectiveCamera,
  globeGroup: THREE.Group
) {
  const touchState: TouchState = {
    initialDistance: 0,
    initialZoom: camera.position.z,
    lastX: 0,
    lastY: 0,
  }

  /**
   * Calculate distance between two touch points
   */
  function getTouchDistance(touches: TouchList): number {
    if (touches.length < 2) return 0
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  /**
   * Handle touch start
   */
  function onTouchStart(event: TouchEvent) {
    if (event.touches.length === 2) {
      // Pinch zoom start
      touchState.initialDistance = getTouchDistance(event.touches)
      touchState.initialZoom = camera.position.z
    } else if (event.touches.length === 1) {
      // Single touch drag start
      touchState.lastX = event.touches[0].clientX
      touchState.lastY = event.touches[0].clientY
    }
  }

  /**
   * Handle touch move
   */
  function onTouchMove(event: TouchEvent) {
    if (event.touches.length === 2) {
      // Pinch zoom
      const currentDistance = getTouchDistance(event.touches)
      const scale = currentDistance / touchState.initialDistance
      const newZoom = touchState.initialZoom / scale

      // Clamp zoom between min and max distance
      camera.position.z = Math.max(4, Math.min(12, newZoom))
    } else if (event.touches.length === 1) {
      // Single touch drag - rotate globe
      const deltaX = event.touches[0].clientX - touchState.lastX
      const deltaY = event.touches[0].clientY - touchState.lastY

      // Rotate based on drag distance
      const rotationSpeed = 0.005
      globeGroup.rotation.y -= deltaX * rotationSpeed
      globeGroup.rotation.x -= deltaY * rotationSpeed

      // Clamp x rotation to prevent over-rotation
      globeGroup.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, globeGroup.rotation.x))

      touchState.lastX = event.touches[0].clientX
      touchState.lastY = event.touches[0].clientY
    }
  }

  /**
   * Handle touch end
   */
  function onTouchEnd(event: TouchEvent) {
    touchState.initialDistance = 0
    touchState.lastX = 0
    touchState.lastY = 0
  }

  /**
   * Handle mouse wheel zoom (desktop)
   */
  function onMouseWheel(event: WheelEvent) {
    event.preventDefault()

    const zoomSpeed = 0.1
    const direction = event.deltaY > 0 ? 1 : -1
    const newZoom = camera.position.z + direction * zoomSpeed

    // Clamp zoom
    camera.position.z = Math.max(4, Math.min(12, newZoom))
  }

  // Add event listeners
  container.addEventListener('touchstart', onTouchStart, false)
  container.addEventListener('touchmove', onTouchMove, false)
  container.addEventListener('touchend', onTouchEnd, false)
  container.addEventListener('wheel', onMouseWheel, { passive: false })

  // Return cleanup function
  return () => {
    container.removeEventListener('touchstart', onTouchStart)
    container.removeEventListener('touchmove', onTouchMove)
    container.removeEventListener('touchend', onTouchEnd)
    container.removeEventListener('wheel', onMouseWheel)
  }
}
