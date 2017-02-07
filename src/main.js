
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

