Ext.define('Trister.controller.Home', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            homeView: '#HomePanel',
            updateView: '#UpdatePanel',
            mainView: '#MainPanel',
            tweetBtn: '#HomePanel #TweetBtn'
        },
        control: {
            homeView: {
                activeitemchange: 'itemChanged'
            },
            tweetBtn: {
                tap: 'toUpatePanel'
            }
        }
    },

    itemChanged: function(panel, newItem, oldItem) {
        // switch between Homeline/Mention/DM
        console.log(newItem.getXTypes());
        if (newItem.id === 'HomelineList') {
            storeName = 'Homeline';
            loadingName = 'Tweets';
        } else if (newItem.id === 'MentionList') {
            storeName = 'Mention';
            loadingName = 'Mentions';
        }
        store = Ext.getStore(storeName);
        if (store.getData().length === 0) {
            newItem.setMasked({
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
        this.getMainView().setActiveItem('#UpdatePanel');
        updatePanel.down('textareafield').focus();
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});
