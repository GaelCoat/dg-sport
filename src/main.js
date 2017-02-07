
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

      return that;
    });

  },

});

var View = new Main({el: $('body')});
View.render();

