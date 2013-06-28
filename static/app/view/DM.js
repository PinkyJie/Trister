Ext.define('Trister.view.DM', {
    extend: 'Ext.navigation.View',
    xtype: 'dmnavigation',

    requires: [
        'Trister.view.DMList',
        'Trister.view.DMChatList'
    ],

    config: {
        id: 'DMNavigation',
        items: {
            xtype: 'dmlist'
        }
    }
});