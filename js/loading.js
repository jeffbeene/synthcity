const version = '1.0.0';
const threeVersion = '0.159.0';

const terminal = document.getElementById("terminal");
const cursor = document.getElementById("cursor");
var cursorVisible = true;

var bootDate = new Date().toISOString()
bootDate = "1982"+bootDate.substring(4, bootDate.length-4);

var colorClass = 'c1';

// onload
window.onload = function() {

  let speed = 100;

  setTimeout(function(){
    window.write('▉▉▉▉▉▉▉▉▉▉▉ welcome to synthcity ▉▉▉▉▉▉▉▉▉▉▉', 0, 500, function() {
      window.newLine();
      if (isMobile()) {
        window.setColor('c2');
        window.write('>> ERROR: Device not supported', 0, 0, null);
      }
      else {
        window.setColor('c2');
        window.newLine();
        window.write('# a procedural audiovisual experience by jeff beene', 50, 2000, function() {
          window.setColor('c3');
          window.newLine();
          window.newLine();
          window.write('>> establishing connection', 0, 500, function() {
            window.write('.', speed, 500, function() {
              window.write('.', speed, 500, function() {
                window.write('.', speed, 500, function() {
                  window.newLine();
                  window.newLine();
                  window.setColor('c4');
                  window.write('00110001 00110010 00101101 00110000 00110101', 0, 50, function() {
                    window.newLine();
                    window.write('00101101 00110010 00110000 00110010 00110010', 0, 50, function() {
                      window.setColor('c1');
                      window.newLine();
                      window.newLine();
                      window.write(' ', speed, 500, function() {
                        window.setColor('c1');
                        window.write('--system', speed, 50, function() {
                          window.setColor('c2');
                          window.newLine();
                          window.write(' ', speed, 500, function() {
                            window.newLine();
                            window.setColor('c4');
                            window.write('build version: '+version, 0, 250, function() {
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
                                        window.setColor('c1');
                                        window.write('--instructions', speed, 50, function() {
                                          window.setColor('c2');
                                          window.newLine();
                                          window.write(' ', speed, 500, function() {
                                            window.newLine();
                                            window.write('# sit back and enjoy the ride or take the wheel and drive', 0, 50, function() {
                                              window.setColor('c4');
                                              window.newLine();
                                              window.newLine();
                                              window.write('press <space> to toggle autopilot', 0, 50, function() {
                                                window.newLine();
                                                window.write('hold <shift> for overdrive', 0, 50, function() {
                                                  window.newLine();
                                                  window.write('press <]> to skip song', 0, 50, function() {
                                                    window.newLine();
                                                    window.write('press <p> to pause song', 0, 50, function() {
                                                      window.newLine();
                                                      window.write('press <esc> to open terminal', 0, 50, function() {
                                                        window.newLine();
                                                        window.newLine();
                                                        window.write(' ', speed, 500, function() {
                                                          window.setColor('c3');
                                                          window.write('>> Synthesizing...', 0, 1, function() {
                                                            window.setColor('c1');
                                                            window.newLine();
                                                            window.newLine();
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
  }, 1000);

};

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
    const textNode = document.createTextNode(s.charAt(i));
    newNode.appendChild(textNode);
    terminal.insertBefore(newNode, cursor);

    i++;
    if(i==s.length){
      clearInterval(interval);
      setTimeout(callback, delay);
    }

  }, speed); 

}

window.writeAsset = function(url, itemsLoaded, itemsTotal) {
  const chars = [
  '▖',
  '▗',
  '▘',
  '▙',
  '▚',
  '▛',
  '▜',
  '▝',
  '▞',
  '▟',
  '░',
  '▒',
  '▓'
  ];
  const newNode = document.createElement('span');
  newNode.className = colorClass;
  const textNode = document.createTextNode( chars[Math.floor(Math.random()*chars.length)] );
  newNode.appendChild(textNode);
  terminal.insertBefore(newNode, cursor);
}

window.newLine = function() {
  const node = document.createElement('br');
  terminal.insertBefore(node, cursor);
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