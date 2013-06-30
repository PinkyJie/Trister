Ext.define('Trister.controller.DMChatList', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            dmChatView: '#DMChatList',
            textareaField: '#DMChatList textareafield',
            sendBtn: '#DMChatList button'
        },
        control: {
            sendBtn: {
                tap: 'sendDM'
            }
        }
    },

    sendDM: function(btn) {
        var dmContent = this.getTextareaField().getValue();
        if (dmContent === '') {
            Ext.Msg.alert('Error','DM content can not be blank!');
        } else {
            var friendName = this.getDmChatView().title;
            Ext.Ajax.request({
                url: '/dm/create',
                method: 'POST',
                scope: this,
                params: {
                    'screen_name': friendName,
                    'text': dmContent
                },
                success: function(response) {
                    var res = Ext.decode(response.responseText);
                    if (res.success === true) {
                        this.getTextareaField().setValue('');
                        var dm = res.content;
                        dm.type = 'local';
                        this.getDmChatView().getStore().add(dm);
                    } else {
                        Ext.Msg.alert('Error','Failed to send DM!');
                    }
                }
            });
        }
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});