Ext.define('Trister.model.ListAbstract', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            'id_str', 'user', 'full_name', 'subscriber_count', 'member_count',
            'description', 'slug', 'created_at'
        ]
    }
});