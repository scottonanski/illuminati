// import * as THREE from 'https://cdn.skypack.dev/three@0.137.5';
// import {
//     Mesh
// } from 'three';
// import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.137.5/examples/jsm/loaders/GLTFLoader.js';

import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const sprite = new Image();
sprite.src = './img/illuminati.png';

const maxSize = 10;
const minSize = 0;
const mouseRadius = 45;

let scene;
let camera;
let renderer;
let loader;
let pyramid;
let model_container = document.querySelector('.web-gl');
let particleArray = [];

let mouse = {
    x: undefined,
    y: undefined
};

window.addEventListener("mousemove", function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
});

function Particle(x, y, directionX, directionY, radius, speedX, speedY, size, frameX, frameY) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.radius = radius;
    this.speedX = speedX;
    this.speedY = speedY;
    this.size = size;
    this.frameX = frameX;
    this.frameY = frameY;
}

Particle.prototype.draw = function () {
    ctx.drawImage(sprite, this.size * this.frameX, this.size * this.frameY, this.size, this.size, this.x - this.radius * 4, this.y - this.radius * 4, this.radius * 8, this.radius * 8);
};

Particle.prototype.update = function () {
    if (this.x + this.radius * 1 > canvas.width || this.x - this.radius * 1 < 0) {
        this.directionX = -this.directionX;
    }
    if (this.y + this.radius * 1 > canvas.height || this.y - this.radius * 1 < 0) {
        this.directionY = -this.directionY;
    }
    this.x += this.directionX;
    this.y += this.directionY;

    if (
        mouse.x - this.x < mouseRadius &&
        mouse.x - this.x > -mouseRadius &&
        mouse.y - this.y < mouseRadius &&
        mouse.y - this.y > -mouseRadius
    ) {
        if (this.radius < maxSize) {
            this.radius += 1;
        }
    } else if (this.radius > minSize) {
        this.radius -= 0.09;
    }
    if (this.radius < 0) {
        this.radius = 0;
    }
    this.draw();
};

const init = () => {

    scene = new THREE.Scene();

    const fov = 13;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 30);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
        canvas: model_container
    });

    renderer.setSize(window.innerWidth, innerHeight);
    renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
    renderer.autoClear = false;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.physicallyCorrectLights = true;


    //Lights
    const color = 0xffffff;
    const intensity = 2.5;
    const light = new THREE.AmbientLight(color, intensity);
    light.position.set(0, 1, 0);

    scene.add(light);

    loader = new GLTFLoader();
    loader.load('./model/pyramid.gltf', (gltf) => {
        pyramid = gltf.scene.children[0];
        pyramid.position.set(0, 0, 0);
        scene.add(gltf.scene);
        console.log(pyramid);
    });

    console.log(loader);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    }

    particleArray = [];
    for (let i = 0; i < 3000; i++) {
        let radius = 0;
        let x = Math.random() * (innerWidth - radius * 2 - radius * 2 + radius * 2);
        let y = Math.random() * (innerHeight - radius * 2 - radius * 2 + radius * 2);
        let directionX = Math.random() * 2 - 1;
        let directionY = Math.random() * 2 - 1;
        let speedX = (Math.random() * 2) - 1;
        let speedY = (Math.random() * 2) - 1;
        let size = 250;
        let frameX = Math.floor(Math.random() * 4);
        let frameY = Math.floor(Math.random() * 4);

        particleArray.push(
            new Particle(x, y, directionX, directionY, radius, speedX, speedY, size, frameX, frameY)
        );

    }

    animate();
}

const render = () => {
    renderer.render(scene, camera);
}

const animate = () => {

    requestAnimationFrame(animate);
    pyramid.rotation.y += 0.004;
    render();

    ctx.clearRect(0, 0, innerWidth, innerHeight);
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
    }

}

function onWindowResize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}

window.addEventListener("resize", onWindowResize, false);
init();
animate();

setInterval(() => {
    mouse.x = undefined;
    mouse.y = undefined;
}, 1000);