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
        Trister.util.Common.toggleTweetFav(record);
    },

    doActionToTweet: function(item, record) {
        Trister.util.Common.doActionToTweet(item, record, this);
    },

    showThreadPanel: function(list, index, item, record, e) {
        var replyId = record.get('in_reply_to_status_id_str');
        if (replyId === null) {
            return;
        } else if (e.target.classList.contains('chat')) {
            Trister.util.Common.getReplyThreads(item, replyId, this.getMentionView(), this.getThreadView());
        }

    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});
