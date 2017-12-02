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
      src: ['resources/audio/steps.mp3'],
      volume: 0.45,
      loop: true
    });

    STATE.sounds.pool['landing'] = new Howl({ 
       src: ['resources/audio/landing.mp3'],
       volume: 0.45,
       onend: function() { STATE.sounds.pool['landing'].playing = 0; }
    });

    STATE.sounds.pool['jump'] = new Howl({
      src: ['resources/audio/jump.mp3'],
      volume: 0.45,
      onend: function() { STATE.sounds.pool['jump'].playing = 0; }
    });
    //
    // Speech Synthesis

  }

  static init ( STATE ) { }

  static update ( STATE, deltaTime ) { }

}
