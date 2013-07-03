Ext.define('Trister.view.DMChatList', {
    extend: 'Ext.List',
    xtype: 'dmchatlist',

    requires: [
        'Ext.Toolbar',
        'Trister.store.DMChatList'
    ],

    config: {
        id: 'DMChatList',
        cls: 'dm-chat-list',
        disableSelection: true,
        store: 'DMChatList',
        scrollToTopOnRefresh: false,
        items: [
            {
                xtype: 'toolbar',
                docked: 'bottom',
                items: [
                    {
                        id: 'DMContent',
                        xtype: 'textareafield',
                        height: 60,
                        flex: 6,
                        name: 'DMInput'
                    },
                    {
                        xtype: 'button',
                        text: 'Send',
                        ui: 'action',
                        flex: 1
                    }
                ]
            }
        ],
        itemTpl: Ext.XTemplate.from('DMChat')
    }
});