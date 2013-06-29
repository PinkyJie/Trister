Ext.define('Trister.util.Common', {
    singleton: true,

    // use entities field to extract info included in a tweet
    // reference https://gist.github.com/wadey/442463
    genFormattedTweet: function(text, entities) {
        var indexMap = {};
        Ext.Array.forEach(entities.hashtags, function(hashtag, idx) {
            indexMap[hashtag.indices[0]] = [
                hashtag.indices[1],
                ['<span class="content-tag label">',
                 '#' +  hashtag.text,
                 '</span>'
                ].join('')
            ];
        });
        Ext.Array.forEach(entities.urls, function(url, idx) {
            indexMap[url.indices[0]] = [
                url.indices[1],
                ['<span class="content-url label">',
                 '<a target="_blank" href="' + url.expanded_url + '">',
                 url.display_url,
                 '</a>',
                 '</span>'
                ].join('')
            ];
        });
        Ext.Array.forEach(entities.user_mentions, function(mention, idx) {
            indexMap[mention.indices[0]] = [
                mention.indices[1],
                ['<span class="content-user label">',
                 '@' +  mention.screen_name,
                 '</span>'
                ].join('')
            ];
        });
        if (entities.media) {
            Ext.Array.forEach(entities.media, function(media, idx) {
                indexMap[media.indices[0]] = [
                    media.indices[1],
                    ['<span class="content-media label">',
                     '<a target="_blank" href="' + media.expanded_url + '">',
                     media.display_url,
                     '</a>',
                     '</span>'
                    ].join('')
                ];
            });
            }

        var result = "";
        var last_i = 0;
        var i = 0;
        for (i = 0; i < text.length; ++i) {
            var ind = indexMap[i];
            if (ind) {
                var end = ind[0];
                var replacedEntity = ind[1];
                if (i > last_i) {
                    result += text.substring(last_i, i);
                }
                result += replacedEntity;
                i = end - 1;
                last_i = end;
            }
        }
        if (i > last_i) {
            result += text.substring(last_i, i);
        }
        return result;
    },

    // response to the tweet context menu
    doActionToTweet: function(menuItem, record, controller) {
        var updatePanel = controller.getUpdateView();
        var updateTitleBar = updatePanel.down('titlebar');
        var updateType = updatePanel.down('textfield[name=type]');
        var updateTweetId = updatePanel.down('textfield[name=tweet_id]');
        var updateTextarea = updatePanel.down('textareafield');
        var updateCheckCount = updatePanel.down('label');
        if (menuItem.action === 'Reply' || menuItem.action === 'RT') {
            updateTitleBar.setTitle(menuItem.action);
            updateType.setValue(menuItem.action);
            if (menuItem.action === 'Reply') {
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
                if (record.get('retweeted_status')) {
                    updateTextarea.setValue(' ' + record.get('text'));
                } else {
                    updateTextarea.setValue(' RT @' + record.get('user').screen_name + ':' + record.get('text'));
                }
            }
            updateCheckCount.setHtml(140 - updateTextarea.getValue().length);
            controller.getMainView().setActiveItem('#UpdatePanel');
            updateTextarea.focus();
        } else if (menuItem.action === 'Retweet') {
            Ext.Ajax.request({
                url: '/retweet',
                method: 'POST',
                params: {
                    tweet_id: record.get('id_str')
                },
                scope: controller,
                success: function(response) {
                    var result = Ext.decode(response.responseText);
                    Ext.Msg.alert('Success', result.content);
                },
                failure: function(response) {
                    var result = Ext.decode(response.responseText);
                    Ext.Msg.alert('Error', result.content);
                }
            });
        } else if (menuItem.action === 'Delete') {
            Ext.Ajax.request({
                url: '/destroy/tweet',
                method: 'POST',
                params: {
                    tweet_id: record.get('id_str')
                },
                scope: controller,
                success: function(response) {
                    var result = Ext.decode(response.responseText);
                    Ext.Msg.alert('Success', result.content);
                },
                failure: function(response) {
                    var result = Ext.decode(response.responseText);
                    Ext.Msg.alert('Error', result.content);
                }
            });
        }
    }
});