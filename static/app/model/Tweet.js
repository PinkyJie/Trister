Ext.define('Trister.model.Tweet', {
	extend: 'Ext.data.Model',

	config: {
		fields: [
            'created_at', 'id_str', 'text', 'source', 'in_reply_to_status_id_str',
            'in_reply_to_user_id_str', 'in_reply_to_screen_name', 'retweet_count',
            'favorited', 'retweeted','user', 'entities',
            {name: 'retweeted_status', type: 'object', defaultValue: null},
            {name: 'reply_user_img', type: 'string', defaultValue: ''},
            {
                name: 'formatted_time',
                type: 'string',
                convert: function(value, record) {
                    var diff = new Date().getTime() - new Date(record.get('created_at')).getTime();
                    if (diff > 1000 * 60 * 60 * 24) {
                        return Math.floor(diff / (1000 * 60 * 60 * 24)) + " d ago";
                    } else if (diff > 1000 * 60 * 60) {
                        return Math.floor(diff / (1000 * 60 * 60)) + " h ago";
                    } else if (diff > 1000 * 60) {
                        return Math.floor(diff / (1000 * 60)) + " m ago";
                    } else {
                        return Math.floor(diff / 1000) + " s ago";
                    }
                }
            }
        ],
        pageSize: 20
	}
});