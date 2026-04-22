// Componente cursore + posizionamento cactus
AFRAME.registerComponent('cursor-place', {
  init() {
    this.raycaster = new THREE.Raycaster()
    this.camera = document.getElementById('camera')
    this.threeCamera = this.camera.getObject3D('camera')
    this.ground = document.getElementById('ground')
    this.rayOrigin = new THREE.Vector2(0, 0)
    this.cursorLocation = new THREE.Vector3(0, 0, 0)
    this.cursor = document.getElementById('cursor')
    this.currentCactus = null
    
    this.el.sceneEl.addEventListener('click', () => {
      if (!this.cursorLocation) return
      
      if (this.currentCactus) {
        this.currentCactus.parentNode?.removeChild(this.currentCactus)
      }
      
      const cactus = document.createElement('a-entity')
      cactus.setAttribute('gltf-model', '#cactusModel')
      cactus.setAttribute('position', this.cursorLocation)
      cactus.setAttribute('scale', '0 0 0')
      cactus.setAttribute('shadow', { receive: false })
      cactus.setAttribute('rotation', `0 ${Math.random() * 360} 0`)
      
      this.el.sceneEl.appendChild(cactus)
      this.currentCactus = cactus
      
      setTimeout(() => {
        cactus.setAttribute('animation', {
          property: 'scale',
          to: '6 6 6',
          easing: 'easeOutElastic',
          dur: 800
        })
      }, 10)
      
      const prompt = document.getElementById('promptText')
      if (prompt) prompt.style.display = 'none'
    })
  },
  
  tick() {
    if (!this.ground?.object3D) return
    
    this.raycaster.setFromCamera(this.rayOrigin, this.threeCamera)
    const intersects = this.raycaster.intersectObject(this.ground.object3D, true)
    
    if (intersects.length > 0) {
      this.cursorLocation = intersects[0].point
    }
    
    if (this.cursor) {
      this.cursor.object3D.position.lerp(this.cursorLocation, 0.3)
      this.cursor.object3D.position.y += 0.05
      this.cursor.object3D.rotation.y = this.threeCamera.rotation.y
    }
  }
})

// Attiva il componente sulla scena
document.querySelector('a-scene').setAttribute('cursor-place', '')
