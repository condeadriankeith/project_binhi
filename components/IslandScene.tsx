
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
  Stars,
  Outlines
} from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '../constants';
import { TileData, ItemType, Organization } from '../types';

const LowPolyTree = ({ 
  type, 
  rotation = 0, 
  targetScale = 1, 
  growthStage = 4,
  outlineColor
}: { 
  type: ItemType; 
  rotation?: number; 
  targetScale?: number; 
  growthStage?: number;
  outlineColor?: string;
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const currentScale = useRef(0);
  const velocity = useRef(0);
  
  const stageScale = growthStage === 1 ? 0.3 : growthStage === 2 ? 0.5 : growthStage === 3 ? 0.75 : 1.0;
  const finalScale = targetScale * stageScale;

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.1);
    if (Math.abs(currentScale.current - finalScale) > 0.001 || Math.abs(velocity.current) > 0.001) {
      const tension = 150;
      const friction = 12;
      const force = tension * (finalScale - currentScale.current) - friction * velocity.current;
      velocity.current += force * safeDelta;
      currentScale.current += velocity.current * safeDelta;
    }
    if (meshRef.current) {
      meshRef.current.scale.set(currentScale.current, currentScale.current, currentScale.current);
      
      const time = state.clock.getElapsedTime();
      const sway = Math.sin(time * 2 + rotation) * 0.03 * (1.5 - stageScale); // Smaller trees sway more
      meshRef.current.rotation.z = sway;
      meshRef.current.rotation.x = sway * 0.5;
    }
  });

  const treeConfig = useMemo(() => {
    switch (type) {
      case ItemType.NARRA:
        return { height: 1.8, width: 0.9, detail: 8, leaves: 3, leafColor: '#2D6B22', trunkColor: '#4A3728' };
      case ItemType.MALUGAI:
        return { height: 1.7, width: 0.7, detail: 7, leaves: 2, leafColor: '#1B4332', trunkColor: '#3E2723' };
      case ItemType.KALUMPIT:
        return { height: 2.0, width: 1.0, detail: 6, leaves: 4, leafColor: '#409167', trunkColor: '#5D4037' };
      case ItemType.UDLING:
        return { height: 1.5, width: 0.6, detail: 5, leaves: 2, leafColor: '#3F704D', trunkColor: '#2D1F1A' };
      case ItemType.BUGNAI:
        return { height: 1.4, width: 0.8, detail: 8, leaves: 3, leafColor: '#2E7D32', trunkColor: '#4E342E' };
      case ItemType.KUPANG:
        return { height: 2.2, width: 1.1, detail: 7, leaves: 4, leafColor: '#558B2F', trunkColor: '#3E2723' };
      case ItemType.MOLAVE:
        return { height: 1.6, width: 0.5, detail: 6, leaves: 2, leafColor: '#3F704D', trunkColor: '#6D4C41' };
      case ItemType.AGARWOOD:
        return { height: 1.9, width: 0.8, detail: 5, leaves: 3, leafColor: '#004D40', trunkColor: '#1B5E20' };
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
        {outlineColor && <Outlines thickness={0.05} color={outlineColor} screenspace />}
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
            {outlineColor && <Outlines thickness={0.05} color={outlineColor} screenspace />}
          </mesh>
        );
      })}
    </group>
  );
};

const Tile = ({ 
  tile, 
  color, 
  onClick, 
  isDarkMode, 
  accentColor,
  isWateringMode,
  currentUserEmail 
}: { 
  tile: TileData; 
  color: string; 
  onClick: () => void; 
  isDarkMode: boolean; 
  accentColor: string;
  isWateringMode?: boolean;
  currentUserEmail?: string;
}) => {
  const [hovered, setHovered] = React.useState(false);
  const groupRef = useRef<THREE.Group>(null);
  
  const isOwned = tile.plantedBy === currentUserEmail;
  const today = new Date().toISOString().split('T')[0];
  const isWateredToday = tile.lastWatered?.startsWith(today);
  
  let outlineColor: string | undefined = undefined;
  if (isWateringMode && isOwned && tile.isPlanted) {
    outlineColor = isWateredToday ? '#3b82f6' : '#10b981';
  }
  
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
      hasBush: random(tile.id) > 0.6, 
      hasRock: random(tile.id + 100) > 0.8, 
      bushSize: 0.15 + random(tile.id) * 0.15,
      rockScale: 0.05 + random(tile.id + 200) * 0.1,
      rockRot: [random(tile.id + 300) * Math.PI * 2, random(tile.id + 400) * Math.PI * 2, 0] as [number, number, number]
    };
  }, [tile.id]);

  return (
    <group position={[tile.x * 1.02, 0, tile.z * 1.02]} ref={groupRef}>
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
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <meshStandardMaterial color={hovered ? '#E6EE9C' : color} roughness={0.8} />
        {outlineColor && <Outlines thickness={0.05} color={outlineColor} screenspace />}
      </RoundedBox>

      {/* Decorative Elements */}
      {!tile.isPlanted && decor.hasBush && (
        <mesh position={[0.25, 0.45, -0.25]} scale={decor.bushSize} castShadow>
          <dodecahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#43A047" flatShading roughness={0.8} />
        </mesh>
      )}
      {!tile.isPlanted && decor.hasRock && (
        <mesh position={[-0.3, 0.42, 0.2]} rotation={decor.rockRot} scale={decor.rockScale} castShadow>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#9E9E9E" flatShading roughness={0.7} />
        </mesh>
      )}

      {tile.isPlanted && tile.plantType && (
        <LowPolyTree 
          type={tile.plantType} 
          rotation={tile.rotation} 
          targetScale={tile.scale} 
          growthStage={tile.growthStage || 4} 
          outlineColor={outlineColor}
        />
      )}
    </group>
  );
};

const FloatingIsland: React.FC<{ 
  tiles: TileData[]; 
  onTileClick: (id: number) => void;
  islandColor: string;
  index: number;
  orgOffset: THREE.Vector3;
  onFocus: (index: number) => void;
  accentColor: string;
  isWateringMode?: boolean;
  currentUserEmail?: string;
}> = ({ tiles, onTileClick, islandColor, index, orgOffset, onFocus, accentColor, isWateringMode, currentUserEmail }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const centerX = useMemo(() => {
    const xs = tiles.map(t => t.x);
    return (Math.min(...xs) + Math.max(...xs)) / 2 * 1.02;
  }, [tiles]);

  const centerZ = useMemo(() => {
    const zs = tiles.map(t => t.z);
    return (Math.min(...zs) + Math.max(...zs)) / 2 * 1.02;
  }, [tiles]);

  const centerY = useMemo(() => {
    return (tiles[0] as any).y || 0;
  }, [tiles]);

  const [scale, setScale] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setScale(1), 50);
    return () => clearTimeout(timer);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, scale, 4, delta));

      const phaseY = index * 1.5;
      const hoverY = centerY + Math.sin(time * 0.8 + phaseY) * 0.2;
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, hoverY, 3, delta);

      const phaseRot = index * 2.2;
      const driftRot = Math.sin(time * 0.3 + phaseRot) * 0.05;
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, driftRot, 2, delta);

      const tiltX = Math.cos(time * 0.5 + phaseRot) * 0.02;
      const tiltZ = Math.sin(time * 0.5 + phaseRot) * 0.02;
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, tiltX, 2, delta);
      groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, tiltZ, 2, delta);
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={[centerX + orgOffset.x, centerY + orgOffset.y, centerZ + orgOffset.z]}
      scale={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onFocus(index);
      }}
    >
      <group position={[-centerX, 0.5, -centerZ]}>
        {tiles.map(tile => (
          <Tile 
            key={tile.id} 
            tile={tile} 
            onClick={() => onTileClick(tile.id)} 
            color={islandColor} 
            isDarkMode={false}
            accentColor={accentColor}
            isWateringMode={isWateringMode}
            currentUserEmail={currentUserEmail}
          />
        ))}
      </group>

      <group position={[0, -0.5, 0]}>
        <RoundedBox args={[5.2, 1.5, 5.2]} radius={0.4} smoothness={4} position={[0, -0.2, 0]} receiveShadow>
          <meshStandardMaterial color="#3E2723" roughness={1} />
        </RoundedBox>
        <RoundedBox args={[4.8, 1.0, 4.8]} radius={0.5} smoothness={4} position={[0, -1.2, 0]} receiveShadow>
          <meshStandardMaterial color="#261A15" roughness={1} />
        </RoundedBox>
      </group>
    </group>
  );
};

const CameraController: React.FC<{ 
  activeOrgIndex: number; 
  focusedIslandIndex: number; 
  orgPositions: THREE.Vector3[];
  allIslands: THREE.Vector3[][];
}> = ({ activeOrgIndex, focusedIslandIndex, orgPositions, allIslands }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const lastOrgIndex = useRef(activeOrgIndex);
  const lastIslandIndex = useRef(focusedIslandIndex);
  
  // Animation state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionStartTime = useRef(0);
  const startCameraPos = useRef(new THREE.Vector3());
  const startTargetPos = useRef(new THREE.Vector3());
  const flightDuration = useRef(2500); // 2.5 seconds for a majestic flight

  useEffect(() => {
    if (activeOrgIndex !== lastOrgIndex.current || focusedIslandIndex !== lastIslandIndex.current) {
      setIsTransitioning(true);
      transitionStartTime.current = performance.now();
      startCameraPos.current.copy(camera.position);
      if (controlsRef.current) startTargetPos.current.copy(controlsRef.current.target);
      
      // Longer flight for different orgs, shorter for local islands
      flightDuration.current = activeOrgIndex !== lastOrgIndex.current ? 2500 : 1200;
      
      lastOrgIndex.current = activeOrgIndex;
      lastIslandIndex.current = focusedIslandIndex;
    }
  }, [activeOrgIndex, focusedIslandIndex, camera.position]);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    const orgPos = orgPositions[activeOrgIndex] || new THREE.Vector3(0, 0, 0);
    const islandLocalPos = allIslands[activeOrgIndex]?.[focusedIslandIndex] || new THREE.Vector3(0, 0, 0);
    const targetPos = new THREE.Vector3().addVectors(orgPos, islandLocalPos);
    const idealCameraPos = new THREE.Vector3(targetPos.x + 14, targetPos.y + 16, targetPos.z + 14);

    if (isTransitioning) {
      const elapsed = performance.now() - transitionStartTime.current;
      const progress = Math.min(elapsed / flightDuration.current, 1);
      
      // Smooth Easing (easeInOutCubic)
      const eased = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Curved Trajectory (Arc upwards)
      const altitudeBoost = activeOrgIndex !== lastOrgIndex.current ? 30 : 5;
      const arcY = Math.sin(progress * Math.PI) * altitudeBoost;

      // Update Camera Position with Arc
      camera.position.lerpVectors(startCameraPos.current, idealCameraPos, eased);
      camera.position.y += arcY;

      // Update Controls Target
      controlsRef.current.target.lerpVectors(startTargetPos.current, targetPos, eased);
      controlsRef.current.update();

      if (progress >= 1) {
        setIsTransitioning(false);
      }
    } else {
      // Keep target locked but allow user OrbitControls
      controlsRef.current.target.copy(targetPos);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={false} 
      minPolarAngle={Math.PI / 8} 
      maxPolarAngle={Math.PI / 2.2} 
      minDistance={12} 
      maxDistance={30} 
      enableDamping
      dampingFactor={0.05}
    />
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
      groupRef.current.position.x += 0.5 * delta * speed;
      groupRef.current.position.y = startPos[1] + Math.sin(state.clock.getElapsedTime() * 0.5 + startPos[0]) * 0.5;
      
      if (groupRef.current.position.x > 100) groupRef.current.position.x = -100;
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
  orgs: Organization[];
  onTileClick: (id: number) => void; 
  activeOrgIndex: number;
  isDarkMode?: boolean;
  focusedIslandIndex: number;
  onIslandFocus: (index: number) => void;
  isWateringMode?: boolean;
  currentUserEmail?: string;
}> = ({ 
  orgs, 
  onTileClick, 
  activeOrgIndex, 
  isDarkMode,
  focusedIslandIndex,
  onIslandFocus,
  isWateringMode,
  currentUserEmail
}) => {
  // Global positions for each organization
  const orgPositions = useMemo(() => {
    return orgs.map((_, i) => new THREE.Vector3(i * 300, 0, 0)); // Spaced far apart in a row
  }, [orgs]);

  // Group tiles into islands for all orgs
  const allOrgIslands = useMemo(() => {
    return orgs.map(org => {
      const groups: TileData[][] = [];
      for (let i = 0; i < org.tiles.length; i += 25) {
        groups.push(org.tiles.slice(i, i + 25));
      }
      return groups;
    });
  }, [orgs]);

  const allIslandLocalPositions = useMemo(() => {
    return allOrgIslands.map(islands => {
      return islands.map(island => {
        const xs = island.map(t => t.x);
        const zs = island.map(t => t.z);
        const y = (island[0] as any).y || 0;
        return new THREE.Vector3(
          ((Math.min(...xs) + Math.max(...xs)) / 2) * 1.02,
          y,
          ((Math.min(...zs) + Math.max(...zs)) / 2) * 1.02
        );
      });
    });
  }, [allOrgIslands]);

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
        
        {isDarkMode && <Stars radius={500} depth={50} count={10000} factor={4} saturation={0} fade speed={1} />}
        <Environment preset={isDarkMode ? "night" : "apartment"} />
        <ambientLight intensity={isDarkMode ? 0.2 : 0.6} color={isDarkMode ? "#ffffff" : "#fff9e6"} />
        
        <directionalLight 
            position={isDarkMode ? [15, 25, 10] : [20, 30, 20]} 
            intensity={isDarkMode ? 0.8 : 1.5} 
            castShadow 
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={0.5}
            shadow-camera-far={1000}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
            shadow-bias={-0.0001}
            color={isDarkMode ? "#E2E8F0" : "#FFF7CC"}
        />
        
        <CameraController 
          activeOrgIndex={activeOrgIndex} 
          focusedIslandIndex={focusedIslandIndex} 
          orgPositions={orgPositions}
          allIslands={allIslandLocalPositions}
        />

        {orgs.map((org, oIdx) => (
          <group key={org.id} position={orgPositions[oIdx]}>
            {allOrgIslands[oIdx].map((islandTiles, iIdx) => (
              <FloatingIsland 
                key={`${org.id}-${iIdx}`}
                index={iIdx}
                tiles={islandTiles}
                onTileClick={oIdx === activeOrgIndex ? onTileClick : () => {}} // Only clickable if active
                islandColor={org.islandColor}
                accentColor={org.accentColor}
                isWateringMode={isWateringMode}
                currentUserEmail={currentUserEmail}
                orgOffset={new THREE.Vector3(0,0,0)} // Already handled by parent group
                onFocus={(idx) => {
                  if (oIdx === activeOrgIndex) onIslandFocus(idx);
                }}
              />
            ))}
          </group>
        ))}
        
        {/* Atmospheric Clouds (Travel Clouds) */}
        {orgPositions.map((pos, i) => (
          <React.Fragment key={i}>
            <LowPolyCloud startPos={[pos.x - 50, 10, pos.z - 20]} opacity={0.4} scale={3} speed={0.5} />
            <LowPolyCloud startPos={[pos.x + 50, 5, pos.z + 30]} opacity={0.3} scale={4} speed={0.3} />
            {/* Interstitial clouds for speed effect during flight */}
            {i < orgPositions.length - 1 && (
               <LowPolyCloud startPos={[pos.x + 150, 0, 0]} opacity={0.2} scale={5} speed={2} />
            )}
          </React.Fragment>
        ))}

      </Canvas>
    </div>
  );
};
