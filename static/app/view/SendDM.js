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
                id: 'FoundUserPanel',
                hidden: true,
                xtype: 'panel',
                styleHtmlContent: true,
                tpl: [
                    '<img class="dm-found-user-img" src="{profile_image_url_https}" />',
                    '<div class="dm-found-user-name">{screen_name}</div>',
                    '<div class="dm-found-user-desc">{description}</div>'
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
                                        name: 'screen_name',
                                        label: 'Name',
                                        labelWidth: '38%',
                                        required: true,
                                        flex: 5
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
                                id: 'DMContentArea',
                                xtype: 'textareafield',
                                name: 'text',
                                label: 'Content',
                                // hidden: true,
                                required: true

                            },
                            {
                                id: 'isUserValid',
                                xtype: 'textfield',
                                name: 'valid',
                                value: 'false',
                                hidden: true,
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