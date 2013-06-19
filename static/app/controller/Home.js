Ext.define('Trister.controller.Home', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            homeView: '#HomePanel',
            tweetBtn: '#HomePanel #TweetBtn'
        },
        control: {
            tweetBtn: {
                tap: 'tweet'
            }
        }
    },

    tweet: function() {
        this.getHomeView().getParent().setActiveItem('#UpdatePanel', {type: 'slide', direction: 'left'});
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});
