OBJECTER =

	add: (Object3d)->
		scene.add Object3d
		return

	remove: (obj)->
		scene.remove obj
		return

	setVisible: (obj)->
		obj.visible = !obj.visible
		return