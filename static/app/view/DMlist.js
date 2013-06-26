Ext.define('Trister.view.DMlist', {
    extend: 'Ext.List',
    xtype: 'dmlist',

    requires: [
        'Trister.store.DMlist',
        'Ext.plugin.ListPaging',
        'Ext.plugin.PullRefresh'
    ],

    config: {
        id: 'DMList',
        title: 'DM',
        iconCls: 'user',
        cls: 'dm',
        store: 'DMlist',
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
        itemTpl: Ext.XTemplate.from('DMabstract')
    }
});