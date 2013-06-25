Ext.define('Trister.controller.UpdateStatus', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            updateView: '#UpdatePanel',
            cancelBtn: '#UpdatePanel #CancelBtn',
            sendBtn: '#UpdatePanel #SendBtn',
            form: '#UpdatePanel formpanel',
            textarea: '#UpdatePanel formpanel textareafield',
            countLabel: '#UpdatePanel formpanel label'
        },
        control: {
            cancelBtn: {
                tap: 'returnHome'
            },
            sendBtn: {
                tap: 'sendTweet'
            },
            textarea: {
                keyup: 'checkWordCount'
            }
        }
    },

    returnHome: function() {
        this.getTextarea().setValue('');
        this.getUpdateView().getParent().setActiveItem('#HomePanel', {type: 'slide', direction: 'left'});
    },

    sendTweet: function() {
        var form = this.getForm();
        var form_data = form.getValues();
        if (form_data['tweet'] === '') {
            Ext.Msg.alert('Error','Tweet content can not be blank!');
        } else if (form_data['tweet'].length > 140) {
            Ext.Msg.alert('Error','The length of tweet content can not be more than 140!');
        } else {
            this.getUpdateView().setMasked({
                xtype: 'loadmask',
                message: 'Updating...Please wait...'
            });
            form.submit({
                url: '/update',
                method: 'POST',
                scope: this,
                success: function(form, result) {
                    this.getUpdateView().getParent().setMasked(false);
                    this.getTextarea().setHtml('');
                    this.getUpdateView().getParent().setActiveItem('#HomePanel', {type: 'slide', direction: 'left'});
                },
                failure: function(form, result) {
                    this.getUpdateView().getParent().setMasked(false);
                    Ext.Msg.alert('Error', result.content);
                }
            });
        }
    },

    checkWordCount: function() {
        var count = this.getTextarea().getValue().length;
        var label = this.getCountLabel();
        label.setHtml(140 - count);
        if (count <= 140) {
            label.setCls('tweet-count');
        } else {
            label.setCls('tweet-count-warning');
        }
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});
