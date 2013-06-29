Ext.define('Trister.model.DirectMessage', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            'id_str', 'text', 'sender', 'recipient', 'entities', 'created_at', 'type',
            {
                name: 'formatted_time',
                type: 'string',
                convert: function(value, record) {
                    var date = new Date(record.get('created_at'));
                    return [
                        date.getFullYear().toString(),
                        '-',
                        addZeroPrefix((date.getMonth() + 1)),
                        '-',
                        addZeroPrefix(date.getDate()),
                        ' ',
                        addZeroPrefix(date.getHours()),
                        ':',
                        addZeroPrefix(date.getMinutes()),
                        ':',
                        addZeroPrefix(date.getSeconds())
                    ].join('');

                }
            },
            {
                name: 'formatted_text',
                type: 'string',
                convert: function(value, record) {
                    return genFormattedTweet(record.get('text'), record.get('entities'));
                }
            }
        ],
        pageSize: 20
    }
});

// use entities field to extract info included in a tweet
function genFormattedTweet(text, entities) {
    if (entities.hashtags.length > 0 ) {
        Ext.Array.forEach(entities.hashtags, function(hashtag, idx) {
            text = text.replace(
                '#' + hashtag.text,
                ['<span class="content-tag label">',
                 '#' +  hashtag.text,
                 '</span>'
                ].join('')
            );
        });
    } else if (entities.urls.length > 0) {
        Ext.Array.forEach(entities.urls, function(url, idx) {
            text = text.replace(
                url.url,
                ['<span class="content-url label">',
                 '<a target="_blank" href="' + url.expanded_url + '">',
                 url.display_url,
                 '</a>',
                 '</span>'
                ].join('')
            );
        });
    } else if (entities.user_mentions.length > 0) {
        Ext.Array.forEach(entities.user_mentions, function(mention, idx) {
            text = text.replace(
                '@' + mention.screen_name,
                ['<span class="content-user label">',
                 '@' +  mention.screen_name,
                 '</span>'
                ].join('')
            );
        });
    } else if (entities.media && entities.media.length > 0) {
        Ext.Array.forEach(entities.media, function(media, idx) {
            text = text.replace(
                media.url,
                ['<span class="content-media label">',
                 '<a target="_blank" href="' + media.expanded_url + '">',
                 media.display_url,
                 '</a>',
                 '</span>'
                ].join('')
            );
        });
    }
    return text;
}

function addZeroPrefix(num) {
    if (num < 10) {
        return '0' + num;
    }
    return '' + num;
}