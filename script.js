import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js";
import {OrbitControls} from "https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/controls/OrbitControls.js";

const canvas=document.querySelector("#scene");
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;

const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(0x07070a,.055);
const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,100);
camera.position.set(0,0,7);

const controls=new OrbitControls(camera,canvas);
controls.enableDamping=true;controls.enablePan=false;controls.minDistance=4;controls.maxDistance=10;
controls.autoRotate=true;controls.autoRotateSpeed=.55;

scene.add(new THREE.AmbientLight(0x334455,1.4));
const key=new THREE.PointLight(0xb9ff4a,35,18);key.position.set(3,3,4);scene.add(key);
const rim=new THREE.PointLight(0xff416c,25,14);rim.position.set(-4,-2,2);scene.add(rim);

const core=new THREE.Group();scene.add(core);
const geo=new THREE.IcosahedronGeometry(1.45,3);
const mat=new THREE.MeshPhysicalMaterial({color:0x16181c,metalness:.9,roughness:.2,clearcoat:1,clearcoatRoughness:.12,emissive:0x07100a,emissiveIntensity:.25});
const mesh=new THREE.Mesh(geo,mat);core.add(mesh);

const ringMat=new THREE.MeshBasicMaterial({color:0xb9ff4a,transparent:true,opacity:.55});
for(let i=0;i<4;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(1.9+i*.28,.008,8,160),ringMat);r.rotation.set(Math.random()*2,Math.random()*2,Math.random()*2);core.add(r)}

const particlesGeo=new THREE.BufferGeometry(),count=1800,positions=new Float32Array(count*3);
for(let i=0;i<count*3;i+=3){const radius=THREE.MathUtils.randFloat(4,12),a=Math.random()*Math.PI*2,b=Math.acos(THREE.MathUtils.randFloatSpread(2));positions[i]=radius*Math.sin(b)*Math.cos(a);positions[i+1]=radius*Math.cos(b);positions[i+2]=radius*Math.sin(b)*Math.sin(a)}
particlesGeo.setAttribute("position",new THREE.BufferAttribute(positions,3));
const particles=new THREE.Points(particlesGeo,new THREE.PointsMaterial({color:0xb9ff4a,size:.018,transparent:true,opacity:.5}));
scene.add(particles);

let targetY=0;
addEventListener("scroll",()=>targetY=scrollY/innerHeight);
addEventListener("resize",()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

function animate(t){
 requestAnimationFrame(animate);
 core.rotation.y+=.0025;
 core.rotation.x+=.0008;
 particles.rotation.y=t*.000015;
 const s=Math.sin(t*.001)*.08;
 core.position.y+=(s-targetY*.22-core.position.y)*.025;
 camera.position.y+=(targetY*.15-camera.position.y)*.025;
 controls.update();
 renderer.render(scene,camera);
}
animate(0);

window.addEventListener("load",()=>setTimeout(()=>{const l=document.querySelector("#loader");l.style.opacity="0";l.style.visibility="hidden"},700));