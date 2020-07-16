const {ccclass, property} = cc._decorator;
import BulletComponent from "./bullet"
import UFOComponent from "./ufo"
import ResultComponent from "./result"
import Record from "./record"


@ccclass
export default class AircraftComponent extends cc.Component {

    @property(cc.Prefab)
    ufoPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    bulletPrefab: cc.Prefab = null;

    @property(cc.Node) 
    heroNode: cc.Node = null

    @property(cc.Node) 
    ufoWrapNode: cc.Node = null

    @property(cc.Node)
    bulletWrapNode: cc.Node = null

    // 结算页面的组件
    @property(ResultComponent)
    resultComponent: ResultComponent = null

    private _ufoPool: cc.NodePool = new cc.NodePool()

    private _bulletPool: cc.NodePool = new cc.NodePool()

    private _ufoPoolSize = 16

    private _bulletPoolSize = 16

    private _score = 0

    public gameOverCb: Function = null

    // 录屏管理类
    private _record: Record = new Record()
    
    onLoad() {
        const collisionManager = cc.director.getCollisionManager()
        collisionManager.enabled = true
        this.resultComponent.setAirCraftComponent(this)
        this.initBulletPool()
        this.initUFOPool()

        // test
        // this.startGame()
       
    }

    // 开始游戏
    startGame() {
        this._score = 0
        this.resultComponent.hide()
        this._record.start()

        // 测试代码
        // this.schedule(() => {
        //     this.fireBullet()
        // }, 0.8)

        // 测试代码
        this.schedule(() => {
            this.generateUFO()
        }, 0.6)

        // 测试代码
        // this.schedule(() => {
        //     const a = Math.random() > 0.5 ? 1 : -1

        //     this.moveAircraft(a * Math.random() * 200)
        // }, 0.5)
    }

    addScore(addNum) {
        this._score += addNum
    }

    gameOver() {
        this.unscheduleAllCallbacks()
        this._record.stop()
        this.resultComponent.show(this._score)
        this.putBulletAndUFO()
        this.heroNode.setPosition(cc.v3(0, -465.163, 0))
    }

    putBullet(node) {
        this._bulletPool.put(node)
    }

    putUFO(node) {
        this._ufoPool.put(node)
    }

    /**
     *
     *
     * @param {Function} cb
     */
    onGameOver(cb: Function) {
        this.gameOverCb = cb
    }

    // 发射子弹
    fireBullet() {
        let bulletNode: cc.Node = null
        if(this._bulletPool.size() > 0) {
            bulletNode = this._bulletPool.get()
            bulletNode.setPosition(cc.v3(0, 0, 0))
        } else {
            bulletNode = cc.instantiate(this.bulletPrefab)
        }

        bulletNode.getComponent(BulletComponent).setAirCraftComponent(this)

        this.bulletWrapNode.addChild(bulletNode)

        const heroWorldPos = this.heroNode.convertToWorldSpaceAR(cc.v3(0, 0, 0))
        const bulletWorldPos = this.bulletWrapNode.convertToWorldSpaceAR(cc.v3(0, 0, 0))

        const gapX = heroWorldPos.x -  bulletWorldPos.x 
        const gapY = heroWorldPos.y - bulletWorldPos.y

        bulletNode.setPosition(bulletNode.position.add(cc.v3(gapX, gapY, 0)))
    }

    generateUFO() {
        let ufoNode: cc.Node = null 
        if(this._ufoPool.size() > 0) {
            ufoNode = this._ufoPool.get()
            ufoNode.setPosition(cc.v3(0, 0, 0))
        } else {
            ufoNode = cc.instantiate(this.ufoPrefab)
        }

        this.ufoWrapNode.addChild(ufoNode)
        ufoNode.getComponent(UFOComponent).setAirCraftComponent(this).randomPos()
    }

    initBulletPool() {
        for(let i = 0; i < this._bulletPoolSize; i++) {
            const bulletNode = cc.instantiate(this.bulletPrefab)
            this._bulletPool.put(bulletNode)
        }
    }

    initUFOPool() {
        for(let i = 0; i < this._ufoPoolSize; i++) {
            const ufoNode = cc.instantiate(this.ufoPrefab)
            this._ufoPool.put(ufoNode)
        }
    }

    moveAircraft(x) {
        // this.heroNode.setPosition(this.heroNode.position.add(cc.v3(x,  0, 0))) 
        this.heroNode.setPosition(x, this.heroNode.position.y); 
    }

    shareVideo() {
        this._record.shareVideo()
    }

    putBulletAndUFO() {
        this.bulletWrapNode.children.forEach((node) => this._bulletPool.put(node))
        this.ufoWrapNode.children.forEach((node) => this._ufoPool.put(node))
    }


}
