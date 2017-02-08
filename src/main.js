var hope = require('./libs/appear');

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

