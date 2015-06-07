// model/player.js
// 
// Model for representing a player's game state
//
// A player's state is summed up as a set of four tuples (appeal, capacity) for
// each of the four goods.
//
// exports: factory method for creating Player model objects
define(['underscore', 'backbone'], function (_, Backbone) {

  var goods = [ 'bread', 'clothes', 'cutlery', 'lamps' ];

  var PlayerModel = Backbone.Model.extend({
    cool: 'beans',
    me: function () { console.log('i am ' + this.color); },

    initialize: function (opts) {

      var industry = {};

      $.each(goods, function (i, g) {
        var def = {
          appeal: 0,
          capacity: 0
        };

        industry[g] = def;
      });

      this.color = opts.color;
      this.industry = industry;
    },

    /**
     * Return the most that this player can sell of a given good
     *
     * @param good 'bread', 'clothes', etc
     */
    getLimit: function (good) {
      var def = this.industry[good];

      return Math.min(def.appeal, def.capacity);
    },
    
    setAppeal: function (good, value) {
      var industry = this.industry[good];

      industry.appeal = value;

      this.trigger(good+':appeal', { value: value });
    }
  });

  var factory = function (color) {
    var model = new PlayerModel({ color: color }); // Object.create(proto);

    return model;
  };

  return factory;
});
