let audioInstance = null;
let youtubePlayerFrame = null;

// Initialize when DOM is ready
const CHAPTER_NEXT = {
  1: { html: "gift.html", css: "css/gift.css", js: "js/gift.js" },
  2: { html: "story.html", css: "css/story.css", js: "js/story.js" },
  3: { html: "letter.html", css: "css/letter.css", js: "js/letter.js" },
  4: { html: "surprise.html", css: "css/surprise.css", js: "js/surprise.js" },
  5: { html: "wish.html", css: "css/wish.css", js: "js/wish.js" },
  6: { html: "ending.html", css: "css/ending.css", js: "js/ending.js" }
};

function prefetchHref(href, rel = "prefetch") {
  if (!href || document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = rel;
  link.href = href;
  if (href.endsWith(".js")) link.as = "script";
  if (href.endsWith(".css")) link.as = "style";
  document.head.appendChild(link);
}

function prefetchNextChapter() {
  const chapter = document.querySelector("main.journey")?.dataset.chapter;
  const next = CHAPTER_NEXT[chapter];
  if (!next) return;
  prefetchHref(next.html);
  prefetchHref(next.css, "preload");
  prefetchHref(next.js, "preload");
}

document.addEventListener("DOMContentLoaded", () => {
  // 1. Keep the HTML overlay if present so the next page is covered on first paint
  let overlay = document.querySelector(".page-transition-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "page-transition-overlay";
    overlay.setAttribute("aria-hidden", "true");
    document.body.prepend(overlay);
  }

  prefetchNextChapter();

  // 2. Inject Ambient Particle Layer if not present
  let ambientLayer = document.querySelector(".ambient");
  if (!ambientLayer) {
    ambientLayer = document.createElement("div");
    ambientLayer.className = "ambient";
    ambientLayer.setAttribute("aria-hidden", "true");
    ambientLayer.innerHTML = `
      <span class="aura aura-one"></span>
      <span class="aura aura-two"></span>
      <span class="aura aura-three"></span>
      <div id="particleLayer" class="particle-layer"></div>
    `;
    document.body.appendChild(ambientLayer);
  }

  // 3. Inject Progress Indicator (for chapters 1 to 6)
  const mainJourney = document.querySelector("main.journey");
  if (mainJourney) {
    const chapter = mainJourney.getAttribute("data-chapter");
    if (chapter && parseInt(chapter) >= 1 && parseInt(chapter) <= 6) {
      const progressPill = document.createElement("div");
      progressPill.className = "progress-indicator";
      progressPill.innerHTML = `Mahlet's journey · ${chapter}/7 <span aria-hidden="true" class="progress-heart-container" style="color: var(--pink); display: inline-flex; align-items: center; margin-left: 0.3rem; vertical-align: middle; width: 0.95rem; height: 0.95rem;"><svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></span>`;
      document.body.appendChild(progressPill);
    }
  }

  // 4. Initialize Background Music
  initBackgroundMusic();

  // 5. Spawn Ambient Particles
  createAmbientParticles();
  createFavoriteThingDoodles();

  // 6. Reveal after the first paint so the overlay never flashes away early
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add("is-loaded");
      if (mainJourney) {
        mainJourney.classList.add("is-active");
      }
    });
  });
});

// Particle Spawning Logic
function createAmbientParticles() {
  const particleLayer = document.getElementById("particleLayer");
  if (!particleLayer) return;

  const symbols = ["✦", "♡", "❀", "·", "✧"];
  const fragment = document.createDocumentFragment();
  const count = window.innerWidth < 600 ? 18 : 35; // Optimize particle count for mobile performance

  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.textContent = symbols[index % symbols.length];
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${12 + Math.random() * 15}s`;
    particle.style.animationDelay = `${Math.random() * -20}s`;
    particle.style.opacity = `${0.2 + Math.random() * 0.5}`;
    particle.style.fontSize = `${0.6 + Math.random() * 0.9}rem`;
    fragment.appendChild(particle);
  }

  particleLayer.appendChild(fragment);
}

// Each chapter gets a different handful of tiny references to the things Mahlet likes.
// They sit behind the interaction, like doodles in the margins of a storybook.
function createFavoriteThingDoodles() {
  const mainJourney = document.querySelector("main.journey");
  if (!mainJourney) return;

  const chapter = Number(mainJourney.dataset.chapter || 1);
  const motifs = [
    "✦", "⋆", "☾", // stars and galaxy
    "♆", "❦",       // Greek mythology: trident and laurel
    "▱", "▰",       // little book-page marks
    "✿", "☺", "⌁"  // flowers, fun, and a curl
  ];
  const doodleLayer = document.createElement("div");
  doodleLayer.className = "favorite-thing-doodles";
  doodleLayer.setAttribute("aria-hidden", "true");

  // The pieces are deliberately placed around the page edges so they are visible
  // without hiding the gifts, buttons, photos, or writing.
  const edgePositions = [
    [7, 17], [88, 18], [7, 48], [90, 51], [8, 79], [87, 80], [18, 91], [78, 91]
  ];
  const count = window.innerWidth < 600 ? 7 : 8;
  for (let index = 0; index < count; index += 1) {
    const doodle = document.createElement("span");
    doodle.className = "favorite-thing-doodle";
    doodle.textContent = motifs[(index * 3 + chapter * 2 + Math.floor(Math.random() * motifs.length)) % motifs.length];
    const [left, top] = edgePositions[index];
    doodle.style.left = `${left}%`;
    doodle.style.top = `${top}%`;
    doodle.style.fontSize = `${1.25 + Math.random() * 1.25}rem`;
    doodle.style.animationDelay = `${Math.random() * -8}s`;
    doodle.style.animationDuration = `${5 + Math.random() * 7}s`;
    doodleLayer.appendChild(doodle);
  }
  mainJourney.appendChild(doodleLayer);
}

// Background Music Persistence Logic
function initBackgroundMusic() {
  if (typeof BirthdayConfig === "undefined" || (!BirthdayConfig.musicUrl && !BirthdayConfig.youtubeVideoId)) return;

  const path = window.location.pathname;

  // The first page resets an old visit. After the book is opened, keep the
  // playback flag as the next early page loads.
  const isEarlyPage = path.includes("index.html") || path.includes("gift.html") || path === "/" || path === "";
  if (isEarlyPage) {
    const isOpeningPage = path.includes("index.html") || path === "/" || path === "";
    if (isOpeningPage) {
      sessionStorage.removeItem("musicPlaying");
      sessionStorage.removeItem("musicTime");
      sessionStorage.removeItem("volumeIncreased");
      sessionStorage.removeItem("musicInitialized");
      // Preload the chosen YouTube player while the opening page is visible.
      // The first book tap can then start sound immediately instead of waiting
      // for YouTube to load during the page transition.
      if (BirthdayConfig.youtubeVideoId) {
        initYouTubeMusic(BirthdayConfig.youtubeVideoId, false);
      }
    }

    // Create the local player even on the first page. Previously it was only
    // created from the story page onward, so the opening-book tap had no audio
    // element to play.
    if (BirthdayConfig.musicUrl && !BirthdayConfig.youtubeVideoId) {
      let earlyAudio = document.getElementById("global-background-music");
      if (!earlyAudio) {
        earlyAudio = document.createElement("audio");
        earlyAudio.id = "global-background-music";
        earlyAudio.loop = true;
        earlyAudio.preload = "auto";
        earlyAudio.src = BirthdayConfig.musicUrl;
        document.body.appendChild(earlyAudio);
      }
      audioInstance = earlyAudio;
      earlyAudio.volume = 0.22;

      const savedEarlyTime = sessionStorage.getItem("musicTime");
      if (savedEarlyTime) earlyAudio.currentTime = parseFloat(savedEarlyTime);
      if (!isOpeningPage && sessionStorage.getItem("musicPlaying") === "true") {
        attemptPlayMusic();
      }
    }
    return;
  }

  // Restrict background music loading to story, letter, surprise, wish, ending (Chapters 3 to 7)
  const isMusicPage = path.includes("story.html") || 
                      path.includes("letter.html") || 
                      path.includes("surprise.html") || 
                      path.includes("wish.html") || 
                      path.includes("ending.html");
  if (!isMusicPage) return;

  // Initialize playback state when story.html opens
  if (path.includes("story.html") && !sessionStorage.getItem("musicInitialized")) {
    // Only start at zero when the visitor reached the story without opening
    // the book first. Otherwise keep the opening page's saved position.
    if (sessionStorage.getItem("musicPlaying") !== "true") {
      sessionStorage.setItem("musicPlaying", "true");
      sessionStorage.setItem("musicTime", "0");
      sessionStorage.setItem("volumeIncreased", "false");
    }
    sessionStorage.setItem("musicInitialized", "true");
  }

  // A YouTube song needs an embedded player rather than an <audio> element.
  if (BirthdayConfig.youtubeVideoId) {
    const shouldResumeYouTube = sessionStorage.getItem("musicPlaying") === "true";
    initYouTubeMusic(BirthdayConfig.youtubeVideoId, shouldResumeYouTube);
    if (shouldResumeYouTube) {
      queueYouTubePlayback();
    }
    return;
  }

  let audio = document.getElementById("global-background-music");
  if (!audio) {
    audio = document.createElement("audio");
    audio.id = "global-background-music";
    audio.loop = true;
    audio.preload = "auto";
    audio.src = BirthdayConfig.musicUrl;
    document.body.appendChild(audio);
  }
  audioInstance = audio;

  const savedTime = sessionStorage.getItem("musicTime");
  const isPlaying = sessionStorage.getItem("musicPlaying");
  const volumeIncreased = sessionStorage.getItem("volumeIncreased") === "true";

  if (savedTime) {
    audio.currentTime = parseFloat(savedTime);
  }

  // Set volume based on persistent progress
  if (volumeIncreased || audio.currentTime >= 17) {
    audio.volume = 0.75;
    sessionStorage.setItem("volumeIncreased", "true");
  } else {
    audio.volume = 0.15;
  }

  if (isPlaying === "true") {
    const isFirstStoryPlay = path.includes("story.html") && parseFloat(savedTime || "0") === 0;
    attemptPlayMusic(isFirstStoryPlay);
  }

  // Monitor playback time to trigger climax transition after 17 seconds
  audio.addEventListener("timeupdate", () => {
    sessionStorage.setItem("musicTime", audio.currentTime);
    
    const hasIncreased = sessionStorage.getItem("volumeIncreased") === "true";
    if (audio.currentTime >= 17 && !hasIncreased) {
      sessionStorage.setItem("volumeIncreased", "true");
      fadeVolume(0.15, 0.75, 2500); // Fades volume from 15% to 75% over 2.5s
    }
  });
}

function initYouTubeMusic(videoId, autoplay = false) {
  let frame = document.getElementById("youtube-background-music");
  if (!frame) {
    frame = document.createElement("iframe");
    frame.id = "youtube-background-music";
    frame.className = "youtube-background-player";
    frame.title = "Background music";
    frame.allow = "autoplay; encrypted-media";
    frame.setAttribute("aria-hidden", "true");
    frame.src = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=${autoplay ? 1 : 0}&mute=0&loop=1&playlist=${encodeURIComponent(videoId)}&controls=0&disablekb=1&playsinline=1&modestbranding=1&enablejsapi=1`;
    frame.addEventListener("load", () => {
      frame.dataset.ready = "true";
      if (sessionStorage.getItem("musicPlaying") === "true") {
        startYouTubeAudio();
      }
    });
    document.body.appendChild(frame);
  }
  youtubePlayerFrame = frame;
}

function sendYouTubeCommand(command, args = "") {
  if (!youtubePlayerFrame || !youtubePlayerFrame.contentWindow) return;
  youtubePlayerFrame.contentWindow.postMessage(JSON.stringify({
    event: "command",
    func: command,
    args
  }), "*");
}

function startYouTubeAudio() {
  // These are the exact commands understood by YouTube's iframe player.
  sendYouTubeCommand("unMute");
  sendYouTubeCommand("setVolume", [38]);
  sendYouTubeCommand("playVideo");
  // The player may still be preparing on slow connections, so repeat once.
  setTimeout(() => {
    sendYouTubeCommand("unMute");
    sendYouTubeCommand("setVolume", [38]);
    sendYouTubeCommand("playVideo");
  }, 900);
}

function queueYouTubePlayback() {
  const play = () => startYouTubeAudio();
  play();
  ["click", "touchstart", "pointerdown", "keydown"].forEach((eventName) => {
    document.addEventListener(eventName, play, { once: true, passive: true });
  });
}

function startGlobalMusic() {
  sessionStorage.setItem("musicPlaying", "true");
  sessionStorage.setItem("musicInitialized", "true");
  // This is called inside the very first "open the book" tap. Creating the
  // autoplay iframe here preserves that gesture for mobile browsers.
  if (!youtubePlayerFrame && typeof BirthdayConfig !== "undefined" && BirthdayConfig.youtubeVideoId) {
    initYouTubeMusic(BirthdayConfig.youtubeVideoId, true);
    return;
  }
  if (youtubePlayerFrame) {
    queueYouTubePlayback();
    return;
  }
  if (audioInstance) {
    attemptPlayMusic();
  }
}

function attemptPlayMusic(forceWait = false) {
  if (!audioInstance) return;

  // Enhance iOS compatibility configurations
  audioInstance.setAttribute("playsinline", "true");
  audioInstance.setAttribute("webkit-playsinline", "true");

  const tryPlay = () => {
    audioInstance.play()
      .then(() => {
        console.log("Playback successfully started/unlocked on interaction!");
        removeUnlockListeners();
      })
      .catch((error) => {
        console.log("Playback attempt blocked: ", error.message);
        // Playback failed, listeners remain attached to retry on next user action
      });
  };

  const unlockEvents = ["click", "touchstart", "pointerdown", "keydown", "scroll"];

  const handleInteraction = () => {
    tryPlay();
  };

  const removeUnlockListeners = () => {
    unlockEvents.forEach((evt) => {
      document.removeEventListener(evt, handleInteraction, { passive: true });
    });
  };

  const addUnlockListeners = () => {
    unlockEvents.forEach((evt) => {
      document.addEventListener(evt, handleInteraction, { passive: true });
    });
  };

  if (forceWait) {
    console.log("Audio waiting for first interaction gesture.");
    addUnlockListeners();
  } else {
    // Attempt playing immediately (standard unlock restore)
    audioInstance.play()
      .then(() => {
        console.log("Audio played immediately successfully!");
      })
      .catch((error) => {
        console.log("Autoplay blocked immediately. Registering unlock gesture handlers: ", error.message);
        addUnlockListeners();
      });
  }
}

// Page Transition Helper
let isNavigating = false;

function navigateWithTransition(url) {
  if (isNavigating) return;
  prefetchHref(url);

  const overlay = document.querySelector(".page-transition-overlay");
  if (overlay) {
    overlay.classList.remove("is-loaded");
    overlay.classList.add("is-exiting");
  }

  if (audioInstance) {
    sessionStorage.setItem("musicTime", audioInstance.currentTime);
  }

  const go = () => {
    if (isNavigating) return;
    isNavigating = true;
    window.location.href = url;
  };

  if (overlay) {
    overlay.addEventListener("transitionend", (event) => {
      if (event.propertyName === "opacity") go();
    }, { once: true });
  }
  setTimeout(go, 240);
}

// Volume fade transitions (for playing voice notes cleanly)
function fadeOutMusic(duration = 1000) {
  if (youtubePlayerFrame) {
    // The YouTube player cannot be volume-faded without its full API; pause softly instead.
    setTimeout(() => sendYouTubeCommand("pauseVideo"), duration);
    sessionStorage.setItem("musicPlaying", "false");
    return;
  }
  if (!audioInstance) return;
  const startVolume = audioInstance.volume;
  const interval = 50;
  const steps = duration / interval;
  const delta = startVolume / steps;

  const timer = setInterval(() => {
    if (audioInstance.volume > delta) {
      audioInstance.volume -= delta;
    } else {
      audioInstance.volume = 0;
      audioInstance.pause();
      sessionStorage.setItem("musicPlaying", "false");
      clearInterval(timer);
    }
  }, interval);
}

function fadeInMusic(targetVolume, duration = 1000) {
  if (youtubePlayerFrame) {
    sessionStorage.setItem("musicPlaying", "true");
    queueYouTubePlayback();
    return;
  }
  if (!audioInstance) return;

  if (targetVolume === undefined) {
    const volumeIncreased = sessionStorage.getItem("volumeIncreased") === "true";
    targetVolume = volumeIncreased ? 0.75 : 0.15;
  }

  audioInstance.volume = 0;
  sessionStorage.setItem("musicPlaying", "true");
  audioInstance.play().then(() => {
    const interval = 50;
    const steps = duration / interval;
    const delta = targetVolume / steps;

    const timer = setInterval(() => {
      if (audioInstance.volume < targetVolume - delta) {
        audioInstance.volume += delta;
      } else {
        audioInstance.volume = targetVolume;
        clearInterval(timer);
      }
    }, interval);
  }).catch(e => console.log(e));
}

// Volume fade progression helper (linear transition between two levels)
function fadeVolume(start, end, duration = 2500) {
  if (!audioInstance) return;
  const interval = 50;
  const steps = duration / interval;
  const delta = (end - start) / steps;
  let currentVolume = start;
  audioInstance.volume = currentVolume;

  const timer = setInterval(() => {
    currentVolume += delta;
    if ((delta > 0 && currentVolume >= end) || (delta < 0 && currentVolume <= end)) {
      audioInstance.volume = end;
      clearInterval(timer);
    } else {
      audioInstance.volume = Math.max(0, Math.min(1, currentVolume));
    }
  }, interval);
}
