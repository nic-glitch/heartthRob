// script.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("[flipbook] script loaded");

  // === 1) LIST YOUR IMAGES IN ORDER (exact names/case) ===
  // Keep only the pages you actually have. If you don't have page8/page9, remove those lines.
  const pages = [
    "pages/frontCover.jpg", // 0 (single)
    "pages/page2.jpg",      // 1 ┐
    "pages/page3.jpg",      // 2 ┘  spread 0
    "pages/page4.jpg",      // 3 ┐
    "pages/page5.jpg",      // 4 ┘  spread 1
    "pages/page6.jpg",      // 5 ┐
    "pages/page7.jpg",      // 6 ┘  spread 2
    "pages/page8.jpg",      // 7 ┐  (delete if not present)
    "pages/page9.jpg",      // 8 ┘  (delete if not present)
    "pages/backCover.jpg"   // 9 (single)  <-- must be last
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
  const flipcard   = document.getElementById("flipcard");

  if (!cover || !backCover || !spread || !leftPage || !rightPage || !leftImg || !rightFront || !rightBack || !flipcard) {
    console.error("[flipbook] Missing one or more required elements. Check IDs in index.html.");
    return;
  }

  // === 3) STATE ===
  let flipping = false;
  let spreadIndex = 0; // 0..spreadCount-1
  const lastIndex   = pages.length - 1;          // back cover index
  const interior    = pages.slice(1, lastIndex); // page2..pageN
  const spreadCount = Math.ceil(interior.length / 2);

  // spread 0 -> [1,2], spread 1 -> [3,4], spread 2 -> [5,6], ...
  function spreadPair(idx) {
    const leftIdx  = 1 + idx * 2;
    const rightIdx = leftIdx + 1;
    return [leftIdx, rightIdx];
  }

  // === 4) VIEW HELPERS ===
  function showCover() {
    console.log("[flipbook] showCover");
    flipping = false;
    cover.removeAttribute("aria-hidden");
    spread.setAttribute("aria-hidden", "true");
    backCover.setAttribute("aria-hidden", "true");
    spreadIndex = 0;
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

    if (!pages[leftIdx]) {
      console.error("[flipbook] Missing left page image for spread", idx);
      return;
    }
    leftImg.src = pages[leftIdx];

    if (!pages[rightIdx]) {
      // Odd number of interior pages — no right page; show backCover on both faces to avoid flashing
      console.warn("[flipbook] No right page for spread", idx, "→ using back cover as placeholder");
      rightFront.src = pages[lastIndex];
      rightBack.src  = pages[lastIndex];
    } else {
      rightFront.src = pages[rightIdx];
      // Prepare what appears after flipping: next spread's LEFT page OR back cover
      if (idx < spreadCount - 1) {
        const [nextLeftIdx] = spreadPair(idx + 1);
        rightBack.src = pages[nextLeftIdx];
      } else {
        rightBack.src = pages[lastIndex];
      }
    }

    flipcard.classList.remove("flip-forward");
    spread.dataset.idx = String(idx); // store for handlers
  }

  function showSpread(idx) {
    console.log("[flipbook] showSpread", idx);
    cover.setAttribute("aria-hidden", "true");
    backCover.setAttribute("aria-hidden", "true");
    spread.removeAttribute("aria-hidden");
    setSpread(idx);
    flipping = false;
  }

  // === 5) INTERACTIONS ===
  cover.addEventListener("click", () => {
    console.log("[flipbook] cover clicked");
    if (!flipping) showSpread(0);
  });

  leftPage.addEventListener("click", () => {
    console.log("[flipbook] left page clicked");
    if (flipping || spread.hasAttribute("aria-hidden")) return;
    const idx = Number(spread.dataset.idx || 0);
    if (idx <= 0) showCover();
    else showSpread(idx - 1);
  });

  rightPage.addEventListener("click", () => {
    console.log("[flipbook] right page clicked");
    if (flipping || spread.hasAttribute("aria-hidden")) return;
    const idx = Number(spread.dataset.idx || 0);

    if (idx < spreadCount - 1) {
      flipping = true;
      flipcard.classList.add("flip-forward");
      flipcard.addEventListener("transitionend", () => {
        console.log("[flipbook] flip finished → next spread");
        showSpread(idx + 1);
      }, { once: true });
    } else {
      showBackCover();
    }
  });

  backCover.addEventListener("click", () => {
    console.log("[flipbook] back cover clicked");
    showCover();
  });

  // === 6) PRELOAD (helps catch typos like .JPG vs .jpg) ===
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

