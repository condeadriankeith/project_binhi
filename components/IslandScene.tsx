
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Float, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows, 
  Sparkles,
  RoundedBox,
  Cloud,
  Stars
} from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '../constants';
import { TileData, ItemType } from '../types';

const LowPolyTree = ({ type, rotation = 0, targetScale = 1 }: { type: ItemType; rotation?: number; targetScale?: number }) => {
  const meshRef = useRef<THREE.Group>(null);
  const currentScale = useRef(0);
  const velocity = useRef(0);
  
  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.1);
    // Spring-like pop-in animation with overshoot
    if (Math.abs(currentScale.current - targetScale) > 0.001 || Math.abs(velocity.current) > 0.001) {
      const tension = 150;
      const friction = 12;
      const force = tension * (targetScale - currentScale.current) - friction * velocity.current;
      velocity.current += force * safeDelta;
      currentScale.current += velocity.current * safeDelta;
    }
    if (meshRef.current) {
      meshRef.current.scale.set(currentScale.current, currentScale.current, currentScale.current);
      
      // Subtle wind sway
      const time = state.clock.getElapsedTime();
      const sway = Math.sin(time * 2 + rotation) * 0.03;
      meshRef.current.rotation.z = sway;
      meshRef.current.rotation.x = sway * 0.5;
    }
  });

  const treeConfig = useMemo(() => {
    switch (type) {
      case ItemType.NARRA: // National tree, broad hardwood canopy
        return { height: 1.8, width: 0.9, detail: 8, leaves: 3, leafColor: '#2D6B22', trunkColor: '#4A3728' };
      case ItemType.MOLAVE: // Tugas - very hard wood, sturdy
        return { height: 1.6, width: 0.5, detail: 6, leaves: 2, leafColor: '#3F704D', trunkColor: '#6D4C41' };
      case ItemType.BANABA: // Purple flowers, ornamental
        return { height: 1.5, width: 0.7, detail: 7, leaves: 2, leafColor: '#8B5CF6', trunkColor: '#5D4037' };
      case ItemType.DAO: // Fast-growing canopy tree
        return { height: 2.0, width: 0.8, detail: 6, leaves: 3, leafColor: '#1B4332', trunkColor: '#3E2723' };
      case ItemType.KAMAGONG: // Philippine Ebony, premium hardwood
        return { height: 1.7, width: 0.6, detail: 5, leaves: 2, leafColor: '#0F3D2E', trunkColor: '#2D1F1A' };
      default:
        return { height: 1.2, width: 0.5, detail: 6, leaves: 2, leafColor: '#409167', trunkColor: '#5D4037' };
    }
  }, [type]);

  return (
    <group ref={meshRef} rotation={[0, rotation, 0]} position={[0, 0.2, 0]}>
      {/* Trunk */}
      <mesh position={[0, treeConfig.height * 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.12, treeConfig.height * 0.5, 5]} />
        <meshStandardMaterial color={treeConfig.trunkColor} roughness={0.9} />
      </mesh>
      
      {/* Leaves */}
      {Array.from({ length: treeConfig.leaves }).map((_, i) => {
        const yOffset = treeConfig.height * (0.4 + i * 0.25);
        const scale = 1 - i * 0.2;
        return (
          <mesh 
            key={i} 
            position={[0, yOffset, 0]}
            rotation={[0, (i * Math.PI) / 4, 0]}
            castShadow
            receiveShadow
          >
            <coneGeometry args={[treeConfig.width * scale, treeConfig.height * 0.6, treeConfig.detail]} />
            <meshStandardMaterial color={treeConfig.leafColor} roughness={0.6} flatShading />
          </mesh>
        );
      })}
    </group>
  );
};

const Tile: React.FC<{ data: TileData; onClick: (id: number) => void; islandColor: string }> = ({ data, onClick, islandColor }) => {
  const [hovered, setHovered] = React.useState(false);
  const groupRef = useRef<THREE.Group>(null);
  
  // Fluid hover animation
  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetY = hovered ? 0.1 : 0;
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 10, delta);
    }
  });

  const decor = useMemo(() => {
    const random = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };
    return { 
      hasBush: random(data.id) > 0.6, 
      hasRock: random(data.id + 100) > 0.8, 
      bushSize: 0.15 + random(data.id) * 0.15,
      rockScale: 0.05 + random(data.id + 200) * 0.1,
      rockRot: [random(data.id + 300) * Math.PI * 2, random(data.id + 400) * Math.PI * 2, 0] as [number, number, number]
    };
  }, [data.id]);

  return (
    <group position={[data.x * 1.02, 0, data.z * 1.02]} ref={groupRef}>
      {/* Tile Base (Deep Earth) */}
      <RoundedBox 
        args={[0.98, 0.8, 0.98]} 
        radius={0.1} 
        smoothness={4} 
        position={[0, -0.2, 0]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial color="#5D4037" roughness={0.9} />
      </RoundedBox>

      {/* Tile Top (Grass) */}
      <RoundedBox 
        args={[0.98, 0.2, 0.98]} 
        radius={0.05} 
        smoothness={4} 
        position={[0, 0.3, 0]}
        receiveShadow
        castShadow
        onClick={(e) => { e.stopPropagation(); onClick(data.id); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <meshStandardMaterial color={hovered ? '#E6EE9C' : islandColor} roughness={0.8} />
      </RoundedBox>

      {/* Decorative Elements */}
      {!data.plantType && decor.hasBush && (
        <mesh position={[0.25, 0.45, -0.25]} scale={decor.bushSize} castShadow>
          <dodecahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#43A047" flatShading roughness={0.8} />
        </mesh>
      )}
      {!data.plantType && decor.hasRock && (
        <mesh position={[-0.3, 0.42, 0.2]} rotation={decor.rockRot} scale={decor.rockScale} castShadow>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#9E9E9E" flatShading roughness={0.7} />
        </mesh>
      )}

      {data.plantType && <LowPolyTree type={data.plantType} rotation={data.rotation} targetScale={data.scale} />}
    </group>
  );
};

const DynamicIsland = ({ 
  tiles, 
  onTileClick, 
  islandColor, 
  waterColor, 
  accentColor,
  orgIndex
}: { 
  tiles: TileData[], 
  onTileClick: (id: number) => void,
  islandColor: string,
  waterColor: string,
  accentColor: string,
  orgIndex: number
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  const prevOrgIndex = useRef(orgIndex);

  if (prevOrgIndex.current !== orgIndex) {
    if (groupRef.current) {
      const dir = orgIndex > prevOrgIndex.current ? 1 : -1;
      groupRef.current.position.x = dir * 30;
      groupRef.current.rotation.y = dir * Math.PI / 4;
    }
    prevOrgIndex.current = orgIndex;
  }

  useFrame((state, delta) => {
    if (groupRef.current) {
        // Fluid slide to center
        groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, 0, 6, delta);
        groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, 0, 6, delta);
        
        // Gentle organic hover
        const time = state.clock.getElapsedTime();
        const hoverY = Math.sin(time * 1.5) * 0.15;
        groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, hoverY, 4, delta);
        
        // Fluid tilt based on mouse
        const targetRotX = (state.mouse.y * Math.PI) / 16;
        const targetRotZ = -(state.mouse.x * Math.PI) / 16;
        groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 4, delta);
        groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, targetRotZ, 4, delta);
    }
  });

  return (
    <group ref={groupRef}>
        {/* The Grid of Tiles */}
        <group position={[0, 0.5, 0]}>
          {tiles.map(tile => (
            <Tile key={tile.id} data={tile} onClick={onTileClick} islandColor={islandColor} />
          ))}
        </group>

        {/* Deep Island Bedrock */}
        <group position={[0, -0.5, 0]}>
          <RoundedBox args={[5.8, 1.5, 5.8]} radius={0.4} smoothness={4} position={[0, -0.2, 0]} receiveShadow>
            <meshStandardMaterial color="#3E2723" roughness={1} />
          </RoundedBox>
          <RoundedBox args={[5.2, 1.0, 5.2]} radius={0.5} smoothness={4} position={[0, -1.2, 0]} receiveShadow>
            <meshStandardMaterial color="#261A15" roughness={1} />
          </RoundedBox>
        </group>

    </group>
  );
};



const LowPolyCloud = ({ 
  startPos, 
  scale = 1, 
  opacity = 0.5,
  speed = 1
}: { 
  startPos: [number, number, number], 
  scale?: number, 
  opacity?: number,
  speed?: number
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle drift across the sky
      groupRef.current.position.x += 0.5 * delta * speed;
      // Gentle bob
      groupRef.current.position.y = startPos[1] + Math.sin(state.clock.getElapsedTime() * 0.5 + startPos[0]) * 0.5;
      
      // Wrap around
      if (groupRef.current.position.x > 30) {
        groupRef.current.position.x = -30;
      }
    }
  });

  return (
    <group ref={groupRef} position={startPos} scale={scale}>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
         <dodecahedronGeometry args={[1.5, 0]} />
         <meshStandardMaterial color="#ffffff" transparent opacity={opacity} roughness={1} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[1.2, -0.2, 0.4]} scale={0.8}>
         <dodecahedronGeometry args={[1.2, 0]} />
         <meshStandardMaterial color="#ffffff" transparent opacity={opacity} roughness={1} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[-1.3, -0.3, -0.2]} scale={0.7}>
         <dodecahedronGeometry args={[1.4, 0]} />
         <meshStandardMaterial color="#ffffff" transparent opacity={opacity} roughness={1} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[0.4, 0.6, -0.5]} scale={0.6}>
         <dodecahedronGeometry args={[1, 0]} />
         <meshStandardMaterial color="#ffffff" transparent opacity={opacity} roughness={1} flatShading />
      </mesh>
    </group>
  );
};

export const IslandScene: React.FC<{ 
  tiles: TileData[], 
  onTileClick: (id: number) => void,
  islandColor: string,
  waterColor: string,
  accentColor: string,
  orgIndex: number,
  isDarkMode: boolean
}> = ({ tiles, onTileClick, islandColor, waterColor, accentColor, orgIndex, isDarkMode }) => {
  return (
    <div className={`w-full h-full absolute inset-0 z-0 transition-colors duration-1000 ${isDarkMode ? 'bg-[#0B1120]' : 'bg-[#E3F2FD]'}`}>
      <Canvas 
        dpr={[1, 2]} 
        shadows 
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          preserveDrawingBuffer: true 
        }}
      >
        <PerspectiveCamera makeDefault position={[14, 16, 14]} fov={35} />
        
        {isDarkMode && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
        <Environment preset={isDarkMode ? "night" : "apartment"} />
        <ambientLight intensity={isDarkMode ? 0.2 : 0.6} color={isDarkMode ? "#ffffff" : "#fff9e6"} />
        
        {/* Main Light (Moon or Sun) */}
        <directionalLight 
            position={isDarkMode ? [15, 25, 10] : [20, 30, 20]} 
            intensity={isDarkMode ? 0.8 : 1.5} 
            castShadow 
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={0.5}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
            shadow-bias={-0.0001}
            color={isDarkMode ? "#E2E8F0" : "#FFF7CC"}
        />
        
        {/* Fill Light */}
        <directionalLight position={[-10, 10, -10]} intensity={isDarkMode ? 0.3 : 0.5} color={isDarkMode ? "#3B82F6" : "#E3F2FD"} />
        
        <OrbitControls 
            enablePan={false} 
            minPolarAngle={Math.PI / 8} 
            maxPolarAngle={Math.PI / 2.2} 
            minDistance={12} 
            maxDistance={30} 
            enableDamping
            dampingFactor={0.05}
        />

        <DynamicIsland 
          tiles={tiles} 
          onTileClick={onTileClick} 
          islandColor={islandColor}
          waterColor={waterColor}
          accentColor={accentColor}
          orgIndex={orgIndex}
        />
        
        {/* Atmospheric Clouds (Low Poly) */}
        <LowPolyCloud startPos={[-10, 5, -15]} opacity={0.5} scale={2} speed={1.2} />
        <LowPolyCloud startPos={[15, 8, -10]} opacity={0.4} scale={1.5} speed={0.8} />
        <LowPolyCloud startPos={[-5, -5, 15]} opacity={0.3} scale={2.5} speed={0.5} />

      </Canvas>
    </div>
  );
};
