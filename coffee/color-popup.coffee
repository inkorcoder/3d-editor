colorPalette = document.getElementById 'colorPalette'
colorPalette.width = 200
colorPalette.height = 200
ctx = colorPalette.getContext '2d'

colorPaletteImage = new Image()
colorPaletteImage.src = 'img/colors.png'
setColorPalette = (brightness)->
	ctx.clearRect 0, 0, colorPalette.width, colorPalette.height
	ctx.fillStyle = "rgb(#{brightness},#{brightness},#{brightness})"
	ctx.fillRect 0, 0, colorPalette.width, colorPalette.height
	ctx.drawImage colorPaletteImage, 0, 0, colorPalette.width, colorPalette.height

colorPaletteImage.onload = ->
	setColorPalette 255

rgbToHex = (R,G,B)->
	toHex(R)+toHex(G)+toHex(B)

toHex = (n)->
	n = parseInt(n,10);
	if (isNaN(n)) then return "00";
	n = Math.max(0,Math.min(n,255));
	return "0123456789ABCDEF".charAt((n-n%16)/16)  + "0123456789ABCDEF".charAt(n%16);

colorPopup = new Vue(

	el: '#color-popup'

	data:
		position: { x: 0, y: 0 }
		canvas: colorPalette
		ctx: ctx
		brightness: 255
		color: { r: '', g: '', b: '', hex: '' }
		caller: null
		isActive: off
		isPointerActive: off
		result: document.getElementById('color-popup').querySelector '.color'
		pointer: document.getElementById('color-popup').querySelector '.pointer'

	methods:

		setColor: ->
			data = this.$data
			imageData = data.ctx.getImageData(data.position.x, data.position.y, 1, 1).data
			data.color.r = imageData[0]
			data.color.g = imageData[1]
			data.color.b = imageData[2]
			rgb = data.color.r + ',' + data.color.g + ',' + data.color.b;
			data.color.hex = rgbToHex(data.color.r,data.color.g,data.color.b);
			data.caller.value = "0x"+data.color.hex.toLowerCase()
			data.result.style.background = "#"+data.color.hex.toLowerCase()

		setPosition: (event, ignore)->
			if this.$data.isPointerActive or ignore
				this.$data.position.x = event.pageX - event.target.parentNode.offsetLeft;
				this.$data.position.y = event.pageY - event.target.parentNode.offsetTop;
				this.$data.pointer.style.left = this.$data.position.x+'px'
				this.$data.pointer.style.top = this.$data.position.y+'px'
				do this.setColor

		enablePointer: ->
			this.$data.isPointerActive = on
			return

		disablePointer: ->
			this.$data.isPointerActive = off
			return

		setBrightness: ->
			setColorPalette this.$data.brightness
			do this.setColor
			return

		confirmColor: ->
			@$data.isActive = off
			@$data.caller.dispatchEvent new Event 'change'
			return

		closePopup: ->
			@$data.isActive = off
			return
)
