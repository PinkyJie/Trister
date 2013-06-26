Ext.define('Trister.view.DM', {
    extend: 'Ext.navigation.View',
    xtype: 'dmnavigation',

    requires: [
        'Trister.view.DMlist',
        // 'Trister.view.DMchat'
    ],

    config: {
        items: {
            xtype: 'dmlist'
        }
    }
});