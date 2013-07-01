Ext.define('Trister.controller.Mention', {
    extend: 'Ext.app.Controller',

    requires: [
        'Trister.util.Common'
    ],

    config: {
        refs: {
            mentionView: 'mentionlist',
            updateView: '#UpdatePanel',
            mainView: '#MainPanel',
            threadView: 'mentionlist threadspanel'
        },
        control: {
            mentionView: {
                itemdoubletap: 'addOrRemoveFav',
                menuoptiontap: 'doActionToTweet',
                itemtap: 'showThreadPanel'
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

    showThreadPanel: function(list, index, item, record, e) {
        var replyId = record.get('in_reply_to_status_id_str');
        if (replyId === null) {
            return;
        } else if (e.target.className === 'type-img') {
            Trister.util.Common.getReplyThreads(item, replyId, this.getMentionView(), this.getThreadView());
        }

    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});
