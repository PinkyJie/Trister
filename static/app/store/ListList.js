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
        listeners: {
            load: 'hideLoadingMask',
            itemtap: 'showListTweets'
        }
	},

    showListTweets: function(list, index, item, record) {
    },

    hideLoadingMask: function() {
        Ext.getCmp('HomePanel').setMasked(false);
    }

});