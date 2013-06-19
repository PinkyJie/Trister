Ext.define('Trister.model.Tweet', {
	extend: 'Ext.data.Model',

	config: {
		fields: [
            'created_at', 'id_str', 'text', 'source', 'in_reply_to_status_id_str',
            'in_reply_to_user_id_str', 'in_reply_to_screen_name', 'retweet_count',
            'favorited', 'retweeted','user', 'entities',
            {name: 'retweeted_status', type: 'object', defaultValue: null},
            {name: 'reply_user_img', type: 'string', defaultValue: ''}
        ],
        pageSize: 20
	}
});