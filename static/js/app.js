
Ext.application({
    name: 'Trister',
    launch: function() {
    
        /* Views */
        var loginView = Ext.create('Ext.Panel', {
            id: 'LoginView',
            hidden: true,
            fullscreen: true,
            title: 'Login',
            cls: 'login',
            layout: 'vbox',
            masked: {
                xtype: 'loadmask',
                message: 'login...',
                hidden: true
            },
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
                    xtype: 'formpanel',
                    flex: 1,
                    items: [
                        {
                            xtype: 'fieldset',
                            title: 'Please Login First',
                            instructions: 'GFW-free Oauth',
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Name',
                                    name: 'name',
                                    required: true
                                },
                                {
                                    xtype: 'passwordfield',
                                    label: 'Password',
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
                    'favorited', 'retweeted', 'source_url', 'retweeted_status','user'
                ],
                pageSize: 25,
                //autoLoad: true,
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
            masked: {
                xtype: 'loadmask',
                message: 'loading tweets...',
                hidden: true
            },
            items: [
                {
                    xtype: 'list',
                    title: 'Home',
                    iconCls: 'home',
                    cls: 'home',
                    store: Ext.create('TweetStore'),
                    disableSelection: true,
                    plugins: [
                        { xclass: 'Ext.plugin.ListPaging' },
                        { xclass: 'Ext.plugin.PullRefresh' }
                    ],
                    emptyText: '<p class="no-searches">No tweets found matching that search</p>',
                    itemTpl: Ext.create('Ext.XTemplate',
                        '<img class="user-img" src="{user.profile_image_url_https}" />',
                        '<div class="tweet">',
                        '<h2>{user.screen_name}</h2>',
                        '<p>{text}</p>',
                        '</div>'
                    )
                },
                {
                    title: 'Reply',
                    iconCls: 'reply',
                    cls: 'reply',
                    html: 'Reply'
                },
                {
                    title: 'DM',
                    iconCls: 'user',
                    cls: 'dm',
                    html: 'Direct Message'
                }
            ]
            
        });
        
        var mainView = Ext.create('Ext.Panel',{
            id: 'MainView',
            layout: 'card',
            cardAnimation: 'slide',
            fullscreen: true,
            items: [
                loginView, homeView
            ],
            listeners: {
                activeitemchange: function(p,newItem,oldItem) {
                    if (newItem.id == 'HomeView') {
                        this.getItems().items[1].getItems().items[0].getStore().load();
                    }
                }
            }
        });
        
        Ext.Viewport.add(mainView);
    }
});
