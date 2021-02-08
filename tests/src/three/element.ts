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
threeDefineGeometry();
threeDefineMesh();
threeDefineLightAmbient();
threeDefineLightPoint();
threeDefineLightSpot();
ogodDefineKey();
ogodDefineKeys();
threeDefineControlFly();
