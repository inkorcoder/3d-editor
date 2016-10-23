Vue.filter 'tabs', (items, curr)->
	res = []
	for item in items
		if item.tab.toString() is curr.toString() then res.push item
	this.$set 'filtered', res.length
	res
