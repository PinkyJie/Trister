Ext.define('Trister.controller.DM', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            dmListView: '#DMList',
            dmNaviView: '#DMNavigation',
            composeBtn: '#ComposeDM',
            curRecordIndexLabel: '#DMNavigation #CurOpennedChatIdx'
        },
        control: {
            dmListView: {
                disclose: 'openDMChatView'
            },
            dmNaviView: {
                push: 'afterPushChatView',
                pop: 'afterPopChatView'
            },
            composeBtn: {
                tap: 'toSendDMPanel'
            }
        }
    },

    openDMChatView: function(list, record, target, index) {
        // add a type attribute to erery dm record
        var newRecord = record.get('dms');
        var config = Ext.getStore('Config').getAt(0);
        var me = config.get('user').name;
        Ext.Array.forEach(newRecord, function(r, index){
            if (r.sender.screen_name === me) {
                r.type = 'local';
            } else {
                r.type = 'remote';
            }
        });
        Ext.getStore('DMChatList').applyData(newRecord);
        this.getCurRecordIndexLabel().setHtml(index);
        this.getDmNaviView().push({
            xtype: 'dmchatlist',
            title: record.get('friend').screen_name
        });
    },

    afterPushChatView: function(naviView, pushedView) {
        naviView.getParent().getTabBar().hide();
        this.getComposeBtn().hide();
        setTimeout(function(){
            pushedView.getScrollable().getScroller().scrollToEnd({});
        }, 200);
    },

    afterPopChatView: function(naviView, popedView) {
        var data = popedView.getStore().getData().all;
        var rawData = [];
        Ext.Array.forEach(data, function(d, index){
            rawData.push(d.data);
        });
        rawData.reverse();
        var idx = parseInt(this.getCurRecordIndexLabel().getHtml(), 10);
        var store = this.getDmListView().getStore();
        var model = store.getAt(idx);
        store.removeAt(idx);
        store.insert(idx, {
            'dms': rawData
        });
        naviView.getParent().getTabBar().show();
        this.getComposeBtn().show();
    },

    toSendDMPanel: function() {
        var homeView = this.getDmNaviView().getParent();
        homeView.getTabBar().hide();
        homeView.getParent().setActiveItem('#SendDMPanel');
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});