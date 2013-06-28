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
        id: 'HomePanel',
        fullscreen: true,
        tabBarPosition: 'bottom',
        items: [
            {
                xtype: 'titlebar',
                title: 'Timeline',
                docked: 'top',
                items: [
                    {
                        id: 'TweetBtn',
                        align: 'right',
                        iconCls: 'compose'
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