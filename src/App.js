import * as THREE from 'three'
import { useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { useGLTF, MeshTransmissionMaterial, ContactShadows, Environment } from '@react-three/drei'
import { Stats, OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'

const model = '/model.glb'
let config

export default function App() {
  return (
    <Canvas eventSource={document.getElementById('root')} eventPrefix="client" camera={{ position: [0, 0, 5], fov: 40 }}>
      <ambientLight intensity={0.7} />
      <spotLight intensity={1} angle={0.1} penumbra={1} position={[10, 15, -5]} castShadow />
      <Environment preset="city" background blur={1} />
      <ContactShadows resolution={512} position={[0, -0.8, 0]} opacity={1} scale={10} blur={2} far={0.8} />
      <Object rotation={[0, 0, 0]} />
      <OrbitControls />
      <Stats />
    </Canvas>
  )
}

function Object(props) {
  const ref = useRef()
  const { scene, nodes, materials } = useGLTF(model)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.set(0, Math.PI / 4 + Math.sin(t / 20), 0)
    ref.current.position.y = (0.5 + Math.cos(t / 2)) / 7
  })
  return (
    <group ref={ref}>
      <primitive
        object={scene}
        {...props}
        receiveShadow
        position={[0, 0, 0]}
        scale={[1, 1, 1]}
        rotation={[0, 0, 0]}
      />
    </group>
  )
}

useGLTF.preload(model)
