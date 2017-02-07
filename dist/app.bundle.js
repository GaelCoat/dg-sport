webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_, Backbone, q, $) {
	_.templateSettings = {
	  interpolate: /\{\{(.+?)\}\}/g,
	  escape: /\{\{\-(.+?)\}\}/g,
	  evaluate: /\<\%(.+?)\%\>/gim
	};


	var Main = Backbone.View.extend({

	  events: {},

	  initialize: function(params) {

	  },

	  render: function() {

	    var that = this;

	    return q.fcall(function(){

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


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(3), __webpack_require__(5), __webpack_require__(4)))

/***/ }
]);