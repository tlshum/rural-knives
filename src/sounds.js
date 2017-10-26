import { Howl } from 'howler';

export default class SOUNDS {

  static load ( STATE ) {

    STATE.sounds.pool['test'] = new Howl({
      src: ['resources/audio/test.mp3']
    });

  }

  static init ( STATE ) { }

  static update ( STATE, deltaTime ) { }

}
