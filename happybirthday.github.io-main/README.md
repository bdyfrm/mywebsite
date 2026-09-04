# Mahlet's September 5 Gift

A mobile-first interactive birthday experience made for Mahlet — also known here as “My favorite almost.”

This project is a pure HTML, CSS, and JavaScript digital gift with soft animations, glassmorphism, a memory hunt, a story timeline, a handwritten-style letter, a surprise reveal, and a quiet emotional ending.

It is deliberately page-by-page rather than scrollable: every moment asks Mahlet to tap, choose, hold, play, shake, or open something before the next surprise appears.

Small Greek-mythology, galaxy, book, flower, playful, and curly-crown motifs are scattered as page-specific storybook doodles.

## Preview

Open `index.html` in any browser.

No build step. No framework. No dependencies except Google Fonts.

## Experience Flow

1. **Secret Invitation**
   A full-screen opening scene with floating particles, a glass card, and an animated gift box.

2. **Memory Hunt Game**
   Five gift boxes appear. Only one unlocks the next part of the journey. Wrong choices show cute playful messages.

3. **Our Story**
   A vertical mobile-friendly timeline with emotional story cards and photo placeholders.

4. **Birthday Letter**
   A dark elegant scene with a paper letter, handwritten typography, and a slow typewriter reveal.

5. **Surprise Box**
   A large animated gift opens dramatically, releasing floating memories and soft confetti.

6. **Wish and Ending**
   A shake-or-tap candle interaction leads to a slow photo montage and an ending where “almost” is gently crossed out, leaving “my favorite.”

## Features

- Mobile-first responsive layout
- Pure HTML, CSS, and JavaScript
- Smooth scrolling and level transitions
- Glassmorphism UI
- Floating hearts, particles, stars, and soft confetti
- Animated gift boxes
- Scroll-revealed story timeline
- Typewriter letter animation
- Optional background music support
- Easy text and photo customization
- Fast static-site loading

## Folder Structure

```text
├── index.html                 # start here
├── gift.html … ending.html    # the seven interactive moments
├── js/config.js               # Mahlet's text, photos, and audio settings
├── css/                       # styling for each moment
└── 0628.MP3                   # current background track
```

## Customize together

Everything intended for editing is in `js/config.js`. Search for `[PLACEHOLDER` to find the memory notes, photos, sign-off, and closing sentence that still need your details.

### Change the Letter

Edit `letterText` in `js/config.js`.

### Change Story Cards

Edit the `storyTimeline` array in `js/config.js`:

```js
{
  title: "✨ First Conversation",
  text: "Write your personal memory here.",
  photo: "assets/photos/first-conversation.jpg"
}
```

### Add Photos

Create a folder like this:

```text
assets/
└── photos/
    ├── first-conversation.jpg
    ├── favorite-photo.jpg
    └── best-memory.jpg
```

Then set the matching `photo` fields in `js/config.js`.

For a video page, put the `.mp4` path in `photo` (or `media`) and set that story card's `mediaType` to `"video"`. It will appear as a tappable, phone-friendly video in the memory book.

If a photo field is empty, the site uses a soft gradient placeholder.

### Add Background Music

Create:

```text
assets/
└── music/
    └── background.mp3
```

The current local soundtrack is `mp3.m4a` in the project root. The site will loop it after Mahlet taps the opening book. To use a different song or filename, update `musicUrl` in `js/config.js`.

## Run Locally

Option 1: open `index.html` directly in your browser.

Option 2: serve it locally:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts

## Notes

This website is designed to feel personal. Replace the placeholder text and photos with real memories for the best effect.

The final screen intentionally has no restart button or call to action. It is meant to end quietly.
