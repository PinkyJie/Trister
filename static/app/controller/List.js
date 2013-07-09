Ext.define('Trister.controller.List', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            listListView: '#ListList',
            listNaviView: '#ListNavigation'
        },
        control: {
            listListView: {
                itemtap: 'openListTweetView'
            },
            listNaviView: {
                push: 'afterPushChatView',
                pop: 'afterPopChatView'
            }
        }
    },

    openListTweetView: function(list, index, target, record) {
        var store = Ext.getStore('ListTweetList');
        store.clearData();
        this.getListNaviView().setMasked({
            xtype: 'loadmask',
            message: 'Loading tweets...'
        });
        var url = '/list/timeline/' + record.get('id_str');
        store.getProxy().setUrl(url);
        store.load();
        this.getListNaviView().push({
            xtype: 'listtweetlist',
            title: record.get('full_name')
        });
    },

    afterPushChatView: function(naviView, pushedView) {
        naviView.getParent().getTabBar().hide();
    },

    afterPopChatView: function(naviView, popedView) {
        naviView.getParent().getTabBar().show();
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});