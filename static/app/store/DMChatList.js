Ext.define('Trister.store.DMChatList', {
	extend: 'Ext.data.Store',

	config: {
		model: 'Trister.model.DirectMessage',
		sorters: [{
			property: 'time',
			direction: 'ASC'
		}]
	}
});