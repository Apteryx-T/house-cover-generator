const canvas = document.getElementById("coverCanvas");
const ctx = canvas.getContext("2d");

const refs = {
  imageInput: document.getElementById("imageInput"),
  template: document.getElementById("templateSelect"),
  title: document.getElementById("titleInput"),
  area: document.getElementById("areaInput"),
  location: document.getElementById("locationInput"),
  layout: document.getElementById("layoutInput"),
  download: document.getElementById("downloadBtn"),
};

const state = {
  image: null,
};

const templateDefaults = {
  estateBold: {
    title: "北京国贸",
    area: "78平",
    location: "CBD核心区  东三环",
    layout: "一室一厅一卫",
    caption: "国贸 CBD·78 m²一居｜一镜到底 Room Tour 国贸核心...",
    account: "安家在北京（瑞峰）",
    date: "2025-09-05",
    likes: "388",
    bottomCard: true,
  },
  varietyVisit: {
    title: "哈哈哈哈哈",
    area: "百万探家博主来我家",
    location: "@李小没不冷｜《超想迷你家》",
    layout: "都聊了点啥?",
    caption: "新家 Roomtour｜《超想迷你家》拍摄的一天 欢迎 @...",
    account: "李外里",
    date: "01-13",
    likes: "219",
    bottomCard: true,
  },
  sunnyEstate: {
    title: "市委家属院",
    area: "#6层板楼带电梯",
    location: "3个阳台#",
    layout: "",
    caption: "市委家属院｜板楼带电梯｜三个阳台采光好",
    account: "城市好房",
    date: "2026-07-09",
    likes: "168",
    bottomCard: false,
  },
  bauhausRoomTour: {
    title: "ROOM TOUR",
    area: "17W",
    location: "日式中古风",
    layout: "详解版",
    caption: "17W日式中古风｜Room Tour 详解版",
    account: "我的中古之家",
    date: "2026-07-09",
    likes: "1688",
    bottomCard: false,
  },
  dutchCube: {
    title: "世界最壮观大全",
    area: "荷兰鹿特丹方块住宅",
    location: "荷兰",
    layout: "激进的住宅小区",
    caption: "荷兰激进的住宅设计… 荷兰鹿特丹方块住宅和铅笔公寓",
    account: "建筑师黄伟",
    date: "2025-12-09",
    likes: "769",
    bottomCard: true,
  },
  cuteCarousel: {
    title: "小白也能懂的",
    area: "可爱轮播图",
    location: "动画教程",
    layout: "",
    caption: "小清新轮播图动画教程",
    account: "设计小笔记",
    date: "2026-07-10",
    likes: "520",
    bottomCard: false,
  },
};

const W = canvas.width;
const H = canvas.height;
const DESIGN_H = 1920;
const CROP_Y = (DESIGN_H - H) / 2;
const SAFE_TOP = 250;
const YELLOW = "#f5ad00";
const WHITE = "#ffffff";
const DARK = "#111217";

function getValue(name) {
  return refs[name].value.trim();
}

function getTemplateId() {
  return refs.template.value || "estateBold";
}

function applyTemplateDefaults(templateId) {
  const defaults = templateDefaults[templateId];
  if (!defaults) return;

  Object.entries(defaults).forEach(([key, value]) => {
    if (key !== "bottomCard" && refs[key]) {
      refs[key].value = value;
    }
  });
  render();
}

function font(size, weight = 900) {
  return `${weight} ${size}px "Microsoft YaHei", "SimHei", Arial, sans-serif`;
}

function fitFontSize(text, startSize, maxWidth, weight = 900) {
  let size = startSize;
  ctx.font = font(size, weight);
  while (size > 28 && ctx.measureText(text).width > maxWidth) {
    size -= 4;
    ctx.font = font(size, weight);
  }
  return size;
}

function drawCoverImage() {
  if (!state.image) {
    const grd = ctx.createLinearGradient(0, 0, W, DESIGN_H);
    grd.addColorStop(0, "#e8dfd3");
    grd.addColorStop(0.48, "#84766a");
    grd.addColorStop(1, "#17181d");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, DESIGN_H);

    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(78, 410, 380, 250);
    ctx.fillStyle = "rgba(255,255,255,0.09)";
    ctx.fillRect(486, 248, 420, 840);
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(80, 1160, 760, 220);
    return;
  }

  const img = state.image;
  const scale = Math.max(W / img.width, DESIGN_H / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = (W - dw) / 2;
  const dy = (DESIGN_H - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

function drawGradientScrims() {
  let grd = ctx.createLinearGradient(0, 0, 0, 520);
  grd.addColorStop(0, "rgba(0,0,0,0.42)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, 520);

  grd = ctx.createLinearGradient(0, DESIGN_H - 720, 0, DESIGN_H);
  grd.addColorStop(0, "rgba(0,0,0,0)");
  grd.addColorStop(0.58, "rgba(0,0,0,0.28)");
  grd.addColorStop(1, "rgba(0,0,0,0.72)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, DESIGN_H - 720, W, 720);
}

function strokeFillText(text, x, y, size, fill, options = {}) {
  const {
    weight = 900,
    stroke = "#070707",
    strokeWidth = Math.max(8, size * 0.08),
    align = "left",
    shadow = true,
  } = options;

  ctx.save();
  ctx.font = font(size, weight);
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";

  if (shadow) {
    ctx.shadowColor = "rgba(0,0,0,0.86)";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = Math.max(5, size * 0.08);
    ctx.shadowOffsetY = Math.max(5, size * 0.08);
  }

  ctx.strokeStyle = stroke;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function strokeFillRotatedText(text, x, y, size, angle, fill, options = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  strokeFillText(text, 0, 0, size, fill, options);
  ctx.restore();
}

function comicStrokeText(text, x, y, size, fill, options = {}) {
  const {
    align = "left",
    angle = 0,
    outer = "rgba(0,0,0,0.72)",
    middle = "#6f6b67",
    inner = WHITE,
    outerWidth = 24,
    middleWidth = 14,
    innerWidth = 5,
    shadowX = 10,
    shadowY = 10,
    scaleX = 1,
    scaleY = 1,
    weight = 900,
  } = options;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.scale(scaleX, scaleY);
  ctx.font = font(size, weight);
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";

  ctx.strokeStyle = outer;
  ctx.lineWidth = outerWidth;
  ctx.strokeText(text, shadowX, shadowY);

  ctx.strokeStyle = middle;
  ctx.lineWidth = middleWidth;
  ctx.strokeText(text, 0, 0);

  ctx.strokeStyle = inner;
  ctx.lineWidth = innerWidth;
  ctx.strokeText(text, 0, 0);

  ctx.fillStyle = fill;
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function layeredEstateText(text, x, y, size, options = {}) {
  const {
    align = "center",
    weight = 900,
    fill = "#fffdf7",
    outline = "#3b4146",
    outlineWidth = Math.max(8, size * 0.075),
  } = options;

  ctx.save();
  ctx.font = font(size, weight);
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";
  ctx.miterLimit = 1.5;
  ctx.shadowColor = "rgba(0,0,0,0.18)";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = Math.max(2, size * 0.018);
  ctx.shadowOffsetY = Math.max(3, size * 0.026);

  ctx.strokeStyle = outline;
  ctx.lineWidth = outlineWidth;
  ctx.strokeText(text, x, y);

  ctx.shadowColor = "transparent";
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawTopCopy() {
  const title = getValue("title");
  const area = getValue("area");

  if (title) {
    const titleSize = fitFontSize(title, 152, W - 70);
    strokeFillText(title, 28, 205 + SAFE_TOP, titleSize, WHITE, {
      strokeWidth: 14,
      shadow: true,
    });
  }

  if (area) {
    const areaSize = fitFontSize(area, 216, W - 160);
    strokeFillText(area, W - 32, 390 + SAFE_TOP, areaSize, YELLOW, {
      align: "right",
      strokeWidth: 16,
      shadow: true,
    });
  }
}

function drawMiddleCopy() {
  const location = getValue("location");
  const layout = getValue("layout");
  const baseY = DESIGN_H - 662 + SAFE_TOP;

  if (location) {
    const locationSize = fitFontSize(location, 78, W - 34);
    strokeFillText(location, 12, baseY, locationSize, WHITE, {
      strokeWidth: 12,
    });
  }

  const layoutY = baseY + 110;
  if (layout) {
    const layoutSize = fitFontSize(layout, 76, W - 180);
    strokeFillText(layout, 18, layoutY, layoutSize, YELLOW, {
      strokeWidth: 10,
    });
  }

}

function drawEstateBoldTemplate() {
  drawGradientScrims();
  drawTopCopy();
  drawMiddleCopy();
}

function drawVarietyVisitTemplate() {
  const laugh = getValue("title");
  const main = getValue("area");
  const tag = getValue("location");
  const question = getValue("layout");

  const topScrim = ctx.createLinearGradient(0, 0, 0, 460);
  topScrim.addColorStop(0, "rgba(0,0,0,0.28)");
  topScrim.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = topScrim;
  ctx.fillRect(0, 0, W, 460);

  const bottomScrim = ctx.createLinearGradient(0, DESIGN_H - 700, 0, DESIGN_H);
  bottomScrim.addColorStop(0, "rgba(0,0,0,0)");
  bottomScrim.addColorStop(0.55, "rgba(0,0,0,0.18)");
  bottomScrim.addColorStop(1, "rgba(0,0,0,0.72)");
  ctx.fillStyle = bottomScrim;
  ctx.fillRect(0, DESIGN_H - 700, W, 700);

  if (laugh) {
    const chars = Array.from(laugh).slice(0, 5);
    const positions = [
      [92, 352, 154, -8],
      [322, 410, 106, -15],
      [502, 332, 150, -7],
      [742, 258, 160, -8],
      [910, 436, 146, 14],
    ];

    chars.forEach((char, index) => {
      const [x, y, size, angle] = positions[index];
      comicStrokeText(char, x, y + SAFE_TOP, size, WHITE, {
        angle,
        outer: "rgba(0,0,0,0.42)",
        middle: "#77746f",
        outerWidth: 13,
        middleWidth: 10,
        innerWidth: 3,
        shadowX: 6,
        shadowY: 7,
        scaleX: 0.94,
        scaleY: 1.16,
      });
    });
  }

  if (tag) {
    const tagLines = tag.split("｜").slice(0, 2);
    tagLines.forEach((line, index) => {
      comicStrokeText(line, 88, 980 + SAFE_TOP + index * 58, 43, WHITE, {
        stroke: "rgba(56,37,28,0.9)",
        outer: "rgba(35,24,20,0.36)",
        middle: "rgba(72,48,38,0.9)",
        outerWidth: 8,
        middleWidth: 5,
        innerWidth: 2,
        shadowX: 3,
        shadowY: 3,
        scaleX: 0.96,
        scaleY: 1.08,
      });
    });
  }

  if (main) {
    const mainSize = fitFontSize(main, 120, W - 28);
    comicStrokeText(main, W / 2, 1176 + SAFE_TOP, mainSize, "#d65b99", {
      align: "center",
      outer: "rgba(136,54,91,0.38)",
      middle: WHITE,
      inner: "#ffe3f1",
      outerWidth: 12,
      middleWidth: 10,
      innerWidth: 3,
      shadowX: 4,
      shadowY: 5,
      scaleX: 0.98,
      scaleY: 1.1,
    });
  }

  if (question) {
    const questionSize = fitFontSize(question, 164, W - 92);
    comicStrokeText(question, W / 2, 1354 + SAFE_TOP, questionSize, WHITE, {
      align: "center",
      outer: "rgba(115,74,47,0.36)",
      middle: "#a07754",
      inner: WHITE,
      outerWidth: 10,
      middleWidth: 7,
      innerWidth: 2,
      shadowX: 4,
      shadowY: 5,
      scaleX: 0.96,
      scaleY: 1.12,
    });
  }
}

function drawSunnyEstateTemplate() {
  const title = getValue("title");
  const detail = [getValue("area"), getValue("location"), getValue("layout")]
    .filter(Boolean)
    .join(" ");

  if (title) {
    const titleSize = fitFontSize(title, 176, W - 58);
    layeredEstateText(title, W / 2, 292 + SAFE_TOP, titleSize, {
      outlineWidth: Math.max(12, titleSize * 0.075),
    });
  }

  if (detail) {
    const detailSize = fitFontSize(detail, 80, W - 48, 900);
    layeredEstateText(detail, W / 2, 414 + SAFE_TOP, detailSize, {
      outlineWidth: Math.max(7, detailSize * 0.07),
    });
  }
}

function drawBauhausRoomTourTemplate() {
  const title = getValue("title");
  const middle = [getValue("area"), getValue("location")].filter(Boolean).join("");
  const detail = getValue("layout");
  const centerX = W / 2;

  function trackedTextWidth(text, tracking) {
    return ctx.measureText(text).width + Math.max(0, Array.from(text).length - 1) * tracking;
  }

  function drawTrackedText(text, x, y, tracking) {
    const chars = Array.from(text);
    let cursor = x - trackedTextWidth(text, tracking) / 2;
    chars.forEach((char) => {
      ctx.fillText(char, cursor, y);
      cursor += ctx.measureText(char).width + tracking;
    });
  }

  function fitSpecificFont(text, startSize, maxWidth, family, weight, tracking = 0) {
    let size = startSize;
    do {
      ctx.font = `${weight} ${size}px ${family}`;
      if (trackedTextWidth(text, tracking) <= maxWidth) return size;
      size -= 2;
    } while (size > 32);
    return size;
  }

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  if (title) {
    const upperTitle = title.toUpperCase();
    const tracking = 5;
    const titleFamily = `"Cover Optimum", "Times New Roman", serif`;
    const titleSize = fitSpecificFont(upperTitle, 140, 918, titleFamily, 700, tracking);
    ctx.save();
    ctx.translate(536, 576 + SAFE_TOP);
    ctx.font = `700 ${titleSize}px ${titleFamily}`;
    ctx.fillStyle = "#173c80";
    drawTrackedText(upperTitle, 0, 0, tracking);
    ctx.restore();
  }

  if (middle) {
    const middleFamily = `"Cover ShuHei", "Noto Sans SC", sans-serif`;
    const middleSize = fitSpecificFont(middle, 92, 884, middleFamily, 700);
    ctx.save();
    ctx.translate(548, 758 + SAFE_TOP);
    ctx.font = `700 ${middleSize}px ${middleFamily}`;
    ctx.fillStyle = "#a8dcfa";
    ctx.fillText(middle, 0, 0);
    ctx.restore();
  }

  if (detail) {
    const detailFamily = `"Cover PangMen", "Noto Sans SC", sans-serif`;
    const detailSize = fitSpecificFont(detail, 164, 520, detailFamily, 400);
    ctx.save();
    ctx.translate(1000, 958 + SAFE_TOP);
    ctx.font = `400 ${detailSize}px ${detailFamily}`;
    ctx.textAlign = "right";
    ctx.lineJoin = "miter";
    ctx.miterLimit = 2;

    ctx.fillStyle = "rgba(45,38,33,0.34)";
    ctx.fillText(detail, 3, 4);
    ctx.strokeStyle = "#fffdf8";
    ctx.lineWidth = 2;
    ctx.strokeText(detail, 0, 0);
    ctx.fillStyle = "#fffdf8";
    ctx.fillText(detail, 0, 0);
    ctx.restore();
  }

  ctx.restore();
}

function drawDutchCubeTemplate() {
  const topTitle = getValue("title");
  const tag = getValue("area");
  const location = Array.from(getValue("location"));
  const headline = Array.from(getValue("layout"));
  const splitAt = Math.min(3, headline.length);
  const headlineLine1 = headline.slice(0, splitAt).join("");
  const headlineLine2 = headline.slice(splitAt).join("");
  const white = "#fffef9";
  const yellow = "#efb31a";

  function fitDutchFont(text, startSize, maxWidth, family, weight) {
    let size = startSize;
    do {
      ctx.font = `${weight} ${size}px ${family}`;
      if (ctx.measureText(text).width <= maxWidth) return size;
      size -= 2;
    } while (size > 30);
    return size;
  }

  ctx.save();
  ctx.textBaseline = "alphabetic";
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  if (topTitle) {
    const family = `"Cover PangMen", "Noto Sans SC", sans-serif`;
    const size = fitDutchFont(topTitle, 116, 1000, family, 400);
    ctx.font = `400 ${size}px ${family}`;
    ctx.textAlign = "center";
    ctx.lineJoin = "miter";
    ctx.fillStyle = "rgba(41,47,53,0.42)";
    ctx.fillText(topTitle, 544, 151 + SAFE_TOP);
    ctx.fillStyle = white;
    ctx.fillText(topTitle, 536, 143 + SAFE_TOP);
  }

  ctx.strokeStyle = "rgba(255,255,255,0.96)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(60, 170 + SAFE_TOP);
  ctx.lineTo(1022, 170 + SAFE_TOP);
  ctx.stroke();

  if (tag) {
    const family = `"Noto Sans SC", "Microsoft YaHei", sans-serif`;
    const size = fitDutchFont(tag, 54, 568, family, 900);
    ctx.font = `900 ${size}px ${family}`;
    const tagWidth = Math.max(590, ctx.measureText(tag).width + 58);
    ctx.fillStyle = "rgba(4,5,6,0.96)";
    ctx.beginPath();
    ctx.roundRect(126, 372 + SAFE_TOP, tagWidth, 92, 42);
    ctx.fill();
    ctx.fillStyle = white;
    ctx.textAlign = "left";
    ctx.fillText(tag, 153, 438 + SAFE_TOP);
  }

  if (location.length) {
    const family = `"Cover ShuHei", "Noto Sans SC", sans-serif`;
    ctx.font = `700 98px ${family}`;
    ctx.textAlign = "center";
    ctx.fillStyle = white;
    location.slice(0, 2).forEach((char, index) => {
      ctx.fillText(char, 203, 580 + SAFE_TOP + index * 104);
    });

  }

  function drawHeadlineLine(text, x, y, maxWidth, accentFirst) {
    if (!text) return;
    const family = `"Cover ShuHei", "Noto Sans SC", sans-serif`;
    const size = fitDutchFont(text, 170, maxWidth, family, 700);
    ctx.font = `700 ${size}px ${family}`;
    ctx.textAlign = "left";
    ctx.lineJoin = "miter";
    ctx.miterLimit = 2;

    ctx.fillStyle = "rgba(172,114,0,0.7)";
    ctx.fillText(text, x + 10, y + 11);

    let cursor = x;
    Array.from(text).forEach((char, index) => {
      ctx.fillStyle = accentFirst && index === 0 ? yellow : white;
      ctx.fillText(char, cursor, y);
      cursor += ctx.measureText(char).width;
    });
  }

  drawHeadlineLine(headlineLine1, 132, 860 + SAFE_TOP, 850, true);
  drawHeadlineLine(headlineLine2, 132, 1055 + SAFE_TOP, 860, false);
  ctx.restore();
}

function drawCuteCarouselTemplate() {
  const eyebrow = getValue("title");
  const main = getValue("area");
  const sub = getValue("location");
  const white = "#fffaf0";
  const family = `"Cover Zcool Happy", "Cover Xiaolai", "Microsoft YaHei", sans-serif`;

  function fitCuteFont(text, startSize, maxWidth, tracking = 0) {
    let size = startSize;
    do {
      ctx.font = `400 ${size}px ${family}`;
      const width = ctx.measureText(text).width + Math.max(0, Array.from(text).length - 1) * tracking;
      if (width <= maxWidth) return size;
      size -= 2;
    } while (size > 28);
    return size;
  }

  function trackedTextWidth(text, tracking) {
    return ctx.measureText(text).width + Math.max(0, Array.from(text).length - 1) * tracking;
  }

  function drawTrackedFill(text, x, y, size, tracking = 0) {
    const chars = Array.from(text);
    ctx.font = `400 ${size}px ${family}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    let cursor = x - trackedTextWidth(text, tracking) / 2;
    chars.forEach((char) => {
      ctx.fillText(char, cursor, y);
      cursor += ctx.measureText(char).width + tracking;
    });
  }

  function drawCuteLine(text, x, y, startSize, maxWidth, tracking = 0, angle = 0) {
    if (!text) return;
    const size = fitCuteFont(text, startSize, maxWidth, tracking);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;
    ctx.shadowColor = "rgba(70,45,30,0.32)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 6;
    ctx.strokeStyle = "rgba(106,76,58,0.82)";
    ctx.lineWidth = Math.max(6, size * 0.048);
    ctx.font = `400 ${size}px ${family}`;
    ctx.textAlign = "center";
    ctx.strokeText(text, 0, 0);
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(255,250,240,0.98)";
    ctx.lineWidth = Math.max(1.5, size * 0.012);
    ctx.strokeText(text, 0, 0);
    ctx.fillStyle = white;
    drawTrackedFill(text, 0, 0, size, tracking);
    ctx.restore();
  }

  function drawSparkle(x, y, r, angle = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.fillStyle = white;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(r * 0.18, -r * 0.18, r, 0);
    ctx.quadraticCurveTo(r * 0.18, r * 0.18, 0, r);
    ctx.quadraticCurveTo(-r * 0.18, r * 0.18, -r, 0);
    ctx.quadraticCurveTo(-r * 0.18, -r * 0.18, 0, -r);
    ctx.fill();
    ctx.restore();
  }

  function drawSmallCross(x, y, r, angle = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.strokeStyle = white;
    ctx.lineWidth = Math.max(5, r * 0.32);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-r, 0);
    ctx.lineTo(r, 0);
    ctx.moveTo(0, -r);
    ctx.lineTo(0, r);
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const dark = ctx.createLinearGradient(0, 0, 0, DESIGN_H);
  dark.addColorStop(0, "rgba(0,0,0,0.30)");
  dark.addColorStop(0.42, "rgba(0,0,0,0.22)");
  dark.addColorStop(1, "rgba(0,0,0,0.06)");
  ctx.fillStyle = dark;
  ctx.fillRect(0, 0, W, DESIGN_H);

  const vignette = ctx.createRadialGradient(W / 2, 720, 120, W / 2, 760, 940);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.30)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, DESIGN_H);

  drawCuteLine(eyebrow, W / 2, 292 + SAFE_TOP, 98, 820, 2, -1.2);
  drawCuteLine(main, W / 2, 486 + SAFE_TOP, 162, 880, 2, 0.7);
  drawCuteLine(sub, W / 2, 666 + SAFE_TOP, 136, 860, 2, -0.6);

  drawSmallCross(398, 842 + SAFE_TOP, 15, 42);
  drawSparkle(512, 784 + SAFE_TOP, 30, 8);
  drawSparkle(436, 908 + SAFE_TOP, 20, -12);
  drawSmallCross(362, 1002 + SAFE_TOP, 9, 34);
  drawSparkle(316, 1068 + SAFE_TOP, 9, 0);
  drawSparkle(464, 1052 + SAFE_TOP, 12, 10);
  ctx.restore();
}

function drawAvatar(x, y, r) {
  const grd = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
  grd.addColorStop(0, "#ffc936");
  grd.addColorStop(0.55, "#ff9f1c");
  grd.addColorStop(1, "#fff2c8");
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#171717";
  ctx.beginPath();
  ctx.arc(x - 8, y - 4, 13, 0, Math.PI * 2);
  ctx.arc(x + 13, y - 5, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x - 4, y - 4, 22, 0.15, Math.PI * 1.15);
  ctx.stroke();
}

function wrapText(text, x, y, maxWidth, lineHeight, maxLines) {
  const chars = Array.from(text);
  let line = "";
  let lines = [];

  chars.forEach((char) => {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = char;
    } else {
      line = testLine;
    }
  });

  if (line) lines.push(line);
  lines = lines.slice(0, maxLines);

  if (lines.length === maxLines && ctx.measureText(lines[maxLines - 1]).width > maxWidth - 28) {
    let last = lines[maxLines - 1];
    while (last.length > 0 && ctx.measureText(`${last}...`).width > maxWidth) {
      last = last.slice(0, -1);
    }
    lines[maxLines - 1] = `${last}...`;
  }

  lines.forEach((textLine, index) => ctx.fillText(textLine, x, y + index * lineHeight));
}

function render() {
  ctx.clearRect(0, 0, W, H);
  const templateId = getTemplateId();

  ctx.save();
  ctx.translate(0, -CROP_Y);

  drawCoverImage();

  if (templateId === "varietyVisit") {
    drawVarietyVisitTemplate();
  } else if (templateId === "sunnyEstate") {
    drawSunnyEstateTemplate();
  } else if (templateId === "bauhausRoomTour") {
    drawBauhausRoomTourTemplate();
  } else if (templateId === "dutchCube") {
    drawDutchCubeTemplate();
  } else if (templateId === "cuteCarousel") {
    drawCuteCarouselTemplate();
  } else {
    drawEstateBoldTemplate();
  }

  ctx.restore();
}

function loadImage(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      state.image = img;
      render();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

refs.imageInput.addEventListener("change", (event) => {
  loadImage(event.target.files[0]);
});

refs.template.addEventListener("change", () => {
  applyTemplateDefaults(getTemplateId());
});

Object.values(refs).forEach((element) => {
  if (!element || element === refs.imageInput || element === refs.download || element === refs.template) return;
  element.addEventListener("input", render);
  element.addEventListener("change", render);
});

refs.download.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `房源封面-${Date.now()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
});

render();

async function loadCoverFonts() {
  if (!document.fonts?.load) return;
  await Promise.all([
    document.fonts.load('700 150px "Cover Optimum"', "ROOM TOUR"),
    document.fonts.load('700 110px "Cover ShuHei"', "17W日式中古风"),
    document.fonts.load('400 180px "Cover PangMen"', "详解版"),
    document.fonts.load('400 140px "Cover Poetsen"', "CAROUSEL"),
    document.fonts.load('400 150px "Cover StarPanda"', "可爱轮播图"),
    document.fonts.load('400 110px "Cover Xiaolai"', "动画教程"),
    document.fonts.load('800 150px "Cover FangYuan"', "可爱轮播图"),
    document.fonts.load('400 150px "Cover Zcool Happy"', "可爱轮播图"),
  ]);
  render();
}

loadCoverFonts();
