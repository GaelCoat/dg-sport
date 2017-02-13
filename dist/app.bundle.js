webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_, Backbone, $, q) {var hope = __webpack_require__(9);
	var Parallax = __webpack_require__(10);
	var Section = __webpack_require__(11);
	var Lang = __webpack_require__(12)

	_.templateSettings = {
	  interpolate: /\{\{(.+?)\}\}/g,
	  escape: /\{\{\-(.+?)\}\}/g,
	  evaluate: /\<\%(.+?)\%\>/gim
	};


	var Main = Backbone.View.extend({

	  sections: [],

	  events: {
	    'click header .lang': 'showLangSelect',
	    'click': 'hideLangSelect',
	  },

	  nat: 'eng',

	  initialize: function(params) {

	  },

	  //-------------------------------------
	  // Scroll Handle
	  //-------------------------------------
	  scroll: _.throttle(function(e) {

	    Backbone.trigger('window:scroll', e);
	  }, 20),

	  showLangSelect: function(e) {

	    e.stopPropagation();
	    this.$el.find(e.currentTarget).toggleClass('open');
	    return this;
	  },

	  hideLangSelect: function(e) {

	    this.$el.find('header .lang').removeClass('open');
	    return this;
	  },

	  //-------------------------------------
	  // OnScroll Parallax
	  //-------------------------------------
	  initParallax: function() {

	    var that = this;

	    this.$el.find('.parallax').each(function() {

	      var $this = $(this);
	      var view = new Parallax({
	        el: $this,
	        force: $this.data('force'),
	        type: $this.data('type')
	      });
	      view.render();
	    });

	    return this;
	  },

	  //-------------------------------------
	  // Appear
	  //-------------------------------------
	  initAppears: function() {

	    var that = this;

	    // Apparitions
	    $('section').appear();
	    $('section').on('appear', function(event, $els) { $els.addClass('ready'); });
	    //$('section').on('disappear', function(event, $els) { $els.removeClass('ready'); });

	    return this;
	  },

	  getLang: function() {

	    var lang =  window.location.pathname.slice(1);
	    if (lang.length === 0) return this;

	    var langs = ['fr', 'en', 'de', 'ita'];

	    if (langs.indexOf(lang) === -1) {

	      window.history.replaceState(null, 'eng', '/eng');
	      this.nat = 'eng';
	    } else this.nat = lang;

	    this.$el.find('header .lang span').text(this.nat);

	    return this;
	  },

	  renderSections: function() {

	    var that = this;

	    var promises = [];

	    this.$el.find('section').each(function() {

	      var defer = q.defer();
	      var $this = $(this);

	      q.fcall(function() {

	        var view = new Section({
	          el: $this,
	          id: $this.attr('id'),
	          lang: Lang[that.nat],
	        });

	        return view.render();
	      })
	      .then(defer.resolve)

	      promises.push(defer.promise);
	    });

	    return promises;
	  },

	  render: function() {

	    var that = this;

	    $(window).scroll(this.scroll.bind(this));
	    $(window).resize(function() {

	      Backbone.trigger('window:resize');
	    });

	    return q.fcall(that.getLang.bind(that))
	    .then(that.renderSections.bind(that))
	    .all()
	    .then(function() {

	      return [
	        that.initAppears(),
	        that.initParallax()
	      ]
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
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
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


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Backbone, $) {
	module.exports = Backbone.View.extend({

	  events: {},

	  windowHeight: $(window).height(),
	  firstTop: null,

	  force: null,

	  type: 'translate',

	  initialize: function(params) {

	    this.listenTo(Backbone, 'window:scroll', this.scroll.bind(this));
	    this.listenTo(Backbone, 'window:resize', this.resize.bind(this));
	    this.force = params.force;
	    this.firstTop = this.$el.offset().top;

	    this.type = params.type;
	  },

	  resize: function() {

	    this.firstTop = this.$el.offset().top;
	    this.windowHeight = $(window).height();
	    return this.scroll($(window));
	  },

	  //-------------------------------------
	  // Scroll Handle
	  //-------------------------------------
	  scroll: function(e) {

	    var pos = $(e.currentTarget).scrollTop();
	    var top = this.$el.offset().top;
	    var height = this.$el.outerHeight();

	    if (top + height < pos || top > pos + this.windowHeight) return this;

	    return this[this.type](pos);
	  },

	  translate: function(pos) {

	    this.$el.css({
	      '-webkit-transform': 'translate3d(0px,'+Math.round((this.firstTop - pos) * this.force) +'px, 0px)',
	      'transform': 'translate3d(0px,'+Math.round((this.firstTop - pos) * this.force) +'px, 0px)'
	    });

	    return this;
	  },

	  margin: function(pos) {

	    return this;
	  },

	  render: function() {

	    var that = this;
	    return this;
	  },

	});


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(4)))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Backbone, _, $, q) {
	module.exports = Backbone.View.extend({

	  events: {},

	  lang: 'fr',

	  initialize: function(params) {

	    this.lang = params.lang[this.id];
	  },

	  getTpl: function() {

	    this.tpl = _.template($('#tpl-'+this.id).html());
	    return this;
	  },

	  render: function() {

	    var that = this;

	    return q.fcall(that.getTpl.bind(that))
	    .then(function() {

	      that.$el.html(that.tpl({
	        lang: that.lang
	      }));
	      return that;
	    });
	  },

	});


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(2), __webpack_require__(4), __webpack_require__(5)))

/***/ },
/* 12 */
/***/ function(module, exports) {

	
	module.exports = {

	  fr: {
	    home: {
	      subtitle: '<span>Accompagne les sportifs de haut</span><span>niveau dans le développement de leur</span><span>communauté et d’une identité digitale</span>'
	    },
	    thinking: {
	      txt: 'Nous sommes convaincus que le digital joue désormais un rôle majeur dans le monde du sport. Il permet aux sportifs de fédérer une communauté, de bâtir une image forte, de marketer leurs performances… Autant d’éléments sous évalués mais pourtant essentiels pour décupler la valeur d’un sportif à travers ses contrats en clubs, ses contrats de sponsoring & pour lui permettre de réussir ses projets annexes.',
	      quote: '<span>Le nom d\'un grand</span><span>sportif est une</span><span>marque qu\'il</span><span>convient à ce</span><span>titre de protéger et</span><span>de développer sur</span><span>le plan digital.</span>',
	    },
	    us: {
	      quote: '<span>Nous nous battons chaque jour pour bâtir,</span><span>à partir de sportifs, des héros à part entière.</span>',
	      txt: 'Nous sommes une équipe de passionnés, d’un dévouement sans limite et d’une fiabilité sans faille. Nous fournissons un travail d’une qualité incomparable, focus sur les détails et l’innovation. Nous sommes loués par nos clients pour notre aptitude à sortir du rôle d’agence traditionnelle afin de nous positionner comme un véritable partenaire de leur carrière.'
	    },
	  },

	  eng: {
	    home: {
	      subtitle: '<span>Accompagne les sportifs de haut</span><span>niveau dans le développement de leur</span><span>communauté et d’une identité digitale</span>'
	    },
	    thinking: {
	      txt: 'Nous sommes convaincus que le digital joue désormais un rôle majeur dans le monde du sport. Il permet aux sportifs de fédérer une communauté, de bâtir une image forte, de marketer leurs performances… Autant d’éléments sous évalués mais pourtant essentiels pour décupler la valeur d’un sportif à travers ses contrats en clubs, ses contrats de sponsoring & pour lui permettre de réussir ses projets annexes.',
	      quote: '<span>Le nom d\'un grand</span><span>sportif est une</span><span>marque qu\'il</span><span>convient à ce</span><span>titre de protéger et</span><span>de développer sur</span><span>le plan digital.</span>',
	    },
	    us: {
	      quote: '<span>Nous nous battons chaque jour pour bâtir,</span><span>à partir de sportifs, des héros à part entière.</span>',
	      txt: 'Nous sommes une équipe de passionnés, d’un dévouement sans limite et d’une fiabilité sans faille. Nous fournissons un travail d’une qualité incomparable, focus sur les détails et l’innovation. Nous sommes loués par nos clients pour notre aptitude à sortir du rôle d’agence traditionnelle afin de nous positionner comme un véritable partenaire de leur carrière.'
	    },
	  },

	  de: {
	    home: {
	      subtitle: '<span>Accompagne les sportifs de haut</span><span>niveau dans le développement de leur</span><span>communauté et d’une identité digitale</span>'
	    },
	    thinking: {
	      txt: 'Nous sommes convaincus que le digital joue désormais un rôle majeur dans le monde du sport. Il permet aux sportifs de fédérer une communauté, de bâtir une image forte, de marketer leurs performances… Autant d’éléments sous évalués mais pourtant essentiels pour décupler la valeur d’un sportif à travers ses contrats en clubs, ses contrats de sponsoring & pour lui permettre de réussir ses projets annexes.',
	      quote: '<span>Le nom d\'un grand</span><span>sportif est une</span><span>marque qu\'il</span><span>convient à ce</span><span>titre de protéger et</span><span>de développer sur</span><span>le plan digital.</span>',
	    },
	    us: {
	      quote: '<span>Nous nous battons chaque jour pour bâtir,</span><span>à partir de sportifs, des héros à part entière.</span>',
	      txt: 'Nous sommes une équipe de passionnés, d’un dévouement sans limite et d’une fiabilité sans faille. Nous fournissons un travail d’une qualité incomparable, focus sur les détails et l’innovation. Nous sommes loués par nos clients pour notre aptitude à sortir du rôle d’agence traditionnelle afin de nous positionner comme un véritable partenaire de leur carrière.'
	    },
	  },

	  ita: {
	    home: {
	      subtitle: '<span>Accompagne les sportifs de haut</span><span>niveau dans le développement de leur</span><span>communauté et d’une identité digitale</span>'
	    },
	    thinking: {
	      txt: 'Nous sommes convaincus que le digital joue désormais un rôle majeur dans le monde du sport. Il permet aux sportifs de fédérer une communauté, de bâtir une image forte, de marketer leurs performances… Autant d’éléments sous évalués mais pourtant essentiels pour décupler la valeur d’un sportif à travers ses contrats en clubs, ses contrats de sponsoring & pour lui permettre de réussir ses projets annexes.',
	      quote: '<span>Le nom d\'un grand</span><span>sportif est une</span><span>marque qu\'il</span><span>convient à ce</span><span>titre de protéger et</span><span>de développer sur</span><span>le plan digital.</span>',
	    },
	    us: {
	      quote: '<span>Nous nous battons chaque jour pour bâtir,</span><span>à partir de sportifs, des héros à part entière.</span>',
	      txt: 'Nous sommes une équipe de passionnés, d’un dévouement sans limite et d’une fiabilité sans faille. Nous fournissons un travail d’une qualité incomparable, focus sur les détails et l’innovation. Nous sommes loués par nos clients pour notre aptitude à sortir du rôle d’agence traditionnelle afin de nous positionner comme un véritable partenaire de leur carrière.'
	    },
	  },
	}


/***/ }
]);