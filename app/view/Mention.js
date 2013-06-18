Ext.define('Trister.view.Mention', {
    extend: 'Ext.List',
    xtype: 'mentionlist',
    requires: [
        'Trister.store.Mention',
        'Ext.plugin.ListPaging',
        'Ext.plugin.PullRefresh',
        'Trister.view.template.MentionTweet'
    ],

    config: {
        title: 'Mention',
        iconCls: 'reply',
        cls: 'mention',
        store: 'Mention',
        disableSelection: true,
        plugins: [
            { xclass: 'Ext.plugin.ListPaging' },
            { xclass: 'Ext.plugin.PullRefresh' }
        ],
        emptyText: '<p class="no-tweets">No mentions found!</p>',
        itemTpl: 'MentionTweet'
    }

});