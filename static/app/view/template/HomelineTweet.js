Ext.define('Trister.view.template.HomelineTweet', {
    extend: 'Ext.Template',
    requires: [
        'Trister.util.Common'
    ],

    constructor: function (config) {
        this.callParent([
            '<tpl if="retweeted_status">',
                '<img class="user-img" src="{retweeted_status.user.profile_image_url_https}" />',
            '<tpl else>',
                '<img class="user-img" src="{user.profile_image_url_https}" />',
            '</tpl>',
            '<tpl if="retweeted_status">',
                '<img class="type-img" src="{user.profile_image_url_https}" />',
            '<tpl elseif="in_reply_to_user_id_str">',
                '<img class="type-img" src="{reply_user_img}" />',
            '<tpl elseif="source == \'Instagram\'">',
                '<img class="type-img" src="resources/img/instagram.png" />',
            '<tpl elseif="source == \'街旁(JiePang)-台灣/香港\'">',
                '<img class="type-img" src="resources/img/jiepang.png" />',
            '<tpl elseif="source == \'foursquare\'">',
                '<img class="type-img" src="resources/img/foursquare.png" />',
            '<tpl else>',
                '<img class="type-img" src="resources/img/status.png" />',
            '</tpl>',
            '<div class="tweet">',
            '<p class="time">{[this.show_diff(values.created_at)]}</p>',
            '<tpl if="retweeted_status">',
                '<p class="user-name">{retweeted_status.user.screen_name}</p>',
            '<tpl else>',
                '<p class="user-name">{user.screen_name}</p>',
            '</tpl>',
            '<p class="content">{text}</p>',
            '<p class="source">',
            '<tpl if="retweeted_status">',
                '<span class="tweet-type">Rwteeted by <span class="relate-user label">{user.screen_name}</span></span>',
            '<tpl elseif="in_reply_to_user_id_str">',
                '<span class="tweet-type">Reply to <span class="relate-user label">{in_reply_to_screen_name}</span></span>',
            '</tpl>',
            '  via <span class="source-text label">{source}</span></p>',
            '</div>',
            {
                show_diff: Trister.util.Common.process_time
            }
        ]);
    }
});