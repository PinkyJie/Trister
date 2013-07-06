Ext.define('Trister.model.DMAbstract', {
    extend: 'Ext.data.Model',

    requires: [
        'Trister.util.Common'
    ],

    config: {
        fields: [
            {
                name: 'dms',
                type: 'array',
                convert: function(value, record) {
                    return value.sort(function(a,b){
                        return (new Date(b.created_at).getTime()) -
                            (new Date(a.created_at).getTime());
                    });
                }
            },
            {
                name: 'time',
                type: 'int',
                convert: function(value, record) {
                    return new Date(record.get('dms')[0].created_at).getTime();
                }
            },
            {
                name: 'formatted_time',
                type: 'string',
                convert: function(value, record) {
                    var time = record.get('dms')[0].created_at;
                    return Trister.util.Common.formatTime(time);
                }
            },
            {
                name: 'friend',
                type: 'object',
                convert: function(value, record) {
                    var latest_dm = record.get('dms')[0];
                    var config = Ext.getStore('Config').getAt(0);
                    if (latest_dm.sender.screen_name === config.get('user').name) {
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
            },
            {
                name: 'id',
                type: 'string',
                convert: function(value, record) {
                    return record.get('friend').id_str;
                }
            }
        ]
    }
});