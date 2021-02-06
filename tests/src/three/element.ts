import { ogodDefineKey, ogodDefineKeys, ogodFactoryInstanceProperty } from '@ogod/element-core';
import { threeDefineCamera, threeDefineControlFly, threeDefineEngine, threeDefineGeometry, threeDefineLightAmbient, threeDefineLightPoint, threeDefineLightSpot, threeDefineMaterial, threeDefineMesh, threeDefineRenderer, threeDefineScene, threeDefineVec3 } from '@ogod/element-three';

threeDefineEngine();
threeDefineRenderer();
threeDefineCamera();
threeDefineScene();
threeDefineVec3();
threeDefineMaterial('three-material', [], [{
    type: ogodFactoryInstanceProperty('MeshPhong'),
    args: {
        get: () => ([{ color: 0xF4A259 }]),
        connect: (host, key) => host.state[key] = host[key]
    }
}]);
threeDefineGeometry('three-geometry', [], [{
    type: ogodFactoryInstanceProperty('Box'),
    args: {
        get: () => [1, 1, 1],
        connect: (host, key) => host.state[key] = host[key]
    }
}]);
threeDefineGeometry('three-geometry-sphere', [], [{
    type: ogodFactoryInstanceProperty('Sphere'),
    args: {
        get: () => [0.5, 32, 32],
        connect: (host, key) => host.state[key] = host[key]
    }
}]);
threeDefineMesh();
threeDefineLightAmbient();
threeDefineLightPoint();
threeDefineLightSpot();
ogodDefineKey();
ogodDefineKeys();
threeDefineControlFly();
