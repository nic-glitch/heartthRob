// ---- CONFIG: all images in /pages ----
// frontCover, then any number of inside pages (page2..pageN), then backCover
const pages = [
  "pages/frontCover.jpg", // 0  (single)
  "pages/page2.jpg",      // 1  ┐
  "pages/page3.jpg",      // 2  │ spread 0 = [1,2]
  "pages/page4.jpg",      // 3  │
  "pages/page5.jpg",      // 4  ┘ spread 1 = [3,4]
  "pages/page6.jpg",      // 5  ┐
  "pages/page7.jpg",      // 6  ┘ spread 2 = [5,6]
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
const spreadCount = Math.ceil(interior.length / 2); // pairs of two

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
  leftImg.src = pages[leftIdx];
  rightFront.src = pages[rightIdx];

  // Prepare the back face for the flip (what appears after turning):
  // next spread’s




// Preload
pages.forEach(src => { const img = new Image(); img.src = src; });
