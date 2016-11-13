GlobalUtils =

	createTriggerObject: (array, value, itemName)->
		result = {}
		for item in array
			key = if itemName then item[itemName] else item
			result[key] = value
		result

	toggleTriggerObject: (array, object, value, itemName)->
		for item in array
			key = if itemName then item[itemName] else item
			object[key] = value

	rgbToHex: (r, g, b)->
		"#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

	hexToRgb: (hex)->
		shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
		hex = hex.replace shorthandRegex, (m, r, g, b)->
			return r + r + g + g + b + b
		result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec hex
		return if result then {
			r: parseInt result[1], 16
			g: parseInt result[2], 16
			b: parseInt result[3], 16
		} else null

	setRendererSize: ->
		containerWidth = window.innerWidth
		containerHeight = window.innerHeight
		renderer.setSize( containerWidth, containerHeight );
		camera.aspect = containerWidth / containerHeight;
		camera.updateProjectionMatrix()
		return

	closest: (el, selector)->
		matchesSelector = el.matches or
											el.webkitMatchesSelector or
											el.mozMatchesSelector or
											el.msMatchesSelector
		while el
			if matchesSelector.call el, selector
				break
		el = el.parentElement
		el

	random: (min, max)->
		min + Math.random() * (max - min)
