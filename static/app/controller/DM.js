Ext.define('Trister.controller.DM', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            dmListView: '#DMList',
            dmNaviView: {
                selector: '#DMNavigation',
                xtype: 'navigationview',
                autoCreate: true
            }
        },
        control: {
            dmListView: {
                disclose: 'openDMChatView'
            }
        }
    },

    openDMChatView: function(list, record, target, index) {
        // add a type attribute to erery dm record
        var newRecord = record.get('dms');
        var me = record.get('me');
        Ext.Array.forEach(newRecord, function(r, index){
            if (r.sender.screen_name === me) {
                r.type = 'local';
            } else {
                r.type = 'remote';
            }
        });
        this.getDmNaviView().push({
            xtype: 'dmchatlist',
            title: record.get('friend'),
            data: newRecord
        });
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});