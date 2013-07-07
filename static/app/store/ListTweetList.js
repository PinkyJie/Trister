Ext.define('Trister.store.ListTweetList', {
	extend: 'Ext.data.Store',

	config: {
		model: 'Trister.model.Tweet',
        proxy: {
            type: 'ajax',
            url: '/',
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