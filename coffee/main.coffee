# for title in document.querySelectorAll '[data-title]'
# 	title.onmouseover = ->
# 		text = this.getAttribute 'data-title'
# 		hint = document.createElement 'div'
# 		hint.className = 'hint'
# 		hint.innerHTML = text
# 		document.body.appendChild hint
# 		rect = this.getBoundingClientRect()
# 		hint.style.left = rect.left+rect.width/2+'px'
# 		hint.style.top = rect.top+rect.height+'px'
# 		setTimeout ->
# 			hint.classList.add 'active'
# 		, 1000
# 		return
# 	title.onmouseout = ->
# 		for hint in document.getElementsByClassName 'hint'
# 			hint.classList.remove 'active'
# 			setTimeout ->
# 				document.body.removeChild hint
# 			, 100
# 		return

# _bindCalc = (calc)->
# 	input = calc.previousElementSibling
# 	plus = calc.querySelector '.plus'
# 	minus = calc.querySelector '.minus'
# 	plus.addEventListener 'mousedown', ->
# 		val = if parseInt(input.value) then parseInt(input.value) else 0
# 		input.value = val+1
# 	minus.addEventListener 'mousedown', ->
# 		val = if parseInt(input.value) and parseInt(input.value) > 0 then parseInt(input.value) else 1
# 		input.value = val-1
# 	return

# for calc in document.querySelectorAll '.calc'
# 	_bindCalc calc

# Object.prototype.getName = ->
# 	funcNameRegex = /function (.{1,})\(/;
# 	results = (funcNameRegex).exec((this).constructor.toString());
# 	return if (results && results.length > 1) then results[1] else ""

colorPopup = {}
# mainAside = {}
mainHeader = {}
vueRenderer = {}
OPTIONS =
	leftAside: off
	rightAside: on
	theme: 'skin'
RENDER =
	isPlaying: off
INSTRUMENT = ''
asideWidth =
	left: 200
	right: 200

OBJECT = new THREE.Object3D()

LOADER =
	json: new THREE.JSONLoader()

projector = new THREE.Projector()

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100000 );


AXIS = new THREE.AxisHelper(200)
scene.add AXIS



renderer = new THREE.WebGLRenderer({alpha: on});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById('renderWrapper').appendChild renderer.domElement
controls = new THREE.OrbitControls( camera, renderer.domElement )
# controls.enabled = off

# console.log OBJECTER.controls
# controls.enabled = off

random = (min, max)->
  rand = min + Math.random() * (max - min)
document.addEventListener 'contextmenu', (e)->
	e.preventDefault()

geometry = new THREE.BoxGeometry( 10, 10, 10 );
material = new THREE.MeshNormalMaterial();

loader = new THREE.JSONLoader()
imgLoader = new THREE.TextureLoader()
cube = new THREE.Object3D()
light = new THREE.PointLight( 0xbbbbbb, 1, 1000 );
ambient = new THREE.AmbientLight( 0xbbbbbb);
light.position.set( 100, 100, 100 );
scene.add( light );
scene.add ambient


# grid = ThreeUtils.grid 100, 1
# grid.position.y = -.1

# scene.add grid

# for i in [-250...250]
# 	c = new THREE.Mesh( geometry, material );
# 	c.position.x = random -10, 10
# 	c.position.y = random -10, 10
# 	c.position.z = random -10, 10
# 	scene.adwadsd c

# lineGeo = new THREE.Geometry()
# lineGeo.vertices.push new THREE.Vector3 0, 0, 0
# lineGeo.vertices.push new THREE.Vector3 0, 1, 0

# lineMaterial = new THREE.LineBasicMaterial
# 	color: 0x00ff00

# line = new THREE.Mesh(
# 	new THREE.BoxGeometry 1,1,1
# 	new THREE.MeshNormalMaterial()
# )
# scene.add line
camera.position.x = 0;
camera.position.y = 2;
camera.position.z = 5;

KEYS = {}
document.addEventListener 'keydown', (e)->
	ev = e.code.toLowerCase().replace /(Key|Arrow)/gim, ''
	KEYS[ev] = on
document.addEventListener 'keyup', (e)->
	ev = e.code.toLowerCase().replace /(Key|Arrow)/gim, ''
	KEYS[ev] = off
lastTime = new Date().getTime()
i = 0
render = ->
	requestAnimationFrame( render );

	newTime = new Date().getTime()
	difference = newTime - lastTime
	lastTime = newTime
	if window.infoBar and i%10 is 1 then infoBar.fps = difference

	# if KEYS.up	then controls.pan( new THREE.Vector2( 0, 10 ) );
	# if KEYS.down	then controls.pan( new THREE.Vector2( 0, -10 ) );
	# if KEYS.left	then controls.pan( new THREE.Vector2( 10, 0 ) );
	# if KEYS.right	then controls.pan( new THREE.Vector2( -10, 0 ) );

	renderer.render(scene, camera);
	controls.update();

	i++

setTimeout ->
	render()
, 2000
# console.clear()

onWindowResize = ( e )->
	do vueRenderer.setViewport
	return
window.addEventListener 'resize', onWindowResize, false