Ext.define('Trister.model.Tweet', {
	extend: 'Ext.data.Model',

    requires: [
        'Trister.util.Common'
    ],

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
                    return Trister.util.Common.formatTime(record.get('created_at'));
                }
            },
            {
                name: 'source_text',
                type: 'string',
                convert: function(value, record) {
                    // pick up source text from source html tag
                    // reference http://stackoverflow.com/questions/1499889/remove-html-tags-in-javascript-with-regex#answer-12943036
                    var temp = document.createElement('div');
                    temp.innerHTML = record.get('source');
                    return temp.textContent || temp.innerText;
                }
            },
            {
                name: 'formatted_text',
                type: 'string',
                convert: function(value, record) {
                    return Trister.util.Common.genFormattedTweet(record.get('text'), record.get('entities'));
                }
            },
            {
                name: 'formatted_retweeted_text',
                tyep: 'string',
                convert: function(value, record) {
                    var retweeted = record.get('retweeted_status');
                    if (retweeted) {
                        return Trister.util.Common.genFormattedTweet(
                            record.get('retweeted_status').text,
                            record.get('retweeted_status').entities
                        );
                    } else {
                        return null;
                    }
                }
            }

        ],
        pageSize: 20
	}
});