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
                property: 'type',
                direction: 'ASC'
            },
            {
                property: 'slug',
                direction: 'ASC'
            }
        ],
        grouper: function(record) {
            return record.get('type');
        },
        listeners: {
            load: 'hideLoadingMask'
        }
	},

    hideLoadingMask: function() {
        Ext.getCmp('HomePanel').setMasked(false);
    }

});