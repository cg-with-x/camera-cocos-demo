import AircraftComponent from "./aircraft";
import camera, { CameraCapacity } from "@byted-creative/camera"
import {CameraCocosLayer} from "@byted-creative/camera-cocos-layer"
import face, {Face, FaceEvent, FaceInfo} from "@byted-creative/camera-face"
import ResultComponent from "./result";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraComponent extends cc.Component {

    @property(AircraftComponent)
    airCraftComponent: AircraftComponent = null

    @property(ResultComponent)
    resultComponent: ResultComponent = null

    async onLoad(){

        this.resultComponent.setCameraComponent(this);

        // 初始化摄像头
        camera.init({
            layerAdapter: new CameraCocosLayer({root: this.node}), 
            capacity: [CameraCapacity.Face],
        });

        try{
            await camera.start();
            camera.setBeauty({whiten: 0.4, smoothen: 0.13, enlargeEye: 0.13, slimFace: 0.45});

            face.init({});
            face.startDetect();

            // 张嘴开始游戏， 眨眼发射子弹， 飞机的位置由人脸位置决定
            face.on(FaceEvent.onMouthAh, this.startGame, this);

            this.airCraftComponent.onGameOver(() => {
                face.off(FaceEvent.onFaceInfos, this.onFaceInfos, this);
                face.off(FaceEvent.onBlink, this.fire, this);
                face.off(FaceEvent.onBlinkRight, this.fire, this);
                face.off(FaceEvent.onBlinkLeft, this.fire, this);
            });
      
        }catch(e){
            console.log('camera start fail', e);
        }

    }

    startDetect(){
        this.resultComponent.hide();
        face.on(FaceEvent.onMouthAh, this.startGame, this);
    }

    private startGame(){
        face.off(FaceEvent.onMouthAh, this.startGame, this);
        this.airCraftComponent.startGame();
        face.on(FaceEvent.onFaceInfos, this.onFaceInfos, this);
        face.on(FaceEvent.onBlink, this.fire, this);
        face.on(FaceEvent.onBlinkRight, this.fire, this);
        face.on(FaceEvent.onBlinkLeft, this.fire, this);
    }

    private onFaceInfos(faceInfos: FaceInfo[]){
        if(faceInfos.length > 0){
            const point = faceInfos[0].faceOutline[16];
            this.airCraftComponent.moveAircraft(point.x);
        }
    }

    private fire(){
        console.log('blink');
        this.airCraftComponent.fireBullet();
    }

}
