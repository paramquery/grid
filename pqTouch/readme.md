# pqtouch

A lightweight JavaScript utility that adds robust touch support to jQuery UI components. It works seamlessly with standard rendering as well as complex modern controls utilizing virtual rendering (virtual scrolling/windowing).

Inspired by the classic **jQuery UI Touch Punch** by Dave Furfero, `pqtouch` bridges the gap for modern high-performance web applications where Touch Punch falls short due to virtualized DOM nodes.

## Features

* **Universal Touch Support:** Automatically maps touch events to mouse events (`touchstart` → `mousedown`, `touchmove` → `mousemove`, `touchend` → `mouseup`).


* **Virtual Rendering Compatible:** Designed specifically to handle modern grid systems, spreadsheets, and lists that dynamically create and destroy DOM elements during scroll or interaction.


* **Non-Intrusive Integration:** Works under the hood by safely monkey-patching the core jQuery UI `$.ui.mouse` prototype.


* **Plug and Play:** Zero configuration required; just include it after jQuery UI, and your widgets instantly become touch-ready.



## Why pqtouch?

Traditional solutions like Touch Punch map events based on static DOM layouts. When dealing with modern, virtualization-heavy UI controls (where elements are dynamically rendered and recycled in the viewport), standard event translation often breaks down, drops tracking, or fails to target the correct virtual element.

`pqtouch` addresses this limitation by enhancing how the jQuery UI mouse prototype tracks interaction vectors, ensuring that virtualized elements respond perfectly to swipes, drags, and taps.

## Installation

You can install `pqtouch` via npm or download it directly for browser usage.

```bash
npm install pqtouch

```

## Usage

### Browser (Script Tag)

Include `pqtouch` right after your jQuery and jQuery UI scripts.

```html
<!-- Include jQuery and jQuery UI -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="path/to/jquery-ui.min.js"></script>

<!-- Include pqtouch to patch the mouse prototype -->
<script src="node_modules/pqtouch/pqtouch.js"></script>

<script>
  // Your jQuery UI controls (even those with virtual rendering) now support touch!
  $( "#draggable" ).draggable();
  $( "#selectable" ).selectable();
</script>

```

### Module Bundlers (Webpack, Rollup, Vite)

If you are using a modern build system, simply import it after jQuery UI has been loaded.

```javascript
import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';
import 'pqtouch'; // This applies the monkey-patch automatically

```

## How It Works

`pqtouch` hooks into the internal mechanisms of `$.ui.mouse._mouseInit`. It intercepts the initialization of any widget inheriting from the mouse widget and attaches touch event listeners. When a touch gesture is detected, it synthesizes a corresponding native mouse event and dispatches it, ensuring the target calculations remain accurate even when the DOM updates underneath the touch pointer due to virtual rendering.

## Credits

* Inspired by the exceptional groundwork laid out by Dave Furfero in **jQuery UI Touch Punch**.



## License

This project is open-source and available under the [MIT License](https://www.google.com/search?q=LICENSE).