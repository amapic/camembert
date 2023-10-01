import dynamic from "next/dynamic";
import Head from "next/head";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Html, Plane, Gltf, Text } from "@react-three/drei";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import { PlanePerso, Cube } from "../component/Sea";
import {
  useEffect,
  useRef,
  useMemo,
  useState,
  forwardRef,
  useLayoutEffect,
  Suspense,
} from "react";

import {
  Canvas,
  useLoader,
  useFrame,
  extend,
  useThree,
} from "@react-three/fiber";
// import {
//   postprocessing,
//   EffectComposer,
//   Bloom,
// } from "@react-three/postprocessing";
// import { GLSL } from "gl-react";
import { lerp, damp } from "three/src/math/MathUtils";
// import { useControls } from "leva";
// import WaveShaderMaterial from "../component/shader2";
// import RoundedBoxGeometry from "./../boxgeo.js";
// import CookieConsent from "../component/CookieConsent";

import { OrbitControls } from "@react-three/drei";

import EnsembleImage from "@/component/EnsembleImage";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import { useSpring, animated } from "@react-spring/web";

function Island({ position, id, img }) {
  const ref = useRef();

  const tt = (id * 2 * Math.PI) / 3;
  const [shiny, setShiny] = useState(false);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y =
        -5 + Math.sin((state.clock.getElapsedTime() + tt) / 2);
    }
  });

  // function onHover() {
  //   document.getElement;
  // }

  return (
    <group ref={ref} position={position} scale={[1.5, 1.5, 1.5]}>
      <Plane
        position={[0, 4, 0]}
        args={[3, 3]}
        onPointerEnter={() => {
          document.getElementsByTagName("body")[0].style.cursor = "pointer";

          // alert("rr");
        }}
        onPointerLeave={() => {
          document.getElementsByTagName("body")[0].style.cursor = "default";
        }}
      >
        <meshStandardMaterial color="white" map={img} />
      </Plane>

      <Text position={[0, 7, 0]}>AA</Text>

      <Gltf src="slide/singleIsland.glb" />
    </group>
  );
}

function Cloud({ position, glb_cloud }) {
  const ref = useRef();
  const ref2 = useRef();

  // useEffect(() => {});

  useFrame((state) => {
    if (ref.current && ref2.current) {
      if (state.clock.getElapsedTime() > 5) {
        ref.current.position.x += 0.02;
        ref2.current.position.x += 0.015;
      }
    }

    if (ref.current.position.x > 15) {
      ref.current.position.x = -30;
    }

    if (ref2.current.position.x > 15) {
      ref.current.position.x = -30;
    }
  });

  return (
    <group scale={[1, 1, 1]}>
      <mesh
        ref={ref}
        position={[-10, 15, 0]}
        geometry={glb_cloud.scene.children[0].geometry}
        material={glb_cloud.scene.children[0].material}
      />
      <mesh
        ref={ref2}
        position={[-8, 15, -3]}
        geometry={glb_cloud.scene.children[0].geometry}
        material={glb_cloud.scene.children[0].material}
      />
    </group>
  );
}

function Home() {
  const intensity = 0.1;
  const radius = 0.9;
  const luminanceThreshold = 1;
  const luminanceSmoothing = 1;

  // const terrain = useLoader(FBXLoader, "slide/Low_Poly_Forest.fbx");
  // const terrain2 = useLoader(GLTFLoader, "slide/Low_Poly_Forest.gltf");
  // var OrbitControls;
  const options = useMemo(() => {
    return {
      progress: { value: 0, min: 0, max: 1, step: 0.1 },
      z: { value: 10, min: 0, max: 20, step: 1 },
      maxpolarangle: { value: 0.85, min: 0, max: 1, step: 0.01 },
      x: { value: 0, min: 0, max: 50, step: 10 },
    };
  }, []);

  useEffect(() => {
    var first = true;
  });

  const springs = useSpring({
    from: { x: 0 },
    to: { x: 100 },
    config: {
      duration: 2000,
      // easing: easings.easeInOutQuart,
    },
    delay: 3000,
  });
  //  {
  //   from: { x: 100 },
  //   to: { x: 90 },
  //   config: {
  //     mass: 5,
  //     friction: 120,
  //     tension: 120,
  //     duration: 2000,
  //   },
  //   delay: 5000,
  // }

  return (
    <>
      <Head>
        <title>Book A.PICHAT</title>
        <link rel="shortcut icon" href="/slide/favicon.ico" />
      </Head>
      {/* <animated.div style={{ ...springs }} className="mer" id="mer">
        <img src="/slide/wave6.JPG"></img>
      </animated.div> */}

      <div
        id="div_canvas"
        style={{
          background: "black",
          height: "100vh",
          width: "100vw",
          position: "fixed",
        }}
      >
        <Canvas
          gl={{ antialias: true }}
          style={{ background: "blue" }}
          // onCreated={(state) => state.gl.setClearColor("blue")}
          camera={{
            near: 0.1,
            far: 20000,
            zoom: 1,
            position: [0, 0, 20],
            maxPolarAngle: 0.85,
          }}
        >
          {/* <color attached="background" args={["lightblue"]} /> */}
          <TextureScene />
          <group position={[50, -10, 0]} scale={[0.3, 0.3, 0.3]}>
            <Gltf src="slide/Low_Poly_Forest.gltf" />

            {/* <primitive object={terrain2} /> */}
          </group>
        </Canvas>
      </div>
      <div className="wrapGreybar">
        <div className="greybar"></div>
      </div>
    </>
  );
}

export function TextureScene() {
  // const camera_x = useRef(0);
  var camera_x;
  var tt = null;
  const reftext = useRef();
  const sound_played = useRef(false);
  const animation = useRef(true);
  // const camera = useThree((state) => state.camera);

  // useEffect(() => {});

  useFrame((state) => {
    // if (state.clock.oldTime == 0) {
    //   state.camera.lookAt(new THREE.Vector3(0, 0, 0));
    //   state.camera.position = [-10, 0, 1];
    // }
    if (
      reftext.current &&
      reftext.current.position.x < 0 &&
      state.clock.getElapsedTime() > 8
    ) {
      reftext.current.position.x += 0.3;
      reftext.current.rotation.z = -0.2;
    }

    if (
      !sound_played.current &&
      reftext.current &&
      reftext.current.position.x > 0
    ) {
      sound_played.current = true;
      // var audio = new Audio("slide/S2_24.wav");
      // audio.play();
      reftext.current.fontStyle = "normal";
      reftext.current.rotation.z = 0.0;
    }

    if (state.camera.position.x < 19.4 && animation.current) {
      // state.camera.position.x += 0.1;
    }

    if (state.clock.getElapsedTime() > 5 && animation.current) {
      if (state.camera.position.x < 0) {
        animation.current = false;
      }
      // state.camera.position.x -= Math.sin(state.clock.getElapsedTime() - 5) / 3;
      // state.camera.position.z += Math.cos(state.clock.getElapsedTime() - 5) / 3;
    }
  });

  const glb = useLoader(GLTFLoader, "slide/singleIsland.glb");
  const glb_cloud = useLoader(GLTFLoader, "slide/cloud.glb");
  // const img_planete = useLoader(THREE.TextureLoader, "slide/site_planete.JPG");
  // const img_agap2 = useLoader(THREE.TextureLoader, "slide/site_exemple.JPG");
  const img = useLoader(THREE.TextureLoader, "slide/ds.jpg");

  return (
    <>
      <ambientLight intensity={1} />
      <spotLight position={[10, 10, 10]} angle={45} penumbra={0} />

      <Island position={[1, -2, 0]} id={1} img={img} />
      <Island position={[10, -2, 0]} id={2} img={img} />
      <Island position={[-10, -10, 0]} id={3} img={img} />
      <Island position={[-25, -2, 0]} id={3} img={img} />
      <Island position={[25, -2, 0]} id={3} img={img} />
      <Cloud position={[1, 5, 0]} glb_cloud={glb_cloud} />
      {/* <Physics
        gravity={[10, 0, 0]}
        defaultContactMaterial={{
          friction: 0.0,
          restitution: 1,
          contactEquationStiffness: 3,
          contactEquationRelaxation: 5,
        }}
      >
        <PlanePerso position={[10, 0, 0]} />
        <Cube position={[-50, -9, -10]} />
      </Physics> */}
      <Text
        ref={reftext}
        scale={[2, 2, 2]}
        position={[-25, 12.5, 0]}
        fontStyle="italic"
      >
        A
      </Text>
      <Text scale={[2, 2, 2]} position={[-25, 12.5, 0]} fontStyle="italic">
        B
      </Text>
      <Text scale={[2, 2, 2]} position={[-25, 12.5, 0]} fontStyle="italic">
        C
      </Text>

      <Text
        // ref={reftext}
        scale={[2, 2, 2]}
        position={[-25, 12.5, 0]}
        fontStyle="italic"
      >
        C
      </Text>

      <OrbitControls />

      {/* <Plane position={[0, 0, -5]} args={[100, 100]}>
        <meshStandardMaterial color="blue" />
      </Plane> */}
    </>
  );
}

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});
