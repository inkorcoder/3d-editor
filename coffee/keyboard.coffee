document.addEventListener 'keydown', (e)->
	ev = e.code.toLowerCase().replace /(Key|Arrow)/gim, ''
	KEYS[ev] = on
	console.log e.keyCode
	switch e.keyCode
		when 49 # 1
			OBJECTER.controls.setMode "translate"
			break
		when 50 # 2
			OBJECTER.controls.setMode "rotate"
			break
		when 51 # 3
			OBJECTER.controls.setMode "scale"
			break
		when 187 # +, =, num+
			OBJECTER.controls.setSize OBJECTER.controls.size + 0.1
			break
		when 189 # -, _, num-
			OBJECTER.controls.setSize Math.max OBJECTER.controls.size - 0.1, 0.1
			break
	return

document.addEventListener 'keyup', (e)->
	ev = e.code.toLowerCase().replace /(Key|Arrow)/gim, ''
	KEYS[ev] = off
	return