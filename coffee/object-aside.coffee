Vue.filter 'isEmpty', (objs)->
	res = []
	for o in objs
		if o.name != '' then res.push o
	res

objectAside = new Vue(

	el: '#object-aside'

	data:
		isActive: OPTIONS.rightAside
		separatorPosition: 40
		object: OBJECT
		log: 							log
		objectPositionX: OBJECT.position.x
		objectPositionY: OBJECT.position.y
		objectPositionZ: OBJECT.position.z
		objectRotationX: OBJECT.rotation.x
		objectRotationY: OBJECT.rotation.y
		objectRotationZ: OBJECT.rotation.z
		objectScaleX: OBJECT.scale.x
		objectScaleY: OBJECT.scale.y
		objectScaleZ: OBJECT.scale.z
		objectMaterialType: ''
		objectMaterialReflectivity: 0.1
		objectMaterialOpacity: 1
		objectMaterialTransparent: off
		objectMaterialColor: ''
		objectMaterialEmissive: ''
		hierarchy: scene.children

	methods:

		setRotationX: (event,reset)->
			this.$data.object.rotation.x = event.target.value * (Math.PI/180); return
		setRotationY: ->
			this.$data.object.rotation.y = event.target.value * (Math.PI/180); return
		setRotationZ: ->
			this.$data.object.rotation.z = event.target.value * (Math.PI/180); return

		setScaleX: ->
			this.$data.object.scale.x = event.target.value; return
		setScaleY: ->
			this.$data.object.scale.y = event.target.value; return
		setScaleZ: ->
			this.$data.object.scale.z = event.target.value; return

		setPositionX: ->
			this.$data.object.position.x = event.target.value; return
		setPositionY: ->
			this.$data.object.position.y = event.target.value; return
		setPositionZ: ->
			this.$data.object.position.z = event.target.value; return

		setMaterialType: (str)->
			this.$data.objectMaterialType = str; return

		setMaterialReflectivity: ->
			this.$data.objectMaterialReflectivity = event.target.value; return

		setMaterialOpacity: ->
			this.$data.objectMaterialOpacity = event.target.value; return

		setColorPopupCaller: (event)->
			colorPopup.caller = event.target
			colorPopup.isActive = on

		toggleAside: ->
			this.$data.isActive = !this.$data.isActive
			mainHeader.isRight = this.$data.isActive
			return

		separatorUp: ->
			this.$data.separatorPosition = 10 / window.innerHeight * 100
			return

		separatorDown: ->
			this.$data.separatorPosition = 100 - (10 / window.innerHeight * 100)
			return

		setVisible: (obj)->
			OBJECTER.setVisible obj

		removeItem: (obj)->
			OBJECTER.remove obj

)

separatorMove = (e)->
	# e.preventDefault()
	pos = e.pageY / window.innerHeight * 100
	if e.pageY <= 10 then pos = 10 / window.innerHeight * 100
	if e.pageY+10 >= window.innerHeight then pos = 100 - (10 / window.innerHeight * 100)
	objectAside.separatorPosition = pos
	return

document
	.addEventListener 'mousedown', (e)->
		if e.target.id is 'separator'
			document.body.classList.add 'dragged'
			document.addEventListener 'mousemove', separatorMove
document
	.addEventListener 'mouseup', ->
		document.body.classList.remove 'dragged'
		document.removeEventListener 'mousemove', separatorMove

# document.getElementById 'object-aside'
	# .addEventListener 'mouseover', ->
		# window.controls.enabled = off
# document.getElementById 'object-aside'
	# .addEventListener 'mouseout', ->
		# window.controls.enabled = on