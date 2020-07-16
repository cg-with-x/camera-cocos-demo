
const {ccclass} = cc._decorator;

@ccclass
export default class BulletComponent extends cc.Component {

    
    private _speed =  1600
   
    private _aircraftComponent: any = null 

    setAirCraftComponent(aircraftComp) {
        this._aircraftComponent = aircraftComp
    }

    update (dt) {
        const speed = this._speed
        this.node.position = this.node.position.add(cc.v3(0, speed * dt))
        if(this.node.y >= this.node.parent.parent.height && this._aircraftComponent) {
           this._aircraftComponent.putBullet(this.node)
        }
    }
}
