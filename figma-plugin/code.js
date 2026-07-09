figma.showUI(__html__, { width: 380, height: 430, themeColors: true });

const FONT = { family: "Inter", style: "Regular" };
const FONT_BOLD = { family: "Inter", style: "Bold" };

const styles = {
  estateBold: {
    name: "Estate Bold",
    title: "House Listing Bold",
    description: "Dense listing UI for sales-driven house videos.",
    folder: "estate-bold",
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
      info: ["78 sqm", "1 Bed 1 Living", "South", "Rent 16k"],
      space: "Living Room",
      feature: "15 min to CBD",
      cta: "DM for tour",
      summary: "Guomao | 78 sqm | 1 bed | CBD commute",
    },
  },
  varietyVisit: {
    name: "Variety Visit",
    title: "Home Visit Variety",
    description: "Light, sticker-like UI for host-led room tour videos.",
    folder: "variety-visit",
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
      info: ["New Roomtour", "Shoot day", "Mini home", "Welcome"],
      space: "Now: Living Room",
      feature: "A popular home blogger visits",
      cta: "Comment for floor plan",
      summary: "For people who love light, storage, and cozy living.",
    },
  },
};

const componentMeta = {
  "Estate / InfoCard": { styleId: "estateBold", name: "info-card" },
  "Estate / SpaceTag": { styleId: "estateBold", name: "space-tag" },
  "Estate / FeatureText": { styleId: "estateBold", name: "feature-text" },
  "Estate / CTAButton": { styleId: "estateBold", name: "cta-button" },
  "Estate / SummaryCard": { styleId: "estateBold", name: "summary-card" },
  "Variety / InfoSticker": { styleId: "varietyVisit", name: "info-sticker" },
  "Variety / SpaceBubble": { styleId: "varietyVisit", name: "space-bubble" },
  "Variety / FeatureCaption": { styleId: "varietyVisit", name: "feature-caption" },
  "Variety / CTASticker": { styleId: "varietyVisit", name: "cta-sticker" },
  "Variety / SummarySticker": { styleId: "varietyVisit", name: "summary-sticker" },
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
  const meta = componentMeta[name];
  component.name = name;
  component.x = x;
  component.y = y;
  component.resize(width, height);
  component.fills = [];
  if (meta) {
    component.setPluginData("houseUiKit", "component");
    component.setPluginData("styleId", meta.styleId);
    component.setPluginData("exportName", meta.name);
  }
  parent.appendChild(component);
  return component;
}

async function createEstateComponents(board, style) {
  const c = style.colors;

  const info = createComponentFrame(board, "Estate / InfoCard", 56, 190, 560, 156);
  const infoBg = createRoundRect(info, 0, 0, 560, 156, c.panel, 18, 0.96);
  addDropShadow(infoBg, "#000000", 0.22, 0, 14, 28);
  await createText(info, "Key Info", 24, 20, 24, c.muted, { bold: true });
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
  await createText(feature, "Walkable commute, stable daily rhythm", 4, 78, 30, c.accent, { bold: true });

  const cta = createComponentFrame(board, "Estate / CTAButton", 56, 720, 320, 92);
  const ctaBg = createRoundRect(cta, 0, 0, 320, 92, c.accent, 18);
  addDropShadow(ctaBg, "#000000", 0.18, 0, 10, 20);
  await createText(cta, style.sample.cta, 72, 27, 32, "#19130a", { bold: true });

  const summary = createComponentFrame(board, "Estate / SummaryCard", 56, 870, 680, 176);
  createRoundRect(summary, 0, 0, 680, 176, c.panel, 18, 0.96);
  await createText(summary, "Wrap-up", 28, 24, 26, c.muted, { bold: true });
  await createText(summary, style.sample.summary, 28, 78, 34, c.text, { bold: true, width: 610 });
}

async function createVarietyComponents(board, style) {
  const c = style.colors;

  const info = createComponentFrame(board, "Variety / InfoSticker", 56, 190, 560, 178);
  const infoBg = createRoundRect(info, 0, 0, 560, 178, c.panel, 24);
  infoBg.strokes = solid(c.stroke);
  infoBg.strokeWeight = 4;
  addDropShadow(infoBg, c.stroke, 0.18, 8, 10, 0);
  await createText(info, "What we talk about", 28, 24, 30, c.accent, { bold: true });
  await createText(info, style.sample.info.join(" | "), 28, 82, 30, c.text, { bold: true, width: 500 });

  const space = createComponentFrame(board, "Variety / SpaceBubble", 56, 416, 310, 86);
  const bubble = createRoundRect(space, 0, 0, 310, 86, c.panelSoft, 43);
  bubble.strokes = solid(c.accent);
  bubble.strokeWeight = 4;
  await createText(space, style.sample.space, 34, 24, 32, c.text, { bold: true });

  const feature = createComponentFrame(board, "Variety / FeatureCaption", 56, 560, 720, 170);
  await createText(feature, style.sample.feature, 0, 0, 50, c.accent, { bold: true, width: 720 });
  await createText(feature, "What did we chat about?", 0, 82, 60, c.text, { bold: true });

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
  await createText(summary, "Final takeaway", 30, 24, 28, c.accent, { bold: true });
  await createText(summary, style.sample.summary, 30, 78, 34, c.text, { bold: true, width: 620 });
}

async function createStyleBoard(styleId, index) {
  const style = styles[styleId];
  const board = figma.createFrame();
  board.name = `${style.name} / Video UI Kit`;
  board.x = index * 860;
  board.y = 0;
  board.resize(820, 1220);
  board.cornerRadius = 28;
  board.fills = solid(style.colors.bg);
  board.setPluginData("houseUiKit", "board");
  board.setPluginData("styleId", styleId);
  figma.currentPage.appendChild(board);

  await createText(board, style.title, 56, 46, 46, style.colors.text, { bold: true });
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
  figma.ui.postMessage({ type: "status", text: "UI kit generated on the current page." });
}

function bytesToBase64(bytes) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let output = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const c = i + 2 < bytes.length ? bytes[i + 2] : 0;
    const triplet = (a << 16) | (b << 8) | c;
    output += chars[(triplet >> 18) & 63];
    output += chars[(triplet >> 12) & 63];
    output += i + 1 < bytes.length ? chars[(triplet >> 6) & 63] : "=";
    output += i + 2 < bytes.length ? chars[triplet & 63] : "=";
  }
  return output;
}

function getExportableComponents(styleId) {
  return figma.currentPage
    .findAll((node) => node.type === "COMPONENT" && node.getPluginData("houseUiKit") === "component")
    .filter((node) => styleId === "all" || node.getPluginData("styleId") === styleId);
}

function getDesignSystem(styleId) {
  const ids = styleId === "all" ? Object.keys(styles) : [styleId];
  const result = {};
  ids.forEach((id) => {
    result[id] = {
      name: styles[id].name,
      title: styles[id].title,
      description: styles[id].description,
      colors: styles[id].colors,
      sample: styles[id].sample,
    };
  });
  return result;
}

async function exportSvgZip(styleId) {
  const nodes = getExportableComponents(styleId);
  if (nodes.length === 0) {
    figma.ui.postMessage({
      type: "status",
      text: "No generated components found. Click Generate UI Kit first.",
    });
    return;
  }

  const files = [];
  for (const node of nodes) {
    const componentStyleId = node.getPluginData("styleId");
    const exportName = node.getPluginData("exportName") || node.name.toLowerCase().replace(/\W+/g, "-");
    const folder = styles[componentStyleId].folder;
    const bytes = await node.exportAsync({ format: "SVG" });
    files.push({
      path: `${folder}/${exportName}.svg`,
      base64: bytesToBase64(bytes),
    });
  }

  const designSystem = JSON.stringify(getDesignSystem(styleId), null, 2);
  files.push({
    path: "design-system.json",
    text: designSystem,
  });

  figma.ui.postMessage({
    type: "export-ready",
    text: `Exported ${nodes.length} SVG components.`,
    filename: "house-cover-ui-kit.zip",
    files,
  });
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
      figma.notify(`Generate failed: ${error.message}`);
      figma.ui.postMessage({ type: "status", text: `Generate failed: ${error.message}` });
    }
  }

  if (message.type === "export-svg-zip") {
    try {
      await exportSvgZip(message.styleId);
    } catch (error) {
      figma.notify(`Export failed: ${error.message}`);
      figma.ui.postMessage({ type: "status", text: `Export failed: ${error.message}` });
    }
  }
};
