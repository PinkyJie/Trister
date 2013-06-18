Ext.define('Trister.model.Tweet', {
	extend: 'Ext.data.Model',

	config: {
		fields: [
            'created_at', 'id_str', 'text', 'source', 'in_reply_to_status_id_str',
            'in_reply_to_user_id_str', 'in_reply_to_screen_name', 'retweet_count',
            'favorited', 'retweeted', 'source_url', 'retweeted_status','user',
            'entity','reply_user_img'
        ],
        pageSize: 20
	}
});