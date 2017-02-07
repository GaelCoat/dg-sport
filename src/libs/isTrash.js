
module.exports = function() {

  return /MSIE 10/i.test(navigator.userAgent) ||
    /MSIE 9/i.test(navigator.userAgent) ||
    /rv:11.0/i.test(navigator.userAgent) ||
    /Edge\/12./i.test(navigator.userAgent) ||
    window.navigator.userAgent.indexOf("Edge") > -1 ||
    navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

}()
