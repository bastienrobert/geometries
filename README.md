# ◼ Geometries

Primitives. [Definition](https://en.wikipedia.org/wiki/Geometric_primitive) - [Examples](https://bastienrobert.github.io/geometries/examples/)

This library is fully optimized (please open a new issue if you've some recommendations) and is dependency-free to be fast and lightweight.

| Type | Weight  | Gzip   |
| ---- | ------- | ------ |
| CJS  | 14.37kb | 2.58kb |
| ES   | 14.26kb | 2.51kb |
| UMD  | 7.3kb   | 1.99kb |

[![NPM](https://nodei.co/npm/geometries.png?downloadRank=true&stars=true)](https://nodei.co/npm/geometries/)

## Getting started

You should import the primitives you want to use:

```js
import { Box as BoxGeometry } from '@bastienrobert/geometries'
```

then, you can create a new instance like:

```js
const box = new BoxGeometry()
```

## To do

- **Geometry**
  - [x] Basic main interface
- **Examples**
  - [ ] GUI
- **Geometries**
  - [x] Plane
  - [x] Cube
  - [x] Sphere
  - [x] Cone _(is a cylinder)_
  - [x] Cylinder
  - [x] Torus
  - [ ] Icosahedron
  - [ ] Dodecahedron
  - [ ] Tetrahedron
