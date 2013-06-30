Ext.define('Trister.model.DirectMessage', {
    extend: 'Ext.data.Model',

    requires: [
        'Trister.util.Common'
    ],

    config: {
        fields: [
            'id_str', 'text', 'sender', 'recipient', 'entities', 'created_at', 'type',
            {
                name: 'formatted_time',
                type: 'string',
                convert: function(value, record) {
                    var date = new Date(record.get('created_at'));
                    return [
                        date.getFullYear().toString(),
                        '-',
                        addZeroPrefix((date.getMonth() + 1)),
                        '-',
                        addZeroPrefix(date.getDate()),
                        ' ',
                        addZeroPrefix(date.getHours()),
                        ':',
                        addZeroPrefix(date.getMinutes()),
                        ':',
                        addZeroPrefix(date.getSeconds())
                    ].join('');

                }
            },
            {
                name: 'formatted_text',
                type: 'string',
                convert: function(value, record) {
                    return Trister.util.Common.genFormattedTweet(record.get('text'), record.get('entities'));
                }
            }
        ],
        pageSize: 20
    }
});

function addZeroPrefix(num) {
    if (num < 10) {
        return '0' + num;
    }
    return '' + num;
}