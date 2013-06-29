Ext.define('Trister.controller.DM', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            dmListView: '#DMList',
            dmNaviView: '#DMNavigation',
            composeBtn: '#ComposeDM'
        },
        control: {
            dmListView: {
                disclose: 'openDMChatView'
            },
            dmNaviView: {
                push: 'afterPushChatView',
                pop: 'afterPopChatView'
            }
        }
    },

    openDMChatView: function(list, record, target, index) {
        // add a type attribute to erery dm record
        var newRecord = record.get('dms');
        var me = record.get('me');
        Ext.Array.forEach(newRecord, function(r, index){
            if (r.sender.screen_name === me) {
                r.type = 'local';
            } else {
                r.type = 'remote';
            }
        });
        Ext.getStore('DMChatList').applyData(newRecord.reverse());
        this.getDmNaviView().push({
            xtype: 'dmchatlist',
            title: record.get('friend').screen_name
        });
    },

    afterPushChatView: function(naviView, pushedView) {
        naviView.getParent().getTabBar().hide();
        this.getComposeBtn().hide();
    },

    afterPopChatView: function(naviView, popedView) {
        naviView.getParent().getTabBar().show();
        this.getComposeBtn().show();
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});