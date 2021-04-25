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
        console.log('loading music..');
        return new Promise((resolve,reject) => {
            console.log("loading music ", this.MUSIC['title'].src)
            this.MUSIC['title'].obj = new Howl({src: this.MUSIC['title'].src});
            this.MUSIC['title'].obj.once('load', function() {
                console.log('loaded, resolving!');
                resolve();
            })
        }) 
    }
} 