Ext.define('Trister.model.ListAbstract', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            'id_str', 'user', 'full_name', 'subscriber_count', 'member_count',
            'description', 'slug', 'created_at', 'type', 'following',
            {
                name: 'sort_type',
                type: 'string',
                convert: function(value, record) {
                    var re = /@(\w+)\/.*/;
                    var reResult = re.exec(record.get('full_name'));
                    var config = Ext.getStore('Config').getAt(0);
                    if (reResult.length === 2 && config.get('user').name === reResult[1]) {
                        return 'Lists you Created';
                    } else if (record.get('following') === true) {
                        return 'Lists you Followed';
                    } else {
                        return 'Lists you Included';
                    }
                }
            }
        ]
    }
});