define([], function () {

  return {
    ucfirst: function (str) {
      if (str.length < 1) {
        return '';
      }

      return str[0].toUpperCase() + (str.length < 2 ? '' : str.slice(1));
    }
  };
});
