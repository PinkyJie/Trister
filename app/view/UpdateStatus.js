Ext.define('Trister.view.UpdateStatus', {
	extend: 'Ext.Panel',
	xtype: 'updatepanel',
    requires: [
        'Ext.Label'
    ],

	config: {
		fullscreen: true,
        title: 'Update',
        cls: 'update-tweet',
        layout: 'vbox',
        masked: {
            xtype: 'loadmask',
            message: 'Updating...',
            hidden: true
        },
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                title: 'Update',
                items: [
                    {
                        text: 'Cancel',
                        align: 'left',
                        handler: function() {
                            mainView.setActiveItem('HomeView', { type: 'slide', direction: 'left' });
                        }
                    },
                    {
                        text: 'Send',
                        align: 'right',
                        handler: function() {
                            var form = this.getParent().getParent().getParent().getItems().items[1];
                            var form_data = form.getValues();
                            if (form_data['tweet'] === '') {
                                Ext.Msg.alert('Error','Tweet content can not be blank!');
                            } else if (form_data['tweet'].length > 140) {
                                Ext.Msg.alert('Error','The length of tweet content can not be more than 140!');
                            } else {
                                this.getParent().getParent().getParent().getMasked().show();
                                form.submit({
                                    url: '/update',
                                    method: 'POST',
                                    success: function(form,result) {
                                        form.getParent().getMasked().hide();
                                        if (result.status == "success") {
                                            mainView.setActiveItem('HomeView', { type: 'slide', direction: 'left' });
                                            mainView.getItems().items[1].getStore().load();
                                        } else if (result.status == "error") {
                                            Ext.Msg.alert('Error', result.content);
                                        }
                                    }
                                });
                            }
                        }
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
                                required: true,
                                listeners: {
                                    keyup: function() {
                                        var count = this.getValue().length;
                                        var label = this.getParent().getParent().getItems().items[1];
                                        label.setHtml(140 - count);
                                        if (count <= 140) {
                                            label.setCls('tweet-count');
                                        } else {
                                            label.setCls('tweet-count-warning');
                                        }
                                    }
                                }
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