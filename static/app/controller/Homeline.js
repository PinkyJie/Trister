Ext.define('Trister.controller.Homeline', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            homelineView: 'homelinelist',
            updateView: '#UpdatePanel',
            mainView: '#MainPanel'
        },
        control: {
            homelineView: {
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
                record.set('favorited', !favorited);
            },
            failure: function(response) {
                var result = Ext.decode(response.responseText);
                Ext.Msg.alert('Error', result.content);
            }
        });
    },

    doActionToTweet: function(item, record) {
        console.log(item);
        var updatePanel = this.getUpdateView();
        var updateTitleBar = updatePanel.down('titlebar');
        var updateType = updatePanel.down('textfield[name=type]');
        var updateTweetId = updatePanel.down('textfield[name=tweet_id]');
        var updateTextarea = updatePanel.down('textareafield');
        var updateCheckCount = updatePanel.down('label');
        if (item.action === 'Reply' || item.action === 'RT') {
            updateTitleBar.setTitle(item.action);
            updateType.setValue(item.action);
            if (item.action === 'Reply') {
                updateTweetId.setValue(record.get('id_str'));
                var users = [];
                Ext.Array.forEach(record.get('entities').user_mentions, function(mention, idx){
                    users.push('@' + mention.screen_name);
                });
                var author;
                if (record.get('retweeted_status')) {
                    author = '@' + retweeted_status.user.screen_name;
                } else {
                    author = '@' + record.get('user').screen_name;
                }
                updateTextarea.setValue(author + ' ' + users.join(' ') + ' ');
            } else {
                updateTweetId.setValue(null);
                updateTextarea.setValue(' ' + record.get('text'));
            }
            updateCheckCount.setHtml(140 - updateTextarea.getValue().length);
            this.getMainView().setActiveItem('#UpdatePanel');
            updateTextarea.focus();
        } else if (item.action === 'Retweet') {
            // Ext.Ajax.request({
            //     url: '/favorite/' + action,
            //     method: 'POST',
            //     params: {
            //         tweet_id: record.get('id_str')
            //     },
            //     scope: this,
            //     success: function(response) {
            //         record.set('favorited', !favorited);
            //     },
            //     failure: function(response) {
            //         var result = Ext.decode(response.responseText);
            //         Ext.Msg.alert('Error', result.content);
            //     }
            // });
        } else if (item.action === 'Delete') {
            // Ext.Ajax.request({
            //     url: '/favorite/' + action,
            //     method: 'POST',
            //     params: {
            //         tweet_id: record.get('id_str')
            //     },
            //     scope: this,
            //     success: function(response) {
            //         record.set('favorited', !favorited);
            //     },
            //     failure: function(response) {
            //         var result = Ext.decode(response.responseText);
            //         Ext.Msg.alert('Error', result.content);
            //     }
            // });
        }
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {
        Ext.getStore('Homeline').addListener('load', function(){
            this.getHomelineView().setMasked(false);
        }, this);
    }
});
