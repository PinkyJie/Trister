Ext.define('Trister.view.DM', {
    extend: 'Ext.navigation.View',
    xtype: 'dmnavigation',

    requires: [
        'Trister.view.DMList',
        'Trister.view.DMChatList',
        'Ext.Label'
    ],

    config: {
        id: 'DMNavigation',
        title: 'DM',
        iconCls: 'mail',
        cls: 'dm',
        defaultBackButtonText: 'DM',
        navigationBar: {
            items: [
                {
                    id: 'ComposeDM',
                    xtype: 'button',
                    align: 'right',
                    iconCls: 'compose'
                },
                {
                    id: 'CurOpennedChatIdx',
                    xtype: 'label',
                    hidden: true
                }
            ]
        },
        items: [
            {
                xtype: 'dmlist'
            }
        ]
    }
});