// ---- CONFIG: image order (inside /pages) ----
const pages = [
  "pages/frontCover.jpg", // 0 - front cover (single)
  "pages/page2.jpg",      // 1 - spread A left
  "pages/page3.jpg",      // 2 - spread A right
  "pages/page4.jpg",      // 3 - spread B left
  "pages/page5.jpg",      // 4 - spread B right
  "pages/backCover.jpg"   // 5 - back cover (single)
];

// ---- ELEMENTS ----
const cover      = document.getElementById("cover");
const backCover  = document.getElementById("backCover");
const spread     = document.getElementById("spread");
const leftPage   = document.getElementById("leftPage");
const rightPage  = document.getElementById("rightPage");
const leftImg    = document.getElementById("leftImg");
const rightFront = document.getElementById("rightFront");
const rightBack  = document.getElementById("rightBack");
const flipcard   = document.getElementById("flipcard");

// ---- STATE ----
// spreadIndex: 0 => [page2,page3], 1 => [page4,page5]
let mode = "cover";        // "cover" | "spread" | "back"
let spreadIndex = 0;       // which two-page spread we’re on
let flipping = false;      // prevent double-clicks during animation

// ---- HELPERS ----
function showCover() {
  mode = "cover";
  flipping = false;
  cover.removeAttribute("aria-hidden");
  spread.setAttribute("aria-hidden", "true");
  backCover.setAttribute("aria-hidden", "true");
  spreadIndex = 0; // reset to first spread
}

function showBackCover() {
  mode = "back";
  flipping = false;
  cover.setAttribute("aria-hidden", "true");
  spread.setAttribute("aria-hidden", "true");
  backCover.removeAttribute("aria-hidden");
}

function setSpreadFromIndex(idx) {
  // idx=0 -> left=1 right=2 ; idx=1 -> left=3 right=4
  const leftIdx  = 1 + idx * 2;
  const rightIdx = 2 + idx * 2;

  leftImg.src    = pages[leftIdx];
  rightFront.src = pages[rightIdx];

  // Prepare the back face: what appears AFTER the flip
  // If we're on spread 0, next reveal is page4 (left of spread 1).
  // If we're on spread 1, next reveal is back cover.
  rightBack.src = (idx === 0) ? pages[3] : pages[5];
}

function showSpread(idx) {
  mode = "spread";
  flipping = false;

  cover.setAttribute("aria-hidden", "true");
  backCover.setAttribute("aria-hidden", "true");
  spread.removeAttribute("aria-hidden");

  setSpreadFromIndex(idx);
  flipcard.classList.remove("flip-forward");
  spreadIndex = idx;
}

function preloadAll() {
  pages.forEach(src => { const img = new Image(); img.src = src; });
}

// ---- INTERACTIONS ----

// Open magazine from front cover → first spread [page2 | page3]
cover?.addEventListener("click", () => {
  if (flipping) return;
  showSpread(0);
});

// LEFT page behavior
// - On first spread → go back to front cover
// - On second spread → go back to first spread
leftPage?.addEventListener("click", () => {
  if (flipping || mode !== "spread") return;
  if (spreadIndex === 0) {
    showCover();
  } else {
    showSpread(0);
  }
});

// RIGHT page behavior
// - On first spread (page3 clicked) → flip to [page4|page5]
// - On second spread (page5 clicked) → show back cover
rightPage?.addEventListener("click", () => {
  if (flipping || mode !== "spread") return;

  if (spreadIndex === 0) {
    flipping = true;
    flipcard.classList.add("flip-forward");
    flipcard.addEventListener("transitionend", () => {
      showSpread(1);
    }, { once: true });
  } else if (spreadIndex === 1) {
    showBackCover();
  }
});

// Click BACK cover → return to front
backCover?.addEventListener("click", showCover);

// Optional keyboard: Enter/Space on pages to trigger click
leftPage?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") leftPage.click();
});
rightPage?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") rightPage.click();
});

// ---- INIT ----
preloadAll();
showCover();



// Preload
pages.forEach(src => { const img = new Image(); img.src = src; });
