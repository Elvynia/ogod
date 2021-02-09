import { ogodDefineKey, ogodDefineKeys, ogodFactoryInstanceProperty } from '@ogod/element-core';
import { threeDefineCamera, threeDefineControlFly, threeDefineEngine, threeDefineGeometry, threeDefineLightAmbient, threeDefineLightPoint, threeDefineLightSpot, threeDefineMaterial, threeDefineMesh, threeDefinePoints, threeDefineRenderer, threeDefineScene, threeDefineTexture, threeDefineVec3 } from '@ogod/element-three';

threeDefineEngine();
threeDefineRenderer();
threeDefineCamera();
threeDefineTexture();
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
threeDefinePoints('three-points', [], [{
    params: {
        get: () => ({
            color: 0xff0000,
            transparent: true,
            depthTest: false
        }),
        connect: (host, key) => host.state[key] = host[key]
    }
}])
threeDefineLightAmbient();
threeDefineLightPoint();
threeDefineLightSpot();
ogodDefineKey();
ogodDefineKeys();
threeDefineControlFly();
