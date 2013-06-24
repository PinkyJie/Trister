Ext.define('Trister.view.Homeline', {
    extend: 'Ext.List',
    xtype: 'homelinelist',
    requires: [
        'Trister.store.Homeline',
        'Ext.plugin.ListPaging',
        'Ext.plugin.PullRefresh',
        'Ext.ux.ListOptions'
    ],

    config: {
        id: 'HomelineList',
        title: 'Home',
        iconCls: 'home',
        cls: 'home',
        store: 'Homeline',
        disableSelection: true,
        plugins: [
            {
                xclass: 'Ext.plugin.ListPaging',
                autoPaging: true,
                loadMoreText: 'Load more Tweets...',
                noMoreRecordsText: 'No more Tweets!'
            },
            {
                xclass: 'Ext.plugin.PullRefresh',
                pullRefreshText: 'Pull down to update...',
                releaseRefreshText: 'Release to update...'
            },
            {
                xclass: 'Ext.ux.ListOptions',
                menuOptions: [{
                    iconCls: 'home'
                }, {
                    iconCls: 'reply'
                }, {
                    iconCls: 'compose'
                }, {
                    iconCls: 'add'
                }]
            }
        ],
        emptyText: '<p class="no-tweets">No tweets found!</p>',
        itemTpl: Ext.XTemplate.from('HomelineTweet')
    }
});