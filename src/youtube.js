import { fetchFromBackground } from "./utils";

async function getPlaylistVidoesTitles() {
  const rawTitle = document.title;

  const playlistName = rawTitle.replace(/- YouTube$/i, "").trim();

  const data = await fetchFromBackground("/discord/get-youtube-tracks", "get", {
    url: window.location.href,
  });
  console.log("Tracks:", data);
}

function addLoopVideoIcon(newDiv) {
  const dislike_btns = document.querySelectorAll(
    "#actions #actions-inner #menu"
  );

  if (dislike_btns.length == 0) {
    return;
  }

  newDiv.innerHTML = `
  <div id="loop-btn-style" class="loop-btn-style">
  <button
  id="custom-button-loop"
  class="custom-button-loop"
  aria-label="Loop Video"
>
  <svg
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    class="style-scope yt-icon"
    style="pointer-events: none; width: 80%"
    id="custom-loop-icon-disabled"
  >
    <g class="style-scope yt-icon">
      <path
        d="M21,13h1v5L3.93,18.03l2.62,2.62l-0.71,0.71L1.99,17.5l3.85-3.85l0.71,0.71l-2.67,2.67L21,17V13z M3,7l17.12-0.03 l-2.67,2.67l0.71,0.71l3.85-3.85l-3.85-3.85l-0.71,0.71l2.62,2.62L2,6v5h1V7z"
        class="style-scope yt-icon"
      ></path>
    </g>
  </svg>
  <svg
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    class="style-scope yt-icon d-none"
    style="pointer-events: none; width: 80%"
    id="custom-loop-icon-active"
  >
    <g class="style-scope yt-icon">
      <path
        d="M20,14h2v5L5.84,19.02l1.77,1.77l-1.41,1.41L1.99,18l4.21-4.21l1.41,1.41l-1.82,1.82L20,17V14z M4,7l14.21-0.02l-1.82,1.82 l1.41,1.41L22.01,6l-4.21-4.21l-1.41,1.41l1.77,1.77L2,5v6h2V7z"
        class="style-scope yt-icon"
      ></path>
    </g>
  </svg>
</button>
<p>Loop Video</p>
</div>
`;

  dislike_btns[0].append(newDiv);
}

function checkUrl(str) {
  return window.location.href.includes(str);
}

function loopVideo() {
  const video = document.querySelector("video");

  if (!video) {
    return;
  }

  video.loop = !video.loop;
  document
    .querySelector("#custom-loop-icon-disabled")
    .classList.toggle("d-none");
  document.querySelector("#custom-loop-icon-active").classList.toggle("d-none");
}

function removeShorts() {
  const shorts = document.querySelectorAll(
    "#title-container.style-scope.ytd-reel-shelf-renderer"
  );

  if (!shorts.length) {
    return;
  }

  shorts[0].parentElement.style.display = "none";
}

setInterval(() => {
  if (checkUrl("/watch?v=")) {
    removeShorts();

    const isLoopVideoButton =
      document.getElementsByClassName("custom-button-loop").length == 0;

    if (!isLoopVideoButton) {
      return;
    }

    const newDiv = document.createElement("div");

    newDiv.classList.add(
      "custom-button-loop-container"
      // "yt-spec-button-shape-next",
      // "yt-spec-button-shape-next--tonal",
      // "yt-spec-button-shape-next--mono",
      // "yt-spec-button-shape-next--size-m",
      // "yt-spec-button-shape-next--icon-leading",
      // "yt-spec-button-shape-next--enable-backdrop-filter-experiment"
    );

    addLoopVideoIcon(newDiv);

    const loopBtn = document.querySelector("#loop-btn-style");

    if (loopBtn) {
      loopBtn.addEventListener("click", () => loopVideo());
    }
  }
}, 1000);
