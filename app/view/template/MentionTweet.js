Ext.define('Trister.view.template.MentionTweet', {
    extend: 'Ext.Template',
    requires: [
        'Trister.util.Common'
    ],

    constructor: function (config) {
        this.callParent([
            '<img class="user-img" src="{user.profile_image_url_https}" />',
            '<tpl if="in_reply_to_user_id_str">',
                '<img class="type-img" src="{reply_user_img}" />',
            '<tpl else>',
                '<img class="type-img" src="static/img/status.png" />',
            '</tpl>',

            '<div class="tweet">',
            '<p class="time">{[this.show_diff(values.created_at)]}</p>',
            '<p class="user-name">{user.screen_name}</p>',
            '<p class="content">{text}</p>',
            '<p class="source">',
            '<tpl if="in_reply_to_user_id_str">',
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