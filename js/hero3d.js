import * as THREE from 'three';

class Hero3D {
  constructor(container) {
    this.container = container;
    this.mouse = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };
    this.clock = new THREE.Clock();
    this.scrollProgress = 0;
    this.init();
  }

  init() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 5);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    // 3D disabled — using product image fallback instead
    const fallback = document.getElementById('hero3d-fallback');
    if (fallback) fallback.style.display = 'block';
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    return;

    this.setupLights();
    this.loadProduct();
    this.createParticles();
    this.createGlowRing();

    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('resize', () => this.onResize());

    this.animate();
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(2, 3, 5);
    this.scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xF39600, 0.6, 10);
    pointLight.position.set(-3, 1, 3);
    this.scene.add(pointLight);

    const rimLight = new THREE.PointLight(0xFFD700, 0.4, 10);
    rimLight.position.set(3, -1, 2);
    this.scene.add(rimLight);

    const backLight = new THREE.PointLight(0xF39600, 0.3, 10);
    backLight.position.set(0, 0, -3);
    this.scene.add(backLight);
  }

  loadProduct() {
    const textureLoader = new THREE.TextureLoader();
    let frontLoaded = false;
    let backLoaded = false;

    textureLoader.load('Imagenes/Producto.png', (frontTexture) => {
      frontTexture.colorSpace = THREE.SRGBColorSpace;
      this.frontTexture = frontTexture;
      frontLoaded = true;
      if (backLoaded) this.buildProduct();
    }, undefined, () => this.showFallback());

    textureLoader.load('Imagenes/Vitaneral-chocolate.png', (backTexture) => {
      backTexture.colorSpace = THREE.SRGBColorSpace;
      this.backTexture = backTexture;
      backLoaded = true;
      if (frontLoaded) this.buildProduct();
    }, undefined, () => this.showFallback());
  }

  buildProduct() {
    const imgAspect = this.frontTexture.image.width / this.frontTexture.image.height;
    const height = 3.4;
    const width = height * imgAspect;

    const frontGeo = new THREE.PlaneGeometry(width, height);
    const frontMat = new THREE.MeshStandardMaterial({
      map: this.frontTexture,
      transparent: true,
      roughness: 0.3,
      metalness: 0.05,
      side: THREE.FrontSide,
    });
    this.productFront = new THREE.Mesh(frontGeo, frontMat);

    const backGeo = new THREE.PlaneGeometry(width, height);
    const backMat = new THREE.MeshStandardMaterial({
      map: this.backTexture,
      transparent: true,
      roughness: 0.3,
      metalness: 0.05,
      side: THREE.FrontSide,
    });
    this.productBack = new THREE.Mesh(backGeo, backMat);
    this.productBack.rotation.y = Math.PI;

    this.productGroup = new THREE.Group();
    this.productGroup.add(this.productFront);
    this.productGroup.add(this.productBack);

    this.scene.add(this.productGroup);

    this.productGroup.scale.set(0, 0, 0);
    this.animateEntrance();
    this.setupScrollAnimation();
  }

  setupScrollAnimation() {
    const heroSection = document.getElementById('hero');
    if (!heroSection || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const logoMerge = document.getElementById('heroLogoMerge');
    const logoFlash = logoMerge ? logoMerge.querySelector('.hero__logo-flash') : null;
    const heroContent = document.querySelector('.hero__content');
    const scrollIndicator = document.querySelector('.hero__scroll-indicator');

    ScrollTrigger.create({
      trigger: heroSection,
      start: 'top top',
      end: '+=250%',
      pin: true,
      scrub: 1.5,
      onUpdate: (self) => {
        this.scrollProgress = self.progress;

        // Phase 1: 0% - 40% → product rotates
        // Phase 2: 40% - 70% → product shrinks to center, spins fast
        // Phase 3: 70% - 85% → product disappears, flash + logo appears
        // Phase 4: 85% - 100% → logo glows and settles

        const p = self.progress;

        // Fade scroll indicator early
        if (scrollIndicator) {
          scrollIndicator.style.opacity = Math.max(0, 1 - p * 5);
        }

        // Fade hero text in phase 2
        if (heroContent) {
          if (p > 0.3) {
            const fadeP = Math.min((p - 0.3) / 0.2, 1);
            heroContent.style.opacity = 1 - fadeP;
            heroContent.style.transform = `translateY(${fadeP * -40}px)`;
          } else {
            heroContent.style.opacity = 1;
            heroContent.style.transform = '';
          }
        }

        // Logo merge overlay
        if (logoMerge) {
          if (p > 0.65 && p < 1) {
            const logoP = (p - 0.65) / 0.35;
            const logoEase = logoP < 0.3
              ? (logoP / 0.3) // fade in fast
              : 1;
            logoMerge.style.opacity = logoEase;

            // Scale: start big, settle to normal
            const scaleVal = logoP < 0.3
              ? 1.5 - logoP / 0.3 * 0.5
              : 1.0;
            logoMerge.style.transform = `translate(-50%, -50%) scale(${scaleVal})`;
          } else if (p >= 1) {
            logoMerge.style.opacity = 1;
            logoMerge.style.transform = 'translate(-50%, -50%) scale(1)';
          } else {
            logoMerge.style.opacity = 0;
          }
        }

        // Flash effect
        if (logoFlash) {
          if (p > 0.62 && p < 0.78) {
            const flashP = (p - 0.62) / 0.16;
            // Flash peaks at 30%, then fades
            const flashOpacity = flashP < 0.3
              ? flashP / 0.3
              : 1 - (flashP - 0.3) / 0.7;
            logoFlash.style.opacity = flashOpacity;
            const flashScale = 0.5 + flashP * 1.5;
            logoFlash.style.transform = `scale(${flashScale})`;
          } else {
            logoFlash.style.opacity = 0;
          }
        }
      },
    });
  }

  showFallback() {
    const fallback = document.getElementById('hero3d-fallback');
    if (fallback) {
      fallback.style.display = 'block';
      fallback.classList.add('active');
    }
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }

  createGlowRing() {
    const ringGeo = new THREE.RingGeometry(1.8, 2.0, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xF39600,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    });
    this.glowRing = new THREE.Mesh(ringGeo, ringMat);
    this.glowRing.position.z = -0.5;
    this.scene.add(this.glowRing);

    const ring2Geo = new THREE.RingGeometry(2.2, 2.3, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide,
    });
    this.glowRing2 = new THREE.Mesh(ring2Geo, ring2Mat);
    this.glowRing2.position.z = -0.8;
    this.scene.add(this.glowRing2);
  }

  animateEntrance() {
    const duration = 1400;
    const start = performance.now();

    const entranceAnim = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const overshoot = progress < 1 ? Math.sin(progress * Math.PI) * 0.05 : 0;
      this.productGroup.scale.setScalar(ease + overshoot);
      if (progress < 1) requestAnimationFrame(entranceAnim);
    };
    requestAnimationFrame(entranceAnim);
  }

  createParticles() {
    const particleCount = 60;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 2.5 + Math.random() * 2;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xF39600,
      size: 0.025,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  }

  onMouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  onResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = this.clock.getElapsedTime();
    const p = this.scrollProgress;

    if (this.productGroup) {
      // Phase 1 (0-40%): rotate
      const rotationProgress = Math.min(p / 0.4, 1);
      const scrollRotation = rotationProgress * Math.PI;

      // Phase 2 (40-70%): shrink + move to center + spin faster
      const shrinkProgress = p > 0.4 ? Math.min((p - 0.4) / 0.3, 1) : 0;
      const shrinkEase = shrinkProgress * shrinkProgress * (3 - 2 * shrinkProgress);

      // Float (reduce during shrink)
      const floatAmount = 0.12 * (1 - shrinkEase);
      this.productGroup.position.y = Math.sin(time * 1.0) * floatAmount;

      // Move product to center of screen (from right side)
      this.productGroup.position.x = -shrinkEase * this.productGroup.position.x;

      // Scale down
      const scale = 1 - shrinkEase * 0.9;
      this.productGroup.scale.setScalar(Math.max(scale, 0.05));

      // Extra spin during shrink
      const extraSpin = shrinkProgress * Math.PI * 3;

      // Mouse tilt
      const mouseFactor = Math.max(0, 1 - p * 2);
      this.targetRotation.x = this.mouse.y * 0.12 * mouseFactor;
      this.targetRotation.y = this.mouse.x * 0.2 * mouseFactor;

      // Apply rotation
      this.productGroup.rotation.x += (this.targetRotation.x - this.productGroup.rotation.x) * 0.06;
      this.productGroup.rotation.y += ((scrollRotation + extraSpin + this.targetRotation.y) - this.productGroup.rotation.y) * 0.08;

      // Fade out product at end of shrink
      if (shrinkProgress > 0.7) {
        const fadeOut = (shrinkProgress - 0.7) / 0.3;
        if (this.productFront) this.productFront.material.opacity = 1 - fadeOut;
        if (this.productBack) this.productBack.material.opacity = 1 - fadeOut;
      } else {
        if (this.productFront) this.productFront.material.opacity = 1;
        if (this.productBack) this.productBack.material.opacity = 1;
      }
    }

    // Glow rings fade out during shrink
    const fadeFactor = p > 0.4 ? Math.max(0, 1 - (p - 0.4) / 0.2) : 1;

    if (this.glowRing) {
      this.glowRing.rotation.z = time * 0.15;
      this.glowRing.material.opacity = (0.1 + Math.sin(time * 1.5) * 0.04) * fadeFactor;
    }
    if (this.glowRing2) {
      this.glowRing2.rotation.z = -time * 0.1;
      this.glowRing2.material.opacity = (0.05 + Math.sin(time * 1.2 + 1) * 0.03) * fadeFactor;
    }

    if (this.particleSystem) {
      this.particleSystem.material.opacity = 0.5 * fadeFactor;
      const positions = this.particleSystem.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const y = positions.getY(i);
        positions.setY(i, y + Math.sin(time * 0.8 + i) * 0.0015);
        const x = positions.getX(i);
        positions.setX(i, x + Math.cos(time * 0.4 + i * 0.1) * 0.001);
      }
      positions.needsUpdate = true;
      this.particleSystem.rotation.y = time * 0.03;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

function initHero3D() {
  const container = document.getElementById('hero3d-container');
  if (!container) return;

  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    const fallback = document.getElementById('hero3d-fallback');
    if (fallback) {
      fallback.style.display = 'block';
      fallback.classList.add('active');
    }
    return;
  }

  try {
    new Hero3D(container);
  } catch (err) {
    console.warn('WebGL not supported, showing fallback', err);
    const fallback = document.getElementById('hero3d-fallback');
    if (fallback) {
      fallback.style.display = 'block';
      fallback.classList.add('active');
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHero3D);
} else {
  initHero3D();
}
