
/* utility functions */
var process_time = function(d) {
    var diff = new Date().getTime() - new Date(d).getTime();
    if (diff > 1000 * 60 * 60 * 24) {
        return Math.floor(diff / (1000 * 60 * 60 * 24)) + " d ago";
    } else if (diff > 1000 * 60 * 60) {
        return Math.floor(diff / (1000 * 60 * 60)) + " h ago";
    } else if (diff > 1000 * 60) {
        return Math.floor(diff / (1000 * 60)) + " m ago";
    } else {
        return Math.floor(diff / 1000) + " s ago";
    }
}

Ext.application({
    name: 'Trister',
    launch: function() {

        /* Views */
        var loginView = Ext.create('Ext.Panel', {
            id: 'LoginView',
            fullscreen: true,
            title: 'Login',
            cls: 'login',
            layout: 'vbox',
            masked: {
                xtype: 'loadmask',
                message: 'Login...',
                hidden: true
            },
            items: [
                {
                    xtype: 'formpanel',
                    flex: 1,
                    items: [
                        {
                            xtype: 'panel',
                            html: [
                                '<img src="static/img/logo.png" />',
                                '<h2>Trister = Tri(sta) + (Ma)ster</h2>',
                                '<p>A new Twitter web app <br>',
                                'Built with ',
                                '<a href="http://flask.pocoo.org/" target="_blank">Flask</a>',
                                ' & ',
                                '<a href="http://www.sencha.com/products/touch/" target="_blank">Sencha Touch 2</a></p>'
                            ].join('')
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Please Login First',
                            instructions: 'GFW-free Oauth',
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Name',
                                    labelWidth: '40%',
                                    name: 'name',
                                    required: true
                                },
                                {
                                    xtype: 'passwordfield',
                                    label: 'Password',
                                    labelWidth: '40%',
                                    name: 'password',
                                    required: true
                                }
                            ]
                        },
                        {
                            xtype: 'button',
                            text: 'Login',
                            ui: 'action',
                            handler: function() {
                                var form = this.up('formpanel');
                                var form_data = form.getValues();
                                if (form_data['name'] == '' || form_data['password'] == '') {
                                    Ext.Msg.alert('Error','Twitter name or password can not be blank!');
                                } else {
                                    this.getParent().getParent().getMasked().show();
                                    form.submit({
                                        url: '/login',
                                        method: 'POST',
                                        success: function(form,result) {
                                            form.getParent().getMasked().hide();
                                            if (result.status == "success") {
                                                mainView.setActiveItem('HomeView', { type: 'slide', direction: 'left' });
                                            } else if (result.status == "error") {
                                                Ext.Msg.alert('Error', result.content);
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    ]
                }
            ],
            listeners: {
                painted: function() {
                    Ext.Ajax.request({
                        url: '/is_login',
                        method: 'GET',
                        scope: this,
                        success: function(response) {
                            var res = Ext.decode(response.responseText);
                            if (res.is_login == 1) {
                                this.getParent().setActiveItem(1);
                            }
                        }
                    });
                }
            }
        });

        Ext.define('TweetStore', {
            extend: 'Ext.data.Store',
            config: {
                fields: [
                    'created_at', 'id_str', 'text', 'source', 'in_reply_to_status_id_str',
                    'in_reply_to_user_id_str', 'in_reply_to_screen_name', 'retweet_count',
                    'favorited', 'retweeted', 'source_url', 'retweeted_status','user',
                    'entity','reply_user_img'
                ],
                pageSize: 20,
                proxy: {
                    type: 'ajax',
                    url: '/home',
                    pageParam: 'page',
                    limitParam: 'count',
                    reader: {
                        type: 'json'
                    }
                }
            }
        });

        var homeView = Ext.create('Ext.TabPanel',{
            id: 'HomeView',
            fullscreen: true,
            tabBarPosition: 'bottom',
            items: [
                {
                    xtype: 'titlebar',
                    docked: 'top',
                    title: 'Trister',
                    items: [
                        {
                            align: 'right',
                            text: 'Tweet',
                            handler: function() {
                                mainView.setActiveItem('UpdateView', { type: 'slide', direction: 'left' });
                            }
                        }
                    ]
                },
                {
                    xtype: 'list',
                    id: 'homeline',
                    title: 'Home',
                    iconCls: 'home',
                    cls: 'home',
                    store: Ext.create('TweetStore'),
                    disableSelection: true,
                    plugins: [
                        { xclass: 'Ext.plugin.ListPaging' },
                        { xclass: 'Ext.plugin.PullRefresh' }
                    ],
                    emptyText: '<p class="no-tweets">No tweets found!</p>',
                    itemTpl: Ext.create('Ext.XTemplate',
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
                            '<img class="type-img" src="static/img/instagram.png" />',
                        '<tpl elseif="source == \'街旁(JiePang)-台灣/香港\'">',
                            '<img class="type-img" src="static/img/jiepang.png" />',
                        '<tpl elseif="source == \'foursquare\'">',
                            '<img class="type-img" src="static/img/foursquare.png" />',
                        '<tpl else>',
                            '<img class="type-img" src="static/img/status.png" />',
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
                            show_diff: process_time
                        }
                    )
                },
                {
                    xtype: 'list',
                    title: 'Mention',
                    id: 'mention',
                    iconCls: 'reply',
                    cls: 'mention',
                    store: Ext.create('TweetStore').setProxy({
                        type: 'ajax',
                        url: '/mention',
                        pageParam: 'page',
                        limitParam: 'count',
                        reader: {
                            type: 'json'
                        }
                    }),
                    disableSelection: true,
                    plugins: [
                        { xclass: 'Ext.plugin.ListPaging' },
                        { xclass: 'Ext.plugin.PullRefresh' }
                    ],
                    emptyText: '<p class="no-tweets">No mentions found!</p>',
                    itemTpl: Ext.create('Ext.XTemplate',
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
                            show_diff: process_time
                        }
                    )
                },
                {
                    title: 'DM',
                    iconCls: 'user',
                    cls: 'dm',
                    html: 'Direct Message'
                }
            ],
            listeners: {
                activeitemchange: function(p,newItem,oldItem) {
                    newItem.getStore().load();
                }
            }

        });

        var updateView = Ext.create('Ext.Panel',{
            id: 'UpdateView',
            fullscreen: true,
            title: 'Update',
            cls: 'update-tweet',
            layout: 'vbox',
            masked: {
                xtype: 'loadmask',
                message: 'Updating...',
                hidden: true
            },
            items: [
                {
                    xtype: 'titlebar',
                    docked: 'top',
                    title: 'Update',
                    items: [
                        {
                            text: 'Cancel',
                            align: 'left',
                            handler: function() {
                                mainView.setActiveItem('HomeView', { type: 'slide', direction: 'left' });
                            }
                        },
                        {
                            text: 'Send',
                            align: 'right',
                            handler: function() {
                                var form = this.getParent().getParent().getParent().getItems().items[1];
                                var form_data = form.getValues();
                                if (form_data['tweet'] == '') {
                                    Ext.Msg.alert('Error','Tweet content can not be blank!');
                                } else if (form_data['tweet'].length > 140) {
                                    Ext.Msg.alert('Error','The length of tweet content can not be more than 140!');
                                } else {
                                    this.getParent().getParent().getParent().getMasked().show();
                                    form.submit({
                                        url: '/update',
                                        method: 'POST',
                                        success: function(form,result) {
                                            form.getParent().getMasked().hide();
                                            if (result.status == "success") {
                                                mainView.setActiveItem('HomeView', { type: 'slide', direction: 'left' });
                                                mainView.getItems().items[1].getStore().load();
                                            } else if (result.status == "error") {
                                                Ext.Msg.alert('Error', result.content);
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'formpanel',
                    flex: 1,
                    items: [
                        {
                            xtype: 'fieldset',
                            items: [
                                {
                                    xtype: 'textareafield',
                                    name: 'tweet',
                                    required: true,
                                    listeners: {
                                        keyup: function() {
                                            var count = this.getValue().length;
                                            var label = this.getParent().getParent().getItems().items[1];
                                            label.setHtml(140 - count);
                                            if (count <= 140) {
                                                label.setCls('tweet-count');
                                            } else {
                                                label.setCls('tweet-count-warning');
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'label',
                            cls: 'tweet-count',
                            html: '140'
                        }
                    ]
                }
            ]
        });

        var mainView = Ext.create('Ext.Panel',{
            id: 'MainView',
            layout: 'card',
            cardAnimation: 'slide',
            fullscreen: true,
            items: [
                loginView, homeView, updateView
            ],
            listeners: {
                activeitemchange: function(p,newItem,oldItem) {
                    if (newItem.id == 'HomeView') {
                        newItem.getItems().items[1].getStore().load();
                    }
                }
            }
        });

        Ext.Viewport.add(mainView);
    }
});
