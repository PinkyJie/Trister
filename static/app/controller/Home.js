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
            Ext.getStore('Homeline').load();
        } else if (newItem.id === 'MentionList') {
            Ext.getStore('Mention').load();
        } else if (newItem.id === 'DMList') {
            console.log('dm load');
        }
    },

    toUpatePanel: function() {
        this.getHomeView().getParent().setActiveItem('#UpdatePanel', {type: 'slide', direction: 'left'});
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});
