Ext.define('Trister.store.Config', {
	extend: 'Ext.data.Store',

	config: {
        autoLoad: true,
        autoSync: true,
		model: 'Trister.model.Config',
        data: [{
            user: null
        }],
        proxy: {
            type: 'localstorage',
            id: 'trister-config'
        }
	}
});