### Css

- you can write standard css and import the style sheet

### Fix canvas on resize

- you add add an event listener called 'resize'
- inside of the event listener you can update the canvas's size + the cameras aspect ratio
- must always update the renderer for our changes to appear

### How to handle pixel ratio

- if things appear blurry, it is probably because you are testing on a screen with a pixel ratio greater than 1.
- the more pixel's the harder the program is to render
- you can use setPixelRatio to control this
- renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

### Double Click to fullscreen

- you can use the 'dblclick' event listener as a common way to toggle fullscreen
- const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
- ^ for different browsers
- canvas.requestFullScreen
- document.exitFullscreen()
- canvas.webkitRequestFullscreen()
- document.webkitExitFullscreen()
