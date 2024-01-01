import {
  AudioLoader,
  Audio
} from 'three';

class Radio {

  constructor(params) {

    this.audioListener = params.audioListener;
    this.controller = params.controller;

    this.volume = 0.5;

    this.audioLoader = new AudioLoader();
    this.trackIndex = 0;
    this.currentTrack = null;

    this.tracks = [
      {
        path: 'assets/music/cybertruck-mood-maze-main-version-15624-02-20.mp3',
        audio: null
      },
      {
        path: 'assets/music/enchanted-luminescence-pecan-pie-main-version-26358-02-51.mp3',
        audio: null
      },
      {
        path: 'assets/music/golden-hour-vens-adams-main-version-27949-02-32.mp3',
        audio: null
      },
      {
        path: 'assets/music/hyperdrive-d0d-main-version-28328-02-37.mp3',
        audio: null
      },
      {
        path: 'assets/music/interstellar-vens-adams-main-version-27940-02-27.mp3',
        audio: null
      },
      {
        path: 'assets/music/jetlag-mountaineer-main-version-20406-02-17.mp3',
        audio: null
      },
      {
        path: 'assets/music/lost-dream-tatami-main-version-26162-02-40.mp3',
        audio: null
      },
      {
        path: 'assets/music/messier-prigida-main-version-28473-03-00.mp3',
        audio: null
      },
      {
        path: 'assets/music/outgoing-era-bosnow-main-version-02-42-14264.mp3',
        audio: null
      },
      {
        path: 'assets/music/polarity-prigida-main-version-25317-02-47.mp3',
        audio: null
      },
      {
        path: 'assets/music/star-champion-prigida-main-version-28474-02-28.mp3',
        audio: null
      },
      {
        path: 'assets/music/sunset-horizon-tecnosine-main-version-03-19-13879.mp3',
        audio: null
      },
      {
        path: 'assets/music/volt-fass-main-version-28511-02-26.mp3',
        audio: null
      },
      {
        path: 'assets/music/we-fly-kaleidoscope-main-version-22558-02-32.mp3',
        audio: null
      },
      {
        path: 'assets/music/1980-miracle-noise-cake-main-version-16821-02-26.mp3',
        audio: null
      },
      {
        path: 'assets/music/continual-prigida-main-version-25319-02-39.mp3',
        audio: null
      }
    ];

    this.shuffle();

    this.play();

  }

  update() {

    // skip song
    if (this.controller.key_pressed_right_bracket) {
      this.playNext();
    }

    // pause
    if (this.controller.key_pressed_p) {
      const currentTrack = this.tracks[this.trackIndex];
      if (currentTrack.audio.isPlaying) {
        currentTrack.audio.pause();
      }
      else {
        currentTrack.audio.play();
      }
    }

  }

  play() {

    const self = this;

    const currentTrack = this.tracks[this.trackIndex];

    // load
    if (currentTrack.audio==null) {
      currentTrack.audio = new Audio( this.audioListener );
      this.audioLoader.load( currentTrack.path, ( buffer ) => {
        currentTrack.audio.setBuffer( buffer );
        currentTrack.audio.setVolume( this.volume );
        // currentTrack.audio.onEnded = this.playNext();
        currentTrack.audio.onEnded = () => {
          this.playNext();
        }
        currentTrack.audio.play();
      });
    }
    else {
      currentTrack.audio.play();
    }

  }

  playNext() {

    this.tracks[this.trackIndex].audio.stop();

    this.trackIndex++;
    if (this.trackIndex==this.tracks.length) {
      this.shuffle();
      this.trackIndex = 0;
    }

    this.play();

  }

  shuffle() {
    let currentIndex = this.tracks.length,  randomIndex;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [this.tracks[currentIndex], this.tracks[randomIndex]] = [this.tracks[randomIndex], this.tracks[currentIndex]];
    }
  }

}

export { Radio }