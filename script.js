// Your page order (inside the "pages" folder)
const pages = [
  "pages/frontCover.jpg", // 0
  "pages/page2.jpg",      // 1
  "pages/page3.jpg",      // 2
  "pages/page4.jpg",      // 3
  "pages/backCover.jpg"   // 4
];

// Elements
const cover     = document.getElementById("cover");
const backCover = document.getElementById("backCover");
const spread    = document.getElementById("spread");

const leftImg   = document.getElementById("leftImg");
const rightFront = document.getElementById("rightFront");
const rightBack  = document.getElementById("rightBack");
const flipcard   = document.getElementById("flipcard");

// State
let mode = "cover";   // "cover" | "spread" | "back"
let currentIndex = 1; // page2 starts as first left page inside

// Show front cover
function showCover() {
  mode = "cover";
  cover.removeAttribute("aria-hidden");
  spread.setAttribute("aria-hidden", "true");
  backCover.setAttribute("aria-hidden", "true");
}

// Show back cover
function showBackCover() {
  mode = "back";
  cover.setAttribute("aria-hidden", "true");
  spread.setAttribute("aria-hidden", "true");
  backCover.removeAttribute("aria-hidden");
}

// Show a spread (two facing pages)
function showSpread(leftIdx, rightIdx) {
  mode = "spread";
  cover.setAttribute("aria-hidden", "true");
  backCover.setAttribute("aria-hidden", "true");
  spread.removeAttribute("aria-hidden");

  leftImg.src = pages[leftIdx];
  rightFront.src = pages[rightIdx];
  rightBack.src = (rightIdx + 1 < pages.length)
    ? pages[rightIdx + 1]
    : "pages/backCover.jpg";

  flipcard.classList.remove("flip-forward");
}

// --- Click handlers ---

// Click front cover → open to first spread
cover.addEventListener("click", () => {
  showSpread(1, 2); // page2 (left), page3 (right)
  currentIndex = 2;
});

// Click left page → back to cover
document.getElementById("leftPage").addEventListener("click", () => {
  showCover();
});

// Click right page → go forward
document.getElementById("rightPage").addEventListener("click", () => {
  if (currentIndex === 2) {
    // Flip page3 → page4
    flipcard.classList.add("flip-forward");
    flipcard.addEventListener("transitionend", () => {
      showSpread(3, 4); // page4 (left), backCover (right)
      currentIndex = 4;
    }, { once: true });
  } else if (currentIn

// Preload
pages.forEach(src => { const img = new Image(); img.src = src; });
