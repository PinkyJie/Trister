Ext.define('Trister.view.DMList', {
    extend: 'Ext.List',
    xtype: 'dmlist',

    requires: [
        'Trister.store.DMList',
        'Ext.plugin.ListPaging',
        'Ext.plugin.PullRefresh'
    ],

    config: {
        id: 'DMList',
        title: 'DM',
        store: 'DMList',
        disableSelection: true,
        onItemDisclosure: true,
        scrollToTopOnRefresh: false,
        plugins: [
            {
                xclass: 'Ext.plugin.ListPaging',
                autoPaging: true,
                loadMoreText: 'Load more DMs...',
                noMoreRecordsText: 'No more DMs!'
            },
            {
                xclass: 'Ext.plugin.PullRefresh',
                pullRefreshText: 'Pull down to update...',
                releaseRefreshText: 'Release to update...'
            }
        ],
        emptyText: '<p class="no-tweets">No DMs found!</p>',
        itemTpl: Ext.XTemplate.from('DMAbstract')
    }
});