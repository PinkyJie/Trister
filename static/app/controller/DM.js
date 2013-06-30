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
        this.getCurRecordIndexLabel().setHtml(index);
        this.getDmNaviView().push({
            xtype: 'dmchatlist',
            title: record.get('friend').screen_name
        });
    },

    afterPushChatView: function(naviView, pushedView) {
        naviView.getParent().getTabBar().hide();
        this.getComposeBtn().hide();
        pushedView.getScrollable().getScroller().scrollToEnd({});
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
            'time': rawData[0].created_at,
            'dms': rawData,
            'me': model.get('me')
        });
        naviView.getParent().getTabBar().show();
        this.getComposeBtn().show();
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});