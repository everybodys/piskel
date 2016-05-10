(function () {
  var ns = $.namespace('pskl.tools.transform');

  ns.TransformUtils = {
    VERTICAL : 'VERTICAL',
    HORIZONTAL : 'HORIZONTAL',
    flip : function (frame, axis) {
      var clone = frame.clone();
      var w = frame.getWidth();
      var h = frame.getHeight();

      clone.forEachPixel(function (color, x, y) {
        if (axis === ns.TransformUtils.VERTICAL) {
          x = w - x - 1;
        } else if (axis === ns.TransformUtils.HORIZONTAL) {
          y = h - y - 1;
        }
        frame.pixels[x][y] = color;
      });
      frame.version++;
      return frame;
    },

    CLOCKWISE : 'clockwise',
    COUNTERCLOCKWISE : 'counterclockwise',
    rotate : function (frame, direction) {
      var clone = frame.clone();
      var w = frame.getWidth();
      var h = frame.getHeight();

      var max =  Math.max(w, h);
      var xDelta = Math.ceil((max - w) / 2);
      var yDelta = Math.ceil((max - h) / 2);

      frame.forEachPixel(function (color, x, y) {
        var _x = x;
        var _y = y;

        // Convert to square coords
        x = x + xDelta;
        y = y + yDelta;

        // Perform the rotation
        var tmpX = x;
        var tmpY = y;
        if (direction === ns.TransformUtils.CLOCKWISE) {
          x = tmpY;
          y = max - 1 - tmpX;
        } else if (direction === ns.TransformUtils.COUNTERCLOCKWISE) {
          y = tmpX;
          x = max - 1 - tmpY;
        }

        // Convert the coordinates back to the rectangular grid
        x = x - xDelta;
        y = y - yDelta;
        if (clone.containsPixel(x, y)) {
          frame.pixels[_x][_y] = clone.getPixel(x, y);
        } else {
          frame.pixels[_x][_y] = Constants.TRANSPARENT_COLOR;
        }
      });
      frame.version++;
      return frame;
    },

    align : function(frame) {
      // Figure out the boundary
      var minx = frame.width, miny = frame.height;
      var maxx = 0, maxy = 0;
      for(var col = 0; col < frame.width; col++) {
        for(var row = 0; row < frame.height; row++) {
          if(frame.pixels[col][row] !== Constants.TRANSPARENT_COLOR) {
            if(row < miny) miny = row;
            if(row > maxy) maxy = row;
            if(col < minx) minx = col;
            if(col > maxx) maxx = col;
          }
        }
      }

      // Calculate how much to move the pixels
      var bw = (maxx - minx + 1) / 2;
      var bh = (maxy - miny + 1) / 2;
      var fw = frame.width / 2;
      var fh = frame.height / 2;

      var dx = Math.floor(fw - bw - minx);
      var dy = Math.floor(fh - bh - miny);

      // Actually move the pixels
      var clone = frame.clone();
      frame.forEachPixel(function(color, x, y) {
        var _x = x, _y = y;

        x -= dx;
        y -= dy;

        if(clone.containsPixel(x, y)) {
          frame.pixels[_x][_y] = clone.getPixel(x, y);
        }
        else {
          frame.pixels[_x][_y] = Constants.TRANSPARENT_COLOR;
        }
      });
      frame.version++;
      return frame;
    }
  };
})();
