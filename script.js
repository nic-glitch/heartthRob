document.addEventListener("DOMContentLoaded", () => {
  console.log("[flipbook] script loaded");

  // --- LIST YOUR IMAGES IN ORDER ---
  const pages = [
    "pages/frontCover.jpg", // 0  single
    "pages/page2.jpg",      // 1  ┐
    "pages/page3.jpg",      // 2  ┘ spread 0
    "pages/page4.jpg",      // 3  ┐
    "pages/page5.jpg",      // 4  ┘ spread 1
    "pages/page6.jpg",      // 5  ┐
    "pages/page7.jpg",      // 6  ┘ spread 2
    "pages/page8.jpg",      // 7  ┐  (include only if it exists)
    "pages/page9.jpg",      // 8  ┘  (include only if it exists)
    "pages/backCover.jpg"   // 9  single (must be last)
  ].filter(Boolean); // keeps it simple if you remove page8/9

  // --- GRAB ELEMENTS ---
  const cover      = document.getElementById("cover");
  const backCover  = document.getElementById("backCover");
  const spread     = document.getElementById("spread");
  const leftPage   = document.getElementById("leftPage");
  const rightPage  = document.getElementById("rightPage");
  const leftImg    = document.getElementById("leftImg");
  const rightFront = document.getElementById("rightFront");
  const rightBack  = document.getElementById("rightBack");
  const flipcard   = document.getElementById("flipcard");

  // Guard for missing IDs
  if (!cover || !backCover || !spread || !leftPage || !rightPage || !leftImg || !rightFront || !rightBack || !flipcard) {
    console.error("[flipbook] Missing one or more required elements. Check IDs in index.html.");
    return;
  }

  // --- STATE ---
  let mode = "cover";     // "cover" | "spread" | "back"
  let flipping = false;
  const lastIndex   = pages.length - 1;           // backCover index
  const interior    = pages.slice(1, lastIndex);  // page2..pageN
  const spreadCount = Math.ceil(interior.length / 2);

  // spread 0 -> [1,2], spread 1 -> [3,4], ...
  function spreadPair(idx) {
    const leftIdx  = 1 + idx * 2;
    const rightIdx = leftIdx + 1;
    return [leftIdx, rightIdx];
  }

  // --- VIEW HELPERS ---
  function showCover() {
    console.log("[flipbook] showCover");
    mode = "cover"; flipping = false;
    cover.removeAttribute("aria-hidden");
    spread.setAttribute("aria-hidden", "true");
    backCover.setAttribute("aria-hidden", "true");
  }

  function showBackCover() {
    console.log("[flipbook] showBackCover");
    mode = "back"; flipping = false;
    cover.setAttribute("aria-hidden", "true");
    spread.setAttribute("aria-hidden", "true");
    backCover.removeAttribute("aria-hidden");
  }

  function setSpread(idx) {
    const [leftIdx, rightIdx] = spreadPair(idx);
    console.log("[flipbook] setSpread", { idx, leftIdx, rightIdx, spreadCount });

    // Defensive: if there’s an odd number of interior pages, rightIdx might be undefined.
    if (!pages[leftIdx]) { console.error("[flipbook] Missing left page image for spread", idx); return; }
    leftImg.src = pages[leftIdx];

    if (!pages[rightIdx]) {
      console.warn("[flipbook] No right page for this spread; showing back cover next");
      rightFront.src = pages[lastIndex];
      rightBack.src  = pages[lastIndex];
    } else {
      rightFront.src = pages[rightIdx];

      // Prepare what appears after the flip: next spread's left page OR back cover
      if (idx < spreadCount - 1) {
        const [nextLeftIdx] = spreadPair(idx + 1);
        rightBack.src = pages[nextLeftIdx];
      } else {
        rightBack.src = pages[lastIndex];
      }
    }

    // Reset flip visual
    flipcard.classList.remove("flip-forward");
  }

  function showSpread(idx) {
    console.log("[flipbook] showSpread", idx);
    mode = "spread"; flipping = false;
    cover.setAttribute("aria-hidden", "true");
    backCover.setAttribute("aria-hidden", "true");
    spread.removeAttribute("aria-hidden");
    setSpread(idx);
    // store current spread on the element for quick debug
    spread.dataset.idx = String(idx);
  }

  // --- INTERACTIONS ---
  cover.addEventListener("click", () => {
    console.log("[flipbook] cover clicked");
    if (!flipping) showSpread(0);
  });

  leftPage.addEventListener("click", () => {
    console.log("[flipbook] left page clicked");
    if (flipping || mode !== "spread") return;
    const idx = Number(spread.dataset.idx || 0);
    if (idx <= 0) showCover();
    else showSpread(idx - 1);
  });

  rightPage.addEventListener("click", () => {
    console.log("[flipbook] right page clicked");
    if (flipping || mode !== "spread") return;
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

  // --- PRELOAD with error logs (find typos fast) ---
  pages.forEach(src => {
    const img = new Image();
    img.onload = () => console.log("[ok]", src);
    img.onerror = () => console.error("[missing]", src, "→ check filename/case/extension and folder");
    img.src = src;
  });

  // --- START ---
  showCover();
});


});

