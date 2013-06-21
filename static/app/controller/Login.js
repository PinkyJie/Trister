Ext.define('Trister.controller.Login', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            loginView: '#LoginPanel',
            loginBtn: '#LoginPanel button'
        },
        control: {
            loginView: {
                initialize: 'checkLogin'
            },
            loginBtn: {
                tap: 'doLogin'
            }
        }
    },

    checkLogin: function() {
        console.log('Login Page show');
        Ext.Ajax.request({
            url: '/is_login',
            method: 'GET',
            scope: this,
            success: function(response) {
                var res = Ext.decode(response.responseText);
                if (res.content == 1) {
                    this.getLoginView().getParent().setActiveItem('#HomePanel');
                }
            }
        });
    },

    doLogin: function() {
        var form = this.getLoginBtn().up('formpanel');
        var form_data = form.getValues();
        if (form_data['name'] === '' || form_data['password'] === '') {
            Ext.Msg.alert('Error','Twitter name or password can not be blank!');
        } else {
            this.getLoginView().setMasked({
                xtype: 'loadmask',
                message: 'Login...\nPlease wait...'
            });
            form.submit({
                success: function(form, result) {
                    this.getParent().setMasked(false);
                    this.getParent().getParent().setActiveItem('#HomePanel', {type: 'slide', direction: 'left'});
                },
                failure: function(form, result) {
                    Ext.Msg.alert('Error', result.content);
                }
            });
        }
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});
