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
                 '[' + url.display_url.split('/')[0] + ']',
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
                     '[' + media.display_url.split('/') + ']',
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
                var me = Ext.getStore('Config').getAt(0).get('user').name;
                Ext.Array.forEach(record.get('entities').user_mentions, function(mention, idx){
                    if (mention.screen_name !== me) {
                        users.push('@' + mention.screen_name);
                    }
                });
                var author;
                if (record.get('retweeted_status')) {
                    author = '@' + retweeted_status.user.screen_name;
                } else {
                    author = '@' + record.get('user').screen_name;
                }
                var replyText = author + ' ' + users.join(' ');
                if (users.length > 0) {
                    replyText += ' ';
                }
                updateTextarea.setValue(replyText);
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
                    var res = Ext.decode(response.responseText);
                    if (res.success === true)  {
                        Ext.Msg.alert('Success', res.content);
                    } else {
                        Ext.Msg.alert('Error', res.content);
                    }
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
                    var res = Ext.decode(response.responseText);
                    if (res.success === true)  {
                        Ext.Msg.alert('Success', res.content);
                    } else {
                        Ext.Msg.alert('Error', res.content);
                    }
                }
            });
        }
    },

    // format time string to 'x ago'
    formatTime: function(timeStr) {
        var diff = new Date().getTime() - new Date(timeStr).getTime();
        if (diff > 1000 * 60 * 60 * 24) {
            return Math.floor(diff / (1000 * 60 * 60 * 24)) + "d ago";
        } else if (diff > 1000 * 60 * 60) {
            return Math.floor(diff / (1000 * 60 * 60)) + "h ago";
        } else if (diff > 1000 * 60) {
            return Math.floor(diff / (1000 * 60)) + "m ago";
        } else {
            return Math.floor(diff / 1000) + "s ago";
        }
    },

    // set cursor positon
    setCaretTo: function(rootId, name, start, pos) {
        var obj = Ext.get(rootId).select('textarea[name=' + name + ']').elements[0];
        obj.focus();
        obj.setSelectionRange(start, pos);
    },

    // get reply threads
    getReplyThreads: function(item, replyStatusId, parentView, threadView) {
        var itemPos = item.element.dom.offsetTop;
        var scroller = parentView.getScrollable().getScroller();
        // a trick to implement after animation action
        scroller.scrollTo(0, itemPos, {
            duration: 500
        });
        setTimeout(function(){
            threadView.showBy(item,'tc-bc');
        },500);
        var threadStore = threadView.down('list').getStore();
        threadStore.removeAll();
        threadView.setMasked({
            xtype: 'loadmask',
            message: 'Loading reply threads...'
        });
        Ext.Ajax.request({
            url: '/threads/' + replyStatusId,
            method: 'GET',
            success: function(response) {
                threadView.setMasked(false);
                var res = Ext.decode(response.responseText);
                if (res.success === true) {
                    threadStore.applyData(res.content);
                } else {
                    threadView.hide();
                    Ext.Msg.alert('Error', res.content);
                }
            }
        });
    },

    // add or remove tweets
    toggleTweetFav: function(record) {
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
            success: function(response) {
                var res = Ext.decode(response.responseText);
                if (res.success === true) {
                    record.set('favorited', !favorited);
                } else {
                    Ext.Msg.alert('Error', res.content);
                }
            }
        });
    }

});