// life starts
document.getElementById('startBtn').onclick = function() {
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('desktop').style.display = 'block';
};



function shutdown() {
  document.getElementById('windows').innerHTML = '';
  openWins = {};
  document.getElementById('desktop').style.display = 'none';
  document.getElementById('welcome').style.display = 'flex';
}

function updateClock() {
  var d = new Date();
  var h = d.getHours().toString().padStart(2, '0');
  var m = d.getMinutes().toString().padStart(2, '0');
  var s = d.getSeconds().toString().padStart(2, '0');
  document.getElementById('clock').innerText = h + ':' + m + ':' + s;
}
setInterval(updateClock, 1000);
updateClock();

var zIndex = 10;
var openWins = {};
 
function openApp(name) {
  if (openWins[name]) {
    openWins[name].style.display = 'block';
    focusWin(openWins[name]);
    return;
  }

  var win = document.createElement('div');
  win.className = 'win';
  win.style.left = (100 + Object.keys(openWins).length * 20) + 'px';
  win.style.top = (60 + Object.keys(openWins).length * 20) + 'px';

if (name === 'calc') {
  win.style.width = '250px';
  win.style.height = '350px';
  win.innerHTML = getCalcHtml();
}else if (name === 'term') {
  win.style.width = '400px';
  win.style.height = '400px';
  win.innerHTML = getTermHtml();
} else if (name === 'paint') {
  win.style.width = '450px';
  win.style.height = '400px';
  win.innerHTML = getPaintHtml();
} else if (name == 'browser') {
  win.style.width = '500px';
  win.style.height = '380px';
  win.innerHTML = getBrowserHtml();
}


document.getElementById('windows').appendChild(win);
openWins[name] = win;
makeDraggable(win);
focusWin(win);

win.querySelector('.closeBtn').onclick = function() {
    win.remove();
    delete openWins[name];
  };

win.querySelector('.minBtn').onclick = function() {
    win.style.display = 'none';
  };
win.querySelector('.maxBtn').onclick = function() {
    if (win.dataset.max == '1') {
      win.style.width = win.dataset.w;
      win.style.height = win.dataset.h;
      win.style.left = win.dataset.l;
      win.style.top = win.dataset.t;
      win.dataset.max = '0';
    } else {
      win.dataset.w = win.style.width;
      win.dataset.h = win.style.height;
      win.dataset.l = win.style.left;
      win.dataset.t = win.style.top;
      win.style.left = '10px';
      win.style.top = '40px';
      win.style.width = '90vw';
      win.style.height = '80vh';
      win.dataset.max = '1';
    }
  };
 if (name == 'calc') setupCalc(win);
  if (name == 'term') setupTerm(win);
  if (name == 'paint') setupPaint(win);
  if (name == 'browser') setupBrowser(win);
}
function focusWin(win) {
  zIndex++;
  win.style.zIndex = zIndex;
}
function makeDraggable(win) {
  var bar = win.querySelector('.winTop');
  var offX = 0, offY = 0, dragging = false;
 
  bar.onmousedown = function(e) {
    if (e.target.tagName == 'SPAN') return;
    dragging = true;
    offX = e.clientX - win.offsetLeft;
    offY = e.clientY - win.offsetTop;
    focusWin(win);
  };
  document.onmousemove = function(e) {
    if (!dragging) return;
    win.style.left = (e.clientX - offX) + 'px';
    win.style.top = (e.clientY - offY) + 'px';
  };
 
  document.onmouseup = function() {
    dragging = false;
  };
}
// maths genios
function getCalcHtml() {
  return '<div class="winTop"><span>Calculator</span><span class="winBtns"><span class="minBtn"></span><span class="maxBtn"></span><span class="closeBtn"></span></span></div>' +
  '<div id="calcScreen">0</div>' +
    '<div class="calcRow"><button onclick="calcClear()">C</button><button onclick="calcPress(\'/\')" class="op">/</button><button onclick="calcPress(\'*\')" class="op">*</button><button onclick="calcPress(\'-\')" class="op">-</button></div>' +
    '<div class="calcRow"><button onclick="calcPress(\'7\')">7</button><button onclick="calcPress(\'8\')">8</button><button onclick="calcPress(\'9\')">9</button><button onclick="calcPress(\'+\')" class="op">+</button></div>' +
    '<div class="calcRow"><button onclick="calcPress(\'4\')">4</button><button onclick="calcPress(\'5\')">5</button><button onclick="calcPress(\'6\')">6</button></div>' +
  '<div class="calcRow"><button onclick="calcPress(\'1\')">1</button><button onclick="calcPress(\'2\')">2</button><button onclick="calcPress(\'3\')">3</button></div>' +
    '<div class="calcRow"><button onclick="calcPress(\'0\')" style="flex:2">0</button><button onclick="calcPress(\'.\')">.</button><button onclick="calcEq()" class="eq">=</button></div>' +
  '</div>';
}

var calcVal = '';
function calcPress(v) {
  calcVal += v;
  document.getElementById('calcScreen').innerText = calcVal;
}
function calcClear() {
  calcVal = '';
  document.getElementById('calcScreen').innerText = '0';
}
function calcEq() {
  try {
    var result = eval(calcVal);
    document.getElementById('calcScreen').innerText = result;
    calcVal = result.toString();
  } catch (e) {
    document.getElementById('calcScreen').innerText = 'error';
    calcVal = '';
  }
}
// hack me

function getTermHtml() {
  return '<div class="winTop"><span>Termijaz</span><span class="winBtns"><span class="minBtn"></span><span class="maxBtn"></span><span class="closeBtn"></span></span></div>' +
  '<div class="winBody" style="padding:0">' +
  '<div id="termLog">type help to see commands<br></div>' +
  '<div id="termInputRow"><span>&gt;</span><input id="termInput"></div>' +
  '</div>';
}
function setupTerm(win) {
  var input = win.querySelector('#termInput');
  var log = win.querySelector('#termLog');
  input.addEventListener('keydown', function(e) {
    if (e.key != 'Enter') return;
    var cmd = input.value;
    input.value = '';
    log.innerHTML += '&gt; ' + cmd + '<br>';
    if (cmd == 'help') {
    log.innerHTML += 'commands: help, about, date, clear<br>';
    } else if (cmd == 'about') {
      log.innerHTML += 'this is Jazweb, a web os , welcome to Jazweb<br>';
    } else if (cmd == 'date') {
      log.innerHTML += new Date().toString() + '<br>';
    } else if (cmd == 'clear') {
      log.innerHTML = '';
    } else {
      log.innerHTML += cmd + ': command not found<br>';
    }
    log.scrollTop = log.scrollHeight;
  });
}
// hello paint how are you
function getPaintHtml() {
  return '<div class="winTop"><span>Paint</span><span class="winBtns"><span class="minBtn"></span><span class="maxBtn"></span><span class="closeBtn"></span></span></div>' +
  '<div class="winBody">' +
  '<div class="paintTools"><input type="color" id="paintColor" value="#000000"><input type="range" id="paintSize" min="1" max="20" value="3"><button id="paintClear">clear</button></div>' +
  '<canvas id="paintCanvas" width="400" height="280"></canvas>' +
  '</div>';
}
function setupPaint(win) {
  var canvas = win.querySelector('#paintCanvas');
  var ctx = canvas.getContext('2d');
  var painting = false;
  var color = win.querySelector('#paintColor');
  var size = win.querySelector('#paintSize');
 
  canvas.onmousedown = function(e) {
    painting = true;
    ctx.beginPath();
    var rect = canvas.getBoundingClientRect();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };
  canvas.onmousemove = function(e) {
    if (!painting) return;
    var rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = color.value;
    ctx.lineWidth = size.value;
    ctx.lineCap = 'round';
    ctx.stroke();
  };
    canvas.onmouseup = function() {
    painting = false;
  };
  win.querySelector('#paintClear').onclick = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}
function getBrowserHtml() {
  return '<div class="winTop"><span>Browser</span><span class="winBtns"><span class="minBtn"></span><span class="maxBtn"></span><span class="closeBtn"></span></span></div>' +
  '<div class="winBody" style="padding:0">' +
  '<div class="browserBody">' +
  '<div class="googleLogo"><span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span></div>' +
  '<div class="searchBox"><input id="browserInput" placeholder="Search Google or type a URL"><span>🔍</span></div>' +
  '<div class="searchBtnRow"><button id="browserSearchBtn">Google Search</button></div>' +
  '</div>' +
  '</div>';
}

function setupBrowser(win) {
  var input = win.querySelector('#browserInput');
  var btn = win.querySelector('#browserSearchBtn');

  function doSearch() {
    var q = input.value.trim();
    if (!q) return;
    window.open('https://www.google.com/search?q=' + encodeURIComponent(q), '_blank');
  }

  btn.onclick = doSearch;
  input.addEventListener('keydown', function(e) {
    if (e.key == 'Enter') doSearch();
  });
}
