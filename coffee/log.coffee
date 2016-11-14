LOG =

	content: document.querySelector '.log .content'

	add: (string)->
		cache = @content.innerHTML
		@content.innerHTML = "
			#{cache}<br>
			#{string}
		"
		@content.scrollTop = @content.scrollHeight
		return

log = new Vue(

	el: '#log'

	data:
		isActive: on

)