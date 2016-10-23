vueRenderer = new Vue

	el: '#renderWrapper'

	data:
		isOffsetLeft: off
		isOffsetRight: off

	methods:

		setOffset: (left, right)->
			@$data.isOffsetLeft = left if left isnt null
			@$data.isOffsetRight = right if right isnt null
			return

		setViewport: ->
			width = window.innerWidth
			# if @$data.isOffsetLeft then width -= asideWidth.left else 0
			# if @$data.isOffsetRight then width -= asideWidth.right else 0
			rect = document.getElementById('renderWrapper').getBoundingClientRect()
			renderer.setSize( width, rect.height );
			camera.aspect = width / rect.height;
			camera.updateProjectionMatrix()
			return

	watch:
		'isOffsetLeft': ->
			do vueRenderer.setViewport
		'isOffsetRight': ->
			do vueRenderer.setViewport