// 修改后的p5.js代码，将方形像素块改为半径为5的圆形像素块
let video; // 存储摄像头图像
let mic; // 存储麦克风输入
let particles = []; // 存储粒子

function setup() {
  createCanvas(640, 480);
  // 初始化摄像头
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  // 初始化麦克风
  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  background(0);
  // 获取麦克风音量并调整阈值
  let vol = mic.getLevel();
  let threshold = map(vol, 0, 0.1, 0.5, 2.5); // 调整速度和偏移量

  // 每次绘制时根据音量创建新的粒子，模拟破碎效果
  if (vol > 0.01) { // 降低触发阈值
    for (let i = 0; i < 100; i++) { // 增加粒子密度
      let x = int(random(width / 10)) * 10;
      let y = int(random(height / 10)) * 10;
      let col = video.get(x, y);
      particles.push(new Particle(x, y, col, threshold));
    }
  }

  // 更新和显示粒子
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].alpha < 0) {
      particles.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y, col, threshold) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.lifetime = 60; // 增加粒子生命周期，使其更慢地消失
    this.alpha = 255;
    this.vx = random(-0.5, 0.5) * threshold; // 减小速度和偏移量
    this.vy = random(-0.5, 0.5) * threshold;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 255 / this.lifetime; // 每次更新减少alpha值，使粒子逐渐消失
  }

  show() {
    noStroke();
    fill(this.col[0], this.col[1], this.col[2], this.alpha);
    ellipse(this.x, this.y, 10, 10); // 将方形像素块改为半径为5的圆形像素块
  }
}