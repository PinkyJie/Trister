Ext.define('Trister.store.ListTweetList', {
	extend: 'Ext.data.Store',

	config: {
		model: 'Trister.model.Tweet',
        proxy: {
            type: 'ajax',
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
        Ext.getCmp('ListNavigation').setMasked(false);
    }
});