<h1>{{good}}</h1>
<ul class="subnav">
{{#subnav}}
  <li><a href="{{url}}" {{#if current}}class="current"{{/if}}>{{ name }}</a></li>
{{/subnav}}
</ul>
<h2>Appeal</h2>
<div class="row">
{{#players}}
  <div class="col-xs-{{width}}">
    <h4 class="player_{{color}}">player: {{name}}</h4>
    <ul class="appeal_track {{color}}" data-player="{{color}}">
{{#appeal_track}}
      <li><label for="{{id}}">{{n}}</label><input type="radio" name="{{ name }}" id="{{id}}" value="{{n}}" {{#if selected}}checked="checked"{{/if}}/></li>
{{/appeal_track}}
    </ul>
  </div>
{{/players}}
</div>
