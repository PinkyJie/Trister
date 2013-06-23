Ext.define('Trister.controller.Homeline', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            homelineView: 'homelinelist'
        },
        control: {

        }
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {
        Ext.getStore('Homeline').addListener('load', function(){
            this.getHomelineView().setMasked(false);
        }, this);
    }
});
