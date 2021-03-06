Ext.define('Trister.view.Homeline', {
    extend: 'Ext.List',
    xtype: 'homelinelist',
    requires: [
        'Trister.store.Homeline',
        'Ext.plugin.ListPaging',
        'Ext.plugin.PullRefresh',
        'Trister.plugin.ListOptions',
        'Trister.view.Threads'
    ],

    config: {
        id: 'HomelineList',
        title: 'Timeline',
        iconCls: 'home',
        cls: 'home',
        store: 'Homeline',
        disableSelection: true,
        scrollToTopOnRefresh: false,
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
                xclass: 'Trister.plugin.ListOptions',
                menuOptions: [
                    {
                        action: 'Reply',
                        iconCls: 'action'
                    },
                    {
                        action: 'RT',
                        iconCls: 'quote'
                    },
                    {
                        action: 'Retweet',
                        iconCls: 'loop2'
                    },
                    {
                        action: 'Delete',
                        iconCls: 'trash'
                    }
                ]
            }
        ],
        emptyText: '<p class="no-tweets">No tweets found!</p>',
        itemTpl: Ext.XTemplate.from('HomelineTweet'),
        items: [
            {
                xtype: 'threadspanel',
                hidden: true
            }
        ]
    }
});