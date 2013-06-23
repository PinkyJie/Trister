Ext.define('Trister.controller.Homeline', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            homelineView: 'homelinelist'
        },
        control: {
            homelineView: {
                itemswipe: 'showContextMenu',
                itemdoubletap: 'addOrRemoveFav'
            }
        }
    },

    showContextMenu: function(list, index, item, record) {

    },

    addOrRemoveFav: function(list, index, item, record) {
        var favorited = record.get('favorited');
        var action;
        if (favorited === false) {
            action = 'add';
        } else {
            action = 'del'
        }
        Ext.Ajax.request({
            url: '/favorite/' + action,
            method: 'POST',
            params: {
                tweet_id: record.get('id_str')
            },
            scope: this,
            success: function(response) {
                record.set('favorited', !favorited);
            },
            failure: function(response) {
                var result = Ext.decode(response.responseText);
                Ext.Msg.alert('Error', result.content);
            }
        });
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {
        Ext.getStore('Homeline').addListener('load', function(){
            this.getHomelineView().setMasked(false);
        }, this);
    }
});
