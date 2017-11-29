import { Howl } from 'howler';

export default class SOUNDS {

  static load ( STATE ) {

    // SFX

    STATE.sounds.pool['test'] = new Howl({
      src: ['resources/audio/test.mp3'],
      volume: 0.75
    });

    STATE.sounds.pool['music'] = new Howl({
      src: ['resources/audio/digital_slash.mp3'],
	  loop: true,
      volume: 0.75
    });

    STATE.sounds.pool['steps'] = new Howl({
      src: ['resources/audio/steps.ogg'],
      volume: 0.75
    });

    // Speech Synthesis

  }

  static init ( STATE ) { }

  static update ( STATE, deltaTime ) { }

}
