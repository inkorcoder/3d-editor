for title in document.querySelectorAll '[data-title]'
	title.onmouseover = ->
		text = this.getAttribute 'data-title'
		hint = document.createElement 'div'
		hint.className = 'hint'
		hint.innerHTML = text
		document.body.appendChild hint
		rect = this.getBoundingClientRect()
		hint.style.left = rect.left+rect.width/2+'px'
		hint.style.top = rect.top+rect.height+'px'
		setTimeout ->
			hint.classList.add 'active'
		, 1000
		return
	title.onmouseout = ->
		for hint in document.getElementsByClassName 'hint'
			hint.classList.remove 'active'
			setTimeout ->
				document.body.removeChild hint
			, 100
		return

_bindCalc = (calc)->
	input = calc.previousElementSibling
	plus = calc.querySelector '.plus'
	minus = calc.querySelector '.minus'
	plus.addEventListener 'mousedown', ->
		val = if parseInt(input.value) then parseInt(input.value) else 0
		input.value = val+1
	minus.addEventListener 'mousedown', ->
		val = if parseInt(input.value) and parseInt(input.value) > 0 then parseInt(input.value) else 1
		input.value = val-1
	return

for calc in document.querySelectorAll '.calc'
	_bindCalc calc

Object.prototype.getName = ->
	funcNameRegex = /function (.{1,})\(/;
	results = (funcNameRegex).exec((this).constructor.toString());
	return if (results && results.length > 1) then results[1] else ""

colorPopup = {}
# mainAside = {}
mainHeader = {}
vueRenderer = {}
OPTIONS =
	leftAside: on
	rightAside: off
RENDER =
	isPlaying: off
INSTRUMENT = ''
asideWidth =
	left: 260
	right: 260

LOADER =
	json: new THREE.JSONLoader()

addToArea = (obj)->
	LOADER.json.load 'files/'+obj, (geo, mats)->
		console.log mats
		m = new THREE.Mesh geo, new THREE.MeshFaceMaterial mats
		scene.add m

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight, 0.1, 100000 );

axis = new THREE.AxisHelper(200)
scene.add axis



renderer = new THREE.WebGLRenderer({alpha: on});
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById('renderWrapper').appendChild renderer.domElement
controls = new THREE.OrbitControls( camera, renderer.domElement )
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
light = new THREE.PointLight( 0xffffff, 1, 1000 );
ambient = new THREE.AmbientLight( 0x555555);
light.position.set( 50, 10, 50 );
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





camera.position.x = 10;
camera.position.y = 10;
camera.position.z = 10;

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

	if KEYS.up	then controls.pan( new THREE.Vector2( 0, 10 ) );
	if KEYS.down	then controls.pan( new THREE.Vector2( 0, -10 ) );
	if KEYS.left	then controls.pan( new THREE.Vector2( 10, 0 ) );
	if KEYS.right	then controls.pan( new THREE.Vector2( -10, 0 ) );

	renderer.render(scene, camera);
	controls.update();

	i++

render();
console.clear()

obj = cube

onWindowResize = ( e )->
	do vueRenderer.setViewport
	return
window.addEventListener 'resize', onWindowResize, false