Ext.define('Trister.model.Config', {
    extend: 'Ext.data.Model',

    config: {
        identifier: {
            type: 'uuid'
        },
        fields: [
            {
                name: 'user',
                type: 'object'
            }
        ]
    }
});