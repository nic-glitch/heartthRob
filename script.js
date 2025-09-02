// ---- CONFIG: all images in /pages ----
const pages = [
  "pages/frontCover.jpg", // 0  (single)
  "pages/page2.jpg",      // 1  ┐ spread 0
  "pages/page3.jpg",      // 2  ┘
  "pages/page4.jpg",      // 3  ┐ spread 1
  "pages/page5.jpg",      // 4  ┘
  "pages/page6.jpg",      // 5  ┐ spread 2
  "pages/page7.jpg",      // 6  ┘
  "pages/backCover.jpg"   // 7  (single)
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
let mode = "cover";              // "cover" | "spread" | "back"
let spreadIndex = 0;             // which two-page spread we’re on (0..last)
let flipping = false;            // lock during animation
const lastIndex = pages.length - 1;          // index of backCover
const interior = pages.slice(1, lastIndex);  // [page2..pageN]
const spreadCount = Math.ceil(interior.length / 2); // number of spreads

// Given a spread index, return [leftIdx, rightIdx] in the pages[] array
function spreadPair(idx) {
  // left starts at 1, advances by 2 per spread: 1,3,5,...
  const leftIdx  = 1 + idx * 2;
  const rightIdx = leftIdx + 1;
  return [leftIdx, rightIdx];
}

// ---- VIEW HELPERS ----
function showCover() {
  mode = "cover";
  flipping = false;
  cover.removeAttribute("aria-hidden");
  spread.setAttribute("aria-hidden", "true");
  backCover.setAttribute("aria-hidden", "true");
  spreadIndex = 0;
}

function showBackCover() {
  mode = "back";
  flipping = false;
  cover.setAttribute("aria-hidden", "true");
  spread.setAttribute("aria-hidden", "true");
  backCover.removeAttribute("aria-hidden");
}

function setSpread(idx) {
  const [leftIdx, rightIdx] = spreadPair(idx);
  leftImg.src    = pages[leftIdx];
  rightFront.src = pages[rightIdx];

  // Prepare the back face for the flip (what appears after turning):
  // next spread’s LEFT page, or back cover if we’re at the last spread
  const [nextLeftIdx] = spreadPair(idx + 1);
  rightBack.src = (idx < spreadCount - 1) ? pages[nextLeftIdx] : pages[lastIndex];
}

function showSpread(idx) {
  mode = "spread";
  flipping = false;

  cover.setAttribute("aria-hidden", "true");
  backCover.setAttribute("aria-hidden", "true");
  spread.removeAttribute("aria-hidden");

  setSpread(idx);
  flipcard.classList.remove("flip-forward");
  spreadIndex = idx;
}

// ---- INTERACTIONS ----
cover.addEventListener("click", () => {
  if (flipping) return;
  showSpread(0); // open to first spread
});

leftPage.addEventListener("click", () => {
  if (flipping || mode !== "spread") return;
  if (spreadIndex === 0) {
    showCover();
  } else {
    // (Optional: animate a left flip; here we just step back a spread)
    showSpread(spreadIndex - 1);
  }
});

rightPage.addEventListener("click", () => {
  if (flipping || mode !== "spread") return;

  if (spreadIndex < spreadCount - 1) {
    // Flip forward to next spread
    flipping = true;
    flipcard.classList.add("flip-forward");
    flipcard.addEventListener("transitionend", () => {
      showSpread(spreadIndex + 1);
    }, { once: true });
  } else {
    // At the last spread → go to back cover
    showBackCover();
  }
});

// Back cover → front cover
backCover.addEventListener("click", showCover);

// Keyboard helpers (Enter/Space)
leftPage.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") leftPage.click();
});
rightPage.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") rightPage.click();
});

// ---- INIT ----
pages.forEach(src => { const img = new Image(); img.src = src; });
showCover();



});

