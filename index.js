'use strict';

var data = {
  list: (function generateLoveList() {
    // var list = ['9 A Failure'];
    // var nums = [6, 5, 4, 3, 3];

    var list = ['10 Brave'];
    var nums = [9, 8, 7, 6, 5, 4, 3, 2, 1];

    var words = (
      'Downhearted,Ashamed,Brave,Happy,Anxious,Angry,Peaceful,Kind,A failure,Beaten,Valuable,Unstoppable,Worn-out,Self-critical,Hopeful,Accepting,Stressed,Annoyed,Calm,Patient,Inadequate,Frustrated,Of_value,Positive' +
      'Downhearted,Ashamed,Brave,Happy,Anxious,Angry,Peaceful,Kind,A failure,Beaten,Valuable,Unstoppable,Worn-out,Self-critical,Hopeful,Accepting,Stressed,Annoyed,Calm,Patient,Inadequate,Frustrated,Of_value,Positive'
    ).split(',');

    nums.forEach(function(n) {
      words.forEach(function(w) {
        list.push(n + ' ' + w);
      });
    });

    return list.join('\n');
  })(),

  option: {
    mask: 'heart.png',
    width: 600,
    height: 600,
    dppx: 1,
    gridSize: Math.round(16 * $('#canvas').width() / 1024),
    weightFactor: function (size) {
      return Math.pow(size, 2.3) * $('#canvas').width() / 1024;
    },
    fontFamily: 'Times, serif',
    color: function (word, weight) {
      switch(weight) {
        case 1:
          return '#FFF59D';
        case 2: 
          return '#FFEE58'
        case 3: 
          return '#81C784';
        case 4:
          return '#A5D6A7';                    
        case 5:
          return '#EC407A'
        case 6:                  
          return '#66BB6A';
        case 7:
          return '#FFF176';
        case 8: 
          return '#F06292'
        case 9: 
          return '#F48FB1';          
        case 10: 
          return '#42A5F5'
        default:
          return '#C09292';
      }      
    },
    rotateRatio: 0.5,
    // rotationSteps: 2,    
    backgroundColor: '#383759'
  }
}

var maskCanvas;

jQuery(function($) {  
  var $canvas = $('#canvas');  
  var $canvasContainer = $('#canvas-container');  

  var $css = $('#config-css');
  var $webfontLink = $('#link-webfont');

  // Update the default value if we are running in a hdppx device
  if (('devicePixelRatio' in window) && window.devicePixelRatio !== 1) {
    data.option.dppx = window.devicePixelRatio;    
  }

  var applyMask = function applyMask() {    
    maskCanvas = null;    

    var img = new Image();    
    img.crossOrigin = 'anonymous';    
    img.src = 'https://dl.dropboxusercontent.com/s/0u9b88bnhp7ed3g/heart.png';

    img.onload = function readPixels() {    
      maskCanvas = document.createElement('canvas');
      maskCanvas.width = img.width;
      maskCanvas.height = img.height;

      var ctx = maskCanvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);

      var imageData = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
      var newImageData = ctx.createImageData(imageData);

      for (var i = 0; i < imageData.data.length; i += 4) {
        var tone = imageData.data[i] +
          imageData.data[i + 1] +
          imageData.data[i + 2];
        var alpha = imageData.data[i + 3];

        if (alpha < 128 || tone > 128 * 3) {
          // Area not to draw
          newImageData.data[i] =
            newImageData.data[i + 1] =
            newImageData.data[i + 2] = 255;
          newImageData.data[i + 3] = 0;
        } else {
          // Area to draw
          newImageData.data[i] =
            newImageData.data[i + 1] =
            newImageData.data[i + 2] = 0;
          newImageData.data[i + 3] = 255;
        }
      }

      ctx.putImageData(newImageData, 0, 0); 
    }
  };

  var run = function run() {    
    // Load web font
    $webfontLink.prop('href', $css.val());

    // devicePixelRatio    
    var devicePixelRatio = parseFloat(data.option.dppx);

    var options = data.option;

    // Set the width and height
    var width = options.width ? options.width : $('#canvas-container').width();
    var height = options.width ? options.width : width;
    // var height = options.height ? options.height : Math.floor(width * 0.65);    

    var pixelWidth = width;
    var pixelHeight = height;

    if (devicePixelRatio !== 1) {
      $canvas.css({'width': width + 'px', 'height': height + 'px'});

      pixelWidth *= devicePixelRatio;
      pixelHeight *= devicePixelRatio;
    } else {
      $canvas.css({'width': '', 'height': '' });
    }

    $canvas.attr('width', pixelWidth);
    $canvas.attr('height', pixelHeight);    

    // Set devicePixelRatio options
    if (devicePixelRatio !== 1) {
      if (!('gridSize' in options)) {
        options.gridSize = 8;
      }
      options.gridSize *= devicePixelRatio;

      if (options.origin) {
        if (typeof options.origin[0] == 'number')
          options.origin[0] *= devicePixelRatio;
        if (typeof options.origin[1] == 'number')
          options.origin[1] *= devicePixelRatio;
      }

      if (!('weightFactor' in options)) {
        options.weightFactor = 1;
      }
      if (typeof options.weightFactor == 'function') {
        var origWeightFactor = options.weightFactor;
        options.weightFactor =
          function weightFactorDevicePixelRatioWrap() {
            return origWeightFactor.apply(this, arguments) * devicePixelRatio;
          };
      } else {
        options.weightFactor *= devicePixelRatio;
      }
    }

    var list = [];
    $.each(data.list.split('\n'), function each(i, line) {
      if (!$.trim(line)) 
        return;

      var lineArr = line.split(' ');
      var count = parseFloat(lineArr.shift()) || 0;
      list.push([lineArr.join(' '), count]);
    });

    options.list = list;        

    if (maskCanvas) {
      options.clearCanvas = false;

      /* Determine bgPixel by creating
         another canvas and fill the specified background color. */
      var bctx = document.createElement('canvas').getContext('2d');

      bctx.fillStyle = options.backgroundColor || '#fff';
      bctx.fillRect(0, 0, 1, 1);
      var bgPixel = bctx.getImageData(0, 0, 1, 1).data;

      var maskCanvasScaled =
        document.createElement('canvas');
      maskCanvasScaled.width = $canvas[0].width;
      maskCanvasScaled.height = $canvas[0].height;
      var ctx = maskCanvasScaled.getContext('2d');

      ctx.drawImage(maskCanvas,
        0, 0, maskCanvas.width, maskCanvas.height,
        0, 0, maskCanvasScaled.width, maskCanvasScaled.height);

      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var newImageData = ctx.createImageData(imageData);
      for (var i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] > 128) {
          newImageData.data[i] = bgPixel[0];
          newImageData.data[i + 1] = bgPixel[1];
          newImageData.data[i + 2] = bgPixel[2];
          newImageData.data[i + 3] = bgPixel[3];
        } else {
          // This color must not be the same w/ the bgPixel.
          newImageData.data[i] = bgPixel[0];
          newImageData.data[i + 1] = bgPixel[1];
          newImageData.data[i + 2] = bgPixel[2];
          newImageData.data[i + 3] = bgPixel[3] ? (bgPixel[3] - 1) : 0;
        }
      }

      ctx.putImageData(newImageData, 0, 0);

      ctx = $canvas[0].getContext('2d');
      ctx.drawImage(maskCanvasScaled, 0, 0);

      maskCanvasScaled = ctx = imageData = newImageData = bctx = bgPixel = undefined;
    }

    WordCloud($canvas[0], options);    
  };

  var loadData = function loadData(name) {
    $css.val(data.fontCSS || '');    
  };

  applyMask();

  $(window).load(function () {
    loadData();    
    run();
  });  
});
