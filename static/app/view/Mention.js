Ext.define('Trister.view.Mention', {
    extend: 'Ext.List',
    xtype: 'mentionlist',
    requires: [
        'Trister.store.Mention',
        'Ext.plugin.ListPaging',
        'Ext.plugin.PullRefresh',
        'Trister.plugin.ListOptions',
        'Trister.view.Threads'
    ],

    config: {
        id: 'MentionList',
        title: 'Mention',
        iconCls: 'action',
        cls: 'mention',
        store: 'Mention',
        disableSelection: true,
        plugins: [
            {
                xclass: 'Ext.plugin.ListPaging',
                autoPaging: true,
                loadMoreText: 'Load more Mentions...',
                noMoreRecordsText: 'No more Mentions!'
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
        emptyText: '<p class="no-tweets">No mentions found!</p>',
        itemTpl: Ext.XTemplate.from('MentionTweet'),
        items: [
            {
                xtype: 'threadspanel',
                hidden: true
            }
        ]
    }

});