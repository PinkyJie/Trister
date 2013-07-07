Ext.define('Trister.view.ListTweetList', {
    extend: 'Ext.List',
    xtype: 'listtweetlist',

    requires: [
        'Trister.store.ListTweetList',
        'Ext.plugin.ListPaging',
        'Ext.plugin.PullRefresh'
    ],

    config: {
        id: 'ListTweetList',
        cls: 'list-tweet-list',
        disableSelection: true,
        store: 'ListTweetList',
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
            }
        ],
        emptyText: '<p class="no-tweets">No Tweets found!</p>',
        itemTpl: Ext.XTemplate.from('HomelineTweet')
    }
});