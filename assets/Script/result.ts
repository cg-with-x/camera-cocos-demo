
const {ccclass, property} = cc._decorator;

@ccclass
export default class ResultComponent extends cc.Component {

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    private _aircraftComponent: any = null
    private _cameraComponent: any = null

    show(score: number) {
        this.node.active = true
        this.scoreLabel.string = `${score}`
    }

    setCameraComponent(cameraComp){
        this._cameraComponent = cameraComp
        return this
    }

    setAirCraftComponent(aircraftComp) {
        this._aircraftComponent = aircraftComp
        return this
    }

    hide() {
        this.node.active = false
    }

    onClickRestart() {
        // this._aircraftComponent.startGame()
        this._cameraComponent.startDetect();
    }

    onClickShareVideo() {
        this._aircraftComponent.shareVideo()
    }
}
