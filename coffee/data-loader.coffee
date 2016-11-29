if typeof require isnt 'undefined' then electron = require('electron') || undefined
if electron
	app = electron.app
	remote = electron.remote
	dialog = electron.dialog
	fs = require('fs')

DataLoader =
	parseFolder: (folder)->
		tmp =
			name: folder.replace /( |\ )/gim, ''
			files: []
		fs.readdir './files/'+folder, (err, bytesRead, buffer)->
			if bytesRead and bytesRead.length > 0
				for file in bytesRead
					tmp.files.push file
		DATA.push tmp
		return
	load: ->
		fs.readdir './files', (err, folders, buffer)->
			for folder in folders
				DataLoader.parseFolder folder
			return
		return

window.DATA = []

if !electron
	window.DATA = [
		{name: 'primitives', files: [
			'primitives/box'
			'primitives/circle'
			'primitives/cone'
			'primitives/plane'
			'primitives/ring'
			'primitives/sphere'
		]}
		{name: 'Plants', files: [
			'plants/tree1'
			'plants/tree2'
			'plants/tree3'
			'plants/tree4'
			'plants/tree5'
			'plants/stone1'
			'plants/stone2'
			'plants/stone3'
			'plants/stone4'
			'plants/stone5'
			'plants/shrub1'
			'plants/shrub2'
			'plants/shrub3'
			'plants/shrub4'
			'plants/shrub5'
			'plants/birch'
			'plants/birch-tree'
			'plants/oak'
			'plants/pine'
			'plants/pine-tree'
			'plants/flo-camomile'
			'plants/flo-narcissus'
			'plants/flo-tuilp-red'
			'plants/flo-tuilp-yellow'
			'plants/grass1'
			'plants/grass2'
			'plants/grass3'
		]}
	]
else DataLoader.load()