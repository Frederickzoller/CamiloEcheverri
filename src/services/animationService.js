import * as THREE from 'three';
import { store } from '../store';
import { setAnimationsLoaded } from '../store/slices/uiSlice';

// Class to manage Three.js animations
class AnimationService {
  constructor() {
    this.scenes = {};
    this.renderers = {};
    this.cameras = {};
    this.animations = {};
    this.frameIds = {};
    this.initialized = false;
  }
  
  // Initialize the animation service
  initialize() {
    if (this.initialized) return;
    this.initialized = true;
    
    // Listen for animation complexity changes
    store.subscribe(() => {
      const { animations } = store.getState().ui;
      if (animations.complexity !== this.currentComplexity) {
        this.currentComplexity = animations.complexity;
        this.updateComplexity();
      }
    });
    
    this.currentComplexity = store.getState().ui.animations.complexity;
  }
  
  // Create a new Three.js scene
  createScene(containerId, options = {}) {
    // Check if the container exists
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID "${containerId}" not found`);
      return false;
    }
    
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    
    // Set background color or transparency
    if (options.backgroundColor) {
      scene.background = new THREE.Color(options.backgroundColor);
    } else {
      scene.background = null; // Transparent background
    }
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      options.fov || 75,
      container.clientWidth / container.clientHeight,
      options.near || 0.1,
      options.far || 1000
    );
    camera.position.z = options.cameraZ || 5;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Add the renderer to the container
    container.innerHTML = '';
    const canvas = renderer.domElement;
    canvas.classList.add('three-canvas');
    container.appendChild(canvas);
    
    // Store the scene, camera, and renderer
    this.scenes[containerId] = scene;
    this.cameras[containerId] = camera;
    this.renderers[containerId] = renderer;
    this.animations[containerId] = [];
    
    // Handle window resize
    const handleResize = () => {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start the animation loop
    this.startAnimationLoop(containerId);
    
    return true;
  }
  
  // Add an object to a scene
  addObject(containerId, object) {
    const scene = this.scenes[containerId];
    if (!scene) {
      console.error(`Scene with ID "${containerId}" not found`);
      return false;
    }
    
    scene.add(object);
    return true;
  }
  
  // Add an animation function to a scene
  addAnimation(containerId, animationFn) {
    if (!this.animations[containerId]) {
      console.error(`Animation container with ID "${containerId}" not found`);
      return false;
    }
    
    this.animations[containerId].push(animationFn);
    return true;
  }
  
  // Start the animation loop for a scene
  startAnimationLoop(containerId) {
    const scene = this.scenes[containerId];
    const camera = this.cameras[containerId];
    const renderer = this.renderers[containerId];
    const animations = this.animations[containerId];
    
    if (!scene || !camera || !renderer) {
      console.error(`Scene, camera, or renderer with ID "${containerId}" not found`);
      return false;
    }
    
    // Animation loop
    const animate = () => {
      this.frameIds[containerId] = requestAnimationFrame(animate);
      
      // Run all animation functions
      for (const animationFn of animations) {
        animationFn(scene, camera, renderer);
      }
      
      // Render the scene
      renderer.render(scene, camera);
    };
    
    // Start the animation loop
    animate();
    
    return true;
  }
  
  // Stop the animation loop for a scene
  stopAnimationLoop(containerId) {
    const frameId = this.frameIds[containerId];
    if (frameId) {
      cancelAnimationFrame(frameId);
      delete this.frameIds[containerId];
    }
  }
  
  // Clean up a scene
  destroyScene(containerId) {
    // Stop the animation loop
    this.stopAnimationLoop(containerId);
    
    // Remove the renderer from the DOM
    const renderer = this.renderers[containerId];
    if (renderer) {
      const canvas = renderer.domElement;
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      renderer.dispose();
    }
    
    // Clean up Three.js objects
    const scene = this.scenes[containerId];
    if (scene) {
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
    
    // Remove references
    delete this.scenes[containerId];
    delete this.cameras[containerId];
    delete this.renderers[containerId];
    delete this.animations[containerId];
  }
  
  // Update animation complexity based on device capabilities
  updateComplexity() {
    const { complexity } = store.getState().ui.animations;
    
    // Update all renderers
    for (const containerId in this.renderers) {
      const renderer = this.renderers[containerId];
      
      switch (complexity) {
        case 'low':
          renderer.setPixelRatio(1);
          break;
        case 'medium':
          renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
          break;
        case 'high':
          renderer.setPixelRatio(window.devicePixelRatio);
          break;
      }
    }
  }
  
  // Create a floating particles animation
  createParticlesAnimation(containerId, options = {}) {
    const scene = this.scenes[containerId];
    if (!scene) {
      console.error(`Scene with ID "${containerId}" not found`);
      return false;
    }
    
    // Default options - updated to black and white theme
    const {
      count = 100,
      color = 0x333333, // Changed to dark gray
      size = 0.05,
      speed = 0.01,
      maxDistance = 5,
    } = options;
    
    // Create particles
    const particles = new THREE.Group();
    const geometry = new THREE.SphereGeometry(size, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color });
    
    // Adjust particle count based on complexity
    let particleCount = count;
    const { complexity } = store.getState().ui.animations;
    
    if (complexity === 'low') {
      particleCount = Math.floor(count * 0.3);
    } else if (complexity === 'medium') {
      particleCount = Math.floor(count * 0.6);
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = new THREE.Mesh(geometry, material);
      
      // Random position
      particle.position.x = Math.random() * maxDistance * 2 - maxDistance;
      particle.position.y = Math.random() * maxDistance * 2 - maxDistance;
      particle.position.z = Math.random() * maxDistance * 2 - maxDistance;
      
      // Random velocity
      particle.userData.velocity = {
        x: (Math.random() - 0.5) * speed,
        y: (Math.random() - 0.5) * speed,
        z: (Math.random() - 0.5) * speed,
      };
      
      particles.add(particle);
    }
    
    scene.add(particles);
    
    // Add animation function
    this.addAnimation(containerId, (scene, camera, renderer) => {
      particles.children.forEach((particle) => {
        // Update position based on velocity
        particle.position.x += particle.userData.velocity.x;
        particle.position.y += particle.userData.velocity.y;
        particle.position.z += particle.userData.velocity.z;
        
        // Bounce off boundaries
        if (Math.abs(particle.position.x) > maxDistance) {
          particle.userData.velocity.x *= -1;
        }
        
        if (Math.abs(particle.position.y) > maxDistance) {
          particle.userData.velocity.y *= -1;
        }
        
        if (Math.abs(particle.position.z) > maxDistance) {
          particle.userData.velocity.z *= -1;
        }
      });
      
      // Rotate the entire particle system
      particles.rotation.y += 0.001;
    });
    
    return particles;
  }
  
  // Create a floating text animation
  createFloatingTextAnimation(containerId, text, options = {}) {
    // This is a placeholder for a more complex text animation
    // In a real implementation, you would use a library like troika-three-text
    console.log(`Creating floating text animation for "${text}" in container "${containerId}"`);
    
    // For now, we'll just create a simple cube as a placeholder
    const scene = this.scenes[containerId];
    if (!scene) {
      console.error(`Scene with ID "${containerId}" not found`);
      return false;
    }
    
    // Create a cube - updated to black and white theme
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x333333 }); // Changed to dark gray
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // Add animation function
    this.addAnimation(containerId, () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    });
    
    return cube;
  }
}

// Create and export a singleton instance
const animationService = new AnimationService();
export default animationService; 