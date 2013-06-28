Ext.define('Trister.model.DMAbstract', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            'time', 'dms', 'me',
            {
                name: 'formatted_time',
                type: 'string',
                convert: function(value, record) {
                    var diff = new Date().getTime() - new Date(record.get('time')).getTime();
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
                name: 'friend',
                type: 'object',
                convert: function(value, record) {
                    var latest_dm = record.get('dms')[0];
                    if (latest_dm.sender.screen_name === record.get('me')) {
                        return latest_dm.recipient;
                    } else {
                        return latest_dm.sender;
                    }
                }
            },
            {
                name: 'latest_dm_text',
                type: 'string',
                convert: function(value, record) {
                    return record.get('dms')[0].text;
                }
            }
        ],
        pageSize: 20
    }
});