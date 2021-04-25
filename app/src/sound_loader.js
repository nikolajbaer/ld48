import {Howler, Howl} from 'howler';
import titleMusic from "../assets/sounds/oumuamua.mp3"


console.log(titleMusic);

export class SoundLoader {
    MUSIC = {
        "title": {src: titleMusic, obj: null}
    }
    
    get(which) {
        return this.MUSIC[which].obj;
    }

    load() {
        return new Promise((resolve,reject) => {
            this.MUSIC['title'].obj = new Howl({
                loop: true,
                volume: 0.5, 
                src: this.MUSIC['title'].src
            });
            this.MUSIC['title'].obj.once('load', function() {
                console.log('loaded, resolving!');
                resolve();
            })
        }) 
    }
} 