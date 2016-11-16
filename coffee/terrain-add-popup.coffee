terrainAddPopup = new Vue(

	el: '#terrain-add-popup'

	data:
		isActive: off
		terrain: Terrain

	methods:

		addTerrain: ->
			Terrain.create(
				# @$data.terrain.width
				# @$data.terrain.height
				@$data.terrain.widthSegments
				@$data.terrain.heightSegments
			)
			do @closePopup

		closePopup: ->
			this.$data.isActive = off
)
