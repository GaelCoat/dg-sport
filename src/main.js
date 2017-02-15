"use strict";

var Application = require("app");
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
