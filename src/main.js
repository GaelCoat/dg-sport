var hope = require('./libs/appear');
var Parallax = require('./views/parallax');
var Section = require('./views/section');
var Lang = require('./lang')

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g,
  escape: /\{\{\-(.+?)\}\}/g,
  evaluate: /\<\%(.+?)\%\>/gim
};


var Main = Backbone.View.extend({

  sections: [],

  events: {},

  nat: 'fr',

  initialize: function(params) {

  },

  //-------------------------------------
  // Scroll Handle
  //-------------------------------------
  scroll: _.throttle(function(e) {

    Backbone.trigger('window:scroll', e);
  }, 20),

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

  renderSections: function() {

    var that = this;

    this.$el.find('section').each(function() {

      var view = new Section({
        el: $(this),
        id: $(this).attr('id'),
        lang: Lang[that.nat],
      });
      view.render();
    });
  },

  render: function() {

    var that = this;

    $(window).scroll(this.scroll.bind(this));
    $(window).resize(function() {

      Backbone.trigger('window:resize');
    });

    return q.fcall(that.renderSections.bind(that))
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

