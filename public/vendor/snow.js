/* Simple offline snow effect (canvas) - tiny, dependency-free
   Usage: Snow.init(rootElement, {count, color, size, speed, zIndex})
*/
(function(global){
  function createCanvas(root, zIndex){
    const c = document.createElement('canvas');
    // use fixed positioning when attaching to the document body so canvas covers the viewport
    if (root === document.body) {
      c.style.position = 'fixed';
      c.style.inset = '0';
    } else {
      c.style.position = 'absolute';
      c.style.top = '0';
      c.style.left = '0';
      c.style.width = '100%';
      c.style.height = '100%';
    }
    c.style.pointerEvents = 'none';
    c.style.zIndex = (zIndex==null? '1' : String(zIndex));
    if (root !== document.body) root.style.position = root.style.position || 'relative';
    root.appendChild(c);
    return c;
  }

  function rand(min, max){ return Math.random()*(max-min)+min; }

  function makeFlakes(count, w, h, sizeRange){
    const flakes = new Array(count);
    for(let i=0;i<count;i++){
      flakes[i] = {
        x: rand(0,w),
        // start above the viewport so they fall into view
        y: rand(-h*1.5, -10),
        r: rand(sizeRange[0], sizeRange[1]),
        vx: rand(-0.6, 0.6),
        // ensure positive downward velocity
        vy: rand(0.8, 2.2),
        // color: mix of white and grey tones
        color: (Math.random() < 0.6) ? '#ffffff' : (['#f0f0f0','#e6e6e6','#d9d9d9','#bfbfbf'][Math.floor(Math.random()*4)]),
        alpha: rand(0.6, 1)
      };
    }
    return flakes;
  }

  function Snow(root, opts){
    this.root = root || document.body;
    this.opts = Object.assign({count:100, color:'#615f5fff', size:[1,3], speed:0.5, zIndex:1}, opts||{});
    this.canvas = createCanvas(this.root, this.opts.zIndex);
    this.ctx = this.canvas.getContext('2d');
    this.running = false;
    this._onResize = this._onResize.bind(this);
    this._frame = this._frame.bind(this);
    this._init();
  }

  Snow.prototype._init = function(){
    this._onResize();
    window.addEventListener('resize', this._onResize);
    this.flakes = makeFlakes(this.opts.count, this.w, this.h, this.opts.size);
  };

  Snow.prototype._onResize = function(){
    let w,h;
    if (this.root === document.body) {
      w = window.innerWidth;
      h = window.innerHeight;
    } else {
      const rect = this.root.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
    }
    this.w = Math.max(1, Math.floor(w));
    this.h = Math.max(1, Math.floor(h));
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    this.canvas.style.width = this.w + 'px';
    this.canvas.style.height = this.h + 'px';
    this.ctx.scale(dpr, dpr);
  };

  Snow.prototype.start = function(){
    if(this.running) return; this.running = true; this._frame();
  };

  Snow.prototype.stop = function(){ this.running = false; };

  Snow.prototype._frame = function(){
    if(!this.running) return;
    const ctx = this.ctx; ctx.clearRect(0,0,this.w,this.h);
    for(let i=0;i<this.flakes.length;i++){
      const f = this.flakes[i];
      ctx.beginPath();
      ctx.globalAlpha = f.alpha;
      ctx.fillStyle = f.color || this.opts.color;
      ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
      ctx.fill();
      // apply motion
      f.x += f.vx * this.opts.speed;
      // small acceleration downwards for more natural fall
      f.vy += 0.01 * this.opts.speed;
      f.y += f.vy * this.opts.speed;
      // slight horizontal sway
      f.vx += Math.sin((f.y + i) * 0.008) * 0.02;
      // recycle when off bottom
      if(f.y - f.r > this.h){
        f.x = rand(0,this.w);
        f.y = -10 - rand(0, this.h*0.3);
        f.vy = rand(0.8, 2.2);
        f.r = rand(this.opts.size[0], this.opts.size[1]);
        f.color = (Math.random() < 0.6) ? '#ffffff' : (['#f0f0f0','#e6e6e6','#d9d9d9','#bfbfbf'][Math.floor(Math.random()*4)]);
        f.alpha = rand(0.6, 1);
      }
      if(f.x > this.w + 30) f.x = -30;
      if(f.x < -30) f.x = this.w + 30;
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(this._frame);
  };

  // convenience init
  Snow.init = function(root, opts){
    const r = (typeof root === 'string') ? document.querySelector(root) : (root || document.body);
    const s = new Snow(r, opts);
    s.start();
    return s;
  };

  global.Snow = Snow;
})(window);
