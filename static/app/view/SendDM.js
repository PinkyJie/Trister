Ext.define('Trister.view.SendDM', {
    extend: 'Ext.Panel',
    xtype: 'senddmpanel',

    requires: [
        'Ext.field.Search'
    ],

    config: {
        id: 'SendDMPanel',
        fullscreen: true,
        cls: 'send-dm-panel',
        layout: 'vbox',
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                title: 'Send DM',
                items: [
                    {
                        id: 'BackToDMBtn',
                        text: 'Cancel',
                        ui: 'back',
                        align: 'left'
                    }
                ]
            },
            {
                xtype: 'formpanel',
                title: 'Input your friend\'s name:',
                flex: 1,
                items: [
                    {
                        xtype: 'fieldset',
                        items: [
                            {
                                xtype: 'panel',
                                layout: 'hbox',
                                items: [
                                    {
                                        id: 'DMToWhom',
                                        xtype: 'textfield',
                                        width: '40%',
                                        name: 'user',
                                        label: 'Name',
                                        required: true,
                                        flex: 4
                                    },
                                    {
                                        id: 'SearchDMUserBtn',
                                        xtype: 'button',
                                        iconCls: 'search',
                                        flex: 1
                                    }
                                ]
                            },
                            {
                                id: 'FoundUserPanel',
                                // hidden: true,
                                xtype: 'panel',
                                styleHtmlContent: true,
                                tpl: [
                                    '<img class="dm-found-user-img" src="{profile_image_url_https}" />',
                                    '<div class="dm-found-user-name">{screen_name}</div>',
                                    '<div class="dm-found-user-desc">{description}</div>'
                                ]
                            },
                            {
                                id: 'DMContent',
                                xtype: 'textareafield',
                                name: 'dm',
                                label: 'Content',
                                // hidden: true,
                                required: true

                            }
                        ]
                    },
                    {
                        id: 'SendDMBtn',
                        xtype: 'button',
                        text: 'Send',
                        ui: 'action',
                        // hidden: true,
                        margin: 'auto',
                        width: '30%'
                    }
                ]
            }
        ]
    }
});