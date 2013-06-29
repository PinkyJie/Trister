Ext.define('Trister.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            main: 'main',
            titleBar: '#HomePanel titlebar'
        },
        control: {
            main: {
                activeitemchange: 'itemChanged'
            }
        }
    },

    itemChanged: function(panel, newItem, oldItem) {
        // switch between Login/Home/Update
        // console.log(newItem.getXTypes());
        if (newItem.id === 'HomePanel') {
            // change from other view to HomePanel
            subActiveItem = newItem.getActiveItem();
            if (subActiveItem.id === 'HomelineList') {
                storeName = 'Homeline';
                loadingName = 'Tweets';
                this.getTitleBar().show();
            } else if (subActiveItem.id === 'MentionList') {
                storeName = 'Mention';
                loadingName = 'Mentions';
                this.getTitleBar().show();
            } else if (subActiveItem.id === 'DMNavigation') {
                storeName = 'DMList';
                loadingName = 'DMs';
                this.getTitleBar().hide();
            }
            // when first loading, show a mask view to aviod blank
            store = Ext.getStore(storeName);
            if (store.getData().length === 0) {
                newItem.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading ' + loadingName + '...'
                });
                store.load();
            }
        }
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});
