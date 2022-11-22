/**
 * Redezvous - A space game.
 */
import * as THREE from 'three/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);
scene.add( new THREE.AxesHelper(5) );
const light = new THREE.PointLight(0xffffff, 2);
light.position.set(10, 10, 10);
scene.add(light);

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const orbiter = new THREE.Group();
const material = new THREE.MeshLambertMaterial();

const bottom = new THREE.Mesh(
    new THREE.CylinderGeometry( 1, 1, 2, 10 ), 
    material
);
orbiter.add( bottom );

const top = new THREE.Mesh(
    new THREE.ConeGeometry( 1, 1.6, 10 ), 
    material
);
top.position.set( 0, 1.8, 0 );
orbiter.add( top );

const engine = new THREE.Mesh(
    new THREE.ConeGeometry( 0.5, 1, 10 ), 
    material
);
engine.position.set( 0, -1, 0 );
orbiter.add( engine );

orbiter.position.set(-2, 0, 0);
orbiter.rotation.set(0, 0, -3.141592 / 2);

scene.add( orbiter );

camera.position.z = 5;

function animate() {
    requestAnimationFrame( animate );

    renderer.render( scene, camera );
};

animate();
