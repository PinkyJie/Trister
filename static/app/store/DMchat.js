Ext.define('Trister.store.DMchat', {
	extend: 'Ext.data.Store',

	config: {
		model: 'Trister.model.DirectMessage',
        // autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '/home',
            pageParam: 'page',
            limitParam: 'count',
            reader: {
                type: 'json'
            }
        }
	}
});