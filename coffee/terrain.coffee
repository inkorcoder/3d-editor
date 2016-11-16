##################################################################
#
#		TERRAIN
#
#		Modes: [ height | color | plaining ]
#
#		┌── height ─────────────────────────────────────────────────────┐
#		│	Setting vertexes height. Each vertex z-axis of
#		│	selected face (wich is a, b and c) will be increased
#		│ by 'weight' property.
#		└───────────────────────────────────────────────────────────────┘
#
#		┌── color ──────────────────────────────────────────────────────┐
#		│	Painting. Each face vertex of taken sub grid will be
#		│	painted to selected color. Sub grid is array of faces
#		│ taken from brush.
#		└───────────────────────────────────────────────────────────────┘
#
#		┌── plaining ───────────────────────────────────────────────────┐
#		│	Setting vertexes height. Each face vertex of taken 
#		│	sub grid will be aline to primary face position.
#		│ Sub grid is array of faces taken from brush.
#		└───────────────────────────────────────────────────────────────┘
#
#####################################################################

Terrain =


	#-----[ properties ]----------------------------------------------#

	width: 						10											# grid width
	height: 					10											# grid height
	widthSegments: 		10											# grid X segments
	heightSegments: 	10											# grid Y segments

	grid: 						[]											# grid array
	steps: 						[]											# grid array
	plane: 						null										# plane object
	geometry: 				null										# plane geometry object

	raycaster: 				new THREE.Raycaster()		# raycaster
	mouse: 						new THREE.Vector2()			# mouse vector
	weight: 					0.1											# height mode

	color: 						'0x444444'							# grid color
	brushColor: 			'0x00ff00'							# brush color
	brushSize: 				5												# brush radius

	instrument: 			'height' 								# height, color, plaining

	modifier: 				'ctrlKey'								# instrument modifier


	#-----[ Public methods ]------------------------------------------#

	### Create new grid.
			-> width 					[int] - width size
			-> height 				[int] - height size
			-> widthSegments 	[int] - number of width cells
			-> heightSegments [int] - number of height cells
			<= nothing
	###
	create: (widthSegments, heightSegments)->

		# remove plane if exists
		if @plane then scene.remove @plane

		# creating new geometry
		geometry = new THREE.PlaneGeometry widthSegments, heightSegments, widthSegments, heightSegments

		# creating grid array
		# ---------y---------
		# ---------y---------
		# xxxxxxxxx+xxxxxxxxx
		# ---------y---------
		# ---------y---------
		row = -1
		for f, i in geometry.faces
			# add new y-array
			if (i%(@widthSegments*2)) is 0
				@grid.push []
				row++
			# pushing x-cell into current y-array and setting default color
			color = if i%2 is 0 then .3 else .4
			@grid[row].push i
			f.color.setRGB color, color, color
		for h in [0...@heightSegments]
			row = []
			for w in [0...@widthSegments]
				s = new THREE.Mesh(
					new THREE.PlaneGeometry 1, 1, 1, 1
					new THREE.MeshBasicMaterial({
						color: 0x00ff00
					})
				)
				s.position.x = (-@widthSegments/2)+w+.5
				s.position.z = (-@heightSegments/2)+h+.5
				s.rotation.x = -Math.PI/2
				s.position.y = .1
				row.push s
				s.visible = off
				scene.add s
			@steps.push row


		# creating new mesh and adding to scene
		@plane = new THREE.Mesh(
			geometry
			new THREE.MeshPhongMaterial({ vertexColors: THREE.FaceColors})
		)
		@geometry = @plane.geometry
		@plane.rotation.x = -Math.PI/2
		scene.add @plane

		# bind event handlers
		document.addEventListener 'mousedown', (e)=>
			if e.button is 0
				document.addEventListener 'mousemove', @mouseMove, off
			@mouseDown e
		document.addEventListener 'mouseup', =>
			document.removeEventListener 'mousemove', @mouseMove, off
			return

		LOG.add "
			Terrain created :: [ #{widthSegments} x #{heightSegments} ]
		"

		return


	### Setting plane color
			-> color 					[hex] - Three.js-color (0xrrggbb)
			<= nothing
	###
	setColor: (color)->

		# do nothing if plane was not created and added to scene
		if !@plane then return

		# set face color
		for f, i in @geometry.faces
			c = GlobalUtils.hexToRgb color.replace /0x/gim, ''
			if i%2 is 0
				f.color.setRGB c.r/255, c.g/255, c.b/255
			else
				f.color.setRGB c.r/255+.1, c.g/255+.1, c.b/255+.1

		# update mesh colors and vertices
		@geometry.colorsNeedUpdate = on
		@geometry.verticesNeedUpdate = on

		LOG.add "
			Terrain color changed to #{color}
		"

		return


	### Setting plane color
			-> value 					[bool] - Three.js-color (0xrrggbb)
			<= nothing
	###
	setWireframe: (value)->

		# do nothing if plane was not created and added to scene
		if !@plane then return

		# set plane wireframe value
		@plane.material.wireframe = value

		LOG.add "
			Terrain wireframe was #{if @plane.material.wireframe then 'enabled' else 'disabled'}
		"

		return

	### Setting plane color
			-> value 					[bool] - Three.js-color (0xrrggbb)
			<= nothing
	###
	setSteps: (value)->

		# do nothing if plane was not created and added to scene
		if !@plane then return

		# set plane wireframe value
		for row in @steps
			for col in row
				col.visible = value

		LOG.add "
			Terrain steps grid was #{if @steps[0][0].visible then 'enabled' else 'disabled'}
		"

		return


	### Removing plane from scene
			-> nothing
			<= nothing
	###
	remove: ->

		# do nothing if plane was not created and added to scene
		if @plane
			scene.remove @plane
			@plane = null
		LOG.add "
			Terrain was removed.
		"

		return


	setObjectOrigin: (object, event, randomRotation, randomScale)->
		mouse = new THREE.Vector2()
		mouse.x = (event.pageX / renderer.domElement.width) * 2 - 1
		mouse.y = -(event.pageY / renderer.domElement.height) * 2 + 1
		@raycaster.setFromCamera mouse, camera
		intersects = @raycaster.intersectObject @plane
		if intersects[0]
			object.position.x = intersects[0].point.x
			object.position.y = intersects[0].point.y
			object.position.z = intersects[0].point.z
			if randomRotation
				object.rotation.y = GlobalUtils.random 0, Math.PI*2
			if randomScale
				s = GlobalUtils.random .5, 1.5
				object.scale.set s, s, s
		return

	###-------------------------------------------------------------###



	#-----[ Private methods ]-----------------------------------------#

	### Getting sub-grid from current face
			-> position 			[obj{x,y}] - position on grid
			<= grid 					[obj{sub-grid,position}] - sub grid from brush
	###
	_getColorGrid: (pos)->

		# find start indes
		y = Math.ceil(pos.y - @brushSize/2)
		y = if y <= 0 then 0 else y

		# return grid object
		{
			array: @grid.slice y, pos.y + Math.ceil @brushSize/2
			pos: pos
		}


	### Getting position on the grid from current face index
			-> face index 		[int] - face index from plane faces array
			<= position 			[obj{x,y}] - position on the grid
	###
	_getPosition: (faceIndex)->

		# init the object
		pos = {x: 0, y: 0}
		w = @widthSegments*2

		pos.y = faceIndex / w
		pos.x = Math.ceil(w * (pos.y - Math.floor(pos.y)))
		pos.y = Math.floor(pos.y)

		# return position
		pos


	### Getting current face index
			-> event 					[obj] - mouse event object
			<= face 					[obj{x,y}] - face,  face index and
	###
	_getFace: (event)->

		# do nothing if plane was not created
		if !event[Terrain.modifier] then return

		# getting coordinates on plane from event
		Terrain.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
		Terrain.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
		Terrain.raycaster.setFromCamera Terrain.mouse, camera

		# getting intersection
		intersects = Terrain.raycaster.intersectObjects [Terrain.plane]

		# if not intersected then do nothing
		if !intersects or !intersects[0] then return

		# or, getting face index and face from plane faces array
		faceIndex = intersects[0].faceIndex
		face = Terrain.plane.geometry.faces[faceIndex]

		# return face object
		{
			face: face
			faceIndex: faceIndex
			parent: intersects[0]
		}


	### Getting current face index
			-> event 					[obj] - mouse event object
			<= nothing
	###
	_heightEvent: (event)->

		# getting active face and do nothig if not exists
		activeFace = Terrain._getFace event
		if !activeFace or !activeFace.face then return

		# a,b, and c - vertexes of face
		a = Terrain.plane.geometry.vertices[activeFace.face.a]
		b = Terrain.plane.geometry.vertices[activeFace.face.b]
		c = Terrain.plane.geometry.vertices[activeFace.face.c]

		# if shift pressed then decrease height
		if event.shiftKey
			a.z -= .1 * parseFloat Terrain.weight
			b.z -= .1 * parseFloat Terrain.weight
			c.z -= .1 * parseFloat Terrain.weight

		# or increase height if shift was not pressed
		else
			a.z += .1 * parseFloat Terrain.weight
			b.z += .1 * parseFloat Terrain.weight
			c.z += .1 * parseFloat Terrain.weight

		# update colors and vertices
		Terrain.plane.geometry.colorsNeedUpdate = on
		Terrain.plane.geometry.verticesNeedUpdate = on

		return


	### Getting sub grid from brush
			-> event 					[obj] - face object from _getPosition method
			<= sub grid 			[obj] result of _getPosition method
	###
	_getBrushPolygons: (face)->
		@_getColorGrid @_getPosition face.faceIndex


	### Binding color event
			-> event 					[obj] - mouse event
			<= nothing
	###
	_colorEvent: (event)->

		# getting active face and do nothing if not exists
		activeFace = Terrain._getFace event
		if !activeFace or !activeFace.face then return

		# handler calling
		Terrain._paint Terrain._getBrushPolygons activeFace

		return


	### Binding plaining event
			-> event 					[obj] - mouse event
			<= nothing
	###
	_plainingEvent: (event)->

		# getting active face and do nothing if not exists
		activeFace = Terrain._getFace event
		if !activeFace or !activeFace.face then return

		# handler calling
		Terrain._plain Terrain._getBrushPolygons(activeFace), event

		return


	### Painting event
			-> sub grid 			[obj] - sub grid under brush
			<= nothing
	###
	_paint: (grid)->

		# convert color
		color = GlobalUtils.hexToRgb Terrain.brushColor.replace /0x/gim, ''

		# iterate rows
		for y in grid.array

			# iterate colls
			for x in y

				# finding primary position
				primaryX = @_getPosition(x).x - grid.pos.x
				primaryY = @_getPosition(x).y - grid.pos.y

				# distance from primary face to current face and color intensity
				sqrt = Math.sqrt primaryX * primaryX + primaryY * primaryY
				sqrtCoef = sqrt / (@brushSize / 2)

				# if face is under brush (brush is round, not square)
				if (
						@_getPosition(x).x > grid.pos.x-Math.ceil(@brushSize/2) &&
						@_getPosition(x).x < grid.pos.x+Math.ceil(@brushSize/2) &&
						@brushSize/2 > sqrt
					)

					# getting current face
					face = Terrain.plane.geometry.faces[x]

					# setting color and intensity
					face.color.setRGB(
						(face.color.r * sqrtCoef + (1-sqrtCoef) * (color.r / 255)) # red
						(face.color.g * sqrtCoef + (1-sqrtCoef) * (color.g / 255)) # green
						(face.color.b * sqrtCoef + (1-sqrtCoef) * (color.b / 255)) # blue
					)

					# update colors and vertices
					@geometry.colorsNeedUpdate = on
					@geometry.verticesNeedUpdate = on

		return


	### Plaining event
			-> sub grid 			[obj] - sub grid under brush
			-> event 					[obj] - mouse event
			<= nothing
	###
	_plain: (grid, event)->

		# creating primary face and creating array for 
		primaryFace 	= null
		planeFaces 		= []

		# iterate rows
		for y in grid.array

			# iterate colls
			for x in y

				# primary face positions on the grid
				primaryX = @_getPosition(x).x - grid.pos.x
				primaryY = @_getPosition(x).y - grid.pos.y

				# distance from primary face to current face and color intensity
				sqrt = Math.sqrt primaryX * primaryX + primaryY * primaryY
				sqrtCoef = sqrt / (@brushSize / 2)

				# if face is under brush (brush is round, not square)
				if (
						@_getPosition(x).x > grid.pos.x-Math.ceil(@brushSize/2) &&
						@_getPosition(x).x < grid.pos.x+Math.ceil(@brushSize/2) &&
						@brushSize/2 > sqrt
					)

					# if current face is primary face
					if (
							@_getPosition(x).x is grid.pos.x &&
							@_getPosition(x).y is grid.pos.y
						)
						# set face to variable
						primaryFace = Terrain.plane.geometry.faces[x]

					# or push face to array
					else planeFaces.push Terrain.plane.geometry.faces[x]

		# for each face in array
		for f in planeFaces

			# current face vertices
			a = @geometry.vertices[f.a]
			b = @geometry.vertices[f.b]
			c = @geometry.vertices[f.c]

			# primary face vertices
			pa = @geometry.vertices[primaryFace.a]
			pb = @geometry.vertices[primaryFace.b]
			pc = @geometry.vertices[primaryFace.c]

			# if shift was pressed - then set height from lowest vertex, if not - from hightest
			height = if event.shiftKey then Math.min pa.z, pb.z, pc.z else Math.max pa.z, pb.z, pc.z

			# setting height
			a.z = height
			b.z = height
			c.z = height

		# update colors and vertices
		@geometry.colorsNeedUpdate = on
		@geometry.verticesNeedUpdate = on

		return

	###-------------------------------------------------------------###



	#-----[ Events ]--------------------------------------------------#

	mouseMove: (event)->

		if !mainHeader.tabs.terrain then return
		if Terrain.instrument is 'height' then Terrain._heightEvent event
		if Terrain.instrument is 'color' then Terrain._colorEvent event
		if Terrain.instrument is 'plaining' then Terrain._plainingEvent event

		return

	mouseDown: (event)->
		if !mainHeader.tabs.terrain then return
		if Terrain.instrument is 'height' then Terrain._heightEvent event
		if Terrain.instrument is 'color' then Terrain._colorEvent event
		if Terrain.instrument is 'plaining' then Terrain._plainingEvent event
		return

	###-------------------------------------------------------------###