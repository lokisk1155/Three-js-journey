## What are textures

images that cover the surface of your geometries

## Types of Textures

All textures follow PBR Principles (Physically Based Rendering)

### 1. Albedo:

- takes the pixels of the texture and applies directly

### 2. Alpha:

- grayscale image where the white will be visible and the black won't

### 3. Height:

- grayscale image that will move the veritices to create some relief (requires subdivisons)

### 4. Normal:

- adds small details that don't move verticies, great for performance;change the way light bounces off an object

### 5. Ambient occlusion:

- grayscale image that will fake shadows in the surfaces crevices, helps create contrast

### 6. Metalness:

- grayscale; helps create a relfection by controling what parts are metallic and which are not

### 7. Roughness:

- grayscale that comes with metalness; specifies which parts are rough and smooth to change reflection of light

## TextureLoader

3 built in functions

1. load; do something after the image is loaded
2. progress; do something during loading
3. error; do something if something went wrong

## UV unwrapping

the concept of mapping textures to cordinates so they can be transformed to fit our geometries

## Transforming the texture

### 1. Repeat

- You can repeat the texture using the repeat property, which is a Vector2, meaning that it has x and y properties.

```
const colorTexture = textureLoader.load('/textures/door/color.jpg')
colorTexture.repeat.x = 2
colorTexture.repeat.y = 3
```

- wrapping like this will stretch your pixels to fit
- you have to update the wrapS and wrapT properties using the THREE.RepeatWrapping constant

```
colorTexture.wrapS = THREE.RepeatWrapping // x axis
colorTexture.wrapT = THREE.RepeatWrapping // y axis
```

- THREE.MirroredRepeatWrapping will change the direction of your wrap

### 2. Offset

- property that is also a Vector2 with x and y properties
- changing these will simply offset the UV coordinates

### 3. Rotation

You can rotate the texture using the rotation property, which is a simple number corresponding to the angle in radians

# Filtering and Mipmapping

Mipmapping (or "mip mapping" with a space) is a technique that consists of creating half a smaller version of a texture again and again until you get a 1x1 texture. All those texture variations are sent to the GPU, and the GPU will choose the most appropriate version of the texture. Three.js and the GPU already handle all of this, and you can just set what filter algorithm to use. There are two types of filter algorithms: the minification filter and the magnification filter.

## 1. Minification filter

The minification filter happens when the pixels of texture are smaller than the pixels of the render. In other words, the texture is too big for the surface
If you are not satisfied you you can change the minification filter of the texture using the minFilter proper:

1. THREE.NearestFilter
2. THREE.LinearFilter
3. THREE.NearestMipmapNearestFilter
4. THREE.NearestMipmapLinearFilter
5. THREE.LinearMipmapNearestFilter
6. THREE.LinearMipmapLinearFilter

## 2. Magnification filter

The magnification filter works just like the minification filter, but when the pixels of the texture are bigger than the render's pixels. In other words, the texture too small for the surface it covers.
You can alter the filter's magFilter property with either

1. THREE.NearestFilter (best performance)
2. THREE.LinearFilter
