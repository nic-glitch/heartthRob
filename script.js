// ---- CONFIG: image order (inside /pages) ----
const pages = [
  "pages/frontCover.jpg", // 0 - front cover
  "pages/page2.jpg",      // 1 - first inside left
  "pages/page3.jpg",      // 2 - first inside right
  "pages/page4.jpg",      // 3 - second inside left
  "pages/backCover.jpg"   // 4 - back cover (final)
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
let mode = "cover";        // "cover" | "spread" | "back"
let currentIndex = 2;      // when in spread mode, this is the current RIGHT page index
let flipping = false;      // lock while animation is running

// ---- HELPERS ----
function showCover() {
  mode = "cover";
  flipping = false;
  cover.removeAttribute("aria-hidden");
  spread.setAttribute("aria-hidden", "true");
  backCover.setAttribute("aria-hidden", "true");
}

function showBackCover() {
  mode = "back";
  flipping = false;
  cover.setAttribute("aria-hidden", "true");
  spread.setAttribute("aria-hidden", "true");
  backCover.removeAttribute("aria-hidden");
}

function setSpread(leftIdx, rightIdx) {
  // left/right images for the visible spread
  leftImg.src = pages[leftIdx];
  rightFront.src = pages[rightIdx];

  // prepare the BACK face of the flipcard:
  // - if we're on the last right page, the next reveal is the back cover
  rightBack.src = (rightIdx + 1 < pages.length) ? pages[rightIdx + 1] : pages[4];
}

function showSpreadFor(rightIdx) {
  mode = "spread";
  flipping = false;

  cover.setAttribute("aria-hidden", "true");
  backCover.setAttribute("aria-hidden", "true");
  spread.removeAttribute("aria-hidden");

  // compute left index from right index
  const leftIdx = rightIdx - 1;
  setSpread(leftIdx, rightIdx);

  // reset flip visual
  flipcard.classList.remove("flip-forward");
  currentIndex = rightIdx;
}

function preloadAll() {
  pages.forEach(src => { const img = new Image(); img.src = src; });
}

// ---- INTERACTIONS ----

// Open magazine from front cover → first spread [page2 (1), page3 (2)]
cover?.addEventListener("click", () => {
  if (flipping) return;
  showSpreadFor(2);
});

// Click LEFT page:
// - If we're at the first spread, go back to front cover
// - Otherwise (if you add more spreads later), you could implement a left flip
leftPage?.addEventListener("click", () => {
  if (flipping || mode !== "spread") return;
  if (currentIndex <= 2) {
    showCover();
  } else {
    // (Future extension: implement mirrored left-page flip here)
    showSpreadFor(currentIndex - 2);
  }
});

// Click RIGHT page → flip forward:
// - From [page2|page3] (right=2) → [page4|backCover] (right=4)
// - From [page4|backCover] → back cover
rightPage?.addEventListener("click", () => {
  if (flipping || mode !== "spread") return;

  // last interior right page is index 2 in this 5-page setup
  if (currentIndex === 2) {
    flipping = true;
    // animate turn of the right page to reveal next
    flipcard.classList.add("flip-forward");
    flipcard.addEventListener("transitionend", () => {
      showSpreadFor(4); // now show [page4 (3), backCover (4)]
    }, { once: true });
  } else if (currentIndex === 4) {
    // clicking the right page when backCover is on the right → go to single back cover
    showBackCover();
  }
});

// Click BACK cover → return to front
backCover?.addEventListener("click", showCover);

// (Optional) keyboard navigation: Enter/Space trigger the same as clicks
leftPage?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") leftPage.click();
});
rightPage?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") rightPage.click();
});

// ---- INIT ----
preloadAll();
// Start on front cover by default
showCover();



// Preload
pages.forEach(src => { const img = new Image(); img.src = src; });
