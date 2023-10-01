import * as THREE from "three";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import { useRef } from "react";
export function Cube(props) {
  const bounceRef = useRef(0);
  const bounceMoment = useRef(0);
  const imgSea = useLoader(THREE.TextureLoader, "slide/wave_intenet1.JPG");
  const [ref, api] = useBox(() => ({
    mass: 0.1,

    rotation: [0.0, 0.0, 0.0],

    ...props,
  }));

  return (
    <mesh receiveShadow castShadow ref={ref}>
      <boxGeometry args={[100, 8, 100]} />
      {/* <meshLambertMaterial color="hotpink" /> */}
      <meshBasicMaterial attach="material-0" map={imgSea} />
      <meshBasicMaterial attach="material-1" map={imgSea} />
      <meshBasicMaterial attach="material-2" repeat={[50, 2]} map={imgSea} />
      <meshBasicMaterial attach="material-3" repeat={[50, 2]} map={imgSea} />
      <meshBasicMaterial attach="material-4" color="#00FFFF" />
      <meshBasicMaterial attach="material-5" color="#00FFFF" />
    </mesh>
  );
}

export function PlanePerso(props) {
  const [ref] = usePlane(() => ({
    mass: 0,
    rotation: [0, (3 * Math.PI) / 2, 0],
    ...props,
  }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry side={THREE.DoubleSide} args={[10, 10]} />
      {/* <shadowMaterial color="#171717" transparent opacity={0.1} /> */}
      <meshNormalMaterial color="#171717" transparent />
    </mesh>
  );
}
