'use strict';

var data = {
  list: (function generateLoveList() {
    var list = ['7 LOVE'];
    var nums = [5, 4, 3, 2, 2];
    // This list of the word "Love" in language of the world was taken from
    // the Language links of entry "Love" in English Wikipedia, with duplicate
    // spelling removed.
    // var words = ('Liebe,Lufu,Aimor,Amor,Heyran,ভালোবাসা,Каханне,Любоў,Любов,བརྩེ་དུང་།,' +
    //   'Ljubav,Karantez,Юрату,Láska,Amore,Cariad,Kærlighed,Armastus,Αγάπη,Amo,Amol,Maitasun,' +
    //   'عشق,Pyar,Amour,Leafde,Gràdh,愛,爱,પ્રેમ,사랑,Սեր,Ihunanya,Cinta,ᑕᑯᑦᓱᒍᓱᑉᐳᖅ,Ást,אהבה,' +
    //   'ಪ್ರೀತಿ,სიყვარული,Махаббат,Pendo,Сүйүү,Mīlestība,Meilė,Leefde,Bolingo,Szerelem,' +
    //   'Љубов,സ്നേഹം,Imħabba,प्रेम,Ái,Хайр,အချစ်,Tlazohtiliztli,Liefde,माया,मतिना,' +
    //   'Kjærlighet,Kjærleik,ପ୍ରେମ,Sevgi,ਪਿਆਰ,پیار,Miłość,Leevde,Dragoste,' +
    //   'Khuyay,Любовь,Таптал,Dashuria,Amuri,ආදරය,Ljubezen,Jaceyl,خۆشەویستی,Љубав,Rakkaus,' +
    //   'Kärlek,Pag-ibig,காதல்,ప్రేమ,ความรัก,Ишқ,Aşk,محبت,Tình yêu,Higugma,ליבע').split(',');

    var words = ('DOWNHEARTED,ASHAMED,BRAVE,HAPPY,ANXIOUS,ANGRY,PEACEFUL,KIND,A_FAILURE,BEATEN,VALUABLE,UNSTOPPABLE,WORN-OUT,SELF-CRITICAL,HOPEFUL,ACCEPTING,STRESSED,ANNOYED,CALM,PATIENT,INADEQUATE,FRUSTRATED,OF_VALUE,POSITIVE' +
        'DOWNHEARTED,ASHAMED,BRAVE,HAPPY,ANXIOUS,ANGRY,PEACEFUL,KIND,A_FAILURE,BEATEN,VALUABLE,UNSTOPPABLE,WORN-OUT,SELF-CRITICAL,HOPEFUL,ACCEPTING,STRESSED,ANNOYED,CALM,PATIENT,INADEQUATE,FRUSTRATED,OF_VALUE,POSITIVE'
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
    width: null,
    height: null,
    dppx: 1,
    gridSize: Math.round(16 * $('#canvas').width() / 1024),
    weightFactor: function (size) {
      return Math.pow(size, 2.3) * $('#canvas').width() / 1024;
    },
    fontFamily: 'Times, serif',
    color: function (word, weight) {
      return (weight === 7) ? '#f02222' : '#c09292';
    },
    rotateRatio: 0.5,
    rotationSteps: 2,
    // ellipticity: 3,
    backgroundColor: '#ffe0e0'
  }
}

var maskCanvas;

jQuery(function($) {
  var $form = $('#form');
  var $canvas = $('#canvas');
  var $htmlCanvas = $('#html-canvas');
  var $canvasContainer = $('#canvas-container');
  var $loading = $('#loading');  
  
  // var $list = data.list;
  // var $options = data.option.toString();
  // var $options = $('#config-option');

  // var $list = $();
  // $list.val(data.list || '');

  // var $options = $();
  // $options.val(data.option || '');



  // var $list = $('#input-list');
  // var $options = $('#config-option');  

  // alert("Options: " + $options)

  // var $width = $('#config-width');
  // var $height = $('#config-height');
  // var $mask = $('#config-mask');
  // var $dppx = $('#config-dppx');
  var $css = $('#config-css');
  var $webfontLink = $('#link-webfont');

  if (!WordCloud.isSupported) {
    $('#not-supported').prop('hidden', false);
    $form.find('textarea, input, select, button').prop('disabled', true);
    return;
  }

  var $box = $('<div id="box" hidden />');
  $canvasContainer.append($box);
  window.drawBox = function drawBox(item, dimension) {
    if (!dimension) {
      $box.prop('hidden', true);

      return;
    }

    // var dppx = $dppx.val();    

    $box.prop('hidden', false);
    $box.css({
      left: dimension.x / data.option.dppx + 'px',
      top: dimension.y / data.option.dppx + 'px',
      width: dimension.w / data.option.dppx + 'px',
      height: dimension.h / data.option.dppx + 'px'
    });
  };

  // Update the default value if we are running in a hdppx device
  if (('devicePixelRatio' in window) &&
      window.devicePixelRatio !== 1) {
    data.option.dppx = window.devicePixelRatio;
    // $dppx.val(window.devicePixelRatio);
  }

  $canvas.on('wordcloudstop', function wordcloudstopped(evt) {
    $loading.prop('hidden', true);
  });

  $form.on('submit', function formSubmit(evt) {
    evt.preventDefault();

    changeHash('');
  });

  // $('#config-mask-clear').on('click', function() {
  //   maskCanvas = null;
  //   // Hack!
  //   $mask.wrap('<form>').closest('form').get(0).reset();
  //   $mask.unwrap();
  // });

  // Load the local image file, read it's pixels and transform it into a
  // black-and-white mask image on the canvas.
  // $mask.on('change', function() {
  //   maskCanvas = null;

  //   // var file = $mask[0].files[0];    

  //   // if (!file) {
  //   //   return;
  //   // }

  //   // var url = window.URL.createObjectURL(file);
  //   var img = new Image();
  //   img.src = "heart.png";

  //   img.onload = function readPixels() {
  //     window.URL.revokeObjectURL(url);

  //     maskCanvas = document.createElement('canvas');
  //     maskCanvas.width = img.width;
  //     maskCanvas.height = img.height;

  //     var ctx = maskCanvas.getContext('2d');
  //     ctx.drawImage(img, 0, 0, img.width, img.height);

  //     var imageData = ctx.getImageData(
  //       0, 0, maskCanvas.width, maskCanvas.height);
  //     var newImageData = ctx.createImageData(imageData);

  //     for (var i = 0; i < imageData.data.length; i += 4) {
  //       var tone = imageData.data[i] +
  //         imageData.data[i + 1] +
  //         imageData.data[i + 2];
  //       var alpha = imageData.data[i + 3];

  //       if (alpha < 128 || tone > 128 * 3) {
  //         // Area not to draw
  //         newImageData.data[i] =
  //           newImageData.data[i + 1] =
  //           newImageData.data[i + 2] = 255;
  //         newImageData.data[i + 3] = 0;
  //       } else {
  //         // Area to draw
  //         newImageData.data[i] =
  //           newImageData.data[i + 1] =
  //           newImageData.data[i + 2] = 0;
  //         newImageData.data[i + 3] = 255;
  //       }
  //     }

  //     ctx.putImageData(newImageData, 0, 0);
  //   };        
  // });

  // if ($mask[0].files.length) {
  //   $mask.trigger('change');
  // }  

  var applyMask = function applyMask() {
    // Load the local image file, read it's pixels and transform it into a
    // black-and-white mask image on the canvas.    
    maskCanvas = null;

    // var file = $mask[0].files[0];    

    // if (!file) {
    //   return;
    // }    

    // var url = window.URL.createObjectURL(file);

    var img = new Image();
    // img.crossOrigin = "Anonymous";
    // img.setAttribute('crossOrigin', '');
    img.crossOrigin = 'anonymous';
    // img.src = 'http://www.clker.com/cliparts/j/E/4/k/R/g/solid-black-heart-reduced-md.png';
    // img.src = 'data:image/jpeg;base64,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JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJABJIIJJJJJJJJJJJBJIIJJJJJJJJJJIBJJJJJIBJJJJJJJIJJJJIABJJJJJJJJBJJJJJJJAJJJJJIIJJJJJJJJJJJJJJJAJJJJJJJJJJJJJJIJJJJJJJJJAJJJJJIBJJJJJJJJJJAJJBJJJJJJJJJJIBJJJJBJJJJJJJJJJJIJJBJJJJJJJJJJJIJJJJJJJJJJJJJJJJJBIJJJJJJJJJJJJJJJJBJJJJJJJJJJJJJJJJJJJJJJJJJJJJAJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJIJIBJJJJJJJJJJJJJJJJJJJJJJJJJJJJJBIJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJBBJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJIBJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJIJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJBJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJIBJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJIJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJBJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJIBJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJIJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJBJJJJJJJJJJJJJJJJJJJJJJJJJJJJIJJBJJJJJJJJJJJJJJJJJJJJJJJJJJJJIJJAJJJJJJJJJJJJJJJJJJJJJJJJJJJJAJJIJJJJJJJJJJJJJJJJJJJJJJJJJJJJBJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJBJJJJJJJJJJJJJJJJJJJJJJJJIJJJJJJIJJJJJJJJJJJJJJJJJJJJJJJJBJJJJJJJBJJJJJJJJJJJJJJJJJJJJJJIJJJJJJJJIJJJJJJJJJJJJJJJJJJJJJJBJJJJJJJJJBJJJJJJJJJJJJJJJJJJJJIJJJJJJJJ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';
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


    // img.onload = function readPixels() {      
    
    //   maskCanvas = document.createElement('canvas');
    //   maskCanvas.width = img.width;
    //   maskCanvas.height = img.height;

    //   var ctx = maskCanvas.getContext('2d');
    //   ctx.drawImage(img, 0, 0, img.width, img.height);

    //   var imageData = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    //   var newImageData = ctx.createImageData(imageData);

    //   for (var i = 0; i < imageData.data.length; i += 4) {
    //     var tone = imageData.data[i] +
    //       imageData.data[i + 1] +
    //       imageData.data[i + 2];
    //     var alpha = imageData.data[i + 3];

    //     if (alpha < 128 || tone > 128 * 3) {
    //       // Area not to draw
    //       newImageData.data[i] =
    //         newImageData.data[i + 1] =
    //         newImageData.data[i + 2] = 255;
    //       newImageData.data[i + 3] = 0;
    //     } else {
    //       // Area to draw
    //       newImageData.data[i] =
    //         newImageData.data[i + 1] =
    //         newImageData.data[i + 2] = 0;
    //       newImageData.data[i + 3] = 255;
    //     }
    //   }

    //   ctx.putImageData(newImageData, 0, 0);
    // };      

  };

  var run = function run() {
    $loading.prop('hidden', false);

    // Load web font
    $webfontLink.prop('href', $css.val());

    // devicePixelRatio
    // var devicePixelRatio = parseFloat($dppx.val());
    var devicePixelRatio = parseFloat(data.option.dppx);

    var options = data.option;

    // Set the width and height
    var width = options.width ? options.width : $('#canvas-container').width();
    var height = options.height ? options.height : Math.floor(width * 0.65);    
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

    $htmlCanvas.css({'width': pixelWidth + 'px', 'height': pixelHeight + 'px'});        

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

    // Put the word list into options
    // if ($list.val()) {
    //   var list = [];
    //   $.each($list.val().split('\n'), function each(i, line) {
    //     if (!$.trim(line))
    //       return;

    //     var lineArr = line.split(' ');
    //     var count = parseFloat(lineArr.shift()) || 0;
    //     list.push([lineArr.join(' '), count]);
    //   });
    //   options.list = list;
    // }

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

    // Always manually clean up the html output
    if (!options.clearCanvas) {
      $htmlCanvas.empty();
      $htmlCanvas.css('background-color', options.backgroundColor || '#fff');
    }

    // All set, call the WordCloud()
    // Order matters here because the HTML canvas might by
    // set to display: none.
    // WordCloud([$canvas[0], $htmlCanvas[0]], options);

    WordCloud([$canvas[0], $htmlCanvas[0]], options);    
  };

  // var loadExampleData = function loadExampleData(name) {
  //   var example = examples[name];

  //   $options.val(example.option || '');
  //   $list.val(example.list || '');
  //   $css.val(example.fontCSS || '');
  //   $width.val(example.width || '');
  //   $height.val(example.height || '');
  // };

  var loadData = function loadData(name) {
    $css.val(data.fontCSS || '');    
  };

  // var changeHash = function changeHash(name) {
  //   if (window.location.hash === '#' + name ||
  //       (!window.location.hash && !name)) {
  //     // We got a same hash, call hashChanged() directly
  //     hashChanged();
  //   } else {
  //     // Actually change the hash to invoke hashChanged()
  //     window.location.hash = '#' + name;
  //   }
  // };

  var hashChanged = function hashChanged() {    
    loadData();    
    run();
    // applyMask();

    // var name = window.location.hash.substr(1);
    // if (!name) {
    //   // If there is no name, run as-is.
    //   run();
    // } else if (name in examples) {
    //   // If the name matches one of the example, load it and run it
    //   loadData();
    //   run();
    // } else {
    //   // If the name doesn't match, reset it.
    //   window.location.replace('#');
    // }
  }

  // $(window).on('hashchange', hashChanged);

  // hashChanged();

  applyMask();

  $(window).load(function () {
    hashChanged();
  });


  // $(document).ready(function() {
  //   loadData();
  //   run();
  //   applyMask();   
  // });  

  
  // if (!window.location.hash ||
  //   !(window.location.hash.substr(1) in examples)) {
  //   // If the initial hash doesn't match to any of the examples,
  //   // or it doesn't exist, reset it to #love
  //   window.location.replace('#love');
  // } else {
  //   hashChanged();
  // }
});
