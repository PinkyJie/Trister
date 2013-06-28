Ext.define('Trister.store.DMList', {
	extend: 'Ext.data.Store',

	config: {
		model: 'Trister.model.DMAbstract',
        // autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '/dm',
            pageParam: 'page',
            limitParam: 'count',
            reader: {
                type: 'json'
            }
        }
	}
});