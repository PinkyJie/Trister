Ext.define('Trister.view.Home', {
    extend: 'Ext.TabPanel',
    xtype: 'homepanel',
    requires: [
        'Ext.TitleBar',
        'Trister.view.Homeline',
        'Trister.view.Mention',
        'Trister.view.DM'
    ],


    config: {
        fullscreen: true,
        tabBarPosition: 'bottom',
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                title: 'Trister',
                items: [
                    {
                        align: 'right',
                        text: 'Tweet',
                        handler: function() {
                            mainView.setActiveItem('UpdateView', { type: 'slide', direction: 'left' });
                        }
                    }
                ]
            },
            {
                xtype: 'homelinelist'
            },
            {
                xtype: 'mentionlist'
            },
            {
                xtype: 'dmlist'
            }
        ]
    }
});