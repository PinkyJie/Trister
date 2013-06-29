Ext.define('Trister.store.DMList', {
	extend: 'Ext.data.Store',

	config: {
		model: 'Trister.model.DMAbstract',
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
            load: 'hideLoadingMask'
        }
	},

    hideLoadingMask: function() {
        Ext.getCmp('HomePanel').setMasked(false);
    }
});