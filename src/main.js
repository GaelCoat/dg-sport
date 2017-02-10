var hope = require('./libs/appear');
var Parallax = require('./views/parallax');

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

  render: function() {

    var that = this;

    $(window).scroll(this.scroll.bind(this));

    return q.fcall(function(){

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

