Ext.define('Trister.store.DMList', {
	extend: 'Ext.data.Store',

	config: {
		model: 'Trister.model.DMAbstract',
        sorters: [{
            property: 'time',
            direction: 'DESC'
        }],
        proxy: {
            type: 'ajax',
            url: '/dm',
            pageParam: 'page',
            limitParam: 'count',
            reader: {
                type: 'json'
            }
        },
        listeners: {
            load: 'combineData',
            beforeload: 'cacheOldData'
        },
        cacheData: []
	},

    combineData: function(store, records) {
        var oldData = this.getCacheData();
        if (oldData.length > 0) {

            var newData = Ext.Array.clone(oldData);
            Ext.Array.forEach(records, function(rec, idx){
                var newId = rec.internalId;
                var newArr = Ext.Array.filter(oldData, function(data){
                    return data.internalId === newId;
                });
                if (newArr.length === 1) {
                    var index = Ext.Array.indexOf(newData, newArr[0]);
                    var dms = newData[index].get('dms');
                    newData[index].set('dms', dms.concat(rec.get('dms')));
                } else {
                    newData.push(rec);
                }
            });
            store.setData(newData);
        }
        Ext.getCmp('HomePanel').setMasked(false);
    },

    cacheOldData: function(store) {
        var nowData = store.getData().items;
        if (nowData.length > 0) {
            this.setCacheData(Ext.Array.clone(nowData));
        }
    }

});