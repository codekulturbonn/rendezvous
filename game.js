/**
 * Rendezvous - A space game.
 */
import * as THREE from "three/build/three.module.js";

const PI = 3.141592;
let gameState = "play";

const scene = new THREE.Scene();
//scene.background = new THREE.Color(0x333333);
scene.add(new THREE.AxesHelper(5));
const light = new THREE.PointLight(0xffffff, 2);
light.position.set(10, 10, 10);
scene.add(light);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function makeOrbiter() {
    const orbiter = new THREE.Group();
    const material = new THREE.MeshLambertMaterial({
        color:"yellow"
    });

    const bottom = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 2, 10),
        material
    );
    orbiter.add(bottom);

    const top = new THREE.Mesh(new THREE.ConeGeometry(1, PI / 2, 10), material);
    top.position.set(0, 1.8, 0);
    orbiter.add(top);

    const engine = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1, 10), material);
    engine.position.set(0, -1, 0);
    orbiter.add(engine);

    orbiter.position.set(-2, 0, 0);
    orbiter.rotation.set(0, 0, -PI / 2);

    return orbiter;
}

function makeLander() {
    const lander = new THREE.Group();
    const material = new THREE.MeshLambertMaterial({
        color:"purple"
    });
    const body = new THREE.Mesh(new THREE.SphereGeometry(1, 6, 6), material);
    const leg1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 4, 4),
        material
    );
    const leg2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 4, 4),
        material
    );
    const leg3 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 4, 4),
        material
    );

    lander.add(body);
    lander.add(leg1);
    lander.add(leg2);
    lander.add(leg3);

    leg1.rotation.set(0, 0, -PI / 2);
    leg1.position.set(2, 0, 0);
    leg2.rotation.set(0, 0, -PI / 4);
    leg2.position.set(2, 2, 0);
    leg3.rotation.set(0, 0, (-PI * 3) / 4);
    leg3.position.set(1, -1, 0);

    setUpLander(lander);

    return lander;
}

scene.add(makeOrbiter());

const lander = makeLander();

scene.add(lander);

camera.position.z = 5;

const info = document.querySelector("#info");
const theend = document.querySelector("#theend");
let speed;
let fuel;

document.onkeydown = function (e) {
    if (gameState === "play") {
        if (fuel <= 0) {
            return;
        }
        switch (e.keyCode) {
            case 37:
                speed += 0.003;
                break;
            case 39:
                speed -= 0.003;
                break;
        }
        fuel -= 1;
    } else {
        // reset
        gameState = "play";
        setUp();
        setUpLander(lander);
        theend.style.display = "none";
        animate();
    }
};

function setUpLander(lander) {
    lander.position.set(3, 0, 0);
}

function setUp() {
    speed = 0.004;
    fuel = 3;
}

function animate() {
    if (gameState === "play") {  
        if (lander.position.x <= PI / 2) {
            gameState = "theEnd";
            if (speed > 0.001 || speed < -0.001) {
                theend.style.color = "red";
                theend.innerHTML = "You loose<br>press any key to restart";
            } else {
                theend.style.color = "green";
                theend.innerHTML = "You win<br>press any key to restart";
            }
            theend.style.display = "block";
        } else {
            lander.position.x -= 0.008;
            lander.rotation.x -= speed;
        }
    
        info.innerHTML = `
            <p>Abstand: ${Math.round((lander.position.x - PI / 2) * 10)}m</p>
            <p>Drehung: ${speed * 1000}</p>
            <p>Treibstoff: ${fuel}</p>
        `;
    
        renderer.render(scene, camera);
        // call self for loop
        requestAnimationFrame(animate);
    }
}

setUp();
animate();
