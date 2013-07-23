/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides

//<debug>
Ext.Loader.setPath({
    'Ext': 'touch/src'
});
//</debug>

Ext.application({
    name: 'Trister',

    requires: [
        'Ext.MessageBox'
    ],

    views: [
        'Main',
        'Login'
    ],

    controllers: [
        'Main',
        'Login',
        'Home',
        'UpdateStatus',
        'Homeline',
        'Mention',
        'DM',
        'DMChatList',
        'SendDM',
        'List',
        'ListTweetList'
    ],

    models: [
        'Tweet',
        'DirectMessage',
        'DMAbstract',
        'Config',
        'ListAbstract'
    ],

    stores: [
        'Homeline',
        'Mention',
        'DMList',
        'DMChatList',
        'Threads',
        'Config',
        'ListList',
        'ListTweetList'
    ],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {
        Ext.event.publisher.TouchGesture.prototype.isNotPreventable = /(?:)/;
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        // Initialize the main view
        Ext.Viewport.add(Ext.create('Trister.view.Login'));
        Ext.Viewport.add(Ext.create('Trister.view.Main'));
        Ext.Viewport.hide();
        var config = Ext.getStore('Config').getAt(0);
        if (config.get('user') === null) {
            Ext.Ajax.request({
                url: '/is_login',
                method: 'GET',
                success: function(response) {
                    var res = Ext.decode(response.responseText);
                    if (res.content == 1) {
                        config.set('user', res.user);
                        Ext.Viewport.setActiveItem('#MainPanel');
                    } else {
                        Ext.Viewport.setActiveItem('#LoginPanel');
                    }
                    Ext.Viewport.show();
                }
            });
        } else {
            Ext.Viewport.setActiveItem('#MainPanel');
            Ext.Viewport.show();
        }
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Trister Update",
            "Trister has a new version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
