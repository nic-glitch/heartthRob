// script.js (resilient version with flip fallback)
document.addEventListener("DOMContentLoaded", () => {
  console.log("[flipbook] script loaded");

  // === 1) LIST YOUR IMAGES IN ORDER (exact names/case!) ===
  // Keep only what you actually have; make sure backCover is last.
  const pages = [
    "pages/frontCover.jpg", // 0  single
    "pages/page2.jpg",      // 1 ┐  spread 0
    "pages/page3.jpg",      // 2 ┘
    "pages/page4.jpg",      // 3 ┐  spread 1
    "pages/page5.jpg",      // 4 ┘
    "pages/page6.jpg",      // 5 ┐  spread 2 (optional)
    "pages/page7.jpg",      // 6 ┘
    "pages/page8.jpg",      // 7 ┐  (optional)
    "pages/page9.jpg",      // 8 ┘  (optional)
    "pages/backCover.jpg"   // 9  single (must be last)
  ].filter(Boolean);

  // === 2) GRAB ELEMENTS ===
  const cover      = document.getElementById("cover");
  const backCover  = document.getElementById("backCover");
  const spread     = document.getElementById("spread");
  const leftPage   = document.getElementById("leftPage");
  const rightPage  = document.getElementById("rightPage");
  const leftImg    = document.getElementById("leftImg");
  const rightFront = document.getElementById("rightFront");
  const rightBack  = document.getElementById("rightBack");
  let   flipcard   = document.getElementById("flipcard");

  // Guard for required nodes
  if (!cover || !backCover || !spread || !leftPage || !rightPage || !leftImg || !rightFront || !rightBack) {
    console.error("[flipbook] Missing required element(s). Check IDs in index.html.");
    return;
  }

  // === 3) STATE ===
  const lastIndex   = pages.length - 1;          // index of backCover
  const interior    = pages.slice(1, lastIndex); // page2..pageN
  const spreadCount = Math.ceil(interior.length / 2); // number of 2-page spreads
  let currentSpread = 0;                          // 0..spreadCount-1
  let flipping = false;

  // Allow turning off 3D flip if flipcard is not present
  let USE_FLIP = true;
  if (!flipcard) {
    console.warn("[flipbook] #flipcard not found. Disabling flip animation (instant page changes).");
    USE_FLIP = false;
  }

  function spreadPair(idx) {
    // spread 0 -> [1,2], spread 1 -> [3,4], spread 2 -> [5,6], ...
    const leftIdx  = 1 + idx * 2;
    const rightIdx = leftIdx + 1;
    return [leftIdx, rightIdx];
  }

  // === 4) VIEW HELPERS ===
  function showCover() {
    console.log("[flipbook] showCover");
    flipping = false;
    currentSpread = 0;
    cover.removeAttribute("aria-hidden");
    spread.setAttribute("aria-hidden", "true");
    backCover.setAttribute("aria-hidden", "true");
  }

  function showBackCover() {
    console.log("[flipbook] showBackCover");
    flipping = false;
    cover.setAttribute("aria-hidden", "true");
    spread.setAttribute("aria-hidden", "true");
    backCover.removeAttribute("aria-hidden");
  }

  function setSpread(idx) {
    const [leftIdx, rightIdx] = spreadPair(idx);
    console.log("[flipbook] setSpread", { idx, leftIdx, rightIdx, spreadCount });

    // Left page is required
    if (!pages[leftIdx]) {
      console.error("[flipbook] Missing left page for spread", idx, "→ check pages[] and filenames.");
      return;
    }
    leftImg.src = pages[leftIdx];

    // Right page may be missing if odd interiors; handle gracefully
    if (!pages[rightIdx]) {
      console.warn("[flipbook] Missing right page for spread", idx, "→ using back cover as placeholder.");
      rightFront.src = pages[lastIndex];
      rightBack.src  = pages[lastIndex];
    } else {
      rightFront.src = pages[rightIdx];

      // Prepare the back face (what appears after the flip): next spread's LEFT, or back cover if last
      if (idx < spreadCount - 1) {
        const [nextLeftIdx] = spreadPair(idx + 1);
        rightBack.src = pages[nextLeftIdx];
      } else {
        rightBack.src = pages[lastIndex];
      }
    }

    if (USE_FLIP) {
      // reset flip visual safely
      try { flipcard.classList.remove("flip-forward"); } catch (e) {}
    }
  }

  function showSpread(idx) {
    console.log("[flipbook] showSpread", idx);
    cover.setAttribute("aria-hidden", "true");
    backCover.setAttribute("aria-hidden", "true");
    spread.removeAttribute("aria-hidden");
    currentSpread = idx;
    setSpread(idx);
    flipping = false;
  }

  // === 5) INTERACTIONS ===
  cover.addEventListener("click", () => {
    console.log("[flipbook] cover clicked");
    if (!flipping) showSpread(0);   // open to first spread
  });

  leftPage.addEventListener("click", () => {
    console.log("[flipbook] left page clicked");
    if (flipping || spread.hasAttribute("aria-hidden")) return;
    if (currentSpread === 0) showCover();
    else showSpread(currentSpread - 1);
  });

  rightPage.addEventListener("click", () => {
    console.log("[flipbook] right page clicked");
    if (flipping || spread.hasAttribute("aria-hidden")) return;

    if (currentSpread < spreadCount - 1) {
      if (USE_FLIP) {
        flipping = true;
        try {
          flipcard.classList.add("flip-forward");
          flipcard.addEventListener("transitionend", () => {
            console.log("[flipbook] flip finished → next spread");
            showSpread(currentSpread + 1);
          }, { once: true });
        } catch (e) {
          console.warn("[flipbook] flip failed; falling back to instant.");
          showSpread(currentSpread + 1);
        }
      } else {
        // No flipcard — just advance instantly
        showSpread(currentSpread + 1);
      }
    } else {
      showBackCover();
    }
  });

  backCover.addEventListener("click", () => {
    console.log("[flipbook] back cover clicked");
    showCover();
  });

  // === 6) PRELOAD with error logs (find typos fast) ===
  pages.forEach(src => {
    const img = new Image();
    img.onload = () => console.log("[ok]", src);
    img.onerror = () => console.error("[missing]", src, "→ check filename/case/extension/folder");
    img.src = src;
  });

  // === 7) START ===
  showCover();
});


});

