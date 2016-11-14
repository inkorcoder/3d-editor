OBJECTER =

	materials:
		green: 					new THREE.MeshPhongMaterial({color: 0x428B23})
		brown: 					new THREE.MeshPhongMaterial({color: 0x231401})

	raycaster: 				new THREE.Raycaster()
	objects: 					[]
	object: 					null

	randomRotation: 	on
	randomScale: 			on

	activeObject: 		''

	setActiveObject: (str)->
		if @activeObject is str then return
		@activeObject = str
		LOG.add "
			Objecter :: spawn object now is [#{str}].
		"
		return

	createPrimitiveGeometry: (str)->
		switch str
			when 'box' 				then geometry = new THREE.BoxGeometry(1, 1, 1)
			when 'circle' 		then geometry = new THREE.CircleGeometry( 1, 16 )
			when 'plane' 			then geometry = new THREE.PlaneGeometry( 1, 1, 1, 1 )
			when 'ring' 			then geometry = new THREE.RingGeometry( 0.5, 1, 16 )
			when 'sphere' 		then geometry = new THREE.SphereGeometry( 1, 16, 16 )
			when 'cone' 			then geometry = new THREE.ConeGeometry( 1, 2, 16 )
		LOG.add 'Objecter :: creating '+str+' geometry...'
		{
			geometry: geometry
			name: str
		}

	createPrimitive: (geometryObject, material)->
		mesh = new THREE.Mesh geometryObject.geometry, material
		mesh.name = geometryObject.name
		mesh.material.color.setRGB .5, .5, .5
		mesh

	add: (path, event)->
		if path.match /primitives/gim
			type = path.split('/')[1]
			mesh = @createPrimitive @createPrimitiveGeometry(type), @materials.phong
			scene.add mesh
			Terrain.setObjectOrigin mesh, event, @randomRotation, @randomScale
			LOG.add 'Objecter :: new primitive object created from '+type+' geometry.'
			@objects.push mesh
		else
			LOADER.json.load 'files/'+path+'/'+path.split('/')[1]+'.json', (geometry, materials)=>
				# console.log materials
				mesh = new THREE.Mesh geometry, new THREE.MeshFaceMaterial materials
				# res = []
				# for m in materials
				# 	res.push @materials.phong
				# mesh = new THREE.Mesh geometry, new THREE.MeshFaceMaterial res
				# console.log mesh
				# for m, i in materials
				# 	mesh.material.materials[i].color.setRGB m.color.r,m.color.g,m.color.b
				# 	mesh.material.materials[i].emissive.setRGB m.emissive.r,m.emissive.g,m.emissive.b
				# 	mesh.material.materials[i].specular.setRGB m.specular.r,m.specular.g,m.specular.b

				# mesh = new THREE.Mesh geometry, @materials.phong
				# mesh = new THREE.Mesh(
				# 	geometry
				# 	new THREE.MeshFaceMaterial(
				# 		[
				# 			@materials.green
				# 			@materials.brown
				# 		]
				# 	)
				# )
				LOG.add 'Objecter :: new object created from ['+path+'].'
				mesh.name = path.split('/')[1]
				scene.add mesh
				Terrain.setObjectOrigin mesh, event, @randomRotation, @randomScale
				@objects.push mesh
				return
		return

	remove: (obj)->
		for object, i in @objects
			if object and object.uuid and (object.uuid is obj.uuid)
				LOG.add 'Objecter :: object ['+obj.name+'] ('+obj.uuid+') was removed.'
				@objects.splice i
		scene.remove obj
		return

	setVisible: (obj)->
		obj.visible = !obj.visible
		LOG.add "
			Objecter :: object [#{obj.name}] (#{obj.uuid}) 
			was #{if obj.visible then 'showed' else 'hiddened'}.
		"
		return

	getOject: (x, y)->
		mouse = new THREE.Vector2()
		mouse.x = (x / renderer.domElement.width) * 2 - 1
		mouse.y = -(y / renderer.domElement.height) * 2 + 1
		@raycaster.setFromCamera mouse, camera
		intersects = @raycaster.intersectObjects @objects
		if intersects[0]
			return intersects[0].object
		else return null

	bind: (obj)->

		return

OBJECTER.controls = new THREE.TransformControls camera, renderer.domElement
scene.add OBJECTER.controls
OBJECTER.controls.enabled = on
renderer.domElement.addEventListener 'mousedown', (e)->
	# e.preventDefault();
	# e.stopPropagation();
	if !e.ctrlKey then return
	if mainHeader.tabs.terrain then return
	object = OBJECTER.getOject(e.clientX, e.clientY)
	if object
		controls.enabled = off
		OBJECTER.controls.attach object
		LOG.add "
			Objecter :: binding controls to [#{object.name}] (#{object.uuid})
		"
	else
		OBJECTER.controls.detach()
		controls.enabled = on
		LOG.add "
			Objecter :: controls was unbinded.
		"
		OBJECTER.add OBJECTER.activeObject, e if OBJECTER.activeObject
	return

renderer.domElement.addEventListener 'mousemove', (e)->
	if !e.ctrlKey then return
	if mainHeader.tabs.terrain then return
	if OBJECTER.activeObject and .3 < Math.random() < .6
		OBJECTER.add OBJECTER.activeObject, e
	return