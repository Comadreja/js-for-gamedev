# Canvas

The arrival of HTML5 brought us several HTML elements and JavaScript APIs that grant us the possibility of programming video games with Web standards and technologies; among them the `<canvas>` element and its JavaScript API, which allows us to draw graphics on the screen, both 2D and 3D.

## The `<canvas>` element

This HTML tag creates a canvas of the specified width and height. On this canvas, we will be able to draw by using the Canvas API.

```html
<canvas width="320" height="200"></canvas>
```

The **dimensions** of the canvas as specified in its HTML tag with `width` and `height` are not necessarily equivalent to on-screen size, but rather to a virtual size unit. By default, `1` of this unit equals `1` pixel; but CSS allows us to set the scale. For instance, the following code would scale our prior canvas to a `200%` of its original size.

```css
canvas {
    width: 640px;
    height: 480px;
}
```

We can take advantage of this and play around with the scale, or adapt our game to different screen sizes. For instance, this article explains how we can use scaling for retro video games with pixel art: [_Retro, crisp pixel art in HTML5 games_](https://belenalbeza.com/retro-crisp-pixel-art-in-html-5-games/).

## The Canvas API

The Canvas API allows us to carry out 2D drawing operations on a `<canvas>` element. With it we can render images, manipulate pixels, draw graphical primitives, curves, etc.

Below are two important resources:

- [Documentation on the MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).
- [Canvas Deep Dive](http://joshondesign.com/p/books/canvasdeepdive/toc.html): a concise yet comprehensive online book.


### Contexts

In order to carry out any drawing operation, we need to obtain a **2D context** from a `<canvas>`. To this end, we shall use the `getContext` method and specify to it that we need a 2D context.

Example:

```javascript
var ctx = document.querySelector('canvas').getContext('2d');
ctx.fillRect(10, 10, 100, 100);
```

![Screenshot](images/canvas_ex01.png)

See the online [code snippet](https://jsfiddle.net/nea366Lm/).

### Colors, borders, etc.

The way the Canvas API does its work is similar to that of a drawing program. Within the **context** we set the styles (background color, border thickness, etc.) we want the "tools" (in this case, the drawing operations) to use.

Keep in mind this system has a "memory", and styles are kept from one operation to the next. That is to say, if we specify in the context that from now on we shall use the red color, _all_ of the following drawing operations shall use this color, not only the next.

Example:

```javascript
// red rectangles
ctx.fillStyle = '#FF004D';
ctx.fillRect(10, 10, 100, 100);
ctx.fillRect(190, 10, 100, 100);
// blue rect with white border
ctx.fillStyle = 'rgba(41, 173, 255, 0.8)';
ctx.fillRect(50, 50, 100, 100);
ctx.strokeStyle = '#fff';
ctx.lineWidth = 5;
ctx.strokeRect(50, 50, 100, 100);
```

![Screenshot](images/canvas_ex02.png)

See the online [code snippet](https://jsfiddle.net/x8knv6w3/2/).


### Images

We can render images on the canvas, but they need to **be loaded first**. The most trivial way of doing this is to use an image loaded with `<img>`, but we can obtain images from other sources: the user's webcam, a `<video>`, another `<canvas>` element, etc.

Example:

```html
<img src="kitten.png" alt="A cute kitten" id="kitten">
<canvas width="300" height="300"></canvas>
```

```javascript
window.onload = function () {
    var img = document.getElementById('kitten');
    var ctx = document.querySelector('canvas')
        .getContext('2d');

    ctx.drawImage(img, 0, 0);
}
```

You can see the image created with `<img>`, and the `<canvas>` element next to it, with the same image drawn:

![Screenshot](images/canvas_ex03.png)

The example works because the **`load` event from `window`** fires when all of the images included in the HTML document have loaded, so we know for sure that it is already available to be drawn on the canvas.

See the online [code snippet](https://jsfiddle.net/j4hbb46h/1/).

### Loading images on the fly

Having to create a `<img>` tag within our HTML for every image we want to load is bothersome. Most engines or game or graphics libraries dynamically create `Image` objects with JavaScript, which are not added to the DOM, and are therefore not visible.

The steps to loading an image this way would be:

1. We use the constructor **`Image`**.
2. We subscribe to the **`load`** event (in order to draw the image when it has loaded).
3. We set the **`src`** attribute of the image in order to start loading.


```javascript
window.onload = function () {
    var img = new Image();
    img.addEventListener('load', function () {
        ctx.drawImage(img, 0, 0);
    });
    img.src = 'https://placekitten.com/g/300/300';
}
```

![Screenshot](images/canvas_ex04.png)

See the online [_snippet_ de código](https://jsfiddle.net/Lm56dcb6/).

### Further info on image loading

`<img>` elements which have the `display:none` style are invisible to the user, but they _are still loaded_ all the same. This is commonly used in order to hide the images that are drawn on the canvas. As we have mentioned previously, the `load` event of `window` fires when –among other things– all of the images in the DOM have loaded, whether they are visible or not. Due to this, we can load images using only HTML and CSS, although it is something of a chore.

In order to load images from JavaScript, using new `Image` instances, we often use [Promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise), or a counter in order to check whether all of them are done loading.

### Other Canvas API operations

The Canvas API is extensive and allows us to carry out many other operations, among them:

- Drawing curves and complex paths
- Gradient paintingPintar gradientes
- Clipping
- Transformations
- Pixel manipulation
- Etc.

## WebGL

WebGL is an API that allows us to operate with **3D graphics** in a `<canvas>` element. Its philosophy is completely different from the Canvas API; it is a far more complex API, but also a very powerful one.

WebGL is a JavaScript implementation of **OpenGL ES 2.0**, which is an industry standard for 3D graphics drawing.

In order to be able to use it, we need to obtain a **3D context** from a `<canvas>` element. To this end, we must specify the `webgl` parameter –or `experimental-webgl` for some browsers– in the call for `getContext`.

There is [documentation on this API available on the MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API).

### 2D Graphics on WebGL

In video game development, it is common to use a 3D graphics API for 2D video games. The reason is none other than performance: some operations executed on 3D graphics are more efficient, such as _Z-ordering_, rotation, transparency, etc.

There is the possibility of **simulating a 2D world** by using a 3D graphics API, such as WebGL. The "trick" is to use an orthographic projection, which does not warp objects due to perspective. 2D graphics are then polygons with a texture within this 2D space.

Many 2D game libraries and graphics engines in JavaScript –Pixi and Phaser among them– offer the possibility of using WebGL as their graphics API instead of Canvas's API.

### Resources

For further learning on WebGL, we recommend the below resources:

- [WebGL on the MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API): documentation, guides, tutorials, etc.
- Introduction to WebGL [part 1](https://dev.opera.com/articles/introduction-to-webgl-part-1/) and [part 2](https://dev.opera.com/articles/introduction-to-webgl-part-2-porting-3d/)
- [WebGL fundamentals](http://webglfundamentals.org/): step-by-step tutorials

## Graphics libraries

There are two extremely popular graphical operation libraries for JavaScript. They are only graphics libraries, so they do not implement any other functionalities that are necessary for a video game. However, they make for a good starting point whether we are developing our own engine, or when we only need to draw graphics for a certain project.

Many engines use them as their graphics layer, so it is convenient to know them if we want to modify an engine or access features of these libraries that are not exposed by the engine.

### 2D Graphics: Pixi.js

- [www.pixijs.com](http://www.pixijs.com/)
- Works with WebGL by default, but it can fallback to Canvas 2D.
- Phaser uses Pixi for graphics rendering.

### 3D Graphics: THREE.js

- [www.threejs.org](https://threejs.org/)
- The reference library for graphics work on WebGL, which greatly simplifies the use of this API.
- Makes it easier to render graphics for their use with WebVR (Web API for virtual reality).
- There is an endless amount of tutorials, books and other documentation available.

## Animations

So far we have only seen how to render static graphics on a canvas, but images on a video game are moving ones.

In video game development, we shall ideally aim to render images on the canvas **60 times per second** (60 FPS, or **frames per second**). To this end, neither `setTimeout` or `setInterval` are reliable, since they are not accurate and there is nothing to guarantee that they will be executed (you can see the reasons for this [in the documentation](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout#Reasons_for_delays_longer_than_specified)).

The proper way to render animations on a canvas is by using `requestAnimationFrame`.

### `requestAnimationFrame`

This function takes a callback that will be automatically called the next time the browser **can draw** on the screen. Within this callback we shall include the drawing operations we want to carry out, as well as a new call to `requestAnimationFrame`, thus establishing a continuous **loop**.

Example:

```javascript
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(x, 25, 50, 50);
    x = (x + 1) % canvas.width;

    requestAnimationFrame(render);
}

requestAnimationFrame(render);
```

You can see a comparison of the same rendering code running with `requestAnimationFrame` and with `setInterval`. You can see how the animation with `requestAnimationFrame` is more fluid, especially if you change tabs in the browser, switch it to the background, etc.

- [Code snippet](https://jsfiddle.net/oxx3h8dp/2/) using `requestAnimationFrame`.
- [Code snippet](https://jsfiddle.net/m92kpe4n/2/) using `setInterval`.

### Delta Time

**Delta Time** is the name given in video game development to the time elapsed between the current frame and the next. It is necessary for this time to be accurate, as much of the game logic relies on it: animation, physics, etc.

Although `Date` is usually employed in Web programming for date management, not only is it inefficient to create repeated instances of `Date`, but these objects do not have the necessary resolution for a video game, which usually demands miliseconds in the decimal range.

There is an alternative, which is to use timestamp objects, `DOMHighResTimeStamp`, such as those returned by using the [`Performance`](https://developer.mozilla.org/en-US/docs/Web/API/Performance) interface. These timestamps have a margin of error of only 5 microseconds. In addition, and much to our convenience, `requestAnimationFrame` calls our **callback with a timestamp**.

In practice, this parameter allows us to accurately calculate the delta time. The timestamp we obtain contains the amount of miliseconds elapsed since the first call to `requestAnimationFrame`. If we keep storing the value of the timestamp for the prior frame, we can calculate the delta time:

Example:

```javascript
const SPEED = 60; // pixels per second
var oldTimestamp = 0;

function render(timestamp) {
  var delta = (timestamp - oldTimestamp) / 1000.0;
  oldTimestamp = timestamp;

  // ...
  x = (x + SPEED * delta) % canvas.width;
  requestAnimationFrame(render);
}
```

You can try this online [code snippet](https://jsfiddle.net/0e11fv91/2/).

Some **considerations** on delta time to keep in mind:

- An **upper bound** must _always_ be set on the delta time value (e.g., 250ms) in order to prevent grlitches in the game logic. A big "skip" in delta time can cause collision errors, abnormal functioning in the physics engine, etc.

- Sometimes it is recommendable to skip our game's **update** by a **frame** (for instance, [as Phaser does](https://github.com/photonstorm/phaser/blob/master/src/core/Game.js#L784)).
