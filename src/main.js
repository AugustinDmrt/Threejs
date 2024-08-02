import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Création de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(2, 5, 5); // Position initiale de la caméra

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ajout de lumière
const light = new THREE.HemisphereLight(0xffffff, 0x444444);
light.position.set(0, 20, 0);
scene.add(light);

// Charger les modèles GLTF/GLB
const loader = new GLTFLoader();

let model1, model2;

// Charger le premier modèle
loader.load(
  "assets/bis.glb", // Chemin relatif vers votre fichier .glb
  (gltf) => {
    model1 = gltf.scene;
    scene.add(model1);

    setupControls(model1, "scale-x1", "scale-y1", null, "scale-all1");
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

// Charger le second modèle
loader.load(
  "assets/CC.glb", // Chemin relatif vers votre fichier .glb
  (gltf) => {
    model2 = gltf.scene;
    model2.position.x = 3; // Déplacer le second modèle pour qu'il ne se chevauche pas avec le premier
    scene.add(model2);

    setupControls(model2, "scale-x2", null, "scale-yz2", "scale-all2");
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

// Ajouter les contrôles Orbit
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Activer le lissage des mouvements
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 2;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI / 2; // Limite l'angle de vue vertical à 90 degrés

// Limite de l'angle polaire pour empêcher la caméra de descendre en dessous de 0
controls.minPolarAngle = 0; // Limite supérieure de l'angle polaire
controls.maxPolarAngle = Math.PI / 2; // Limite inférieure de l'angle polaire (90 degrés)

// Fonction d'animation
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Fonction pour configurer les contrôles d'échelle
function setupControls(model, scaleXId, scaleYId, scaleYZId, scaleAllId) {
  function updateScale() {
    const scaleX = scaleXId
      ? parseFloat(document.getElementById(scaleXId).value)
      : 1;
    const scaleY = scaleYId
      ? parseFloat(document.getElementById(scaleYId).value)
      : 1;
    const scaleYZ = scaleYZId
      ? parseFloat(document.getElementById(scaleYZId).value)
      : 1;
    const scaleAll = parseFloat(document.getElementById(scaleAllId).value);

    model.scale.set(
      scaleX * scaleAll,
      (scaleYId ? scaleY : scaleYZ) * scaleAll,
      scaleYZ * scaleAll
    );
  }

  // Écouteurs pour les curseurs
  if (scaleXId)
    document.getElementById(scaleXId).addEventListener("input", updateScale);
  if (scaleYId)
    document.getElementById(scaleYId).addEventListener("input", updateScale);
  if (scaleYZId)
    document.getElementById(scaleYZId).addEventListener("input", updateScale);
  document.getElementById(scaleAllId).addEventListener("input", updateScale);
}

// Redimensionner le rendu en cas de changement de taille de la fenêtre
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
a;
