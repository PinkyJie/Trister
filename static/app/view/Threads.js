Ext.define('Trister.view.Threads', {
    extend: 'Ext.Panel',
    xtype: 'threadspanel',
    requires: [
        'Trister.store.Threads'
    ],

    config: {
        width: '90%',
        height: '50%',
        hideOnMaskTap: true,
        modal: true,
        items: [
            {
                xtype: 'list',
                width: '100%',
                height: '100%',
                cls: 'threads',
                store: 'Threads',
                disableSelection: true,
                emptyText: '<p class="no-tweets">No threads found!</p>',
                itemTpl: Ext.XTemplate.from('ThreadTweet')
            }
        ]
    }
});