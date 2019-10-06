# Css Quad

Projective transformation of a plane (dom element).  

Can be usefull to quickly add perspective to a dom element, or simply to animate a quad for transition purpose.  

Based on this [original post](https://math.stackexchange.com/questions/296794/finding-the-transform-matrix-from-4-projected-points-with-javascript/339033).  
Another nice article can be found [here](https://franklinta.com/2014/09/08/computing-css-matrix3d-transforms/).


# Installation

```
npm i css-quad --save
```

# Usage

```javascript
import CssQuad from 'css-quad';

const cssQuad = new CssQuad(domElement);
```

Run `npm i && npm start` to build the demo.

# Documentation

## Constructor

### CssQuad(domElement)

## Public methods

### resize()

This method has to be called whenever the dom element size changes.

### update()

This method has to be called on RAF.

## Getters & setters

### p1 = {x,y}
### p2 = {x,y}
### p3 = {x,y}
### p4 = {x,y}

Position of the quad anchors relative to the viewport.