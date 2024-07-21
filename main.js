import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';


const renderer = new THREE.WebGLRenderer();

renderer.setSize(1800, 800);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z= 3;
scene.add(camera);



const light = new THREE.PointLight(188,75,75)
light.position.set(0,10,10)
scene.add(light);


const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(20,20,20);
orbit.update();




let mixer;
const Loader =new GLTFLoader();
Loader.load('/nitrogen.gltf' , function(gltf){
    const model = gltf.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;

    // Play a certain animation
    // const clip = THREE.AnimationClip.findByName(clips, 'HeadAction');
    // const action = mixer.clipAction(clip);
    // action.play();

    // Play all animations at the same time
    clips.forEach(function(clip) {
        const action = mixer.clipAction(clip);
        action.play();
    });

}, undefined, function(error) {
    console.error(error);
});

const clock = new THREE.Clock();
function animate() {
    if(mixer)
        mixer.update(clock.getDelta());
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
new RGBELoader().load("./room.hdr", function(texture){
    texture.mapping =  THREE.EquirectangularReflectionMapping;
    scene.background= texture;
    scene.environment= texture;
});

renderer.toneMapping =THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure =0.6;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);




const Looader =new GLTFLoader();
Looader.load('/nitrogen.gltf' , function(gltf){
  scene.add(gltf.scene);

});
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 0.5);
spotLight.position.set(0,3,5);
spotLight.target.position.set(0,3,0);
scene.add(spotLight);
scene.add(spotLight.target);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping =true;
controls.enablePan= false;
controls.enableZoom=false;
controls.autoRotate=true;
controls.autoRotateSpeed=5

const loop =() => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
}
loop()

const open = document.querySelector('.container');
		const close = document.querySelector('.close');
		var tl = gsap.timeline({ defaults: { duration: 1, ease: 'expo.inOut' } });
		open.addEventListener('click', () => {
			if (tl.reversed()) {
				tl.play();
			} else {
				tl.to('nav', { right: 0 })
					.to('nav', { height: '50vh' }, '-=.1')
					.to('nav ul li a', { opacity: 1, pointerEvents: 'all', stagger: .2 }, '-=.8')
					.to('.close', { opacity: 1, pointerEvents: 'all' }, "-=.8")
					.to('nav h2', { opacity: 1 }, '-=1');
			}
		});

		close.addEventListener('click', () => {
			tl.reverse();
		});