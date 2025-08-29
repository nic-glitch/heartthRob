// Minimal, resilient flipbook (no animation dependency)
document.addEventListener("DOMContentLoaded", () => {
  console.log("[flipbook] loaded");

  // 1) LIST ONLY FILES YOU ACTUALLY HAVE (exact names/case!)
  // If you don't have page8 or page9, DELETE those lines below.
  const pages = [
    "pages/frontCover.jpg", // 0  (single)
    "pages/page2.jpg",      // 1  ┐
    "pages/page3.jpg",      // 2  ┘ spread 0
    "pages/page4.jpg",      // 3  ┐
    "pages/page5.jpg",      // 4  ┘ spread 1
    "pages/page6.jpg",      // 5  ┐
    "pages/page7.jpg",      // 6  ┘ spread 2
    "pages/page8.jpg",      // 7  ┐ (optional; delete if not present)
    "pages/page9.jpg",      // 8  ┘ (optional; delete if not present)
    "pages/backCover.jpg"   // 9  (single; must be last)
  ].filter(Boolean);

  // 2) ELEMENTS (IDs must match your index.html)
  const cover      = document.getElementById("cover");
  const backCover  = document.getElementById("backCover");
  const spread     = document.getElementById("spread");
  const leftPage   = document.getElementById("leftPage");
  const rightPage  = document.getElementById("rightPage");
  const leftImg    = document.getElementById("leftImg");
  const rightFront = document.getElementById("rightFront"); // we’ll just use this as the right image

  // Guard for missing nodes
  if (!cover || !backCover || !spread || !leftPage || !rightPage || !leftImg || !rightFront) {
    console.error("[flipbook] Missing one or more required elements. Check IDs in index.html.");
    return;
  }

  // 3) STATE
  const lastIndex   = pages.length - 1;            // backCover index
  const interiorLen = lastIndex - 1;               // number of inside pages (page2..pageN)
  const spreadCount = Math.ceil(interiorLen / 2);  // how many pairs of inside pages
  let currentSpread = 0;                            // 0 .. spreadCount-1

  // spread 0 -> [1,2], spread 1 -> [3,4], spread 2 -> [5,6], ...
  function spreadPair(idx) {
    const leftIdx  = 1 + idx * 2;
    const rightIdx = leftIdx + 1;
    return [leftIdx, rightIdx];
  }

  // 4) VIEW HELPERS
  function showCov


});

