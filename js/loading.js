// settings

const version = '1.0.0';
const threeVersion = '0.159.0';

const controlsText = {
  drive: [
    'use your mouse to look around/steer',
    'press <space> to toggle autopilot',
    'hold <shift> to engage overdrive',
    'press <]> to skip current song',
    'press <p> to pause current song',
    'press <esc> to open terminal'
  ],
  freeroam: [
    'use <w,a,s,d> to move camera',
    'use <r> and <f> to adjust height',
    'hold <shift> to increase speed',
    'press <]> to skip current song',
    'press <p> to pause current song',
    'press <esc> to open terminal'
  ]
};

// globals

window.userSettings = {};

const terminal = document.getElementById("terminal");
const resourcesTerminal = document.getElementById("resources");
const controlsTerminal = document.getElementById("controls");

const cursor = document.getElementById("cursor");
var cursorVisible = true;

var bootDate = new Date().toISOString()
bootDate = "1982"+bootDate.substring(4, bootDate.length-4);

var colorClass = 'c1';

// onload

window.onload = function() {

  // settings form

  $('input[name=settingsMode]').change(function(){
    let val = $( 'input[name=settingsMode]:checked' ).val();
    window.userSettings.mode = val;
    // update controls
    if (val=='drive') window.updateControls(controlsText.drive);
    else if (val=='freeroam') window.updateControls(controlsText.freeroam);
  });

  $('input[name=settingsRenderScaling]').change(function(){
    let val = $( 'input[name=settingsRenderScaling]:checked' ).val();
    window.userSettings.renderScaling = val;
  });

  // terminal

  setTimeout(function(){

    window.setColor('c1');
    window.write('synthcity --run', 80, 500, function() {
      window.newLine();
      // platform check
      if (isMobile()) {
        window.newLine();
        window.setColor('g1');
        window.write('>> Error: Mobile devices not supported', 0, 0, null);
      }
      else {
        // logo
        window.setColor('g1');
        window.write('                      __  .__           .__  __        ', 0, 0, function() {
          window.newLine();
          window.setColor('g1');
          window.write('  _________.__. _____/  |_|  |__   ____ |__|/  |_ ___.__.', 0, 0, function() {
            window.newLine();
            window.setColor('g2');
            window.write(' /  ___<   |  |/    \\   __\\  |  \\_/ ___\\|  \\   __<   |  |', 0, 0, function() {
              window.newLine();
              window.setColor('g3');
              window.write(' \\___ \\ \\___  |   |  \\  | |   Y  \\  \\___|  ||  |  \\___  |', 0, 0, function() {
                window.newLine();
                window.setColor('g4');
                window.write('/____  >/ ____|___|  /__| |___|  /\\___  >__||__|  / ____|', 0, 0, function() {
                  window.newLine();
                  window.setColor('g5');
                  window.write('     \\/ \/         \\/          \\/     \\/          \\/     ', 0, 0, function() {
                    window.newLine();
                    window.newLine();
                    window.setColor('g1');
                    window.write('** an interactive audiovisual experience by jeff beene **', 0, 800, function() {
                      window.newLine();
                      window.newLine();
                      window.setColor('c3');
                      window.write('>> initiating boot sequence...', 0, 500, function() {

                        // show settings
                        settings.style.display = 'block';

                        // write controls
                        window.updateControls(controlsText.drive);

                        window.newLine();
                        window.newLine();
                        window.setColor('c4');
                        window.write('build version: '+version, 0, 50, function() {
                          window.newLine();
                          window.write('system manufacturer: jeff beene [www.jeff-beene.com]', 0, 50, function() {
                            window.newLine();
                            window.write('system boot time: '+bootDate, 0, 50, function() {
                              window.newLine();
                              window.write('os name: three.js', 0, 50, function() {
                                window.newLine();
                                window.write('os version: '+threeVersion, 0, 50, function() {
                                  window.newLine();
                                  window.write('audio driver: uppbeat.io', 0, 50, function() {
                                    window.newLine();
                                    window.newLine();
                                    window.setColor('c3');
                                    window.write('>> loading resources...', 0, 50, function() {
                                      // load
                                      window.game.load();
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      }
    });
  }, 800);

}

window.showCredits = function() {
  /*
  setTimeout(function(){
    window.newLine();
    window.newLine();
    window.setColor('c1');
    window.write('synthcity --credits', 80, 500, function() {
      window.newLine();
      window.newLine();
      window.setColor('c4');
      window.write('huge thank you to the three.js community!', 0, 500, function() {
        window.newLine();
        window.setColor('c4');
      });
    });
  }, 800);
  */
}

// functions

// c1, c2, c3
window.setColor = function(c) {
  colorClass = c;
};

window.write = function(s, speed, delay, callback) {

  let i = 0;
  let interval = setInterval(function(){

    const newNode = document.createElement('span');
    newNode.className = colorClass;
    let textNode = null;
    if (s.charAt(i)==" ") {
      textNode = document.createTextNode('\u00A0');
    }
    else {
      textNode = document.createTextNode(s.charAt(i));
    }
    newNode.appendChild(textNode);
    terminal.insertBefore(newNode, cursor);

    i++;
    if(i==s.length){
      clearInterval(interval);
      setTimeout(callback, delay);
    }

  }, speed); 

}

window.newLine = function(el=terminal) {
  const node = document.createElement('br');
  terminal.insertBefore(node, cursor);
}

window.updateControls = function(arr) {
  controlsTerminal.innerHTML = '';
  window.writeControls(arr[0], function(){
    window.writeControls(arr[1], function(){
      window.writeControls(arr[2], function(){
        window.writeControls(arr[3], function(){
          window.writeControls(arr[4], function(){
            window.writeControls(arr[5], null);
          });
        });
      });
    });
  });
}

window.writeControls = function(s, callback) {
  let i = 0;
  const linebreak = document.createElement('br');
  controlsTerminal.insertBefore(linebreak, controlsTerminal.lastChild);
  let interval = setInterval(function(){
    const newNode = document.createElement('span');
    newNode.className = 'c1';
    let textNode = document.createTextNode(s.charAt(i));
    newNode.appendChild(textNode);
    controlsTerminal.insertBefore(newNode, controlsTerminal.lastChild);
    i++;
    if(i==s.length){
      clearInterval(interval);
      if (callback) callback();
    }
  }, 0);
}

window.writeAsset = function(url, itemsLoaded, itemsTotal) {
  
  const exts = [
    '.cfg',
    '.dll',
    '.bio',
    '.tek',
    '.bin',
    '.syn',
    '.dna',
    '.xlc'
  ];

  let coolName = makeId()+exts[Math.floor(Math.random()*exts.length)]

  let percent = ((itemsLoaded / itemsTotal)*100).toFixed(2);

  const lineBreak = document.createElement('br');
  resourcesTerminal.insertBefore(lineBreak, resourcesTerminal.firstChild);

  const newNode = document.createElement('span');
  const textNode = document.createTextNode( '>> ['+percent+'%] '+coolName );
  newNode.appendChild(textNode);
  resourcesTerminal.insertBefore(newNode, resourcesTerminal.firstChild);

}

window.strToBin = function(str) {
  let res = '';
  res = str.split('').map(char => {
     return char.charCodeAt(0).toString(2);
  }).join(' ');
  return res.substring(0, 32);
}

// cursor blink
window.setInterval(function() {
  if (cursorVisible==true) {
    cursor.style.visibility = 'hidden';
    cursorVisible = false;
  } else {
    cursor.style.visibility = 'visible';
    cursorVisible = true;
  }
}, 400);

// ismobile
function isMobile() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

function makeId() {
  let length = 16+Math.random()*28;
  let result = '';
  const characters = '$%@~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// simple hash
function hashCode(str) {
  // return hash;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return new Uint32Array([hash])[0].toString(36);
}