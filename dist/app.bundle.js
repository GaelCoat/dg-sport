webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_, Backbone, $, q) {var hope = __webpack_require__(9);

	_.templateSettings = {
	  interpolate: /\{\{(.+?)\}\}/g,
	  escape: /\{\{\-(.+?)\}\}/g,
	  evaluate: /\<\%(.+?)\%\>/gim
	};


	var Main = Backbone.View.extend({

	  sections: [],

	  events: {},

	  initialize: function(params) {

	  },

	  //-------------------------------------
	  // Scroll Handle
	  //-------------------------------------
	  scroll: function(e) {

	  },

	  //-------------------------------------
	  // Appear
	  //-------------------------------------
	  initAppears: function() {

	    var that = this;

	    // Apparitions
	    $('section').appear();
	    $('section').on('appear', function(event, $els) { $els.addClass('ready'); });
	    $('section').on('disappear', function(event, $els) { $els.removeClass('ready'); });

	    return this;
	  },

	  render: function() {

	    var that = this;

	    $(window).scroll(this.scroll.bind(this));

	    return q.fcall(function(){

	      that.initAppears();
	      return true;
	    })
	    .delay(600)
	    .then(function() {

	      that.$el.find('#home').addClass('ready');
	      return that;
	    });

	  },

	});

	var View = new Main({el: $('body')});
	View.render();


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(3), __webpack_require__(4), __webpack_require__(5)))

/***/ },

/***/ 9:
/***/ function(module, exports, __webpack_require__) {

	/*
	 * jQuery appear plugin
	 *
	 * Copyright (c) 2012 Andrey Sidorov
	 * licensed under MIT license.
	 *
	 * https://github.com/morr/jquery.appear/
	 *
	 * Version: 0.3.6
	 */
	(function($) {
	  var selectors = [];

	  var check_binded = false;
	  var check_lock = false;
	  var defaults = {
	    interval: 250,
	    force_process: false
	  };
	  var $window = $(window);

	  var $prior_appeared = [];

	  function appeared(selector) {
	    return $(selector).filter(function() {
	      return $(this).is(':appeared');
	    });
	  }

	  function process() {
	    check_lock = false;
	    for (var index = 0, selectorsLength = selectors.length; index < selectorsLength; index++) {
	      var $appeared = appeared(selectors[index]);

	      $appeared.trigger('appear', [$appeared]);

	      if ($prior_appeared[index]) {
	        var $disappeared = $prior_appeared[index].not($appeared);
	        $disappeared.trigger('disappear', [$disappeared]);
	      }
	      $prior_appeared[index] = $appeared;
	    }
	  }

	  function add_selector(selector) {
	    selectors.push(selector);
	    $prior_appeared.push();
	  }

	  // "appeared" custom filter
	  $.expr[':'].appeared = function(element) {
	    var $element = $(element);
	    if (!$element.is(':visible')) {
	      return false;
	    }

	    var window_left = $window.scrollLeft();
	    var window_top = $window.scrollTop();
	    var offset = $element.offset();
	    var left = offset.left;
	    var top = offset.top;

	    if (top + $element.outerHeight() >= window_top &&
	        top - ($element.data('appear-top-offset') || 0) <= window_top + $window.height() &&
	        left + $element.width() >= window_left &&
	        left - ($element.data('appear-left-offset') || 0) <= window_left + $window.width()) {
	      return true;
	    } else {
	      return false;
	    }
	  };

	  $.fn.extend({
	    // watching for element's appearance in browser viewport
	    appear: function(options) {
	      var opts = $.extend({}, defaults, options || {});
	      var selector = this.selector || this;
	      if (!check_binded) {
	        var on_check = function() {
	          if (check_lock) {
	            return;
	          }
	          check_lock = true;

	          setTimeout(process, opts.interval);
	        };

	        $(window).scroll(on_check).resize(on_check);
	        check_binded = true;
	      }

	      if (opts.force_process) {
	        setTimeout(process, opts.interval);
	      }
	      add_selector(selector);
	      return $(selector);
	    }
	  });

	  $.extend({
	    // force elements's appearance check
	    force_appear: function() {
	      if (check_binded) {
	        process();
	        return true;
	      }
	      return false;
	    }
	  });
	})(function() {
	  if (true) {
	    // Node
	    return __webpack_require__(4);
	  } else {
	    return jQuery;
	  }
	}());


/***/ }

});