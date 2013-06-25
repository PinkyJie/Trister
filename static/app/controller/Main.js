Ext.define('Trister.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            main: 'main'
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
            subActiveItem = newItem.getActiveItem();
            if (subActiveItem.id === 'HomelineList') {
                storeName = 'Homeline';
            } else if (subActiveItem.id === 'MentionList') {
                storeName = 'Mention';
            } else if (subActiveItem.id === 'DMList') {
                storeName = 'DM';
            }
            store = Ext.getStore(storeName);
            // when first loading tweets, show a mask view to aviod blank
            if (store.getData().length == 0) {
                subActiveItem.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading Tweets...'
                });
                store.load();
            }
        }
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});
