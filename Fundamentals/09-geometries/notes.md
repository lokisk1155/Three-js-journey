### What is Geometry

- geometries are composed of vertices
- you can use geomatries to form particals
- all geometry classes inherit from the buffer geometry class

### Create a Simple Square using verticies

```
const vertices = new Float32Array( [
	-1.0, -1.0,  1.0, // v0
	 1.0, -1.0,  1.0, // v1
	 1.0,  1.0,  1.0, // v2

	 1.0,  1.0,  1.0, // v3
	-1.0,  1.0,  1.0, // v4
	-1.0, -1.0,  1.0  // v5
] );
geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
```

### The BoxGeometry has 6 parameters:

1. width: The size on the x axis
2. height: The size on the y axis
3. depth: The size on the z axis
4. widthSegments: How many subdivisions in the x axis
5. heightSegments: How many subdivisions in the y axis
6. depthSegments: How many subdivisions in the z axis

### Creating your own buffer Geometry

```
// Create an empty BufferGeometry
const geometry = new THREE.BufferGeometry()

// Create a Float32Array containing the vertices position (3 by 3)
const positionsArray = new Float32Array([
    0, 0, 0, // First vertex
    0, 1, 0, // Second vertex
    1, 0, 0  // Third vertex
])

// Create the attribute and name it 'position'
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)
```

### Create random Triangles

- Create 50 triangles (450 values)

```
const count = 50
const positionsArray = new Float32Array(count * 3 * 3)
for(let i = 0; i < count * 3 * 3; i++)
{
    positionsArray[i] = (Math.random() - 0.5) * 4
}
```
