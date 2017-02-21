webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Backbone, _) {"use strict";

	var Application = __webpack_require__(5);
	var app = window.App = new Application();

	// --------------------------------------------------
	// On lance le chargement de l'application
	// --------------------------------------------------
	app.start();
	Backbone.history.start({ pushState: true });

	_.templateSettings = {
	  interpolate: /\{\{(.+?)\}\}/g,
	  escape: /\{\{\-(.+?)\}\}/g,
	  evaluate: /\<\%(.+?)\%\>/gim
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(3)))

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Marionette) {var Router = __webpack_require__(8);
	var Layout = __webpack_require__(9)

	module.exports = Marionette.Application.extend({

	  region: 'body',

	  router: null,
	  layout: null,

	  lang: null,

	  onStart: function() {

	    this.router = new Router();
	    this.router.on('app:lang', this.setLang.bind(this));
	    this.router.on('router:home', this.unloadProject.bind(this));
	    this.router.on('project:load', this.loadProject.bind(this));

	    return this;
	  },

	  setLang: function(lang) {

	    this.lang = lang;

	    this.layout = new Layout({
	      el: this.region
	    });

	    this.layout.render();

	    this.listenTo(this.layout, 'redirect', this.cleanRedirect.bind(this))
	    return this;
	  },

	  cleanRedirect: function(url) {

	    this.router.navigate(url, true);
	    return this;
	  },

	  loadProject: function(id) {

	    this.layout.renderProject(id);
	    return this;
	  },

	  unloadProject: function() {

	    if (this.layout) this.layout.unloadProject();
	    return this;
	  },
	});

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Marionette, q) {
	module.exports = Marionette.AppRouter.extend({

	  routes: {
	    '': 'home',
	    ':lang(/)': 'languageSelect',
	    ':lang/:project': 'project',
	  },

	  lang: null,

	  home: function() {

	    this.trigger('router:home');
	    return this.setLang('fr');
	  },

	  languageSelect: function(lang) {

	    this.trigger('router:home');
	    return this.setLang(lang);
	  },

	  project: function(lang, id) {

	    var that = this;

	    return q.fcall(function() {

	      if (!that.lang) return that.setLang(lang);
	      return that;
	    })
	    .then(function() {

	      return that.loadProject(id);
	    });
	  },

	  setLang: function(lang) {

	    var langs = ['fr', 'en', 'de', 'ita'];

	    if (langs.indexOf(lang) === -1) return this.navigate('/fr/', true);

	    this.lang = lang;
	    this.trigger('app:lang', lang);
	    return this;
	  },

	  loadProject: function(id) {

	    this.trigger('project:load', id);
	    return this;
	  }
	});

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6), __webpack_require__(10)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Marionette, $, _, Backbone, q) {var hope = __webpack_require__(14);
	var isMobile = __webpack_require__(15);
	var Parallax = __webpack_require__(16);
	var Section = __webpack_require__(17);
	var Works = __webpack_require__(19);
	var Lang = __webpack_require__(18);
	var Project = __webpack_require__(21);
	var Projects = __webpack_require__(20);

	module.exports = Marionette.View.extend({

	  sections: [],

	  events: {
	    'click a:not([regular])': 'handleRedirect',
	    'click header .drop-lang': 'showLangSelect',
	    'click header .scrollTo': 'scrollTo',
	    'click': 'hideLangSelect',
	  },

	  lang: null,
	  currentProject: null,

	  initialize: function(params) {

	    this.lang = App.lang;
	    this.$el.find('header .drop-lang > span').text(this.lang);
	  },

	  //-------------------------------------
	  // Soft Redirect
	  //-------------------------------------
	  handleRedirect: function(e) {

	    var href = $(e.currentTarget).attr('href');
	    var protocol = this.protocol + '//';

	    if (href.slice(protocol.length) !== protocol) {
	      e.preventDefault();
	      this.trigger('redirect', href)
	    }

	    return this;
	  },

	  //-------------------------------------
	  // Basic anchor
	  //-------------------------------------
	  scrollTo: function(e) {

	    var section = this.$el.find(e.currentTarget).data('section');
	    $('html, body').animate( { scrollTop: $('#'+section).offset().top }, 750 );
	    return this;
	  },

	  //-------------------------------------
	  // Mobile TabBar Work-Around
	  //-------------------------------------
	  setSizes: function() {

	    var that = this;

	    this.$el.find('.setSize').each(function() {

	      $(this).height($(this).height());
	    });

	    return this;
	  },

	  //-------------------------------------
	  // Scroll Handle
	  //-------------------------------------
	  scroll: _.throttle(function(e) {

	    Backbone.trigger('window:scroll', e);
	  }, 20),

	  //-------------------------------------
	  // Show Language Dropdown
	  //-------------------------------------
	  showLangSelect: function(e) {

	    e.stopPropagation();
	    this.$el.find(e.currentTarget).toggleClass('open');
	    return this;
	  },

	  //-------------------------------------
	  // Hide Language Dropdown
	  //-------------------------------------
	  hideLangSelect: function(e) {

	    this.$el.find('header .lang').removeClass('open');
	    return this;
	  },

	  //-------------------------------------
	  // OnScroll Parallax
	  //-------------------------------------
	  initParallax: function() {

	    if (isMobile) return this;

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
	    $('section').on('disappear', function(event, $els) { $els.removeClass('ready'); });

	    return this;
	  },

	  //-------------------------------------
	  // Render unique project
	  //-------------------------------------
	  renderProject: function(id) {

	    this.$el.addClass('modal-open');
	    this.$el.find('article#project').empty();

	    this.currentProject = new Project({
	      model: Projects[id],
	      lang: this.lang,
	      el: this.$el.find('article#project')
	    });

	    return this.currentProject.render();
	  },

	  unloadProject: function() {

	    if (this.currentProject) this.currentProject.unload();
	    return this;
	  },

	  //-------------------------------------
	  // Render each section with current Language
	  //-------------------------------------
	  renderSections: function() {

	    var that = this;

	    var promises = [];

	    this.$el.find('section').each(function() {

	      $('body').scrollTop(0);

	      var defer = q.defer();
	      var $this = $(this);

	      q.fcall(function() {

	        if ($this.attr('id') === 'projects') {

	          var view = new Works({
	            el: $this,
	            id: $this.attr('id'),
	            lang: that.lang,
	          });

	        } else {

	          var view = new Section({
	            el: $this,
	            id: $this.attr('id'),
	            lang: Lang[that.lang],
	          });

	        }

	        return view.render();
	      })
	      .then(defer.resolve)

	      promises.push(defer.promise);
	    });


	    return promises;
	  },

	  // ------------------------------------------------
	  // Preload all pictures, return percentage
	  // ------------------------------------------------
	  preloadAll: function() {

	    var that = this;
	    var ready = [];

	    var total = this.$el.find('.preload').length;
	    var percent = 0;

	    this.$el.find('.preload').each(function(i) {


	      var defer = q.defer();

	      var $this = $(this);
	      var url = $this.data('src');
	      var img = new Image();
	      img.src = url;
	      img.onload = function() {

	        percent += 100/total;

	        that.$el.find('.loader .percent').css('height', percent+'%');

	        if ($this.hasClass('to-bg')) $this.css('background-image', 'url('+url+')');
	        else $this.attr('src', url);

	        $this.removeClass('preload');
	        defer.resolve(url);
	      };

	      ready.push(defer.promise);
	    });

	    return ready;
	  },

	  render: function() {

	    var that = this;

	    $(window).scroll(this.scroll.bind(this));

	    $(window).resize(function() {

	      Backbone.trigger('window:resize');
	    });

	    if (isMobile) this.$el.addClass('mobile');

	    return q.fcall(that.renderSections.bind(that))
	    .all()
	    .then(that.preloadAll.bind(that))
	    .all()
	    .then(function() {

	      if (isMobile) that.setSizes();

	      return [
	        that.initAppears(),
	        that.initParallax()
	      ]
	    })
	    .delay(600)
	    .then(function() {

	      that.$el.find('.loader').fadeOut(400);
	      return that;
	    })
	    .delay(1000)
	    .then(function() {

	      that.$el.removeClass('loading');
	      that.$el.find('#home').addClass('ready');
	      return that;
	    });

	  },

	});



	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6), __webpack_require__(4), __webpack_require__(3), __webpack_require__(2), __webpack_require__(10)))

/***/ },
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
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
/* 15 */
/***/ function(module, exports) {

	module.exports = function(a){ return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))}(navigator.userAgent||navigator.vendor||window.opera);


/***/ },
/* 16 */
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


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(4)))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Backbone, _, $, q) {var isMobile = __webpack_require__(15);

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
	        lang: that.lang,
	        isMobile: isMobile
	      }));
	      return that;
	    });
	  },

	});


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(3), __webpack_require__(4), __webpack_require__(10)))

/***/ },
/* 18 */
/***/ function(module, exports) {

	
	module.exports = {

	  fr: {
	    home: {
	      subtitle: '<span>Accompagne les sportifs de haut</span><span>niveau dans le développement de leur</span><span>identité digitale et de leur communauté</span>'
	    },
	    thinking: {
	      txt: 'Nous sommes convaincus que le digital joue désormais un rôle majeur dans le monde du sport. Il permet aux sportifs de fédérer une communauté, de bâtir une image forte, de marketer leurs performances… Autant d’éléments sous évalués mais pourtant essentiels pour décupler la valeur d’un sportif à travers ses contrats en clubs, ses contrats de sponsoring & pour lui permettre de réussir ses projets annexes.',
	      quote: '<span>Le nom d\'un grand</span><span>sportif est une</span><span>marque qu\'il</span><span>convient à ce</span><span>titre de protéger et</span><span>de développer sur</span><span>le plan digital.</span>',
	      quoteRaw: '\"Le nom d\'un grand sportif est une marque qu\'il convient à ce titre de protéger et de développer sur le plan digital.\"',
	    },
	    us: {
	      quote: '<span>Nous nous battons chaque jour pour ériger</span><span>les sportifs de haut niveau au rang d’idole.</span><span>Nous bâtissons les héros de demain.</span>',
	      quoteRaw: '<span>Nous nous battons chaque jour pour ériger les sportifs de haut niveau au rang d’idole. Nous bâtissons les héros de demain.</span>',
	      txt: 'Nous sommes une équipe de passionnés, d’un dévouement sans limite et d’une fiabilité sans faille. Nous remettons sans cesse en cause le statu quo afin de baser nos workflows sur l’innovation et le sens du détail. Nous sommes loués par nos clients pour notre aptitude à sortir du rôle d’agence traditionnelle qui nous permet d\'être un véritable partenaire de leur carrière.'
	    },
	    skills: {
	      ui: 'Création, refonte & optimisation<br/>de sites internet responsive',
	      identity: 'Élaboration de logos, de designs<br/>& de chartes graphiques',
	      content: 'Conception de GIF, de filtres<br/>& de montages photos',
	    }
	  },

	  en: {
	    home: {
	      subtitle: '<span>Accompagne les sportifs de haut</span><span>niveau dans le développement de leur</span><span>communauté et d’une identité digitale</span>'
	    },
	    thinking: {
	      txt: 'Nous sommes convaincus que le digital joue désormais un rôle majeur dans le monde du sport. Il permet aux sportifs de fédérer une communauté, de bâtir une image forte, de marketer leurs performances… Autant d’éléments sous évalués mais pourtant essentiels pour décupler la valeur d’un sportif à travers ses contrats en clubs, ses contrats de sponsoring & pour lui permettre de réussir ses projets annexes.',
	      quote: '<span>Le nom d\'un grand</span><span>sportif est une</span><span>marque qu\'il</span><span>convient à ce</span><span>titre de protéger et</span><span>de développer sur</span><span>le plan digital.</span>',
	      quoteRaw: '\"Le nom d\'un grand sportif est une marque qu\'il convient à ce titre de protéger et de développer sur le plan digital.\"',
	    },
	    us: {
	      quote: '<span>Nous nous battons chaque jour pour bâtir,</span><span>à partir de sportifs, des héros à part entière.</span>',
	      quoteRaw: '<span>Nous nous battons chaque jour pour ériger les sportifs de haut niveau au rang d’idole. Nous bâtissons les héros de demain.</span>',
	      txt: 'Nous sommes une équipe de passionnés, d’un dévouement sans limite et d’une fiabilité sans faille. Nous fournissons un travail d’une qualité incomparable, focus sur les détails et l’innovation. Nous sommes loués par nos clients pour notre aptitude à sortir du rôle d’agence traditionnelle afin de nous positionner comme un véritable partenaire de leur carrière.'
	    },
	    skills: {
	      ui: 'Création, refonte & optimisation<br/>de sites internet responsive',
	      identity: 'Élaboration de logos, de designs<br/>& de chartes graphiques',
	      content: 'Conception de GIF, de filtres<br/>& de montages photos',
	    }
	  },

	  de: {
	    home: {
	      subtitle: '<span>Accompagne les sportifs de haut</span><span>niveau dans le développement de leur</span><span>communauté et d’une identité digitale</span>'
	    },
	    thinking: {
	      txt: 'Nous sommes convaincus que le digital joue désormais un rôle majeur dans le monde du sport. Il permet aux sportifs de fédérer une communauté, de bâtir une image forte, de marketer leurs performances… Autant d’éléments sous évalués mais pourtant essentiels pour décupler la valeur d’un sportif à travers ses contrats en clubs, ses contrats de sponsoring & pour lui permettre de réussir ses projets annexes.',
	      quote: '<span>Le nom d\'un grand</span><span>sportif est une</span><span>marque qu\'il</span><span>convient à ce</span><span>titre de protéger et</span><span>de développer sur</span><span>le plan digital.</span>',
	      quoteRaw: '\"Le nom d\'un grand sportif est une marque qu\'il convient à ce titre de protéger et de développer sur le plan digital.\"',
	    },
	    us: {
	      quote: '<span>Nous nous battons chaque jour pour bâtir,</span><span>à partir de sportifs, des héros à part entière.</span>',
	      quoteRaw: '<span>Nous nous battons chaque jour pour ériger les sportifs de haut niveau au rang d’idole. Nous bâtissons les héros de demain.</span>',
	      txt: 'Nous sommes une équipe de passionnés, d’un dévouement sans limite et d’une fiabilité sans faille. Nous fournissons un travail d’une qualité incomparable, focus sur les détails et l’innovation. Nous sommes loués par nos clients pour notre aptitude à sortir du rôle d’agence traditionnelle afin de nous positionner comme un véritable partenaire de leur carrière.'
	    },
	    skills: {
	      ui: 'Création, refonte & optimisation<br/>de sites internet sur mesure',
	      identity: 'Élaboration de logos, de designs &<br/>de chartes graphiques',
	      content: 'Conception de GIF, de filtres &<br/>de montages photos',
	    }
	  },

	  ita: {
	    home: {
	      subtitle: '<span>Accompagne les sportifs de haut</span><span>niveau dans le développement de leur</span><span>communauté et d’une identité digitale</span>'
	    },
	    thinking: {
	      txt: 'Nous sommes convaincus que le digital joue désormais un rôle majeur dans le monde du sport. Il permet aux sportifs de fédérer une communauté, de bâtir une image forte, de marketer leurs performances… Autant d’éléments sous évalués mais pourtant essentiels pour décupler la valeur d’un sportif à travers ses contrats en clubs, ses contrats de sponsoring & pour lui permettre de réussir ses projets annexes.',
	      quote: '<span>Le nom d\'un grand</span><span>sportif est une</span><span>marque qu\'il</span><span>convient à ce</span><span>titre de protéger et</span><span>de développer sur</span><span>le plan digital.</span>',
	      quoteRaw: '\"Le nom d\'un grand sportif est une marque qu\'il convient à ce titre de protéger et de développer sur le plan digital.\"',
	    },
	    us: {
	      quote: '<span>Nous nous battons chaque jour pour bâtir,</span><span>à partir de sportifs, des héros à part entière.</span>',
	      quoteRaw: '<span>Nous nous battons chaque jour pour ériger les sportifs de haut niveau au rang d’idole. Nous bâtissons les héros de demain.</span>',
	      txt: 'Nous sommes une équipe de passionnés, d’un dévouement sans limite et d’une fiabilité sans faille. Nous fournissons un travail d’une qualité incomparable, focus sur les détails et l’innovation. Nous sommes loués par nos clients pour notre aptitude à sortir du rôle d’agence traditionnelle afin de nous positionner comme un véritable partenaire de leur carrière.'
	    },
	    skills: {
	      ui: 'Création, refonte & optimisation<br/>de sites internet sur mesure',
	      identity: 'Élaboration de logos, de designs &<br/>de chartes graphiques',
	      content: 'Conception de GIF, de filtres &<br/>de montages photos',
	    }
	  },
	}


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Backbone, _, $, q) {var isMobile = __webpack_require__(15);
	var Projects = __webpack_require__(20);

	module.exports = Backbone.View.extend({

	  events: {},

	  lang: 'fr',

	  initialize: function(params) {

	    this.lang = params.lang;
	    this.tpl = _.template($('#tpl-projects').html());
	  },

	  renderProjects: function() {

	    var that = this;
	    var els = [];

	    _.each(Projects, function(project) {

	      var tpl = _.template($('#tpl-projects-each').html());
	      els.push(tpl({ project: project, isMobile: isMobile, lang: that.lang }));
	    });

	    return els;
	  },

	  dispatch: function(els) {

	    var that = this;

	    var split = _.partition(els, function(el, id) { return id % 2; });

	    this.$el.find('.col.left-col').append(split[1]);
	    this.$el.find('.col.right-col').append(split[0]);

	    return that;
	  },

	  render: function() {

	    var that = this;

	    return q.fcall(function() {

	      that.$el.html(that.tpl({
	        lang: that.lang,
	        isMobile: isMobile
	      }));

	      return that.renderProjects();
	    })
	    .then(that.dispatch.bind(that))
	    .catch(function(err) {

	      console.log(err);
	    })

	  },

	});


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(3), __webpack_require__(4), __webpack_require__(10)))

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = {

	  'thauvin': {
	    id: 'thauvin',
	    name: 'Florian Thauvin',
	    type: 'Website',
	    preview: './img/projects/thauvin/preview.jpg',
	    banner: './img/projects/thauvin/banner.jpg',
	    content: './img/projects/thauvin/content.jpg',
	    year: '2017',
	  },

	  'st-maximin': {
	    id: 'st-maximin',
	    name: 'Allan St-Maximin',
	    type: 'Website',
	    preview: './img/projects/st-maximin/preview.jpg',
	    banner: './img/projects/thauvin/banner.jpg',
	    content: './img/projects/thauvin/content.jpg',
	    year: '2017',
	  },


	}


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Backbone, _, $, q) {var isMobile = __webpack_require__(15);
	var Projects = __webpack_require__(20);

	module.exports = Backbone.View.extend({

	  events: {},

	  lang: 'fr',

	  initialize: function(params) {

	    this.lang = params.lang;
	    this.tpl = _.template($('#tpl-project').html());

	    console.log(params);
	  },

	  renderOthers: function() {

	    var that = this;

	    var els = [];

	    var others = _.reject(Projects, function(item) {

	      return item === that.model;
	    });

	    var selected = others.slice(0, 3);

	    _.each(selected, function(other) {

	      var tpl = _.template($('#tpl-project-other').html());
	      var el = tpl({ other: other, lang: that.lang });
	      var el = $(el);
	      el.find('.cover').css('background-image', 'url('+other.preview+')');
	      els.push(el);
	    });

	    this.$el.find('ul.others').append(els);

	    return this;
	  },

	  render: function() {

	    var that = this;

	    return q.fcall(function() {

	      that.$el.html(that.tpl({
	        lang: that.lang,
	        isMobile: isMobile,
	        project: that.model
	      }));

	      return that;
	    })
	    .then(function() {

	      that.renderOthers();
	      that.$el.show(0).addClass('ready');
	      return that;
	    });
	  },

	  unload: function() {

	    var that = this;

	    this.$el.fadeOut(400, function() {

	      that.$el.removeClass('ready');
	      that.$el.empty();
	      $('body').removeClass('modal-open')
	    });
	  },

	});


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(3), __webpack_require__(4), __webpack_require__(10)))

/***/ }
]);