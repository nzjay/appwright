define(['underscore', 'backbone', 'handlebars', 'text!template/demand.tpl'], function (_, Backbone, Handlebars, template_source) {
  console.log('init...');

  var DemandView = Backbone.View.extend({
    template: null,

    initialize: function () {
      this.template = Handlebars.compile(template_source);
    },

    render: function () {
      console.log('demand:render');
      $(this.el).html(this.template());
    },
  });

  return DemandView;
});
