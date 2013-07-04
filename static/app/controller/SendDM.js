Ext.define('Trister.controller.SendDM', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            sendDMView: '#SendDMPanel'
        },
        control: {
            sendDMView: {
                show: 'test'
            }
        }
    },

    test: function() {
        Ext.Ajax.request({
            url: '/user/JJ_Jacob',
            method: 'GET',
            scope: this,
            success: function(response) {

            }
        });
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});