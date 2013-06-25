Ext.define('Trister.view.UpdateStatus', {
	extend: 'Ext.Panel',
	xtype: 'updatepanel',
    requires: [
        'Ext.Label'
    ],

	config: {
        id: 'UpdatePanel',
		fullscreen: true,
        cls: 'update-tweet',
        layout: 'vbox',
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                title: 'Update',
                items: [
                    {
                        id: 'CancelBtn',
                        text: 'Cancel',
                        align: 'left'
                    },
                    {
                        id: 'SendBtn',
                        text: 'Send',
                        align: 'right'
                    }
                ]
            },
            {
                xtype: 'formpanel',
                flex: 1,
                items: [
                    {
                        xtype: 'fieldset',
                        items: [
                            {
                                xtype: 'textareafield',
                                name: 'tweet',
                                required: true
                            },
                            {
                                xtype: 'textfield',
                                name: 'type',
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                name: 'tweet_id',
                                hidden: true
                            }
                        ]
                    },
                    {
                        xtype: 'label',
                        cls: 'tweet-count',
                        html: '140'
                    }
                ]
            }
        ]
	}
});