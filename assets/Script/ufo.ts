
const {ccclass} = cc._decorator;

@ccclass
export default class UFOComponent extends cc.Component {

    private _speed = 600

    private _aircraftComponent: any = null 

    setAirCraftComponent(aircraftComp) {
        this._aircraftComponent = aircraftComp
        return this
    }

    randomPos() {
        const pageWith = this.node.parent.parent.width
        const nodeWidth = this.node.width
        const halfGapWidth = (pageWith - nodeWidth) / 2
        const x = halfGapWidth * Math.random() * ( Math.random() > 0.5 ? 1 : -1 )
        this.node.setPosition(cc.v3(x, 0, 0))
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider)  {
        if(other.name.match('bullet')) {
            this._aircraftComponent.putBullet(other.node)
            this._aircraftComponent.putUFO(self.node)
            this._aircraftComponent.addScore(1)
        } else if(other.name.match('hero')) {
            this._aircraftComponent.putUFO(self.node)

            try {
                if(this._aircraftComponent.gameOverCb) {
                    this._aircraftComponent.gameOverCb()
                }
            } catch (error) {
                console.error('custom game over cb error', error)
            }

            this._aircraftComponent.gameOver()
           
        }
    }

    update (dt) {
        const speed = this._speed
        this.node.position = this.node.position.add(cc.v3(0, -speed * dt))
        if(this.node.y <= -(this.node.parent.parent.height + this.node.height) && this._aircraftComponent) {
            this._aircraftComponent.putUFO(this.node)
         }
    }
}
