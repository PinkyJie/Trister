
Ext.application({
    name: 'Trister',
    launch: function() {
        var loginView = Ext.create('Ext.Panel', {
            id: 'LoginView',
            hidden: true,
            fullscreen: true,
            title: 'Login',
            cls: 'login',
            layout: 'vbox',
            masked: {
                xtype: 'loadmask',
                message: 'loading...',
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
            ] 
        });
        
        var homeView = Ext.create('Ext.TabPanel',{
            id: 'HomeView',
            fullscreen: true,
            tabBarPosition: 'bottom',
            items: [
                {
                    title: 'Home',
                    iconCls: 'home',
                    html: 'Timeline'
                },
                {
                    title: 'Reply',
                    iconCls: 'reply',
                    html: 'Reply'
                },
                {
                    title: 'DM',
                    iconCls: 'user',
                    html: 'Direct Message'
                },
            ],
            listeners: {
                initialize: function(){
                    Ext.Ajax.request({
                        url: '/home',
                        method: 'GET',
                        scope: this,
                        success: function(response) {
                            this.getParent().getMasked().hide();
                        }
                    });
                }
            }
        });
        
        var mainView = Ext.create('Ext.Panel',{
            xtype: 'panel',
            layout: 'card',
            cardAnimation: 'slide',
            fullscreen: true,
            masked: {
                xtype: 'loadmask',
                message: 'Login...',
                hidden: true
            },
            items: [
                loginView, homeView
            ],
            listeners: {
                initialize: function() {
                    Ext.Ajax.request({
                        url: '/is_login',
                        method: 'GET',
                        scope: this,
                        success: function(response) {
                            var res = Ext.decode(response.responseText);
                            if (res.is_login == 1) {
                                this.setActiveItem(1);
                            }
                        }
                    });
                }
            }
        });
        
        Ext.Viewport.add(mainView);
    }
});
