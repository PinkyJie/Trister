Ext.define('Trister.view.Login', {
	extend: 'Ext.Panel',
	xtype: 'loginpanel',
	requires: [
		'Ext.form.Panel',
		'Ext.form.FieldSet',
		'Ext.form.Password'
	],

	config: {
        id: 'LoginPanel',
        fullscreen: true,
        title: 'Login',
        cls: 'login',
        layout: 'vbox',
        scrollable: true,
        // masked: {
        //     xtype: 'loadmask',
        //     message: 'Login...',
        //     hidden: true
        // },

        items: [
            {
                xtype: 'formpanel',
                flex: 1,
                url: 'login',
                items: [
                    {
                        xtype: 'panel',
                        styleHtmlContent: true,
                        html: [
                            '<img src="resources/images/logo.png" />',
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
                        ui: 'action'
                    }
                ]
            }
        ]
	}
});