const canvas = document.getElementById("coverCanvas");
const ctx = canvas.getContext("2d");

const refs = {
  imageInput: document.getElementById("imageInput"),
  template: document.getElementById("templateSelect"),
  templateGallery: document.getElementById("templateGallery"),
  title: document.getElementById("titleInput"),
  area: document.getElementById("areaInput"),
  location: document.getElementById("locationInput"),
  layout: document.getElementById("layoutInput"),
  download: document.getElementById("downloadBtn"),
};

const state = {
  image: null,
  defaultImage: null,
};

const templateDefaults = {
  estateBold: {
    title: "客厅会说话",
    area: "一家人的餐桌",
    location: "沙发旁 · 留出奔跑距离",
    layout: "两间房各有生活",
    caption: "国贸 CBD·78 m²一居｜一镜到底 Room Tour 国贸核心...",
    account: "安家在北京（瑞峰）",
    date: "2025-09-05",
    likes: "388",
    bottomCard: true,
  },
  varietyVisit: {
    title: "看房看生活",
    area: "跟着一家人的一天",
    location: "客厅奔跑｜餐桌慢慢聊天",
    layout: "住起来怎样？",
    caption: "新家 Roomtour｜《超想迷你家》拍摄的一天 欢迎 @...",
    account: "李外里",
    date: "01-13",
    likes: "219",
    bottomCard: true,
  },
  sunnyEstate: {
    title: "阳光走进家",
    area: "#落地窗旁晒被子",
    location: "一家人围坐#",
    layout: "",
    caption: "市委家属院｜板楼带电梯｜三个阳台采光好",
    account: "城市好房",
    date: "2026-07-09",
    likes: "168",
    bottomCard: false,
  },
  bauhausRoomTour: {
    title: "跟着生活看房",
    area: "饭桌够大",
    location: "沙发留白",
    layout: "动线会说话",
    caption: "17W日式中古风｜Room Tour 详解版",
    account: "我的中古之家",
    date: "2026-07-09",
    likes: "1688",
    bottomCard: false,
  },
  dutchCube: {
    title: "看懂家的尺度",
    area: "长沙发留出奔跑距离",
    location: "一起住",
    layout: "相聚不用挪家具",
    caption: "荷兰激进的住宅设计… 荷兰鹿特丹方块住宅和铅笔公寓",
    account: "建筑师黄伟",
    date: "2025-12-09",
    likes: "769",
    bottomCard: true,
  },
  cuteCarousel: {
    title: "第一次看懂家",
    area: "看见生活动线",
    location: "空间笔记",
    layout: "",
    caption: "小清新轮播图动画教程",
    account: "设计小笔记",
    date: "2026-07-10",
    likes: "520",
    bottomCard: false,
  },
  comicLivingRoom: {
    title: "开跑！",
    area: "这间客厅装得下童年！",
    location: "长沙发 · 留出奔跑距离",
    layout: "孩子奔跑｜大人聊天｜狗狗打盹",
  },
  smartHomeBlocks: {
    title: "当空间留给",
    area: "一起生活",
    location: "客厅装下一家人",
    layout: "沙发之外还有奔跑",
  },
  editorialDay: {
    title: "今日生活实录",
    area: "孩子奔跑｜一家吃饭",
    location: "镜头看见真实生活",
    layout: "家具尺度 · 空间关系",
  },
  viralRoast: {
    title: "这间客厅要看",
    area: "沙发没有占满空间",
    location: "孩子跑得开",
    layout: "才叫客厅",
  },
  greenEstatePoster: {
    title: "生活上新",
    area: "长沙发留出了奔跑的距离",
    location: "客厅会玩",
    layout: "孩子奔跑｜朋友围坐｜阳光晒被",
  },
  cityMagazine: {
    title: "城市生活",
    area: "一桌三餐",
    location: "回家就开饭",
    layout: "岛台备菜｜餐桌聊天",
  },
  yellowFramePoster: {
    title: "#生活",
    area: "看房先看怎么住",
    location: "空间观察",
    layout: "家具尺度｜生活动线",
  },
  blueMorningMagazine: {
    title: "一家吃饭|孩子奔跑",
    area: "客厅留出生活",
    location: "沙发之外有路",
    layout: "餐桌聊天｜阳台晒被",
  },
  retroOrangeGreen: {
    title: "长沙发旁",
    area: "留出奔跑距离",
    location: "跑得开的童年",
    layout: "孩子奔跑｜一家围坐",
  },
  whiteFrameCity: {
    title: "客厅尺度",
    area: "决定一家怎么相处",
    location: "沙发旁留出路",
    layout: "孩子奔跑｜家人聊天",
  },
  propertyPostcard: {
    title: "住进",
    area: "日常生活",
    location: "一起吃饭|孩子写作业|朋友坐到深夜",
    layout: "岛台备菜｜餐桌聊天｜阳台晒被",
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

  const titleSplitHint = document.getElementById("titleSplitHint");
  if (titleSplitHint) {
    titleSplitHint.hidden = templateId !== "blueMorningMagazine";
  }
  const locationSplitHint = document.getElementById("locationSplitHint");
  if (locationSplitHint) {
    locationSplitHint.hidden = templateId !== "propertyPostcard";
  }

  Object.entries(defaults).forEach(([key, value]) => {
    if (key !== "bottomCard" && refs[key]) {
      refs[key].value = value;
    }
  });
  render();
  syncTemplateCards();
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

function drawComicLivingRoomTemplate() {
  const kicker = getValue("title");
  const headline = getValue("area");
  const info = getValue("location");
  const features = getValue("layout")
    .split(/[｜|、，,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);
  const family = `"Cover ShuHei", "Cover Zcool Cool Black", "Microsoft YaHei", sans-serif`;

  function fitComicFont(text, startSize, maxWidth) {
    let size = startSize;
    do {
      ctx.font = `700 ${size}px ${family}`;
      if (ctx.measureText(text).width <= maxWidth) return size;
      size -= 3;
    } while (size > 38);
    return size;
  }

  function comicText(text, x, y, startSize, maxWidth, fill, angle = 0, align = "center") {
    if (!text) return;
    const size = fitComicFont(text, startSize, maxWidth);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.font = `700 ${size}px ${family}`;
    ctx.textAlign = align;
    ctx.textBaseline = "alphabetic";
    ctx.lineJoin = "round";
    ctx.shadowColor = "rgba(0,0,0,0.9)";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 12;
    ctx.strokeStyle = "#050505";
    ctx.lineWidth = Math.max(14, size * 0.105);
    ctx.strokeText(text, 0, 0);
    ctx.fillStyle = fill;
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }

  function burstPath(x, y, width, height) {
    const points = [
      [0.04, 0.16], [0.12, 0.14], [0.10, 0.06], [0.22, 0.10], [0.29, 0.02],
      [0.39, 0.09], [0.50, 0.00], [0.58, 0.09], [0.70, 0.03], [0.76, 0.13],
      [0.91, 0.08], [0.89, 0.21], [0.99, 0.27], [0.93, 0.38], [1.00, 0.48],
      [0.92, 0.57], [0.98, 0.70], [0.88, 0.74], [0.92, 0.88], [0.78, 0.85],
      [0.69, 0.98], [0.58, 0.89], [0.48, 1.00], [0.39, 0.89], [0.26, 0.97],
      [0.21, 0.84], [0.07, 0.89], [0.11, 0.73], [0.01, 0.67], [0.08, 0.55],
      [0.00, 0.44], [0.09, 0.35], [0.01, 0.27],
    ];
    ctx.beginPath();
    points.forEach(([px, py], index) => {
      const pointX = x + px * width;
      const pointY = y + py * height;
      if (index === 0) ctx.moveTo(pointX, pointY);
      else ctx.lineTo(pointX, pointY);
    });
    ctx.closePath();
  }

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const edgeWash = ctx.createRadialGradient(W / 2, 780, 260, W / 2, 780, 980);
  edgeWash.addColorStop(0, "rgba(255,255,255,0)");
  edgeWash.addColorStop(0.72, "rgba(255,255,255,0.05)");
  edgeWash.addColorStop(1, "rgba(255,255,255,0.68)");
  ctx.fillStyle = edgeWash;
  ctx.fillRect(0, 0, W, 1500);

  ctx.strokeStyle = "rgba(10,10,10,0.72)";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  const lineYs = [90, 155, 230, 315, 410, 520, 640, 770, 900, 1040, 1180, 1320];
  lineYs.forEach((lineY, index) => {
    const inset = 58 + (index % 4) * 19;
    ctx.beginPath();
    ctx.moveTo(0, lineY - 72);
    ctx.lineTo(inset, lineY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(W, lineY - 88);
    ctx.lineTo(W - inset, lineY + 5);
    ctx.stroke();
  });

  burstPath(58, 150, 964, 980);
  ctx.fillStyle = "rgba(255,255,255,0.96)";
  ctx.fill();
  ctx.strokeStyle = "#090909";
  ctx.lineWidth = 9;
  ctx.lineJoin = "round";
  ctx.stroke();

  comicText(kicker, 300, 430, 185, 470, "#ffe21b", -3);

  const chars = Array.from(headline);
  const splitAt = Math.max(1, Math.ceil(chars.length / 2));
  const firstLine = chars.slice(0, splitAt).join("");
  const secondLine = chars.slice(splitAt).join("");
  comicText(firstLine, W / 2, 670, 158, 820, "#ff8514", 1);
  comicText(secondLine, W / 2, 875, 172, 840, "#ff9d12", -1);

  if (info) {
    const infoSize = fitComicFont(info, 61, 800);
    ctx.save();
    ctx.translate(W / 2, 1005);
    ctx.rotate((-2 * Math.PI) / 180);
    ctx.font = `700 ${infoSize}px "Microsoft YaHei", sans-serif`;
    const infoWidth = Math.min(890, ctx.measureText(info).width + 70);
    ctx.fillStyle = "#050505";
    ctx.fillRect(-infoWidth / 2, -62, infoWidth, 94);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(info, 0, 8);
    ctx.restore();
  }

  const tagY = 1395;
  const tagGap = 24;
  const tagWidth = features.length === 1 ? 430 : features.length === 2 ? 390 : 292;
  const totalWidth = features.length * tagWidth + Math.max(0, features.length - 1) * tagGap;
  features.forEach((feature, index) => {
    const centerX = (W - totalWidth) / 2 + tagWidth / 2 + index * (tagWidth + tagGap);
    const angle = [-4, 2, -3][index] || 0;
    const size = fitComicFont(feature, 58, tagWidth - 40);
    ctx.save();
    ctx.translate(centerX, tagY + (index % 2) * 24);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#090909";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(-tagWidth / 2 - 18, -54);
    ctx.lineTo(-tagWidth / 2 + 4, -78);
    ctx.lineTo(-tagWidth / 2 + 26, -58);
    ctx.lineTo(tagWidth / 2 - 8, -70);
    ctx.lineTo(tagWidth / 2 + 18, -40);
    ctx.lineTo(tagWidth / 2 + 5, 62);
    ctx.lineTo(-tagWidth / 2 - 12, 56);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffd51c";
    ctx.fillRect(-tagWidth / 2, -52, tagWidth, 104);
    ctx.strokeRect(-tagWidth / 2, -52, tagWidth, 104);
    ctx.font = `700 ${size}px ${family}`;
    ctx.fillStyle = "#090909";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(feature, 0, 3);
    ctx.restore();
  });
  ctx.restore();
}

function drawSmartHomeBlocksTemplate() {
  const topLine = getValue("title");
  const topSecondLine = getValue("area");
  const bottomLine = getValue("location");
  const bottomSecondLine = getValue("layout");
  const family = `"Cover ShuHei", "Cover PangMen", "Microsoft YaHei", sans-serif`;
  const orange = "#ff8500";
  const cyan = "#09c9e6";

  function fitBlockFont(text, startSize, maxWidth) {
    let size = startSize;
    do {
      ctx.font = `700 ${size}px ${family}`;
      if (ctx.measureText(text).width <= maxWidth) return size;
      size -= 3;
    } while (size > 38);
    return size;
  }

  function drawBlockLine(text, anchorX, centerY, startSize, maxWidth, color, align) {
    if (!text) return;
    const size = fitBlockFont(text, startSize, maxWidth - 72);
    ctx.save();
    ctx.font = `700 ${size}px ${family}`;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    const textWidth = ctx.measureText(text).width;
    const horizontalPadding = Math.max(30, size * 0.16);
    const verticalPadding = Math.max(18, size * 0.12);
    const blockWidth = textWidth + horizontalPadding * 2;
    const blockHeight = size + verticalPadding * 2;
    const blockX = align === "right" ? anchorX - blockWidth : anchorX;
    const blockY = centerY - blockHeight / 2;
    const opticalTextY = centerY - size * 0.035;

    ctx.fillStyle = color;
    ctx.fillRect(blockX, blockY, blockWidth, blockHeight);
    ctx.fillStyle = "#050505";
    ctx.fillText(
      text,
      align === "right" ? anchorX - horizontalPadding : anchorX + horizontalPadding,
      opticalTextY,
    );
    ctx.restore();
  }

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  drawBlockLine(topLine, 28, 432, 150, 860, orange, "left");
  drawBlockLine(topSecondLine, 28, 617, 150, 740, orange, "left");
  drawBlockLine(bottomLine, W - 36, 1294, 100, 620, cyan, "right");
  drawBlockLine(bottomSecondLine, W - 36, 1443, 92, 840, cyan, "right");

  ctx.restore();
}

function drawEditorialDayTemplate() {
  const kicker = getValue("title");
  const headlineLines = getValue("area")
    .split(/[｜|]+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 2);
  const role = getValue("location");
  const footer = getValue("layout");
  const serif = `"Cover Instrument", "Cover Cormorant", "Times New Roman", serif`;
  const sans = `"Cover Smiley Sans", Arial, sans-serif`;
  const orange = "#f04a16";
  const labelOrange = "#ff9d12";

  function fitEditorialFont(text, startSize, maxWidth, family, weight = 400) {
    let size = startSize;
    do {
      ctx.font = `${weight} ${size}px ${family}`;
      if (ctx.measureText(text).width <= maxWidth) return size;
      size -= 3;
    } while (size > 34);
    return size;
  }

  function drawBurst(cx, cy, innerRadius, outerRadius, points) {
    ctx.beginPath();
    for (let index = 0; index < points * 2; index += 1) {
      const angle = -Math.PI / 2 + (index * Math.PI) / points;
      const radius = index % 2 === 0 ? outerRadius : innerRadius;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.fillStyle = "rgba(76,52,36,0.22)";
  ctx.fillRect(24, 150, W - 48, 1380);

  drawBurst(300, 520, 205, 350, 13);
  ctx.fillStyle = orange;
  ctx.fill();

  if (kicker) {
    const kickerSize = fitEditorialFont(kicker, 76, 760, sans, 700);
    ctx.save();
    ctx.translate(138, 500);
    ctx.rotate((-4 * Math.PI) / 180);
    ctx.font = `700 ${kickerSize}px ${sans}`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(kicker.toUpperCase(), 0, 0);
    ctx.restore();
  }

  const lines = headlineLines.length ? headlineLines : ["DAY IN", "MY LIFE"];
  lines.forEach((line, index) => {
    const size = fitEditorialFont(line, index === 0 ? 230 : 246, 820, serif, 400);
    ctx.save();
    ctx.translate(610, 735 + index * 235);
    ctx.rotate((-3.5 * Math.PI) / 180);
    ctx.font = `400 ${size}px ${serif}`;
    ctx.fillStyle = "#fffdf8";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(line, 0, 0);
    ctx.restore();
  });

  if (role) {
    const words = role.toUpperCase().split(/\s+/).filter(Boolean);
    const splitAt = Math.max(1, Math.ceil(words.length / 2));
    const roleLines = [words.slice(0, splitAt).join(" "), words.slice(splitAt).join(" ")].filter(Boolean);
    ctx.save();
    ctx.translate(705, 1215);
    ctx.strokeStyle = labelOrange;
    ctx.lineWidth = 10;
    ctx.strokeRect(-290, -92, 580, 184);
    ctx.fillStyle = labelOrange;
    ctx.fillRect(-280, -82, 560, 164);
    roleLines.forEach((line, index) => {
      const size = fitEditorialFont(line, 65, 520, sans, 700);
      ctx.font = `700 ${size}px ${sans}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      ctx.strokeStyle = orange;
      ctx.lineWidth = 5;
      ctx.strokeText(line, 0, -40 + index * 78);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(line, 0, -40 + index * 78);
    });
    ctx.restore();
  }

  if (footer) {
    const footerSize = fitEditorialFont(footer, 48, 660, sans, 700);
    ctx.font = `700 ${footerSize}px ${sans}`;
    ctx.fillStyle = "#fffdf8";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(footer.toUpperCase(), 92, 1490);
  }

  ctx.restore();
}

function drawViralRoastTemplate() {
  const topLine = getValue("title");
  const mainLine = getValue("area");
  const reactionLine = getValue("location");
  const questionLine = getValue("layout");
  const family = `"Cover ShuHei", "Cover Zcool Cool Black", "Microsoft YaHei", sans-serif`;
  const yellow = "#ffd20a";
  const white = "#ffffff";

  function fitImpactFont(text, startSize, maxWidth) {
    let size = startSize;
    do {
      ctx.font = `700 ${size}px ${family}`;
      if (ctx.measureText(text).width <= maxWidth) return size;
      size -= 3;
    } while (size > 42);
    return size;
  }

  function drawImpactLine(text, centerX, baselineY, startSize, maxWidth, options = {}) {
    if (!text) return;
    const { baseFill = white, highlightLast = 0, angle = 0 } = options;
    const size = fitImpactFont(text, startSize, maxWidth - 70);
    ctx.save();
    ctx.translate(centerX, baselineY);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.font = `700 ${size}px ${family}`;
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "center";
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;

    ctx.shadowColor = "rgba(0,0,0,0.82)";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 13;
    ctx.strokeStyle = white;
    ctx.lineWidth = Math.max(22, size * 0.17);
    ctx.strokeText(text, 0, 0);

    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "#050505";
    ctx.lineWidth = Math.max(13, size * 0.1);
    ctx.strokeText(text, 0, 0);

    const chars = Array.from(text);
    const textWidth = ctx.measureText(text).width;
    let cursor = -textWidth / 2;
    ctx.textAlign = "left";
    chars.forEach((char, index) => {
      ctx.fillStyle = highlightLast > 0 && index >= chars.length - highlightLast ? yellow : baseFill;
      ctx.fillText(char, cursor, 0);
      cursor += ctx.measureText(char).width;
    });
    ctx.restore();
  }

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const topShade = ctx.createLinearGradient(0, 120, 0, 760);
  topShade.addColorStop(0, "rgba(0,0,0,0.10)");
  topShade.addColorStop(0.65, "rgba(0,0,0,0.04)");
  topShade.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = topShade;
  ctx.fillRect(0, 100, W, 700);

  drawImpactLine(topLine, W / 2, 465, 154, 930, { baseFill: white, angle: -1 });
  drawImpactLine(mainLine, W / 2, 655, 184, 950, { baseFill: yellow, angle: 0.5 });
  drawImpactLine(reactionLine, 690, 1010, 124, 720, { baseFill: white, highlightLast: 2, angle: 1 });
  drawImpactLine(questionLine, 700, 1180, 170, 650, {
    baseFill: white,
    highlightLast: Math.max(1, Array.from(questionLine).length - 1),
    angle: -1,
  });

  ctx.restore();
}

function drawGreenEstatePosterTemplate() {
  const title = getValue("title");
  const subtitle = getValue("area");
  const tag = getValue("location");
  const sellingPoints = getValue("layout").split(/[｜|]/).filter(Boolean).slice(0, 3);
  const displayFamily = `"Cover ShuHei", "Cover PangMen", "Microsoft YaHei", sans-serif`;
  const yellow = "#f0dc00";

  function fitPosterFont(text, startSize, maxWidth, minSize = 38) {
    let size = startSize;
    while (size > minSize) {
      ctx.font = `700 ${size}px ${displayFamily}`;
      if (ctx.measureText(text).width <= maxWidth) break;
      size -= 3;
    }
    return size;
  }

  ctx.save();

  const titleSize = fitPosterFont(title, 270, 970, 120);
  ctx.font = `700 ${titleSize}px ${displayFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = yellow;
  ctx.fillText(title, W / 2, 545);

  const subtitleSize = fitPosterFont(subtitle, 54, 960, 34);
  ctx.font = `700 ${subtitleSize}px ${displayFamily}`;
  ctx.fillText(subtitle, W / 2, 735);

  const pillWidth = Math.min(390, Math.max(250, tag.length * 62 + 80));
  ctx.fillStyle = yellow;
  ctx.beginPath();
  ctx.roundRect(46, 835, pillWidth, 86, 28);
  ctx.fill();
  const tagSize = fitPosterFont(tag, 60, pillWidth - 58, 32);
  ctx.font = `700 ${tagSize}px ${displayFamily}`;
  ctx.fillStyle = "#101710";
  ctx.fillText(tag, 46 + pillWidth / 2, 880);

  if (sellingPoints.length) {
    ctx.save();
    ctx.translate(565, 1350);
    ctx.rotate((-2 * Math.PI) / 180);
    ctx.fillStyle = yellow;
    ctx.beginPath();
    ctx.roundRect(-300, -185, 600, 370, 22);
    ctx.fill();
    ctx.strokeStyle = "rgba(15,22,12,0.8)";
    ctx.lineWidth = 5;
    ctx.stroke();

    const lineHeight = 92;
    const blockHeight = sellingPoints.length * lineHeight;
    sellingPoints.forEach((line, index) => {
      const size = fitPosterFont(line, 76, 520, 42);
      ctx.font = `700 ${size}px ${displayFamily}`;
      ctx.fillStyle = "#111711";
      ctx.fillText(line, 0, -blockHeight / 2 + lineHeight / 2 + index * lineHeight);
    });
    ctx.restore();
  }

  ctx.restore();
}

function drawCityMagazineTemplate() {
  const title = getValue("title");
  const feature = getValue("area");
  const location = getValue("location");
  const details = getValue("layout");
  const sans = `"Cover PangMen", "Cover ShuHei", "Cover Optimum", "Microsoft YaHei", sans-serif`;
  const bodySans = `"Cover ShuHei", "Microsoft YaHei", sans-serif`;
  const cyan = "#08a8d6";
  const yellow = "#ffd20a";

  function fitMagazineFont(text, startSize, maxWidth, minSize = 34, weight = 700) {
    let size = startSize;
    while (size > minSize) {
      ctx.font = `${weight} ${size}px ${sans}`;
      if (ctx.measureText(text).width <= maxWidth) break;
      size -= 3;
    }
    return size;
  }

  ctx.save();
  ctx.textBaseline = "middle";

  const titleSize = fitMagazineFont(title, 250, 1030, 110);
  ctx.font = `700 ${titleSize}px ${sans}`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText(title, W / 2, 405);

  ctx.save();
  ctx.translate(W / 2, 1020);
  ctx.rotate((-7 * Math.PI) / 180);
  ctx.fillStyle = yellow;
  ctx.fillRect(-620, -195, 1240, 390);

  const featureSize = fitMagazineFont(feature, 260, 1030, 110);
  ctx.font = `700 ${featureSize}px ${sans}`;
  ctx.fillStyle = cyan;
  ctx.textAlign = "center";
  ctx.fillText(feature, 0, -58);

  let detailSize = 42;
  do {
    ctx.font = `700 ${detailSize}px ${bodySans}`;
    if (ctx.measureText(details).width <= 940) break;
    detailSize -= 2;
  } while (detailSize > 26);
  ctx.fillStyle = "#111111";
  ctx.fillText(details, 0, 128);
  ctx.restore();

  ctx.textAlign = "right";
  ctx.fillStyle = yellow;
  const locationSize = fitMagazineFont(location, 52, 510, 32);
  ctx.font = `700 ${locationSize}px ${sans}`;
  ctx.fillText(location, W - 42, 1515);

  ctx.restore();
}

function drawYellowFramePosterTemplate() {
  const title = getValue("title");
  const subtitle = getValue("area");
  const label = getValue("location");
  const description = getValue("layout");
  const displayFamily = `"Cover PangMen", "Cover ShuHei", "Microsoft YaHei", sans-serif`;
  const bodyFamily = `"Cover ShuHei", "Microsoft YaHei", sans-serif`;
  const yellow = "#ffdc08";
  const posterX = 62;
  const posterY = 260;
  const posterW = 956;
  const posterH = 1365;
  const frame = 30;
  const photoH = 865;

  function fitYellowPosterFont(text, startSize, maxWidth, minSize = 32, family = displayFamily) {
    let size = startSize;
    while (size > minSize) {
      ctx.font = `700 ${size}px ${family}`;
      if (ctx.measureText(text).width <= maxWidth) break;
      size -= 3;
    }
    return size;
  }

  function drawImageCoverInRect(x, y, width, height) {
    if (!state.image) return;
    const img = state.image;
    const scale = Math.max(width / img.width, height / img.height);
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;
    const drawX = x + (width - drawWidth) / 2;
    const drawY = y + (height - drawHeight) / 2;
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }

  ctx.save();

  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 18;
  ctx.fillStyle = yellow;
  ctx.beginPath();
  ctx.roundRect(posterX, posterY, posterW, posterH, 18);
  ctx.fill();
  ctx.shadowColor = "transparent";

  const photoX = posterX + frame;
  const photoY = posterY + frame;
  const photoW = posterW - frame * 2;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, 8);
  ctx.clip();
  drawImageCoverInRect(photoX, photoY, photoW, photoH);
  ctx.restore();

  const copyTop = photoY + photoH + 28;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#101820";
  const titleSize = fitYellowPosterFont(title, 190, posterW - 80, 90);
  ctx.font = `700 ${titleSize}px ${displayFamily}`;
  ctx.fillText(title, W / 2, copyTop + 105);

  const subtitleSize = fitYellowPosterFont(subtitle, 66, posterW - 100, 36, bodyFamily);
  ctx.font = `700 ${subtitleSize}px ${bodyFamily}`;
  ctx.fillText(subtitle, W / 2, copyTop + 245);

  ctx.strokeStyle = "rgba(16,24,32,0.72)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(posterX + 55, copyTop + 310);
  ctx.lineTo(posterX + posterW - 55, copyTop + 310);
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.font = `700 39px ${bodyFamily}`;
  ctx.fillText(label, posterX + 55, copyTop + 350);
  const descriptionSize = fitYellowPosterFont(description, 34, 570, 24, bodyFamily);
  ctx.font = `700 ${descriptionSize}px ${bodyFamily}`;
  ctx.fillText(description, posterX + 55, copyTop + 405);

  ctx.restore();
}

function drawBlueMorningMagazineTemplate() {
  const [titleTop = "", ...titleRest] = getValue("title").split("|");
  const titleBottom = titleRest.join("|").trim();
  const headline = getValue("area");
  const location = getValue("location");
  const displayFamily = `"Cover PangMen", "Cover ShuHei", "Microsoft YaHei", sans-serif`;
  const bodyFamily = `"Cover ShuHei", "Microsoft YaHei", sans-serif`;
  const blue = "#0873cf";
  const photoX = 58;
  const photoY = 684;
  const photoW = 964;
  const photoH = 922;

  function fitBlueFont(text, startSize, maxWidth, minSize = 34, family = displayFamily) {
    let size = startSize;
    while (size > minSize) {
      ctx.font = `700 ${size}px ${family}`;
      if (ctx.measureText(text).width <= maxWidth) break;
      size -= 3;
    }
    return size;
  }

  function drawImageCoverInRect(x, y, width, height) {
    if (!state.image) return;
    const img = state.image;
    const scale = Math.max(width / img.width, height / img.height);
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;
    ctx.drawImage(
      img,
      x + (width - drawWidth) / 2,
      y + (height - drawHeight) / 2,
      drawWidth,
      drawHeight,
    );
  }

  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, DESIGN_H);
  ctx.textBaseline = "middle";
  ctx.fillStyle = blue;

  const topSize = fitBlueFont(titleTop, 300, 930, 140);
  ctx.font = `700 ${topSize}px ${displayFamily}`;
  ctx.textAlign = "left";
  ctx.fillText(titleTop, 56, 415);

  ctx.fillStyle = blue;
  ctx.fillRect(58, 540, 424, 118);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  const labelSize = fitBlueFont(location, 42, 345, 27, bodyFamily);
  ctx.font = `700 ${labelSize}px ${bodyFamily}`;
  ctx.fillText(location, 98, 599);

  if (titleBottom) {
    const bottomSize = fitBlueFont(titleBottom, 148, 525, 72);
    ctx.font = `700 ${bottomSize}px ${displayFamily}`;
    ctx.fillStyle = blue;
    ctx.textAlign = "left";
    ctx.fillText(titleBottom, 495, 599);
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(photoX, photoY, photoW, photoH);
  ctx.clip();
  drawImageCoverInRect(photoX, photoY, photoW, photoH);
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  const headlineSize = fitBlueFont(headline, 70, 520, 42, bodyFamily);
  ctx.font = `700 ${headlineSize}px ${bodyFamily}`;
  const headlineChars = Array.from(headline);
  const headlineSplit = Math.max(1, Math.ceil(headlineChars.length / 2));
  ctx.fillText(headlineChars.slice(0, headlineSplit).join(""), 96, 780);
  ctx.fillText(headlineChars.slice(headlineSplit).join(""), 96, 855);

  ctx.restore();
}

function drawRetroOrangeGreenTemplate() {
  const title = getValue("title");
  const headline = getValue("area");
  const label = getValue("location");
  const details = getValue("layout");
  const displayFamily = `"Cover ShuHei", "Cover FangYuan", "Microsoft YaHei", sans-serif`;
  const bodyFamily = `"Cover ShuHei", "Microsoft YaHei", sans-serif`;
  const orange = "#f6a51f";

  function fitRetroFont(text, startSize, maxWidth, minSize = 42, family = displayFamily) {
    let size = startSize;
    while (size > minSize) {
      ctx.font = `700 ${size}px ${family}`;
      if (ctx.measureText(text).width <= maxWidth) break;
      size -= 3;
    }
    return size;
  }

  ctx.save();

  function drawRetroHeadline(text, centerX, centerY, startSize, angle, arcDepth = 42) {
    if (!text) return;
    const size = fitRetroFont(text, startSize, 970, 90);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.font = `700 ${size}px ${displayFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = orange;
    ctx.strokeStyle = "rgba(18,48,36,0.82)";
    ctx.lineWidth = Math.max(6, size * 0.028);
    ctx.lineJoin = "round";
    const chars = Array.from(text);
    const widths = chars.map((char) => ctx.measureText(char).width);
    const tracking = -size * 0.055;
    const totalWidth = widths.reduce((sum, width) => sum + width, 0) + tracking * Math.max(0, chars.length - 1);
    let cursor = -totalWidth / 2;

    chars.forEach((char, index) => {
      const charX = cursor + widths[index] / 2;
      const normalizedX = totalWidth ? charX / (totalWidth / 2) : 0;
      const charY = arcDepth * normalizedX * normalizedX - arcDepth / 2;
      const tangent = Math.atan((4 * arcDepth * charX) / Math.max(1, totalWidth * totalWidth));
      ctx.save();
      ctx.translate(charX, charY);
      ctx.rotate(tangent);
      ctx.strokeText(char, 0, 0);
      ctx.fillText(char, 0, 0);
      ctx.restore();
      cursor += widths[index] + tracking;
    });
    ctx.restore();
  }

  drawRetroHeadline(title, W / 2, 455, 220, -4, 44);
  drawRetroHeadline(headline, W / 2, 655, 205, -5, 48);

  ctx.save();
  ctx.translate(420, 865);
  ctx.rotate((-15 * Math.PI) / 180);
  const labelSize = fitRetroFont(label, 58, 650, 34, bodyFamily);
  ctx.font = `700 ${labelSize}px ${bodyFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = orange;
  const labelChars = Array.from(label);
  const labelWidths = labelChars.map((char) => ctx.measureText(char).width);
  const labelTracking = -labelSize * 0.035;
  const labelWidth = labelWidths.reduce((sum, width) => sum + width, 0) + labelTracking * Math.max(0, labelChars.length - 1);
  let labelCursor = -labelWidth / 2;
  labelChars.forEach((char, index) => {
    const charX = labelCursor + labelWidths[index] / 2;
    const normalizedX = labelWidth ? charX / (labelWidth / 2) : 0;
    const charY = 18 * normalizedX * normalizedX - 9;
    ctx.save();
    ctx.translate(charX, charY);
    ctx.rotate(Math.atan((72 * charX) / Math.max(1, labelWidth * labelWidth)));
    ctx.fillText(char, 0, 0);
    ctx.restore();
    labelCursor += labelWidths[index] + labelTracking;
  });
  ctx.restore();

  const verticalText = Array.from(details.replace(/[｜|]/g, "·"));
  ctx.fillStyle = orange;
  ctx.font = `700 30px ${bodyFamily}`;
  ctx.textAlign = "center";
  verticalText.slice(0, 12).forEach((char, index) => {
    ctx.fillText(char, 1000, 1290 + index * 38);
  });

  ctx.restore();
}

function drawWhiteFrameCityTemplate() {
  const title = getValue("title");
  const headline = getValue("area");
  const location = getValue("location");
  const details = getValue("layout");
  const displayFamily = `"Cover FangYuan", "Cover ShuHei", "Microsoft YaHei", sans-serif`;
  const bodyFamily = `"Cover ShuHei", "Microsoft YaHei", sans-serif`;
  const frameX = (W - 880) / 2;
  const frameY = 360;
  const frameW = 880;
  const frameH = 885;

  function fitWhiteFrameFont(text, startSize, maxWidth, minSize = 36, family = displayFamily, weight = 700) {
    let size = startSize;
    while (size > minSize) {
      ctx.font = `${weight} ${size}px ${family}`;
      if (ctx.measureText(text).width <= maxWidth) break;
      size -= 3;
    }
    return size;
  }

  function splitForTwoLines(text) {
    const chars = Array.from(text);
    if (chars.length <= 5) return [text];
    const splitAt = Math.ceil(chars.length / 2);
    return [chars.slice(0, splitAt).join(""), chars.slice(splitAt).join("")];
  }

  ctx.save();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 12;
  ctx.strokeRect(frameX, frameY, frameW, frameH);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const mainLines = [title, ...splitForTwoLines(headline)].filter(Boolean).slice(0, 3);
  const lineHeight = 155;
  const blockTop = mainLines.length === 1 ? 940 : mainLines.length === 2 ? 850 : 790;
  mainLines.forEach((line, index) => {
    const size = fitWhiteFrameFont(line, 142, frameW - 90, 70, displayFamily, 650);
    ctx.font = `650 ${size}px ${displayFamily}`;
    ctx.fillText(line, frameX + 48, blockTop + index * lineHeight);
  });

  const detailParts = details.split(/[｜|]/).map((item) => item.trim()).filter(Boolean);
  ctx.textAlign = "left";
  ctx.font = `700 68px ${bodyFamily}`;
  ctx.fillText(detailParts[0] || "实景探房", 58, 1480);
  ctx.fillText(detailParts.slice(1).join(" · ") || "好房推荐", 58, 1555);

  ctx.textAlign = "right";
  const locationSize = fitWhiteFrameFont(location, 46, 430, 28, bodyFamily, 700);
  ctx.font = `700 ${locationSize}px ${bodyFamily}`;
  ctx.fillText(location, W - 55, 1550);

  ctx.restore();
}

function drawPropertyPostcardTemplate() {
  const title = getValue("title");
  const headline = getValue("area");
  const location = getValue("location");
  const locationLines = location.split("|").map((item) => item.trim()).filter(Boolean).slice(0, 3);
  const details = getValue("layout");
  const displayFamily = `"Cover FangYuan", "Cover ShuHei", "Microsoft YaHei", sans-serif`;
  const bodyFamily = `"Cover ShuHei", "Microsoft YaHei", sans-serif`;
  const cardX = 36;
  const cardY = 405;
  const cardW = 1008;
  const cardH = 1170;
  const photoX = 105;
  const photoY = 475;
  const photoW = 870;
  const photoH = 460;

  function fitPostcardFont(text, startSize, maxWidth, minSize = 30, family = displayFamily, weight = 700) {
    let size = startSize;
    while (size > minSize) {
      ctx.font = `${weight} ${size}px ${family}`;
      if (ctx.measureText(text).width <= maxWidth) break;
      size -= 3;
    }
    return size;
  }

  function drawImageCoverInRect(x, y, width, height) {
    if (!state.image) return;
    const img = state.image;
    const scale = Math.max(width / img.width, height / img.height);
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;
    ctx.drawImage(
      img,
      x + (width - drawWidth) / 2,
      y + (height - drawHeight) / 2,
      drawWidth,
      drawHeight,
    );
  }

  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(cardX, cardY, cardW, cardH);

  ctx.save();
  ctx.beginPath();
  ctx.rect(photoX, photoY, photoW, photoH);
  ctx.clip();
  drawImageCoverInRect(photoX, photoY, photoW, photoH);
  ctx.restore();

  ctx.fillStyle = "#171717";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  const titleSize = fitPostcardFont(title, 68, 350, 38, bodyFamily, 700);
  ctx.font = `700 ${titleSize}px ${bodyFamily}`;
  ctx.fillText(title, 95, 1055);

  const headlineSize = fitPostcardFont(headline, 132, 560, 66, displayFamily, 700);
  ctx.font = `700 ${headlineSize}px ${displayFamily}`;
  ctx.fillText(headline, 410, 1048);

  ctx.strokeStyle = "#171717";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(105, 1175);
  ctx.lineTo(975, 1175);
  ctx.stroke();

  const detailParts = details.split(/[｜|]/).map((item) => item.trim()).filter(Boolean).slice(0, 4);
  ctx.textAlign = "left";
  ctx.fillStyle = "#222222";
  ctx.font = `500 37px ${bodyFamily}`;
  detailParts.forEach((item, index) => {
    ctx.fillText(`• ${item}`, 105, 1250 + index * 58);
  });

  ctx.textAlign = "right";
  locationLines.forEach((line, index) => {
    const startSize = index === 0 ? 43 : 31;
    const size = fitPostcardFont(line, startSize, 430, 24, bodyFamily, 700);
    ctx.font = `700 ${size}px ${bodyFamily}`;
    ctx.fillText(line, 955, 1250 + index * 60);
  });

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
  } else if (templateId === "comicLivingRoom") {
    drawComicLivingRoomTemplate();
  } else if (templateId === "smartHomeBlocks") {
    drawSmartHomeBlocksTemplate();
  } else if (templateId === "editorialDay") {
    drawEditorialDayTemplate();
  } else if (templateId === "viralRoast") {
    drawViralRoastTemplate();
  } else if (templateId === "greenEstatePoster") {
    drawGreenEstatePosterTemplate();
  } else if (templateId === "cityMagazine") {
    drawCityMagazineTemplate();
  } else if (templateId === "yellowFramePoster") {
    drawYellowFramePosterTemplate();
  } else if (templateId === "blueMorningMagazine") {
    drawBlueMorningMagazineTemplate();
  } else if (templateId === "retroOrangeGreen") {
    drawRetroOrangeGreenTemplate();
  } else if (templateId === "whiteFrameCity") {
    drawWhiteFrameCityTemplate();
  } else if (templateId === "propertyPostcard") {
    drawPropertyPostcardTemplate();
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

function syncTemplateCards() {
  if (!refs.templateGallery) return;
  const activeTemplate = getTemplateId();
  refs.templateGallery.querySelectorAll(".template-card").forEach((card) => {
    const isSelected = card.dataset.templateId === activeTemplate;
    card.classList.toggle("is-selected", isSelected);
    card.setAttribute("aria-pressed", String(isSelected));
  });
}

function createTemplateGallery() {
  if (!refs.templateGallery) return;
  refs.templateGallery.replaceChildren();
  Array.from(refs.template.options).forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "template-card";
    button.dataset.templateId = option.value;
    button.setAttribute("aria-label", option.textContent.trim());

    const thumbnail = document.createElement("canvas");
    thumbnail.width = 240;
    thumbnail.height = 320;
    thumbnail.setAttribute("aria-hidden", "true");

    const name = document.createElement("span");
    name.className = "template-card-name";
    name.textContent = option.textContent.trim();

    button.append(thumbnail, name);
    button.addEventListener("click", () => {
      refs.template.value = option.value;
      applyTemplateDefaults(option.value);
    });
    refs.templateGallery.append(button);
  });
  syncTemplateCards();
}

function renderTemplateThumbnails() {
  if (!refs.templateGallery || !state.defaultImage) return;
  const savedTemplate = refs.template.value;
  const savedImage = state.image;
  const savedValues = {
    title: refs.title.value,
    area: refs.area.value,
    location: refs.location.value,
    layout: refs.layout.value,
  };

  state.image = state.defaultImage;
  refs.templateGallery.querySelectorAll(".template-card").forEach((card) => {
    const templateId = card.dataset.templateId;
    const defaults = templateDefaults[templateId] || {};
    refs.template.value = templateId;
    ["title", "area", "location", "layout"].forEach((key) => {
      if (refs[key] && typeof defaults[key] === "string") refs[key].value = defaults[key];
    });
    render();
    const thumbnail = card.querySelector("canvas");
    const thumbnailContext = thumbnail.getContext("2d");
    thumbnailContext.clearRect(0, 0, thumbnail.width, thumbnail.height);
    const sourceHeight = W * (thumbnail.height / thumbnail.width);
    const sourceY = Math.max(0, (DESIGN_H - sourceHeight) / 2);
    thumbnailContext.drawImage(
      canvas,
      0,
      sourceY,
      W,
      sourceHeight,
      0,
      0,
      thumbnail.width,
      thumbnail.height,
    );
  });

  refs.template.value = savedTemplate;
  state.image = savedImage;
  Object.entries(savedValues).forEach(([key, value]) => {
    refs[key].value = value;
  });
  render();
  syncTemplateCards();
}

function loadDefaultCoverImage() {
  const img = new Image();
  img.onload = () => {
    state.defaultImage = img;
    if (!state.image) state.image = img;
    render();
    renderTemplateThumbnails();
  };
  img.src = window.DEFAULT_COVER_DATA_URL || "assets/default-cover.jpg?v=1";
}

refs.imageInput.addEventListener("change", (event) => {
  loadImage(event.target.files[0]);
});

refs.template.addEventListener("change", () => {
  applyTemplateDefaults(getTemplateId());
});

Object.values(refs).forEach((element) => {
  if (
    !element ||
    element === refs.imageInput ||
    element === refs.download ||
    element === refs.template ||
    element === refs.templateGallery
  ) return;
  element.addEventListener("input", render);
  element.addEventListener("change", render);
});

refs.download.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `房源封面-${Date.now()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
});

createTemplateGallery();
loadDefaultCoverImage();
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
    document.fonts.load('700 170px "Cover ShuHei"', "这个客厅也太大了吧"),
    document.fonts.load('700 170px "Cover ShuHei"', "当房子变成懂你的家"),
    document.fonts.load('400 240px "Cover Instrument"', "DAY IN MY LIFE"),
    document.fonts.load('700 76px "Cover Smiley Sans"', "A TIMESTAMPED"),
    document.fonts.load('700 180px "Cover ShuHei"', "第四代住宅"),
    document.fonts.load('700 270px "Cover ShuHei"', "好房上新"),
    document.fonts.load('700 250px "Cover ShuHei"', "城市好房"),
    document.fonts.load('700 190px "Cover PangMen"', "#好房"),
    document.fonts.load('700 300px "Cover PangMen"', "好房午后"),
    document.fonts.load('700 220px "Cover Zcool Happy"', "这套好房"),
    document.fonts.load('650 142px "Cover FangYuan"', "理想好房"),
    document.fonts.load('700 132px "Cover FangYuan"', "理想好房"),
  ]);
  render();
  renderTemplateThumbnails();
}

loadCoverFonts();
