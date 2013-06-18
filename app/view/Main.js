Ext.define('Trister.view.Main', {
    extend: 'Ext.Panel',
    xtype: 'main',
    requires: [
        'Trister.view.Login',
        'Trister.view.Home',
        'Trister.view.UpdateStatus'
    ],
    config: {
        id: 'MainView',
        layout: 'card',
        cardAnimation: 'slide',
        fullscreen: true,
        items: [
            {
                xtype: 'loginpanel'
            },
            {
                xtype: 'homepanel'
            },
            {
                xtype: 'updatepanel'
            }
        ]
    }
});