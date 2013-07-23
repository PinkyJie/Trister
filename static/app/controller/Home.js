Ext.define('Trister.controller.Home', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            homeView: '#HomePanel',
            updateView: '#UpdatePanel',
            mainView: '#MainPanel',
            tweetBtn: '#HomePanel #TweetBtn',
            titleBar: '#HomePanel titlebar'
        },
        control: {
            homeView: {
                initialize: 'bindTabDbTap',
                activeitemchange: 'itemChanged'
            },
            tweetBtn: {
                tap: 'toUpatePanel'
            }
        }
    },

    bindTabDbTap: function() {
        var tabs = Ext.get('HomePanel').select('.x-tab-icon').elements;
        for(var i = 0; i < tabs.length; i++)
        {
            Ext.get(tabs[i]).on({
                doubletap: this.onTabDbTap,
                scope: this
            });
        }
    },

    onTabDbTap: function(e, element) {
        var eleClass = element.className;
        var parentClass = element.parentElement.className;
        if (parentClass.indexOf('x-tab-active')) {
            var list;
            if (
                eleClass.indexOf('home') !== -1 ||
                eleClass.indexOf('action') !== -1
            ) {
                list = this.getHomeView().getActiveItem();
            } else if (
                eleClass.indexOf('mail') !== -1 ||
                eleClass.indexOf('list') !== -1
            ) {
                list = this.getHomeView().getActiveItem().getItems().items[0];
            }
            list.getScrollable().getScroller().scrollToTop({
                duration: 500
            });
        }
    },

    itemChanged: function(panel, newItem, oldItem) {
        // switch between Homeline/Mention/DM
        // console.log(newItem.getXTypes());
        if (newItem.id === 'HomelineList') {
            storeName = 'Homeline';
            loadingName = 'Tweets';
            this.getTitleBar().setTitle('Homeline');
            this.getTitleBar().show();
        } else if (newItem.id === 'MentionList') {
            storeName = 'Mention';
            loadingName = 'Mentions';
            this.getTitleBar().setTitle('Mention');
            this.getTitleBar().show();
        } else if (newItem.id === 'DMNavigation') {
            storeName = 'DMList';
            loadingName = 'DMs';
            this.getTitleBar().hide();
        } else if (newItem.id === 'ListNavigation') {
            storeName = 'ListList';
            loadingName = 'Lists';
            this.getTitleBar().hide();
        }
        store = Ext.getStore(storeName);
        if (store.getData().length === 0) {
            this.getHomeView().setMasked({
                xtype: 'loadmask',
                message: 'Loading ' + loadingName + '...'
            });
            store.load();
        }
    },

    toUpatePanel: function() {
        var updatePanel = this.getUpdateView();
        updatePanel.down('titlebar').setTitle('Update');
        updatePanel.down('textfield[name=type]').setValue('Update');
        updatePanel.down('textfield[name=tweet_id]').setValue(null);
        updatePanel.down('label').setHtml(140);
        this.getMainView().setActiveItem('#UpdatePanel');
        updatePanel.down('textareafield').focus();
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});
