figma.showUI(__html__, { width: 360, height: 360, themeColors: true });

const FONT = { family: "Inter", style: "Regular" };
const FONT_BOLD = { family: "Inter", style: "Bold" };

const styles = {
  estateBold: {
    name: "房源大字版",
    description: "信息密度高，适合房源讲解和强转化视频。",
    colors: {
      bg: "#111217",
      panel: "#1b1d24",
      panelSoft: "#2a2d36",
      text: "#ffffff",
      muted: "#aeb3bf",
      accent: "#f5ad00",
      stroke: "#050505",
    },
    sample: {
      info: ["建面 78㎡", "一室一厅", "南向", "月租 1.6w"],
      space: "客厅",
      feature: "CBD 通勤 15 分钟",
      cta: "私信看房",
      summary: "国贸｜78㎡｜一居｜适合 CBD 通勤",
    },
  },
  varietyVisit: {
    name: "探家综艺版",
    description: "轻松、有互动感，适合人物出镜和探家内容。",
    colors: {
      bg: "#fff4ec",
      panel: "#ffffff",
      panelSoft: "#ffe5f1",
      text: "#3a261e",
      muted: "#8a6a5d",
      accent: "#d65b99",
      accent2: "#ffcf55",
      stroke: "#8f6a4b",
    },
    sample: {
      info: ["新家 Roomtour", "拍摄的一天", "超想迷你家", "欢迎来玩"],
      space: "现在看客厅",
      feature: "百万探家博主来我家",
      cta: "评论想看户型图",
      summary: "这套房适合爱生活、爱收纳、爱阳光的人",
    },
  },
};

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value = parseInt(normalized, 16);
  return {
    r: ((value >> 16) & 255) / 255,
    g: ((value >> 8) & 255) / 255,
    b: (value & 255) / 255,
  };
}

function solid(hex, opacity = 1) {
  return [{ type: "SOLID", color: hexToRgb(hex), opacity }];
}

function addDropShadow(node, color = "#000000", opacity = 0.22, x = 0, y = 8, blur = 18) {
  node.effects = [
    {
      type: "DROP_SHADOW",
      color: { ...hexToRgb(color), a: opacity },
      offset: { x, y },
      radius: blur,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ];
}

async function createText(parent, text, x, y, size, color, options = {}) {
  const fontName = options.bold ? FONT_BOLD : FONT;
  await figma.loadFontAsync(fontName);
  const node = figma.createText();
  node.fontName = fontName;
  node.characters = text;
  node.fontSize = size;
  node.lineHeight = { unit: "PERCENT", value: options.lineHeight || 116 };
  node.fills = solid(color);
  node.x = x;
  node.y = y;
  if (options.width) {
    node.resize(options.width, node.height);
    node.textAutoResize = "HEIGHT";
  }
  parent.appendChild(node);
  return node;
}

function createRoundRect(parent, x, y, width, height, color, radius = 24, opacity = 1) {
  const node = figma.createRectangle();
  node.x = x;
  node.y = y;
  node.resize(width, height);
  node.cornerRadius = radius;
  node.fills = solid(color, opacity);
  parent.appendChild(node);
  return node;
}

function createComponentFrame(parent, name, x, y, width, height) {
  const component = figma.createComponent();
  component.name = name;
  component.x = x;
  component.y = y;
  component.resize(width, height);
  component.fills = [];
  parent.appendChild(component);
  return component;
}

async function createEstateComponents(board, style) {
  const c = style.colors;

  const info = createComponentFrame(board, "Estate / InfoCard", 56, 190, 560, 156);
  const infoBg = createRoundRect(info, 0, 0, 560, 156, c.panel, 18, 0.96);
  addDropShadow(infoBg, "#000000", 0.22, 0, 14, 28);
  await createText(info, "关键信息", 24, 20, 24, c.muted, { bold: true });
  const columns = style.sample.info;
  for (let i = 0; i < columns.length; i += 1) {
    const x = 24 + i * 132;
    await createText(info, columns[i], x, 72, 28, i === 0 ? c.accent : c.text, { bold: true });
  }

  const space = createComponentFrame(board, "Estate / SpaceTag", 56, 390, 240, 78);
  createRoundRect(space, 0, 0, 240, 78, c.panel, 14, 0.92);
  createRoundRect(space, 14, 18, 8, 42, c.accent, 3);
  await createText(space, style.sample.space, 36, 20, 34, c.text, { bold: true });

  const feature = createComponentFrame(board, "Estate / FeatureText", 56, 520, 690, 150);
  await createText(feature, style.sample.feature, 0, 0, 54, c.text, { bold: true });
  await createText(feature, "步行到地铁，通勤更稳", 4, 78, 30, c.accent, { bold: true });

  const cta = createComponentFrame(board, "Estate / CTAButton", 56, 720, 320, 92);
  const ctaBg = createRoundRect(cta, 0, 0, 320, 92, c.accent, 18);
  addDropShadow(ctaBg, "#000000", 0.18, 0, 10, 20);
  await createText(cta, style.sample.cta, 72, 27, 32, "#19130a", { bold: true });

  const summary = createComponentFrame(board, "Estate / SummaryCard", 56, 870, 680, 176);
  createRoundRect(summary, 0, 0, 680, 176, c.panel, 18, 0.96);
  await createText(summary, "结尾总结", 28, 24, 26, c.muted, { bold: true });
  await createText(summary, style.sample.summary, 28, 78, 34, c.text, { bold: true, width: 610 });
}

async function createVarietyComponents(board, style) {
  const c = style.colors;

  const info = createComponentFrame(board, "Variety / InfoSticker", 56, 190, 560, 178);
  const infoBg = createRoundRect(info, 0, 0, 560, 178, c.panel, 24);
  infoBg.strokes = solid(c.stroke);
  infoBg.strokeWeight = 4;
  addDropShadow(infoBg, c.stroke, 0.18, 8, 10, 0);
  await createText(info, "今天聊什么", 28, 24, 30, c.accent, { bold: true });
  await createText(info, style.sample.info.join(" ｜ "), 28, 82, 30, c.text, { bold: true, width: 500 });

  const space = createComponentFrame(board, "Variety / SpaceBubble", 56, 416, 310, 86);
  const bubble = createRoundRect(space, 0, 0, 310, 86, c.panelSoft, 43);
  bubble.strokes = solid(c.accent);
  bubble.strokeWeight = 4;
  await createText(space, style.sample.space, 34, 24, 32, c.text, { bold: true });

  const feature = createComponentFrame(board, "Variety / FeatureCaption", 56, 560, 720, 170);
  await createText(feature, style.sample.feature, 0, 0, 50, c.accent, { bold: true, width: 720 });
  await createText(feature, "都聊了点啥?", 0, 82, 60, c.text, { bold: true });

  const cta = createComponentFrame(board, "Variety / CTASticker", 56, 780, 430, 104);
  const ctaBg = createRoundRect(cta, 0, 0, 430, 104, c.accent2, 26);
  ctaBg.strokes = solid(c.text);
  ctaBg.strokeWeight = 3;
  addDropShadow(ctaBg, c.stroke, 0.14, 6, 8, 0);
  await createText(cta, style.sample.cta, 36, 30, 34, c.text, { bold: true });

  const summary = createComponentFrame(board, "Variety / SummarySticker", 56, 936, 700, 178);
  const summaryBg = createRoundRect(summary, 0, 0, 700, 178, c.panel, 28);
  summaryBg.strokes = solid(c.accent);
  summaryBg.strokeWeight = 4;
  await createText(summary, "最后总结", 30, 24, 28, c.accent, { bold: true });
  await createText(summary, style.sample.summary, 30, 78, 34, c.text, { bold: true, width: 620 });
}

async function createStyleBoard(styleId, index) {
  const style = styles[styleId];
  const board = figma.createFrame();
  board.name = `${style.name} / 视频组件库`;
  board.x = index * 860;
  board.y = 0;
  board.resize(820, 1220);
  board.cornerRadius = 28;
  board.fills = solid(style.colors.bg);
  figma.currentPage.appendChild(board);

  await createText(board, style.name, 56, 46, 46, style.colors.text, { bold: true });
  await createText(board, style.description, 58, 106, 24, style.colors.muted, { width: 680 });

  if (styleId === "estateBold") {
    await createEstateComponents(board, style);
  } else {
    await createVarietyComponents(board, style);
  }

  return board;
}

async function createLibrary(styleId) {
  await figma.loadFontAsync(FONT);
  await figma.loadFontAsync(FONT_BOLD);

  const ids = styleId === "all" ? ["estateBold", "varietyVisit"] : [styleId];
  const boards = [];
  for (let i = 0; i < ids.length; i += 1) {
    boards.push(await createStyleBoard(ids[i], i));
  }

  figma.viewport.scrollAndZoomIntoView(boards);
  figma.ui.postMessage({ text: "组件库已生成到当前页面。" });
}

figma.ui.onmessage = async (message) => {
  if (message.type === "close") {
    figma.closePlugin();
    return;
  }

  if (message.type === "create-library") {
    try {
      await createLibrary(message.styleId);
    } catch (error) {
      figma.notify(`生成失败：${error.message}`);
      figma.ui.postMessage({ text: `生成失败：${error.message}` });
    }
  }
};
