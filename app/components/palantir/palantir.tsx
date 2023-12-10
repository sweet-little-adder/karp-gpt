'use client'
import React, { useEffect } from 'react';
import * as THREE from 'three';
import type { FC } from 'react'
// import { IcosahedronBufferGeometry } from "three";


// interface PalantirProps {
//   backgroundColor?: string;
// }


// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer();

function dot(v1: any, v2: any) {
  return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}
function mod289(x: any) {
  return x - Math.floor(x * (1.0 / 289.0)) * 289.0;
}

function permute(x: any) {
  return mod289(((x * 34.0) + 10.0) * x);
}

function taylorInvSqrt(r: any) {
  return 1.79284291400159 - 0.85373472095314 * r;
}
function step(edge: any, x: any) {
  return x < edge ? 0.0 : 1.0;
}
function snoise(v: [number, number, number]): number {
  const C: [number, number] = [1.0 / 6.0, 1.0 / 3.0];
  const D: [number, number, number, number] = [0.0, 0.5, 1.0, 2.0];

  // First corner
  const i: [number, number, number] = [
    Math.floor(v[0] + v[1] + v[2]),
    Math.floor(v[0] + C[1]),
    Math.floor(v[1] + C[1]),
  ];

  const x0: [number, number, number] = [v[0] - i[0] + C[0], v[1] - i[1] + C[0], v[2] - i[2] + C[0]];

  // Other corners
  const g: [number, number, number] = [step(x0[1], x0[0]), step(x0[2], x0[1]), step(x0[0], x0[2])];
  const l: [number, number, number] = [1.0 - g[0], 1.0 - g[1], 1.0 - g[2]];

  const i1: [number, number, number] = [Math.min(g[0], l[2]), Math.min(g[1], l[0]), Math.min(g[2], l[1])];
  const i2: [number, number, number] = [Math.max(g[0], l[2]), Math.max(g[1], l[0]), Math.max(g[2], l[1])];

  const x1: [number, number, number] = [x0[0] - i1[0] + C[0], x0[1] - i1[1] + C[0], x0[2] - i1[2] + C[0]];
  const x2: [number, number, number] = [x0[0] - i2[0] + C[1], x0[1] - i2[1] + C[1], x0[2] - i2[2] + C[1]];
  const x3: [number, number, number] = [x0[0] - D[1], x0[1] - D[1], x0[2] - D[1]];

  // Permutations
  i[0] = mod289(i[0]);
  const p: any = permute(permute(permute(i[2] + D[3]) + i[1] + D[2]) + i[0] + D[1]);

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  const n_: number = 0.142857142857; // 1.0/7.0
  const ns: [number, number, number] = [n_ * D[3] - D[0], n_ * D[0] - D[2], n_ * D[1] - D[0]];

  const j: [number, number, number, number] = [p[0] - 49.0 * Math.floor(p[0] * ns[2] * ns[2]), p[1] - 49.0 * Math.floor(p[1] * ns[2] * ns[2]), p[2] - 49.0 * Math.floor(p[2] * ns[2] * ns[2]), p[3] - 49.0 * Math.floor(p[3] * ns[2] * ns[2])];

  const x_: [number, number, number, number] = [Math.floor(j[0] * ns[2]), Math.floor(j[1] * ns[2]), Math.floor(j[2] * ns[2]), Math.floor(j[3] * ns[2])];
  const y_: [number, number, number, number] = [Math.floor(j[0] - 7.0 * x_[0]), Math.floor(j[1] - 7.0 * x_[1]), Math.floor(j[2] - 7.0 * x_[2]), Math.floor(j[3] - 7.0 * x_[3])];

  const x: [number, number, number, number] = [x_[0] * ns[0] + ns[1], x_[1] * ns[0] + ns[1], x_[2] * ns[0] + ns[1], x_[3] * ns[0] + ns[1]];
  const y: [number, number, number, number] = [y_[0] * ns[0] + ns[1], y_[1] * ns[0] + ns[1], y_[2] * ns[0] + ns[1], y_[3] * ns[0] + ns[1]];
  const h: [number, number, number, number] = [1.0 - Math.abs(x[0]) - Math.abs(y[0]), 1.0 - Math.abs(x[1]) - Math.abs(y[1]), 1.0 - Math.abs(x[2]) - Math.abs(y[2]), 1.0 - Math.abs(x[3]) - Math.abs(y[3])];

  const b0: [number, number, number, number] = [x[0], x[1], y[0], y[1]];
  const b1: [number, number, number, number] = [x[2], x[3], y[2], y[3]];

  const s0: [number, number, number, number] = [Math.floor(b0[0]) * 2.0 + 1.0, Math.floor(b0[1]) * 2.0 + 1.0, Math.floor(b0[2]) * 2.0 + 1.0, Math.floor(b0[3]) * 2.0 + 1.0];
  const s1: [number, number, number, number] = [Math.floor(b1[0]) * 2.0 + 1.0, Math.floor(b1[1]) * 2.0 + 1.0, Math.floor(b1[2]) * 2.0 + 1.0, Math.floor(b1[3]) * 2.0 + 1.0];
  const sh: [number, number, number, number] = [-step(h[0], 0.0), -step(h[1], 0.0), -step(h[2], 0.0), -step(h[3], 0.0)];

  const a0: [number, number, number, number] = [b0[0] + s0[0] * sh[0], b0[1] + s0[1] * sh[1], b0[2] + s0[2] * sh[2], b0[3] + s0[3] * sh[3]];
  const a1: [number, number, number, number] = [b1[0] + s1[0] * sh[0], b1[1] + s1[1] * sh[1], b1[2] + s1[2] * sh[2], b1[3] + s1[3] * sh[3]];

  const p0: [number, number, number] = [a0[0], a0[1], h[0]];
  const p1: [number, number, number] = [a0[2], a0[3], h[1]];
  const p2: [number, number, number] = [a1[0], a1[1], h[2]];
  const p3: [number, number, number] = [a1[2], a1[3], h[3]];

  // Normalise gradients
  const norm: [number, number, number, number] = [
    taylorInvSqrt(dot(p0, p0)),
    taylorInvSqrt(dot(p1, p1)),
    taylorInvSqrt(dot(p2, p2)),
    taylorInvSqrt(dot(p3, p3)),
  ];

  p0[0] *= norm[0];
  p0[1] *= norm[0];
  p0[2] *= norm[0];

  p1[0] *= norm[1];
  p1[1] *= norm[1];
  p1[2] *= norm[1];

  p2[0] *= norm[2];
  p2[1] *= norm[2];
  p2[2] *= norm[2];

  p3[0] *= norm[3];
  p3[1] *= norm[3];
  p3[2] *= norm[3];

  // Mix final noise value
  const m: [number, number, number, number] = [
    Math.max(0.5 - dot(x0, x0), 0.0),
    Math.max(0.5 - dot(x1, x1), 0.0),
    Math.max(0.5 - dot(x2, x2), 0.0),
    Math.max(0.5 - dot(x3, x3), 0.0),
  ];

  m[0] = m[0] * m[0];
  m[1] = m[1] * m[1];
  m[2] = m[2] * m[2];
  m[3] = m[3] * m[3];

  const result: number = 105.0 * dot([dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)], m);

  return result;
}

class World {
  renderer: any;
  scene: any;
  camera: any;
  molecule: any;
  constructor() {

    this.build();

    window.addEventListener("resize", this.resize.bind(this));

    this.animate = this.animate.bind(this);
    this.animate();
  }

  build() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.z = 4;

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.molecule = new Molecule();
    this.scene.add(this.molecule);
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  animate() {
    requestAnimationFrame(this.animate);

    const time = performance.now() * 0.001;

    this.molecule.animate(time);

    this.renderer.render(this.scene, this.camera);
  }
}

class Molecule extends THREE.Object3D {
  material: any;
  geometry: any;
  mesh: any;
  radius = 1.5;
  detail = 40;
  particleSizeMin = 0.01;
  particleSizeMax = 0.08;

  constructor() {
    super();

    this.build();
  }

  build() {
    this.dot();

    this.geometry = new THREE.IcosahedronGeometry(1, this.detail);

    this.material = new THREE.PointsMaterial({
      map: this.dot(),
      blending: THREE.AdditiveBlending,
      color: 0xcccccc,
      depthTest: false
    });

    this.setupShader(this.material);

    this.mesh = new THREE.Points(this.geometry, this.material);
    this.add(this.mesh);
  }

  dot(size = 100, color = "#cccccc") {
    const sizeH = size * 0.5;

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;

    const ctx = canvas.getContext("2d");

    const circle = new Path2D();
    circle.arc(sizeH, sizeH, sizeH, 0, 3 * Math.PI);
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fill(circle);
    }

    // debug canvas
    // canvas.style.position = "fixed"
    // canvas.style.top = 0
    // canvas.style.left = 0
    // document.body.appendChild(canvas)

    return new THREE.CanvasTexture(canvas);
  }

  setupShader(material: any) {
    material.onBeforeCompile = (shader: any) => {
      shader.uniforms.time = { value: 0 };
      shader.uniforms.radius = { value: this.radius };
      shader.uniforms.particleSizeMin = { value: this.particleSizeMin };
      shader.uniforms.particleSizeMax = { value: this.particleSizeMax };
      shader.vertexShader =
        "uniform float particleSizeMax;\n" + shader.vertexShader;
      shader.vertexShader =
        "uniform float particleSizeMin;\n" + shader.vertexShader;
      shader.vertexShader = "uniform float radius;\n" + shader.vertexShader;
      shader.vertexShader = "uniform float time;\n" + shader.vertexShader;
      shader.vertexShader =
        document.getElementById("webgl-noise")?.textContent +
        "\n" +
        shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
          vec3 p = position;
          float n = snoise( vec3( p.x*.6 + time*0.2, p.y*0.4 + time*0.3, p.z*.2 + time*0.2) );
          p += n *0.4;

          // constrain to sphere radius
          float l = radius / length(p);
          p *= l;
          float s = mix(particleSizeMin, particleSizeMax, n);
          vec3 transformed = vec3( p.x, p.y, p.z );
        `
      );
      shader.vertexShader = shader.vertexShader.replace(
        "gl_PointSize = size;",
        "gl_PointSize = s;"
      );

      material.userData.shader = shader;
    };
  }

  animate(time: any) {
    this.mesh.rotation.set(0, time * 0.2, 0);
    if (this.material.userData.shader)
      this.material.userData.shader.uniforms.time.value = time;
  }
}


const body = {
  height: '100vh',
  margin: 0,
  backgroundImage: 'radial-gradient(circle farthest-corner, #343541, #000000)',
  backgroundRepeat: 'no-repeat',
};


const Palantir = () => {
  useEffect(() => {
    snoise([1, 2, 3]);
    new World();
  }, []);

  return (

    <div id="webgl-noise" type="x-shader/x-vertex" className="w-full h-screen absolute z-0 m-0 text-center" style={body}>



    </div>



  );

};

export default Palantir;


