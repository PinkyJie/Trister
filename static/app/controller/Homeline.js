Ext.define('Trister.controller.Homeline', {
    extend: 'Ext.app.Controller',

    requires: [
        'Trister.util.Common'
    ],

    config: {
        refs: {
            homelineView: 'homelinelist',
            updateView: '#UpdatePanel',
            mainView: '#MainPanel',
            threadView: 'homelinelist threadspanel'
        },
        control: {
            homelineView: {
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
        } else if (e.target.className === 'type-img') {
            Trister.util.Common.getReplyThreads(item, replyId, this.getHomelineView(), this.getThreadView());
        }

    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});
