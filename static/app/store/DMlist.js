Ext.define('Trister.store.DMlist', {
	extend: 'Ext.data.Store',

	config: {
		model: 'Trister.model.DMabstract',
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