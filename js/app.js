require.config({
  baseUrl: '/js/',

  paths: {
    jquery: "//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min",
    backbone: "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.1/backbone-min",
    underscore: "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min",
    handlebars: "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.3/handlebars.min",
    bootstrap: "//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min",
    text: "vendor/requirejs/text",
    template: "../template",
  },

  shim: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone',
    },
    backbone: {
      exports: '_',
    },
    bootstrap: {
      deps: ['jquery'],
    }
  }
});

require(['jquery', 'underscore', 'backbone', 'handlebars', 'bootstrap', 'model/player', 'view/appeal', 'view/demand'], function ($, _, Backbone, Handlebars, Bootstrap, PlayerModel, AppealView, DemandView) {
  console.log('init...');

  var pages = $('#pages')
    , colors = ['red', 'blue', 'green', 'yellow']
    , players = []
    , goods = ['bread', 'clothes', 'cutlery', 'lamps']
    , goods_data = $.map(goods, function (g) {
        return { name: g[0].toUpperCase() + (g.length > 1 ? g.slice(1) : ''), link_name: g };
    });

  window.GameState = {
    players: players
  };

  // Game data setup
  $.each(colors, function (i, color) {

    var p = PlayerModel(color);

    players.push(p);

  });

  // App setup
  var layout = Handlebars.compile($('#layout').html())({ goods: goods_data });

  // Create pages per good
  $.each(goods, function (i, good) {
    var appeal_id = 'appeal_' + good
      , demand_id = 'demand_' + good;

    // create appeal page
    var appeal_page = $('<li class="page">').attr('id', appeal_id).html(layout)
      , appeal_view = new AppealView({ el: appeal_page.find('.content'), good: good, players: players });

    // create demand page
    var demand_page = $('<li class="page">').attr('id', demand_id).html(layout)
      , demand_view = new DemandView({ el: demand_page.find('.content'), good: good, players: players });

    appeal_view.render();
    demand_view.render();

    pages.append(appeal_page);
    pages.append(demand_page);
  });

  /*$('#pages li').not('#loading').each(function (i, e) {
    var $el = $(e)
      , name = $(e).attr('id');

    $el.html(layout);

    var $content = $el.find('.content')
      , view = new pages[name]({ el: $content });

    view.render();

  });*/

  function show(page) {
    $('#pages > li').removeClass('active')
      .filter(page)
      .addClass('active');
  }

  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      ":good/appeal": "appeal",
      ":good/demand": "demand"
    },

    index: function () {
      console.log("index:display");
    },

    appeal: function (good) {
      console.log("appeal:display:"+good);
      show("#appeal_" + good);
    },

    demand: function (good) {
      console.log("demand:display"+good);
      show('#demand_' + good);
    }
  });

  // Setup events
  $.each(players, function (i, p) {
    $.each(goods, function (j, g) {
      var name = g+':appeal';
      console.log('hook up event: '+p.color+', '+name);
      p.on(name, function (event) {
        console.log(p.color + ' set their ' + g + ' to ' + event.value);
      });
    });
  });

  var router = new Router;
  Backbone.history.start();
});
