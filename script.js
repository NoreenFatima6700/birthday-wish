/* --- CONFIGURATION --- */
// The message to type out in Level 3
const FINAL_MESSAGE = `You solved it — like you solve everything — quietly, intelligently, without needing applause.

Getting to know you has never been simple. It has been layers within layers, truths revealed slowly, a mind that refuses to be predictable. You are not easy to understand — and that is exactly what makes you unforgettable.

You are the kind of mystery that doesn't confuse… it captivates. The kind that challenges, unsettles, and yet feels strangely like home.

On your birthday, I don't just celebrate another year of your life. I celebrate the depth you carry, the strength you always show, the brilliance you can't hide, and the intensity that makes you who you are.

You are not ordinary. You were never meant to be.

Happy Birthday — to my favorite Grim Ripper, my greatest discovery, and the one who continues to intrigue me in ways I cannot explain, only feel.`;

const PASSWORD_LEVEL_1 = "noreen";

/* --- AUDIO HANDLING --- */
// Browsers block autoplay. We start music on the first user interaction (Level 1 submit).
const music = document.getElementById('bg-music');
music.volume = 0.9; // Set volume to 50%

/* --- LEVEL 1 LOGIC --- */
function checkLevel1() {
    const input = document.getElementById('pass1').value.toLowerCase().trim();
    
    if (input === PASSWORD_LEVEL_1) {
        // 1. Play Music
        music.play().catch(e => console.log("Audio play failed (user interaction needed first):", e));

        // 2. Transition Visuals
        document.body.style.backgroundColor = "#0d0d0d"; // Dark mode
        document.getElementById('level1').classList.remove('active');
        document.getElementById('level1').classList.add('hidden');
        
        // 3. Activate Level 2
        document.getElementById('level2').classList.remove('hidden');
        document.getElementById('level2').classList.add('active');

        // 4. Print Console Instructions
        setTimeout(() => {
            console.clear();
            console.log("%c SYSTEM HALTED ", "background: red; color: white; font-size: 20px; padding: 5px;");
            console.log("%c Hello there. Stop looking at the code.", "color: #00ff41; font-size: 14px;");
            console.log("%c To unlock the final gift, type the following command right here and press Enter:", "color: white;");
            console.log("%c openHeart()", "color: yellow; font-size: 16px; font-weight: bold;");
        }, 1000);

    } else {
        // Shake effect for wrong password
        const btn = document.querySelector('button');
        btn.style.transform = "translateX(10px)";
        setTimeout(() => btn.style.transform = "translateX(0)", 100);
        alert("Error 404: Wrong Password.");
    }
}

/* --- LEVEL 2 LOGIC (Console Hack) --- */
// We expose this function to the window object so the user can call it from console
window.openHeart = function() {
    console.log("%c Access Granted. Initializing 3D Environment...", "color: #00ff41;");
    
    // Hide Level 2
    document.getElementById('level2').classList.remove('active');
    document.getElementById('level2').classList.add('hidden');
    
    // Show Level 3
    document.getElementById('level3').classList.remove('hidden');
    document.getElementById('level3').classList.add('active');
    
    // Start 3D and Typing
    initThreeJS();
    typeWriter();
    
    return "Initializing Love Protocol..."; // Return value for console
};

/* --- LEVEL 3: TYPEWRITER EFFECT --- */
let charIndex = 0;
function typeWriter() {
    if (charIndex < FINAL_MESSAGE.length) {
        document.getElementById("typed-message").innerHTML += FINAL_MESSAGE.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 50); // Speed of typing
    }
}

/* --- LEVEL 3: THREE.JS 3D HEART --- */
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    
    // 1. Scene & Camera
    const scene = new THREE.Scene();
    // Add some fog for depth
    scene.fog = new THREE.FogExp2(0x000000, 0.02);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 2. Create Heart Shape
    const x = 0, y = 0;
    const heartShape = new THREE.Shape();
    heartShape.moveTo( x + 5, y + 5 );
    heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
    heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
    heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
    heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
    heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
    heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

    // 3. Extrude to 3D
    const extrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
    const geometry = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );
    
    // Center the geometry
    geometry.center();

    // 4. Material (Wireframe glowing look)
    const material = new THREE.MeshBasicMaterial({ 
        color: 0xff0055, // Hot Pink
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });

    const heartMesh = new THREE.Mesh( geometry, material );
    
    // Flip it correctly
    heartMesh.rotation.x = Math.PI; 
    scene.add( heartMesh );

    // 5. Add "Stars" (Particles)
    const starGeo = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPos = new Float32Array(starCount * 3);
    for(let i=0; i<starCount*3; i++) {
        starPos[i] = (Math.random() - 0.5) * 100;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({color: 0xffffff, size: 0.1});
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 6. Animation Loop
    function animate() {
        requestAnimationFrame( animate );

        // Rotate Heart
        heartMesh.rotation.y += 0.01;
        heartMesh.rotation.z += 0.005;

        // Move Stars slightly
        stars.rotation.y -= 0.002;

        renderer.render( scene, camera );
    }

    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
