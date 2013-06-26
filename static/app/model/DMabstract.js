Ext.define('Trister.model.DMabstract', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            'id_str', 'text', 'sender', 'recipient', 'entities', 'created_at',
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
            },
            {
                name: 'formatted_text',
                type: 'string',
                convert: function(value, record) {
                    return genFormattedTweet(record.get('text'), record.get('entities'));
                }
            }
        ],
        pageSize: 20
    }
});