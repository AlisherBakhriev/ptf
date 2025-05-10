
let scene, camera, renderer, particles;

function initThreeScene() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 15;

    const canvas = document.querySelector('.webgl');
    if (!canvas) {
        console.error('Canvas element with class "webgl" not found!');
        return;
    }

    try {
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
    } catch (e) {
        console.error('WebGL initialization failed:', e);
        document.getElementById('webgl-error').style.display = 'block';
        return;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Полная прозрачность фона

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 5000;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }

    particleGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(posArray, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: new THREE.Color('#64ffda'),
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        if (particles) {
            particles.rotation.x = elapsedTime * 0.1;
            particles.rotation.y = elapsedTime * 0.15;

            const positions = particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 2] += Math.sin(elapsedTime + positions[i]) * 0.01;
            }
            particles.geometry.attributes.position.needsUpdate = true;
        }

        renderer.render(scene, camera);
    }

    animate();

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onMouseMove(event) {
        if (!particles) return;

        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        particles.rotation.y = mouseX * 0.3;
        particles.rotation.x = mouseY * 0.3;
    }

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
}

document.addEventListener('DOMContentLoaded', () => {
    // Проверка поддержки WebGL (исправленная версия)
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) throw new Error('WebGL not supported');
    } catch (e) {
        document.getElementById('webgl-error').style.display = 'block';
        return;
    }

    initThreeScene();

    AOS.init({
        duration: 1000,
        once: true,
        easing: 'ease-in-out',
        initClassName: 'aos-init'
    });
});
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});



if (document.querySelector('.webgl')) {
    initThreeScene();
}