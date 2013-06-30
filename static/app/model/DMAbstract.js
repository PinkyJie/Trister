Ext.define('Trister.model.DMAbstract', {
    extend: 'Ext.data.Model',

    requires: [
        'Trister.util.Common'
    ],

    config: {
        fields: [
            'time', 'dms', 'me',
            {
                name: 'formatted_time',
                type: 'string',
                convert: function(value, record) {
                    return Trister.util.Common.formatTime(record.get('time'));
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