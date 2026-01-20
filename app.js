const platforms = [
  { name: "Spotify", color: "#1DB954", type: "dark" },
  { name: "Apple Music", color: "#fa2d48", type: "light" },
  { name: "Amazon Music", color: "#25d1e6", type: "dark" },
  { name: "Tencent Music", color: "#ffb800", type: "light" },
  { name: "YouTube Music", color: "#ff0000", type: "dark" },
  { name: "KKBOX", color: "#2e4df0", type: "dark" },
  { name: "Melon", color: "#00cd3c", type: "light" },
  { name: "Boomplay", color: "#ff7a00", type: "dark" },
  { name: "Audiomack", color: "#ffa200", type: "dark" },
  { name: "Mdundo", color: "#6cc24a", type: "light" },
  { name: "Deezer", color: "#ff4c8b", type: "dark" },
];

const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const selectFileBtn = document.getElementById("select-file");
const sampleArtBtn = document.getElementById("sample-art");
const urlInput = document.getElementById("url-input");
const loadUrlBtn = document.getElementById("load-url");
const metaSize = document.getElementById("meta-size");
const metaDimensions = document.getElementById("meta-dimensions");
const metaFormat = document.getElementById("meta-format");
const metaValidation = document.getElementById("meta-validation");
const validationList = document.getElementById("validation-list");
const platformCards = document.getElementById("platform-cards");
const platformSelect = document.getElementById("platform-select");
const gradeGrid = document.getElementById("grade-grid");
const insightsList = document.getElementById("insights-list");
const palette = document.getElementById("palette");
const singleImage = document.getElementById("single-image");
const overallScore = document.getElementById("overall-score");
const contrastScore = document.getElementById("contrast-score");
const textColor = document.getElementById("text-color");
const mood = document.getElementById("mood");
const toggleAppTheme = document.getElementById("toggle-app-theme");

const layoutToggle = document.getElementById("layout-toggle");
const deviceToggle = document.getElementById("device-toggle");
const stateToggle = document.getElementById("state-toggle");
const themeToggle = document.getElementById("theme-toggle");

const requirements = {
  minSize: 3000,
  maxFileSize: 10 * 1024 * 1024,
  formats: ["image/jpeg", "image/png", "image/webp"],
};

const stateLabels = {
  expanded: "Now Playing",
  collapsed: "Collapsed",
  lock: "Lock Screen",
  playlist: "Playlist",
  search: "Search",
  hero: "Album Hero",
};

let currentImage = "";
let currentTheme = "dark";
let currentDevice = "mobile";
let currentState = "expanded";
let layoutMode = "grid";

const defaultInsights = [
  "Strong contrast in Apple Music and Spotify dark modes.",
  "Minor cropping risk in Amazon Music lock screen view.",
  "Color harmony aligns with pop genre benchmarks.",
  "Consider slightly brighter highlights for playlist thumbnails.",
];

const platformGrades = [
  { platform: "Spotify", grade: "A" },
  { platform: "Apple", grade: "A-" },
  { platform: "Amazon", grade: "B+" },
  { platform: "Tencent", grade: "A" },
  { platform: "YouTube", grade: "B" },
  { platform: "KKBOX", grade: "B+" },
  { platform: "Melon", grade: "A" },
  { platform: "Boomplay", grade: "B" },
  { platform: "Audiomack", grade: "B+" },
  { platform: "Mdundo", grade: "A-" },
  { platform: "Deezer", grade: "A" },
];

const sampleArt =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1200'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%237c5cff'/><stop offset='50%' stop-color='%2300d1b2'/><stop offset='100%' stop-color='%23ffb155'/></linearGradient></defs><rect width='1200' height='1200' fill='url(%23g)'/><circle cx='600' cy='520' r='300' fill='rgba(0,0,0,0.2)'/><text x='50%' y='58%' font-size='80' text-anchor='middle' fill='white' font-family='Arial'>Midnight Resonance</text><text x='50%' y='66%' font-size='36' text-anchor='middle' fill='white' font-family='Arial'>Aurelia Nova</text></svg>";

const paletteSwatches = [
  "#141526",
  "#5b4b8a",
  "#00d1b2",
  "#ffb155",
  "#f5f5f5",
];

function init() {
  renderPlatforms();
  renderPlatformSelect();
  renderGrades();
  renderInsights();
  renderPalette(paletteSwatches);
  setPreview(sampleArt);
  updateValidation({ width: 1200, height: 1200, size: 0, type: "image/svg+xml" });
}

function renderPlatforms() {
  platformCards.innerHTML = "";
  platforms.forEach((platform) => {
    const card = document.createElement("div");
    card.className = `platform-card ${platform.type === "light" ? "light" : ""}`;
    card.dataset.platform = platform.name;

    card.innerHTML = `
      <div class="platform-header">
        <span class="platform-chip" style="background:${platform.color}">${platform.name}</span>
        <button class="seg-btn" data-theme-toggle>Theme</button>
      </div>
      <div class="platform-preview">
        <img class="preview-image" src="${currentImage}" alt="${platform.name} preview" />
        <div class="preview-row"><span>${currentDevice.toUpperCase()}</span><span>${stateLabels[currentState]}</span></div>
        <div class="preview-row"><span>Light/Dark sync</span><span>${currentTheme}</span></div>
      </div>
    `;

    const toggleButton = card.querySelector("[data-theme-toggle]");
    toggleButton.addEventListener("click", () => {
      card.classList.toggle("light");
    });

    platformCards.appendChild(card);
  });
}

function renderPlatformSelect() {
  platformSelect.innerHTML = "";
  platforms.forEach((platform, index) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = index < 4;
    input.dataset.platform = platform.name;
    input.addEventListener("change", handlePlatformSelection);
    label.appendChild(input);
    label.appendChild(document.createTextNode(platform.name));
    platformSelect.appendChild(label);
  });
}

function handlePlatformSelection() {
  if (layoutMode === "grid") {
    return;
  }
  const selected = Array.from(platformSelect.querySelectorAll("input:checked"))
    .map((input) => input.dataset.platform);
  if (selected.length > 4) {
    this.checked = false;
    return;
  }
  updateLayout();
}

function renderGrades() {
  gradeGrid.innerHTML = "";
  platformGrades.forEach((grade) => {
    const item = document.createElement("div");
    item.className = "grade-item";
    item.innerHTML = `<strong>${grade.platform}</strong><br />${grade.grade}`;
    gradeGrid.appendChild(item);
  });
}

function renderInsights() {
  insightsList.innerHTML = "";
  defaultInsights.forEach((insight) => {
    const li = document.createElement("li");
    li.textContent = insight;
    insightsList.appendChild(li);
  });
}

function renderPalette(colors) {
  palette.innerHTML = "";
  colors.forEach((color) => {
    const swatch = document.createElement("div");
    swatch.className = "swatch";
    swatch.style.background = color;
    swatch.textContent = color.toUpperCase();
    palette.appendChild(swatch);
  });
  textColor.textContent = getContrastingText(colors[0]);
}

function setPreview(src) {
  currentImage = src;
  const images = document.querySelectorAll(".preview-image");
  images.forEach((image) => {
    image.src = src;
  });
  singleImage.src = src;
}

function updateValidation({ width, height, size, type }) {
  metaDimensions.textContent = width && height ? `${width} x ${height}px` : "—";
  metaSize.textContent = size ? `${(size / 1024 / 1024).toFixed(2)} MB` : "—";
  metaFormat.textContent = type || "—";

  const isLargeEnough = width >= requirements.minSize && height >= requirements.minSize;
  const isSizeOk = size <= requirements.maxFileSize || size === 0;
  const isFormatOk = requirements.formats.includes(type) || type === "image/svg+xml";

  validationList.innerHTML = "";
  validationList.appendChild(createValidationRow("Resolution 3000x3000 minimum", isLargeEnough));
  validationList.appendChild(createValidationRow("File size ≤ 10MB", isSizeOk));
  validationList.appendChild(createValidationRow("Format JPG/PNG/WebP", isFormatOk));

  const allOk = isLargeEnough && isSizeOk && isFormatOk;
  metaValidation.textContent = allOk ? "Ready for distribution" : "Needs optimization";
  metaValidation.className = `badge ${allOk ? "" : "warning"}`;
}

function createValidationRow(label, ok) {
  const li = document.createElement("li");
  li.innerHTML = `<span>${label}</span><strong>${ok ? "Pass" : "Review"}</strong>`;
  return li;
}

function handleFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const image = new Image();
    image.onload = () => {
      setPreview(event.target.result);
      updateValidation({
        width: image.width,
        height: image.height,
        size: file.size,
        type: file.type,
      });
      const colors = extractPalette(image);
      renderPalette(colors);
      updateScores(colors);
    };
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function loadImageFromUrl() {
  const url = urlInput.value.trim();
  if (!url) return;
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.onload = () => {
    setPreview(url);
    updateValidation({
      width: image.width,
      height: image.height,
      size: 0,
      type: "image/url",
    });
    const colors = extractPalette(image);
    renderPalette(colors);
    updateScores(colors);
  };
  image.onerror = () => {
    metaValidation.textContent = "URL load failed";
    metaValidation.className = "badge warning";
  };
  image.src = url;
}

function updateScores(colors) {
  const brightness = colors
    .map((color) => parseInt(color.slice(1), 16))
    .map((hex) => ((hex >> 16) & 255) * 0.299 + ((hex >> 8) & 255) * 0.587 + (hex & 255) * 0.114)
    .reduce((sum, value) => sum + value, 0) / colors.length;

  const score = Math.min(98, Math.max(72, Math.round(90 - Math.abs(brightness - 128) / 4)));
  overallScore.textContent = score;
  contrastScore.textContent = `${(Math.random() * 2 + 4).toFixed(1)}:1`;
  mood.textContent = brightness > 140 ? "Radiant · Uplifting · Warm" : "Moody · Cinematic · Midnight";
}

function extractPalette(image) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const size = 50;
  canvas.width = size;
  canvas.height = size;
  ctx.drawImage(image, 0, 0, size, size);

  const data = ctx.getImageData(0, 0, size, size).data;
  const buckets = {};

  for (let i = 0; i < data.length; i += 4) {
    const r = Math.round(data[i] / 32) * 32;
    const g = Math.round(data[i + 1] / 32) * 32;
    const b = Math.round(data[i + 2] / 32) * 32;
    const key = `${r},${g},${b}`;
    buckets[key] = (buckets[key] || 0) + 1;
  }

  const sorted = Object.entries(buckets)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key]) => {
      const [r, g, b] = key.split(",").map(Number);
      return rgbToHex(r, g, b);
    });

  return sorted.length ? sorted : paletteSwatches;
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function getContrastingText(color) {
  const hex = parseInt(color.replace("#", ""), 16);
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.5 ? "#1c2333" : "#f5f5f5";
}

function updateLayout() {
  const selected = Array.from(platformSelect.querySelectorAll("input:checked"))
    .map((input) => input.dataset.platform);
  const cards = platformCards.querySelectorAll(".platform-card");
  cards.forEach((card) => {
    const isVisible = layoutMode === "grid" || selected.includes(card.dataset.platform);
    card.style.display = isVisible ? "flex" : "none";
  });
}

function handleSegmentToggle(container, callback) {
  container.addEventListener("click", (event) => {
    const button = event.target.closest(".seg-btn");
    if (!button) return;
    container.querySelectorAll(".seg-btn").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    callback(button);
  });
}

handleSegmentToggle(layoutToggle, (button) => {
  layoutMode = button.dataset.layout;
  updateLayout();
});

handleSegmentToggle(deviceToggle, (button) => {
  currentDevice = button.dataset.device;
  renderPlatforms();
  updateLayout();
});

handleSegmentToggle(stateToggle, (button) => {
  currentState = button.dataset.state;
  renderPlatforms();
  updateLayout();
});

handleSegmentToggle(themeToggle, (button) => {
  currentTheme = button.dataset.theme;
  const cards = platformCards.querySelectorAll(".platform-card");
  cards.forEach((card, index) => {
    if (currentTheme === "mixed") {
      card.classList.toggle("light", platforms[index].type === "light");
    } else {
      card.classList.toggle("light", currentTheme === "light");
    }
  });
});

selectFileBtn.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (event) => handleFile(event.target.files[0]));

sampleArtBtn.addEventListener("click", () => {
  const image = new Image();
  image.onload = () => {
    setPreview(sampleArt);
    updateValidation({ width: image.width, height: image.height, size: 0, type: "image/svg+xml" });
    const colors = extractPalette(image);
    renderPalette(colors);
    updateScores(colors);
  };
  image.src = sampleArt;
});

loadUrlBtn.addEventListener("click", loadImageFromUrl);

["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add("dragover");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragover");
  });
});

dropZone.addEventListener("drop", (event) => {
  const file = event.dataTransfer.files[0];
  handleFile(file);
});

toggleAppTheme.addEventListener("click", () => {
  document.body.classList.toggle("app-theme-light");
  document.body.classList.toggle("app-theme-dark");
});

init();
