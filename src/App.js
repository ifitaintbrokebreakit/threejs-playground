import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  useGLTF,
  AccumulativeShadows,
  RandomizedLight,
  ContactShadows,
  Environment,
  Stats,
  OrbitControls
} from '@react-three/drei'
import { useControls } from 'leva'

const model = '/model2.glb'

export default function App() {
  return (
    <>
      <Canvas eventSource={document.getElementById('root')} eventPrefix="client" camera={{ position: [0, 0, 5], fov: 40 }}>
        <ambientLight intensity={0.7} />
        <spotLight intensity={1} angle={0.1} penumbra={1} position={[10, 15, -5]} castShadow />
        <ContactShadows resolution={512} position={[0, -0.8, 0]} opacity={1} scale={10} blur={2} far={0.8} />
        <Object rotation={[0, 0, 0]} />
        <OrbitControls />
        <Stats />
        <Environment preset="sunset" background blur={0} />
      </Canvas>
    </>
  )
}

function Object(props) {
  const optionsBottle = useMemo(() => {
    return {
      transmission: { value: 1, min: 0, max: 1 },
      roughness: { value: 0.12, min: 0, max: 1, step: 0.01 },
      thickness: { value: 0.0, min: 0, max: 10, step: 0.01 },
      ior: { value: 1.77, min: 1, max: 5, step: 0.01 },
      clearcoat: { value: 0.15, min: 0, max: 1 }
    }
  }, [])

  const optionsLables = useMemo(() => {
    return {
      transmission: { value: 0, min: 0, max: 1 },
      roughness: { value: 0.0, min: 0, max: 1, step: 0.01 },
      ior: { value: 1, min: 1, max: 5, step: 0.01 },
      clearcoat: { value: 0.4, min: 0, max: 1 }
    }
  }, [])

  const mB = useControls('Bottle Material Settings', optionsBottle)
  const mC = useControls('Cap Material Settings', optionsLables)
  const mLF = useControls('Label Front Material Settings', optionsLables)
  const mLB = useControls('Label Back Material Settings', optionsLables)
  const mLT = useControls('Lable Top Settings', optionsLables)

  const ref = useRef()
  const { scene, nodes, materials } = useGLTF(model)
  const texture = new THREE.TextureLoader().load('map.jpeg' ); 
  console.log(texture);
  console.log(materials);
  mB.color = materials.StingrayPBS5.color
  mB.normalMap = materials.StingrayPBS5.normalMap;
  mC.color = '#ffffff'
  mC.metalness = 1;
  mC.metalnessMap = materials.StingrayPBS_Etikett_Stoppel.metalnessMap;
  mC.normalMap = materials.StingrayPBS_Etikett_Stoppel.normalMap;
  // mLF.transparent = true;
  // mLF.vertexColors = true
  // mLF.depthTest = false
  // mLF.depthWrite = false
  // mLF.blending = THREE.NormalBlending,
  // mLF.alphaMap = texture;
  mLF.color = '#ffffff'
  mLF.metalness = 1;
  mLF.metalnessMap = materials.StingrayPBS_Etikett_Stoppel.metalnessMap;
  mLF.normalMap = materials.StingrayPBS_Etikett_Stoppel.normalMap;
  mLB.color = '#ffffff'
  mLB.metalness = 1;
  mLB.metalnessMap = materials.StingrayPBS_Etikett_Stoppel.metalnessMap;
  mLB.normalMap = materials.StingrayPBS_Etikett_Stoppel.normalMap;
  mLB.transparent = true
  // mLB.vertexColors = true
  // mLB.depthTest = false
  // mLB.depthWrite = false
  // mLB.blending = THREE.NormalBlending,
  mLT.color = '#ffffff'
  mLT.metalness = 1;
  mLT.metalnessMap = materials.StingrayPBS_Etikett_Stoppel.metalnessMap;
  mLT.normalMap = materials.StingrayPBS_Etikett_Stoppel.normalMap;
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.set(0, Math.PI / 4 + Math.sin(t / 20), 0)
    ref.current.position.y = (0.5 + Math.cos(t / 2)) / 7
  })
  return (
    <>
      <mesh position={[1, 1, 0]}>
        <meshStandardMaterial />
      </mesh>
      <group ref={ref} scale={6}>
        <mesh geometry={nodes.Bottle.geometry} material={materials.StingrayPBS5}>
          <meshPhysicalMaterial {...mB} castShadow />
        </mesh>
        <mesh geometry={nodes.Cap_Optimized.geometry} material={materials.StingrayPBS_Etikett_Stoppel}>
          <meshPhysicalMaterial {...mC} attachArray="material" map={materials.StingrayPBS_Etikett_Stoppel.map} />
        </mesh>
        <mesh geometry={nodes.Etikett_EU_80.geometry} material-side={THREE.DoubleSide}>
          <meshPhysicalMaterial {...mLF} attachArray="material" map={materials.StingrayPBS_Etikett_Stoppel.map} side={2} />
        </mesh>
        <mesh geometry={nodes.Etikett_EU_81.geometry} material-side={THREE.DoubleSide}>
          <meshPhysicalMaterial {...mLB} attachArray="material" map={materials.StingrayPBS_Etikett_Stoppel.map} side={2} />
        </mesh>
        <mesh geometry={nodes.Halsetikett2.geometry} material={materials.StingrayPBS_Etikett_Stoppel}>
          <meshPhysicalMaterial {...mLT} attachArray="material" map={materials.StingrayPBS_Etikett_Stoppel.map} />
        </mesh>
        <AccumulativeShadows temporal frames={100} alphaTest={0.9} color="#3ead5d" colorBlend={1} opacity={0.8} scale={20}>
          <RandomizedLight radius={10} ambient={0.5} intensity={1} position={[2.5, 8, -2.5]} bias={0.001} />
        </AccumulativeShadows>
      </group>
    </>
  )
}

useGLTF.preload(model)
