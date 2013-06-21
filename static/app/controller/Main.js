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
        console.log(newItem.getXTypes());
        if (newItem.id === 'HomePanel') {
            Ext.getStore('Homeline').load();
        }
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});
