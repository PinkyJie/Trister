Ext.define('Trister.store.Mention', {
	extend: 'Ext.data.Store',

	config: {
		model: 'Trister.model.Tweet',
        proxy: {
            type: 'ajax',
            url: '/mention',
            pageParam: 'page',
            limitParam: 'count',
            reader: {
                type: 'json'
            }
        }
	}
});