document.addEventListener("DOMContentLoaded", () => {
  // ---- CONFIG: images ----
  const pages = [
    "pages/frontCover.jpg", // 0
    "pages/page2.jpg",      // 1
    "pages/page3.jpg",      // 2
    "pages/page4.jpg",      // 3
    "pages/page5.jpg",      // 4
    "pages/page6.jpg",      // 5
    "pages/page7.jpg",      // 6
    "pages/page8.jpg",      // 7
    "pages/page9.jpg",      // 8
    "pages/backCover.jpg"   // 9
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
  let mode = "cover";   // "cover" | "spread" | "back"
  let spreadIndex = 0;  // current spread (0 = [2|3], 1 = [4|5], etc.)
  let flipping = false;

  const lastIndex = pages.length - 1;           // index of backCover
  const interior = pages.slice(1, lastIndex);   // [page2..page9]
  const spreadCount = Math.ceil(interior.length / 2);

  // Map spread -> [leftIdx, rightIdx] in pages[]
  function spreadPair(idx) {
    const leftIdx = 1 + idx * 2;
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

    // Prepare back face of flipcard → next left page or back cover
    if (idx < spreadCount - 1) {
      const [nextLeftIdx] = spreadPair(idx + 1);
      rightBack.src = pages[nextLeftIdx];
    } else {
      rightBack.src = pages[lastIndex];
    }
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
    showSpread(0);
  });

  leftPage.addEventListener("click", () => {
    if (flipping || mode !== "spread") return;
    if (spreadIndex === 0) showCover();
    else showSpread(spreadIndex - 1);
  });

  rightPage.addEventListener("click", () => {
    if (flipping || mode !== "spread") return;

    if (spreadIndex < spreadCount - 1) {
      flipping = true;
      flipcard.classList.add("flip-forward");
      flipcard.addEventListener("transitionend", () => {
        showSpread(spreadIndex + 1);
      }, { once: true });
    } else {
      showBackCover();
    }
  });

  backCover.addEventListener("click", showCover);

  // ---- INIT ----
  pages.forEach(src => { const img = new Image(); img.src = src; });
  showCover();
});

