export default class Record {

    private _recordManager: any = null

    private _videoPath = ''

    constructor() {
        this._init()
    }

    private _init() {
        if(typeof tt !== 'undefined') {
            this._recordManager = tt.getGameRecorderManager()
            this._recordManager.onStop((res: any) => {
                this._videoPath = res.videoPath
            })
        }
    }

    start() {
        if(this._recordManager) {
            this._recordManager.start()
        }
    }

    stop() {
        if(this._recordManager) {
            this._recordManager.stop()
        }
    }

    shareVideo() {
        if(typeof tt !== 'undefined') {
            tt.shareAppMessage({
                channel: "video",
                title: "精彩视频",
                extra: {
                    videoPath: this._videoPath, // 可用录屏得到的视频地址
            
                },
                success() {
                    console.log("分享视频成功");
                    
                },
                fail(e) {
                    console.log("分享录屏失败", e);
                },
            });
        }
    }
}