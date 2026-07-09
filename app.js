const canvas = document.getElementById("coverCanvas");
const ctx = canvas.getContext("2d");

const refs = {
  imageInput: document.getElementById("imageInput"),
  template: document.getElementById("templateSelect"),
  title: document.getElementById("titleInput"),
  area: document.getElementById("areaInput"),
  location: document.getElementById("locationInput"),
  layout: document.getElementById("layoutInput"),
  caption: document.getElementById("captionInput"),
  account: document.getElementById("accountInput"),
  date: document.getElementById("dateInput"),
  likes: document.getElementById("likesInput"),
  bottomCard: document.getElementById("bottomCardToggle"),
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
};

const W = canvas.width;
const H = canvas.height;
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
    if (key === "bottomCard") {
      refs.bottomCard.checked = value;
    } else if (refs[key]) {
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
    const grd = ctx.createLinearGradient(0, 0, W, H);
    grd.addColorStop(0, "#e8dfd3");
    grd.addColorStop(0.48, "#84766a");
    grd.addColorStop(1, "#17181d");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(78, 410, 380, 250);
    ctx.fillStyle = "rgba(255,255,255,0.09)";
    ctx.fillRect(486, 248, 420, 840);
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(80, 1160, 760, 220);
    return;
  }

  const img = state.image;
  const scale = Math.max(W / img.width, H / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = (W - dw) / 2;
  const dy = (H - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

function drawGradientScrims() {
  let grd = ctx.createLinearGradient(0, 0, 0, 520);
  grd.addColorStop(0, "rgba(0,0,0,0.42)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, 520);

  grd = ctx.createLinearGradient(0, H - 720, 0, H);
  grd.addColorStop(0, "rgba(0,0,0,0)");
  grd.addColorStop(0.58, "rgba(0,0,0,0.28)");
  grd.addColorStop(1, "rgba(0,0,0,0.72)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, H - 720, W, 720);
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
    strokeFillText(title, 28, 205, titleSize, WHITE, {
      strokeWidth: 14,
      shadow: true,
    });
  }

  if (area) {
    const areaSize = fitFontSize(area, 216, W - 160);
    strokeFillText(area, W - 32, 390, areaSize, YELLOW, {
      align: "right",
      strokeWidth: 16,
      shadow: true,
    });
  }
}

function drawMiddleCopy() {
  const location = getValue("location");
  const layout = getValue("layout");
  const baseY = H - 612;

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

  const bottomScrim = ctx.createLinearGradient(0, H - 700, 0, H);
  bottomScrim.addColorStop(0, "rgba(0,0,0,0)");
  bottomScrim.addColorStop(0.55, "rgba(0,0,0,0.18)");
  bottomScrim.addColorStop(1, "rgba(0,0,0,0.72)");
  ctx.fillStyle = bottomScrim;
  ctx.fillRect(0, H - 700, W, 700);

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
      comicStrokeText(char, x, y, size, WHITE, {
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
      comicStrokeText(line, 88, 1000 + index * 58, 43, WHITE, {
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
    comicStrokeText(main, W / 2, 1196, mainSize, "#d65b99", {
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
    comicStrokeText(question, W / 2, 1374, questionSize, WHITE, {
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

  const warmth = ctx.createLinearGradient(0, 0, 0, H);
  warmth.addColorStop(0, "rgba(255,210,112,0.16)");
  warmth.addColorStop(0.56, "rgba(255,191,74,0.08)");
  warmth.addColorStop(1, "rgba(255,171,35,0.13)");
  ctx.fillStyle = warmth;
  ctx.fillRect(0, 0, W, H);

  const topGlow = ctx.createLinearGradient(0, 0, 0, 560);
  topGlow.addColorStop(0, "rgba(255,248,224,0.34)");
  topGlow.addColorStop(0.58, "rgba(255,248,224,0.12)");
  topGlow.addColorStop(1, "rgba(255,248,224,0)");
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, W, 560);

  if (title) {
    const titleSize = fitFontSize(title, 176, W - 58);
    layeredEstateText(title, W / 2, 292, titleSize, {
      outlineWidth: Math.max(12, titleSize * 0.075),
    });
  }

  if (detail) {
    const detailSize = fitFontSize(detail, 80, W - 48, 900);
    layeredEstateText(detail, W / 2, 414, detailSize, {
      outlineWidth: Math.max(7, detailSize * 0.07),
    });
  }
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

function drawBottomCard() {
  if (!refs.bottomCard.checked) return;

  const top = H - 382;
  const radius = 10;
  ctx.save();
  ctx.fillStyle = "rgba(20,21,28,0.97)";
  ctx.beginPath();
  ctx.roundRect(8, top, W - 16, 360, radius);
  ctx.fill();

  ctx.fillStyle = "#f1f2f6";
  ctx.font = font(58, 800);
  ctx.textAlign = "left";
  wrapText(getValue("caption"), 56, top + 86, W - 112, 78, 2);

  drawAvatar(86, top + 260, 58);

  ctx.fillStyle = "#b9bdc7";
  ctx.font = font(44, 600);
  ctx.fillText(getValue("account"), 176, top + 240);

  ctx.fillStyle = "#858b98";
  ctx.font = font(36, 500);
  ctx.fillText(getValue("date"), 176, top + 304);

  ctx.fillStyle = "#aeb3bf";
  ctx.font = font(48, 500);
  ctx.textAlign = "right";
  ctx.fillText(getValue("likes"), W - 52, top + 270);
  ctx.restore();
}

function render() {
  ctx.clearRect(0, 0, W, H);
  const templateId = getTemplateId();

  ctx.save();
  if (templateId === "sunnyEstate") {
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 58);
    ctx.clip();
  }

  drawCoverImage();

  if (templateId === "varietyVisit") {
    drawVarietyVisitTemplate();
  } else if (templateId === "sunnyEstate") {
    drawSunnyEstateTemplate();
  } else {
    drawEstateBoldTemplate();
  }

  drawBottomCard();
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
