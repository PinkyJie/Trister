Ext.define('Trister.controller.Login', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {

        },
        control: {
            'loginpanel': {
                painted: 'checkLogin'
            }
        }
    },

    checkLogin: function() {
        Ext.Ajax.request({
            url: '/is_login',
            method: 'GET',
            scope: this,
            success: function(response) {
                var res = Ext.decode(response.responseText);
                if (res.is_login == 1) {
                    this.getParent().setActiveItem(1);
                }
            }
        });
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});
