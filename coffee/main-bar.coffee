mainHeader = new Vue(

	el: '#main-header'

	data:
		isLeft: 				mainAside.isActive
		isRight: 				objectAside.isActive
		isPlaying: 			off
		tabs: 					{terrain: on, objects: off}
		theme: 					OPTIONS.theme

	methods:

		toggleLeftAside: ->
			mainAside.isActive = !mainAside.isActive
			mainHeader.isLeft = mainAside.isActive

		toggleRightAside: ->
			objectAside.isActive = !objectAside.isActive
			mainHeader.isRight = objectAside.isActive

		toggleAside: ->
			@$data.isAsideActive = !@$data.isAsideActive
			return

		togglePlaying: ->
			@$data.isPlaying = !@$data.isPlaying

		setActiveTab: (tab)->
			for property of @$data.tabs
				@$data.tabs[property] = off
			@$data.tabs[tab] = on
			mainAside.instrument = tab
			return

		setTheme: (name)->
			@$data.theme = name
			return

	watch:
		'isLeft': (newVal, oldVal)->
			vueRenderer.setOffset newVal, null
			return
		'isRight': (newVal, oldVal)->
			vueRenderer.setOffset null, newVal
			return
)