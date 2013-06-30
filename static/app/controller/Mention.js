Ext.define('Trister.controller.Mention', {
    extend: 'Ext.app.Controller',

    requires: [
        'Trister.util.Common'
    ],

    config: {
        refs: {
            mentionView: 'mentionlist',
            updateView: '#UpdatePanel',
            mainView: '#MainPanel'
        },
        control: {
            mentionView: {
                itemdoubletap: 'addOrRemoveFav',
                menuoptiontap: 'doActionToTweet'
            }
        }
    },

    addOrRemoveFav: function(list, index, item, record) {
        var favorited = record.get('favorited');
        var action;
        if (favorited === false) {
            action = 'add';
        } else {
            action = 'del';
        }
        Ext.Ajax.request({
            url: '/favorite/' + action,
            method: 'POST',
            params: {
                tweet_id: record.get('id_str')
            },
            scope: this,
            success: function(response) {
                var res = Ext.decode(response.responseText);
                if (res.success === true) {
                    record.set('favorited', !favorited);
                } else {
                    Ext.Msg.alert('Error', res.content);
                }
            }
        });
    },

    doActionToTweet: function(item, record) {
        Trister.util.Common.doActionToTweet(item, record, this);
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});
