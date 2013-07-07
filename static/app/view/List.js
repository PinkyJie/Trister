Ext.define('Trister.view.List', {
    extend: 'Ext.navigation.View',
    xtype: 'listnavigation',

    requires: [
        'Trister.view.ListList',
        'Trister.view.ListTweetList'
    ],

    config: {
        id: 'ListNavigation',
        title: 'List',
        iconCls: 'list',
        cls: 'tweet-list-nav',
        defaultBackButtonText: 'List',
        items: [
            {
                xtype: 'listlist'
            }
        ]
    }
});