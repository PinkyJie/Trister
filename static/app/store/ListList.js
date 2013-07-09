Ext.define('Trister.store.ListList', {
	extend: 'Ext.data.Store',

	config: {
		model: 'Trister.model.ListAbstract',
        proxy: {
            type: 'ajax',
            url: '/lists/***',
            reader: {
                type: 'json'
            }
        },
        sorters: [
            {
                property: 'slug',
                direction: 'ASC'
            }
        ],
        groupField: 'sort_type',
        groupDir: 'ASC',
        listeners: {
            load: 'hideLoadingMask'
        }
	},

    hideLoadingMask: function() {
        Ext.getCmp('HomePanel').setMasked(false);
    }

});