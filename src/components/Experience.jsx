import {
  CameraControls,
  Environment,
  Float,
  MeshReflectorMaterial,
  RenderTexture,
  Text,
  useFont,
} from "@react-three/drei";
import { City } from "./City";
import { degToRad, lerp } from "three/src/math/MathUtils";
import { useEffect, useRef } from "react";
import { Color } from "three";
import { useAtom } from "jotai";
import { currentPageAtom } from "./UI";
import { useFrame } from "@react-three/fiber";

export const Experience = () => {
  const controls = useRef();
  const meshFitCameraHome = useRef();
  const meshFitCameraStore = useRef();
  const textMaterial = useRef();
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const bloomColor = new Color("#fff");
  bloomColor.multiplyScalar(1.5);

  useFrame((_, delta) => {
    textMaterial.current.opacity = lerp(
      textMaterial.current.opacity,
      currentPage === "home" || currentPage === "intro" ? 1 : 0,
      delta * 1.5
    );
  });

  const intro = async () => {
    controls.current.dolly(-22);
    controls.current.smoothTime = 1.6;
    setTimeout(() => {
      setCurrentPage("home");
    }, 1200);
    fitCamera();
  };

  const fitCamera = async () => {
    if (currentPage === "store") {
      controls.current.smoothTime = 0.5;
      controls.current.fitToBox(meshFitCameraStore.current, true);
    } else {
      controls.current.smoothTime = 1.6;
      controls.current.fitToBox(meshFitCameraHome.current, true);
    }
  };

  useEffect(() => {
    intro();
  }, []);

  useEffect(() => {
    fitCamera();
    window.addEventListener("resize", fitCamera);
    return () => window.removeEventListener("resize", fitCamera);
  }, [currentPage]);
  return (
    <>
      <CameraControls ref={controls} />
      <mesh ref={meshFitCameraHome} position-z={1.5} visible={false}>
      <boxGeometry args={[7.5, 2, 2]} />
        <meshBasicMaterial color="blue" transparent opacity={0.5} />
      </mesh>
      <Text
        font={"fonts/cool.ttf"}
        position-x={0}
        position-y={-0.4}
        position-z={0}
        lineHeight={0.8}
        textAlign="center"
        rotation-y={degToRad(30)}
        anchorY={"bottom"}
      >
        MY LITTLE{"\n"}CITY
        <meshBasicMaterial color={bloomColor} toneMapped={false} ref={textMaterial}>
          <RenderTexture attach={"map"}>
            <color attach="background" args={["#fff"]} />
            <Environment preset="city" />
            <Float floatIntensity={4} rotationIntensity={6}>
              <City
                scale={1}
                position-x={-1}
                position-y={-1}
                rotation-y={-degToRad(25)}
                rotation-x={degToRad(50)}
              />
            </Float>
          </RenderTexture>
        </meshBasicMaterial>
      </Text>
      <group rotation-y={degToRad(-25)} position-x={3}>
        <City scale={0.5} position-y={-0.2} />
        <mesh ref={meshFitCameraStore} visible={false} >
          <boxGeometry args={[2, 1, 1]} />
          <meshBasicMaterial color="red" transparent opacity={0.5} />
        </mesh>
      </group>
      <mesh position-y={-0.48} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[100, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={10}
          roughness={1}
          depthScale={1}
          opacity={0.5}
          transparent
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#333"
          metalness={0.5}
        />
      </mesh>
      <Environment preset="city" />
    </>
  );
};
useFont.preload("fonts/cool.ttf");
