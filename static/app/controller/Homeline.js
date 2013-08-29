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
                itemtouchstart: 'onItemTouchStart',
                itemtouchmove: 'onItemTouchMove',
                itemtouchend: 'onItemTouchEnd',
                // custom event 
                userimgtap: 'showUserPanel',
                relateusertap: 'showUserPanel',
                typeimgchattap: 'showThreadPanel',
                usertap: 'showUserPanel',
                urltap: 'showMediaViewer',
                mediatap: 'showMediaViewer',
                tagtap: 'showTagPanle',
                sourcetexttap: 'showMediaViewer'
            }
        }
    },

    addOrRemoveFav: function(list, index, item, record) {
        Trister.util.Common.toggleTweetFav(record);
    },

    doActionToTweet: function(item, record) {
        Trister.util.Common.doActionToTweet(item, record, this);
    },

    onItemTouchStart: function(list, index, item, record, e) {
        var targetClass, target;
        if (e.target.tagName === 'A') {
            target = e.target.parentElement;
        } else {
            target = e.target;
        }
        targetClass = target.classList;
        if (targetClass.contains('user-img') ||
            targetClass.contains('chat') ||
            targetClass.contains('content-user') ||
            targetClass.contains('relate-user') ||
            targetClass.contains('content-url') ||
            targetClass.contains('content-media') ||
            targetClass.contains('content-tag') ||
            targetClass.contains('source-text')
            ) {
            Ext.get(e.target).addCls('pressed');
            this.touchCancelled = false;
        }
    },

    onItemTouchMove: function(list, index, item, record, e) {
        Ext.get(e.target).removeCls('pressed');
        this.touchCancelled = true;
    },

    onItemTouchEnd: function(list, index, item, record, e) {
        if (this.touchCancelled) {
            this.touchCancelled = false;
            return;
        }
        Ext.get(e.target).removeCls('pressed');
        var targetClass = e.target.classList;
        var customeEventName;
        if (targetClass.contains('user-img')) {
            customeEventName = 'userimgtap';
        } else if (targetClass.contains('chat')) {
            customeEventName = 'typeimgchattap';
        } else if (targetClass.contains('content-user')) {
            customeEventName = 'usertap';
        } else if (targetClass.contains('relate-user')) {
            customeEventName = 'relateusertap';
        } else if (targetClass.contains('content-url')) {
            customeEventName = 'urltap';
            e.stopPropagation();
        } else if (targetClass.contains('content-media')) {
            customeEventName = 'mediatap';
            e.stopPropagation();
        } else if (targetClass.contains('content-tag')) {
            customeEventName = 'tagtap';
        } else if (targetClass.contains('source-text')) {
            customeEventName = 'sourcetexttap';
            e.stopPropagation();
        }
        if (customeEventName) {
            this.getHomelineView().fireEvent(customeEventName,
                list, index, item, record, e);
        }
    },

    showUserPanel: function(list, index, item, record, e) {
        // TODO
        Ext.Msg.alert('Warning', 'not implemented!');
    },

    showMediaViewer: function(list, index, item, record, e) {
        // TODO
        Ext.Msg.alert('Warning', 'not implemented!');
    },

    showTagPanle: function(list, index, item, record, e) {
        // TODO
        Ext.Msg.alert('Warning', 'not implemented!');
    },

    showThreadPanel: function(list, index, item, record, e) {
        var replyId = record.get('in_reply_to_status_id_str');
        Trister.util.Common.getReplyThreads(item, replyId, this.getHomelineView(), this.getThreadView());
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});
