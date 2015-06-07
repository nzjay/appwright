// model/player.js
// 
// Model for representing a player's game state
//
// A player's state is summed up as a set of four tuples (appeal, capacity) for
// each of the four goods.
//
// exports: factory method for creating Player model objects
define(['jquery', 'backbone'], function ($, Backbone) {

  var goods = [ 'bread', 'clothes', 'cutlery', 'lamps' ];

  function isImporter(p) {
    return p.color === 'black';
  }

  var PlayerModel = Backbone.Model.extend({
    cool: 'beans',
    me: function () { console.log('i am ' + this.color); },

    initialize: function (opts) {

      var industry = {}
        , that = this;

      this.color = opts.color;

      // Set default appeal levels
      $.each(goods, function (i, g) {
        var def = {
          appeal: 0,
          capacity: isImporter(that) ? Number.POSITIVE_INFINITY : 0
        };

        industry[g] = def;
      });

      // Pre-load appeal levels
      $.each(opts.data, function (i, d) {
        console.log(opts.color+' restore saved data '+i+', d='+JSON.stringify(d));
        industry[i].appeal = d.appeal;
        industry[i].capacity = d.capacity;
      });

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

  var factory = function (color, data) {
    var model = new PlayerModel({ color: color, data: data || {} }); // Object.create(proto);

    return model;
  };

  return factory;
});
