Ext.define('Trister.controller.Home', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            homeView: '#HomePanel',
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
            name = 'Tweets';
        } else if (newItem.id === 'MentionList') {
            storeName = 'Mention';
            name = 'Mentions';
        }
        store = Ext.getStore(storeName);
        if (store.getData().length == 0) {
            newItem.setMasked({
                xtype: 'loadmask',
                message: 'Loading ' + name + '...'
            });
            store.load();
        }
    },

    toUpatePanel: function() {
        this.getHomeView().getParent().setActiveItem('#UpdatePanel', {type: 'slide', direction: 'left'});
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});
