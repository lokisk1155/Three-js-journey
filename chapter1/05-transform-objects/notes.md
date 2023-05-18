## 4 properties to transform an object

- properties are combined into matrices

1. position (move)
2. scale (resize)
3. rotation (rotate)
4. quaternion (also rotate)

### position

- an instance of the Vector3 class
- 3 essential properties: x, y, z
- z = backwards
- y = up
- x = right

### scale

- also an instance of the Vector3 class
- default value of x, y, and z are 1

### Rotation

- can be handled by both the rotation and quaternaion properties
- both are instances of the class Euler
- If you spin on the y axis, you can picture it like a carousel.
- If you spin on the x axis, you can imagine that you are rotating the wheels of a car you'd be in.
- If you rotate on the z axis, you can imagine that you are rotating the propellers in front of an aircraft you'd be in.

### Quaternion

- express a rotation is a mathmatical way which solve order issues with the rotation property

## lookAt

- object3D instances have access to a method named lookAt
- it will automatically its z axis to the target you provide

## Combining Transformations

- you can use the different transformations in any order
- but you must only use either rotation or quaternion
