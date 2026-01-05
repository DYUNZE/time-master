declare module 'aplayer'{
    
    // 初始化配置项
    export interface AplayerOptions{
        // 挂在播放器的dom容器(必填)
        container: HTMLElement;
        // 是否固定在页面底部(可选)
        fixed?:boolean;
        // 自动播放?
        autoplay?: boolean;
        // 循环模式, 默认"all-全部循环" "one-单曲" "none-不循环"
        loop?: 'all' | 'one' | 'none';
        // 播放顺序? list-列表顺序 random-随机
        order?: 'list' | 'random';
        // 音频列表(必填)
        audio: AplayerAudio[];
        // 歌词类型, 3-LRC文件路径 2-LRC文本 0-无歌词
        lrcType?: 0 | 2 | 3;
        // 是否显示歌词
        showlrc?: boolean;
    }


    // 单个音频配置类型
    export interface AplayerAudio{
        // 歌名(must)
        name: string;
        // 歌手(must)
        artist: string;
        // 音频地址(local or network)
        url: string;
        // 封面图(可选)
        cover?: string;
        // 歌词地址(lrc文件)或歌词文本(可选)
        lrc?: string;
        // 时长(自动获取时长可省略)
        duration?: number;
    }

    // Aplayer实例对象,包含常用方法
    export default class Aplayer{
        constructor(options:AplayerOptions)

        // 播放音频
        play():void

        //暂停音频
        pause():void

        // 切换播放/暂停
        toggle():void

        //音量
        volume(vol:number):void
        
        //跳转到指定时间
        seek(time:number):void

        //销毁播放器
        destroy():void

        //监听播放器事件(play,pause,ended)
        on(event:string, callback:()=>void):void
        
        //移除事件监听
        off(event:string, callback:()=>void):void
    }
}