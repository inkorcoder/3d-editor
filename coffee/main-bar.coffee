mainHeader = new Vue(

	el: '#main-header'

	data:
		isLeft: 				mainAside.isActive
		isRight: 				objectAside.isActive
		isPlaying: 			off
		tabs: 					{terrain: on, objects: off}

	methods:

		toggleLeftAside: ->
			mainAside.isActive = !mainAside.isActive
			mainHeader.isLeft = mainAside.isActive

		toggleRightAside: ->
			objectAside.isActive = !objectAside.isActive
			mainHeader.isRight = objectAside.isActive

		toggleAside: ->
			this.$data.isAsideActive = !this.$data.isAsideActive
			return

		togglePlaying: ->
			this.$data.isPlaying = !this.$data.isPlaying

		setActiveTab: (tab)->
			for property of this.$data.tabs
				this.$data.tabs[property] = off
			this.$data.tabs[tab] = on
			mainAside.instrument = tab
			return

	watch:
		'isLeft': (newVal, oldVal)->
			vueRenderer.setOffset newVal, null
			return
		'isRight': (newVal, oldVal)->
			vueRenderer.setOffset null, newVal
			return
)