<h1>{{ good }}: Appeal</h1>
<div class="row">
{{# players }}
  <div class="col-xs-{{ width }}">
    <h4 class="player_{{ color }}">player: {{ name }}</h4>
    <ul class="appeal_track {{ color }}" data-player="{{ color }}">
{{# appeal_track }}
      <li><label for="{{ ../color }}_appeal_{{ n }}">{{ n }}</label><input type="radio" name="appeal[{{ ../color }}]" id="{{ ../color }}_appeal_{{ n }}" value="{{ n }}" /></li>
{{/ appeal_track }}
    </ul>
  </div>
{{/ players }}
</div>
