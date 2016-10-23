ThreeUtils =
	grid: (count,size)->

		material = new THREE.LineBasicMaterial
			color: 0x333333

		geometry = new THREE.Geometry();

		for x in [-count...count+1]
			c = x
			x *= size
			g = new THREE.Geometry();
			g.vertices.push new THREE.Vector3 x, 0, if Math.abs(c)%2 is 1 then -count*size else count*size
			g.vertices.push new THREE.Vector3 x, 0, if Math.abs(c)%2 is 1 then count*size else -count*size
			geometry.merge g

		for z in [-count...count+1]
			c = z
			z *= size
			g = new THREE.Geometry();
			g.vertices.push new THREE.Vector3((if Math.abs(c)%2 is 1 then -count*size else count*size), 0, z)
			g.vertices.push new THREE.Vector3((if Math.abs(c)%2 is 1 then count*size else -count*size), 0, z)
			geometry.merge g

		line = new THREE.Line( geometry, material )

		line