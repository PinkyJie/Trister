Ext.define('Trister.view.DM', {
    extend: 'Ext.navigation.View',
    xtype: 'dmnavigation',

    requires: [
        'Trister.view.DMList',
        'Trister.view.DMChatList'
    ],

    config: {
        id: 'DMNavigation',
        title: 'DM',
        iconCls: 'chat',
        cls: 'dm',
        defaultBackButtonText: 'DM',
        navigationBar: {
            items: {
                id: 'ComposeDM',
                xtype: 'button',
                align: 'right',
                iconCls: 'compose'
            }
        },
        items: [
            {
                xtype: 'dmlist'
            }
        ]
    }
});