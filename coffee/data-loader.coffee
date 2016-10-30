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
		{name: 'primitives 2', files: [
			'primitives/box'
			'primitives/circle'
			'primitives/cone'
			'primitives/plane'
			'primitives/ring'
			'primitives/sphere'
		]}
		{name: 'primitives 3', files: [
			'primitives/box'
			'primitives/circle'
			'primitives/cone'
			'primitives/plane'
			'primitives/ring'
			'primitives/sphere'
		]}
		{name: 'primitives 4', files: [
			'primitives/box'
			'primitives/circle'
			'primitives/cone'
			'primitives/plane'
			'primitives/ring'
			'primitives/sphere'
		]}
	]
else DataLoader.load()