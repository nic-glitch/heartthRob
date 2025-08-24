document.addEventListener("DOMContentLoaded", () => {
  // ---- CONFIG: all images in /pages ----
  const pages = [
    "pages/frontCover.jpg", // 0  single
    "pages/page2.jpg",      // 1  ┐
    "pages/page3.jpg",      // 2  ┘ spread 0
    "pages/page4.jpg",      // 3  ┐
    "pages/page5.jpg",      // 4  ┘ spread 1
    "pages/page6.jpg",      // 5  ┐
    "pages/page7.jpg",      // 6  ┘ spread 2
    "pages/backCover.jpg"   // 7  single
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

  // Quick sanity logs (you can see these in DevTools → Console)
  console.log("[flipbook] elements:", {
    cover, backCover, spread, leftPage, rightPage, leftImg, rightFront, rightBack, flipcard
  });

  // Guard: if we can’t find required nodes, bail with a helpful message
  if (!cover || !backCover || !spread || !leftPage || !rightPage || !leftImg || !rightFront || !rightBack || !flipcard) {
    console.error("[flipbook] Missing one or more required elements. Check your index.html IDs match script.js.");
    return;
  }

  // ---- STATE ----
  let mode = "cover";              // "cover" | "spread" | "back"
  let spreadIndex = 0;             // 0..last
  let flipping = false;

  const lastIndex = pages.length - 1;            // back cover index
  const interior = pages.slice(1, lastIndex);    // page2..pageN
  const spreadCount = Math.ceil(interior.length / 2); // number of spreads

  // Map spread -> indices in `pages`
  function spreadPair(idx) {
    const leftIdx  = 1 + idx * 2;
    const rightIdx = leftIdx + 1;
    return [leftIdx, rightIdx];
  }

  // ---- VIEW HELPERS ----
  function showCover() {
    console.log("[flipbook] showCover()");
    mode = "cover";
    flipping = false;
    cover.removeAttribute("aria-hidden");
    spread.setAttribute("aria-hidden", "true");
    backCover.setAttribute("aria-hidden", "true");
    spreadIndex = 0;
  }

  function showBackCover() {
    console.log("[flipbook] showBackCover()");
    mode = "back";
    flipping = false;
    cover.setAttribute("aria-hidden", "true");
    spread.setAttribute("aria-hidden", "true");
    backCover.removeAttribute("aria-hidden");
  }

  function setSpread(idx) {
    const [leftIdx, rightIdx] = spreadPair(idx);

    // If you added pages 6 & 7, make sure files actually exist at these URLs.
    leftImg.src    = pages[leftIdx];
    rightFront.src = pages[rightIdx];

    // Prepare what appears after flipping the right page:
    if (idx < spreadCount - 1) {
      const [nextLeftIdx] = spreadPair(idx + 1);
      rightBack.src = pages[nextLeftIdx];
    } else {
      rightBack.src = pages[lastIndex]; // back cover
    }
  }

  function showSpread(idx) {
    console.log("[flipbook] showSpread()", { idx });
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
    console.log("[flipbook] cover clicked");
    if (flipping) return;
    showSpread(0); // open first spread
  });

  leftPage.addEventListener("click", () => {
    console.log("[flipbook] left page clicked");
    if (flipping || mode !== "spread") return;
    if (spreadIndex === 0) showCover();
    else showSpread(spreadIndex - 1);
  });

  rightPage.addEventListener("click", () => {
    console.log("[flipbook] right page clicked");
    if (flipping || mode !== "spread") return;

    if (spreadIndex < spreadCount - 1) {
      flipping = true;
      flipcard.classList.add("flip-forward");
      // When the flip animation finishes, move to the next spread
      flipcard.addEventListener("transitionend", () => {
        console.log("[flipbook] flip finished");
        showSpread(spreadIndex + 1);
      }, { once: true });
    } else {
      showBackCover();
    }
  });

  backCover.addEventListener("click", () => {
    console.log("[flipbook] back cover clicked");
    showCover();
  });

  // ---- INIT ----
  pages.forEach(src => { const img = new Image(); img.src = src; });
  showCover();
});
