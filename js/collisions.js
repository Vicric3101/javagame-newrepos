// Collisions between aligned rectangles
function rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {

    if ((x1 > (x2 + w2)) || ((x1 + w1) < x2))
        return false; // No horizontal axis projection overlap
    if ((y1 > (y2 + h2)) || ((y1 + h1) < y2))
        return false; // No vertical axis projection overlap
    return true;    // If previous tests failed, then both axis projections
    // overlap and the rectangles intersect
}

function circleCollide(x1, y1, r1, x2, y2, r2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return ((dx * dx + dy * dy) < (r1 + r2) * (r1 + r2));
}

// Collisions between rectangle and circle
function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
    var testX = cx;
    var testY = cy;
    if (testX < x0) testX = x0;
    if (testX > (x0 + w0)) testX = (x0 + w0);
    if (testY < y0) testY = y0;
    if (testY > (y0 + h0)) testY = (y0 + h0);
    return (((cx - testX) * (cx - testX) + (cy - testY) * (cy - testY)) < r * r);
}

function rectsOverlapWithDirection(x1, y1, w1, h1, x2, y2, w2, h2) {

    const dx = (x1 + w1 / 2) - (x2 + w2 / 2);
    const dy = (y1 + h1 / 2) - (y2 + h2 / 2);
    const width = (w1 + w2) / 2;
    const height = (h1 + h2) / 2;
    const crossWidth = width * dy;
    const crossHeight = height * dx;
  
    if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
      if (crossWidth > crossHeight) {
        return (crossWidth > -crossHeight) ? 'top' : 'right';
      } else {
        return (crossWidth > -crossHeight) ? 'left' : 'bottom';
      }
    }
    return null;
  }


export { rectsOverlap, circleCollide, circRectsOverlap, rectsOverlapWithDirection }