import './App.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Canvas, extend, useFrame, useLoader, useThree } from 'react-three-fiber';
import circleImg from './assets/circle.png';
import { Suspense, useMemo, useCallback, useRef, useState } from 'react';
extend({ OrbitControls });

let mouseX = 0;
let mouseY = 0;

function map(n, start1, stop1, start2, stop2) {
  return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

/**
 * カメラ操作コンポーネント
 */
function CameraControls() {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  const controlsRef = useRef();
  useFrame(() => controlsRef.current.update());

  return (
    <orbitControls 
      ref={controlsRef}
      args={[camera, domElement]}
      autoRotate
      autoRotateSpeed={-0.2}
    />
  );
}

/**
 * ポイントコンポーネント
 */
function Points() {
  const imgTex = useLoader(THREE.TextureLoader, circleImg);
  const bufferRef = useRef();
  const [color, setColor] = useState(0x00AAFF);

  // http://grapher.mathpix.com/
  // ここで試したsinの計算結果をここで作る
  // x, z の位置を与えるとyを計算する関数を作る
  let t = 0; // 経過時間
  let f = 0.002; // 間隔
  let a = 3; // 強さ（大きいと高くなる）
  const graph = useCallback((x, z) => {
    return Math.sin(f * (x ** 2 + z ** 2 + t)) * (a + mouseY * 0.05);
  }, [t, f, a]);


  // [x1, y1, z1, x2, y2, z2, ...]
  // x, y, zの位置が入った配列を作る
  // const count = 500;
  // const sep = 0.1;
  const count = 100;
  const sep = 3;
  let positions = useMemo(() => {
    let positions = [];
    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
          let x = sep * (xi - count / 2);
          let z = sep * (zi - count / 2);
          let y = graph(x, z);
          positions.push(x, y, z);
      }
    }
    return new Float32Array(positions);
  }, [count, sep, graph]);

  // useFrameはreact-three-fiberのカスタムフック
  // 1フレームごとに関数を実行する（60fps)
  // ここでは時間経過（t）を加算して、その値を元にy座標の計算をしなおして入れ直す
  // positionsに触りたいのでuseRefで属性にアクセスできる様にしている
  // i = 1なのは[x, y, z ...]の繰り返しなので、添え字的には 1n + 3なのでそうしている
  useFrame(() => {
    let power = mouseX * 0.05;
    t += 15 + power;
    const positions = bufferRef.current.array;
    let i = 1;
    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
          let x = sep * (xi - count / 2);
          let z = sep * (zi - count / 2);
          positions[i] = graph(x, z);
          i += 3;
      }
    }
    bufferRef.current.needsUpdate = true; // テクスチャを更新するフラグ
  });

  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          ref={bufferRef}
          attachObject={['attributes', 'position']}
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        /> 
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        map={imgTex}
        color={color}
        size={0.5}
        sizeAttenuation
        transparent={false}
        alphaTest={0.5}
        opacity={1.0}
      />
    </points>
  );
}

/**
 * アニメーションのラッパーコンポーネント 
 */
function AnimationCanvas() {
  return (
    <Canvas
      colorManagement={false}
      camera={{ position: [100, 10, 0], fav: 75 }}
    >
      <Suspense fallback={null}>
        <Points />
      </Suspense>
      <CameraControls />
    </Canvas>
  );
}

function App() {
  const handleMouseMove = (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
  return (
    <div className="anim" onMouseMove={handleMouseMove}>
      <Suspense fallback={<div>loading...</div>}>
        <AnimationCanvas />
      </Suspense>
    </div>
  );
}

export default App;
