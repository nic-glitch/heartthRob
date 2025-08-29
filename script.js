document.addEventListener("DOMContentLoaded", () => {
  // 1) LIST YOUR PAGES HERE (exact names/case!)
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
    "pages/backCover.jpg"   // 9  <-- lastIndex
  ];

  // 2) GRAB ELEMENTS
  const cover      = document.getElementById("cover");
  const backCover  = document.getElementById("backCover");
  const spread     = document.getElementById("spread");
  const leftPage   = document.getElementById("leftPage");
  const rightPage  = document.getElementById("rightPage");
  const leftImg    = document.getElementById("leftImg");
  const rightFront = document.getElementById("rightFront");
  const rightBack  = document.getElementById("rightBack");
  const flipcard   = document.getElementById("flipcard");

  // 3) STATE
  let mode = "cover";
  let spreadIndex = 0;      // 0..spreadCount-1
  let flipping = false;

  const lastIndex   = pages.length - 1;          // index of backCover
  const interior    = pages.slice(1, lastIndex); // page2..pageN
  const spreadCount = Math.ceil(interior.length / 2);

  // Pair helper: spread 0 -> [1,2], spread 1 -> [3,4], ...
  function spreadPair(idx) {
    const leftIdx  = 1 + idx * 2;
    const rightIdx = leftIdx + 1;
    return [leftIdx, rightIdx];
  }

  // 4) VIEW HELPERS
  function showCover() {
    mode = "cover"; flipping = false; spreadIndex = 0;
    cover.removeAttribute("aria-hidden");
    spread.setAttribute("aria-hidden", "true");
    backCover.setAttribute("aria-hidden", "true");
  }

  function showBackCover() {
    mode = "back"; flipping = false;
    cover.setAttribute("aria-hidden", "true");
    spread.setAttribute("aria-hidden", "true");
    backCover.removeAttribute("aria-hidden");
  }

  function setSpread(idx) {
    const [leftIdx, rightIdx] = spreadPair(idx);

    // If you ended up with an odd number of interior pages, rightIdx might be backCover.
    // With page9 present, rightIdx should be a real page.
    leftImg.src = pages[leftIdx];
    rightFront.src = pages[rightIdx];

    // After flipping the right page, we reveal either the next spread's LEFT page or the back cover
    if (idx < spreadCount - 1) {
      const [nextLeftIdx] = spreadPair(idx + 1);
      rightBack.src = pages[nextLeftIdx];
    } else {
      rightBack.src = pages[lastIndex]; // back cover after the last spread
    }
  }

  function showSpread(idx) {
    mode = "spread"; flipping = false; spreadIndex = idx;
    cover.setAttribute("aria-hidden", "true");
    backCover.setAttribute("aria-hidden", "true");
    spread.removeAttribute("aria-hidden");
    setSpread(idx);
    flipcard.classList.remove("flip-forward");
  }

  // 5) INTERACTIONS
  cover.addEventListener("click", () => {
    if (!flipping) showSpread(0);           // opens [page2|page3]
  });

  leftPage.addEventListener("click", () => {
    if (flipping || mode !== "spread") return;
    if (spreadIndex === 0) showCover();     // back to front
    else showSpread(spreadIndex - 1);       // previous spread
  });

  rightPage.addEventListener("click", () => {
    if (flipping || mode !== "spread") return;

    if (spreadIndex < spreadCount - 1) {
      flipping = true;
      flipcard.classList.add("flip-forward");
      flipcard.addEventListener("transitionend", () => {
        showSpread(spreadIndex + 1);        // next spread
      }, { once: true });
    } else {
      showBackCover();                      // last spread → back cover
    }
  });

  backCover.addEventListener("click", showCover);

  // 6) PRELOAD WITH ERROR LOGS (catches typos like page9.JPG vs .jpg)
  pages.forEach(src => {
    const img = new Image();
    img.onload = () => console.log("[ok]", src);
    img.onerror = () => console.error("[missing]", src, "→ Check name/case/extension and folder");
    img.src = src;
  });

  // 7) START
  showCover();
});

});

