<h1>{{good}}: Appeal</h1>
<ul class="subnav">
{{#subnav}}
  <li><a href="{{url}}" {{#if current}}class="current"{{/if}}>{{ name }}</a></li>
{{/subnav}}
</ul>
<div class="row">
{{#players}}
  <div class="col-xs-{{width}}">
    <h4 class="player_{{color}}">player: {{name}}</h4>
    <ul class="appeal_track {{color}}" data-player="{{color}}">
{{#appeal_track}}
      <li><label for="{{../color}}_appeal_{{n}}">{{n}}</label><input type="radio" name="appeal[{{../color}}]" id="{{../color}}_appeal_{{n}}" value="{{n}}" {{#if selected}}checked="checked"{{/if}} class="{{ selected }}"/></li>
{{/appeal_track}}
    </ul>
  </div>
{{/players}}
</div>
