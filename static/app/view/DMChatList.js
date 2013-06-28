Ext.define('Trister.view.DMChatList', {
    extend: 'Ext.List',
    xtype: 'dmchatlist',

    requires: [
        'Ext.Toolbar'
    ],

    config: {
        id: 'DMChatList',
        cls: 'dm-chat',
        disableSelection: true,
        items: [
            {
                xtype: 'toolbar',
                docked: 'bottom',
                items: [
                    {
                        xtype: 'textareafield',
                        height: 60,
                        flex: 5,
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