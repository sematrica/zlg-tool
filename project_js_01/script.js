const t = THREE;  // Alias for Three.js
let camera, scene, renderer, world;
let pixR = window.devicePixelRatio ? window.devicePixelRatio : 1;
let shapes = [];
let sceneOffsetTarget = { x: 0, y: 0 };
let sceneOffset = { x: 0, y: 0 };

let today = new Date();
today.setHours(0, 0, 0, 0);
let internalTime = getTime();
let initialized = false;

// Get the time since the beginning of the day
function getTime() {
    return (new Date().getTime() - today.getTime()) / 1000.0;
}

// Check if the page is hidden or visible to initialize rendering
if (new URLSearchParams(window.location.search).get("clear")) {
    localStorage.clear();
} else {
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState !== 'hidden' && !initialized) {
            init();
        }
    });

    window.onload = () => {
        if (document.visibilityState !== 'hidden') {
            init();
        }
    };

    // Initialize the scene and window manager
    function init() {
        initialized = true;
        setTimeout(() => {
            setupScene();
            setupWindowManager();
            resize();
            updateWindowShape(false);
            render();
            window.addEventListener('resize', resize);
        }, 500);
    }

    // Setup the 3D scene with Three.js
    function setupScene() {
        camera = new t.OrthographicCamera(0, window.innerWidth, 0, window.innerHeight, -10000, 10000);
        camera.position.z = 3.5;

        scene = new t.Scene();
        scene.background = new t.Color(0x000000);
        scene.add(camera);

        renderer = new t.WebGLRenderer({ antialias: true, depthBuffer: true });
        renderer.setPixelRatio(pixR);

        world = new t.Object3D();
        scene.add(world);

        renderer.domElement.setAttribute("id", "scene");
        document.body.appendChild(renderer.domElement);
    }

    // Setup the WindowManager instance and callbacks
    function setupWindowManager() {
        windowManager.setWinShapeChangeCallback(updateWindowShape);
        windowManager.setWinChangeCallback(windowsUpdated);

        // Initialize WindowManager with custom metadata
        let metaData = { foo: "bar" };
        windowManager.init(metaData);

        // Call window update initially
        windowsUpdated();
    }

    // Callback when windows are updated
    function windowsUpdated() {
        updateNumberOfShapes();
    }

    // Update the number of shapes (16 smaller spheres) based on window configuration
    function updateNumberOfShapes() {
        let winWidth = window.innerWidth;
        let winHeight = window.innerHeight;

        // Remove all previous shapes
        shapes.forEach((s) => {
            world.remove(s);
        });
        shapes = [];

        // Create 16 smaller spheres with different colors
        for (let i = 0; i < 64; i++) {
            let c = new t.Color();
            c.setHSL(i * 0.1000, 0.50, 3.30); // 16 unique colors based on the HSL hue value

            let sphereSize = Math.min(winWidth, winHeight) * 1; // Make them small (5% of the window size)
            let sphere = new t.Mesh(
                new t.SphereGeometry(sphereSize, 64, 37),
                new t.MeshBasicMaterial({ color: c, wireframe: true })
            );

            // Position spheres in a 4x4 grid
            let gridCols = 4;
            let spacingX = winWidth / (gridCols + 1);
            let spacingY = winHeight / (gridCols + 1);
            sphere.position.x = (i % gridCols) * spacingX - winWidth / 2 + spacingX;
            sphere.position.y = Math.floor(i / gridCols) * spacingY - winHeight / 2 + spacingY;

            world.add(sphere);
            shapes.push(sphere);
        }
    }

    // Update the window shape with easing
    function updateWindowShape(easing = true) {
        sceneOffsetTarget = { x: -window.screenX, y: -window.screenY };
        if (!easing) sceneOffset = sceneOffsetTarget;
    }

    // Render the 3D scene and update the shapes' positions
    function render() {
        let t = getTime();
        windowManager.update();

        // Smooth the movement of the scene offset
        let falloff = 0.05;
        sceneOffset.x = sceneOffset.x + ((sceneOffsetTarget.x - sceneOffset.x) * falloff);
        sceneOffset.y = sceneOffset.y + ((sceneOffsetTarget.y - sceneOffset.y) * falloff);

        world.position.x = sceneOffset.x;
        world.position.y = sceneOffset.y;

        // Make each shape spin
        for (let i = 0; i < shapes.length; i++) {
            let shape = shapes[i];
            shape.rotation.x = t * 0.5;
            shape.rotation.y = t * 0.3;
        }

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    // Handle window resizing
    function resize() {
        let width = window.innerWidth;
        let height = window.innerHeight;

        camera = new t.OrthographicCamera(0, width, 0, height, -10000, 10000);
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }


}
