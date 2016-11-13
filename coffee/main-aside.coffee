mainAside = new Vue(

	el: '#main-aside'

	data:
		isActive: 		OPTIONS.leftAside
		searchModel: 	''
		filtered: 		0
		instrument: 	'objects'
		terrain: 			Terrain
		data: 				DATA
		objecter: 		OBJECTER
		lists: 				GlobalUtils.createTriggerObject DATA, off, 'name'
		brushTabs:
			height: 		on
			color: 			off
			plaining: 	off

	methods:

		createArrayFromData: (type)->
			res = []
			for o in this.$data.objects
				if o.type is type then res.push o
			res

		clearInput: ()->
			this.$data.searchModel = "";
			return

		toggleAside: ->
			this.$data.isActive = !this.$data.isActive
			mainHeader.isLeft = this.$data.isActive
			return

		toggleList: (str)->
			this.lists[str] = !this.lists[str]
			return

		showAllLists: ->
			GlobalUtils.toggleTriggerObject DATA, this.lists, on, 'name'
			return

		hideAllLists: ->
			GlobalUtils.toggleTriggerObject DATA, this.lists, off, 'name'
			return

		showTerrainPopup: ->
			terrainAddPopup.isActive = on
			return

		setColorPopupCaller: (event)->
			if !@$data.terrain.plane then return
			colorPopup.caller = event.target
			colorPopup.isActive = on

		setTerrainColor: (event)->
			Terrain.setColor event.target.value
			return

		setWireframe: (event)->
			@$data.terrain.setWireframe event.target.checked

		setActiveBrushTab: (tab)->
			for property of @$data.brushTabs
				@$data.brushTabs[property] = off
			@$data.brushTabs[tab] = on
			@$data.terrain.instrument = tab
			return

		
				# console.log m.geometry.faces[0]
				# m.geometry.colorsNeedUpdate = true
)