Ext.define('Trister.controller.Login', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            loginView: '#LoginPanel',
            loginBtn: '#LoginPanel button'
        },
        control: {
            loginBtn: {
                tap: 'doLogin'
            }
        }
    },

    doLogin: function() {
        var form = this.getLoginBtn().up('formpanel');
        var form_data = form.getValues();
        if (form_data['name'] === '' || form_data['password'] === '') {
            Ext.Msg.alert('Error','Twitter name or password can not be blank!');
        } else {
            this.getLoginView().setMasked({
                xtype: 'loadmask',
                message: 'Login...Please wait...'
            });
            form.submit({
                url: 'login',
                method: 'POST',
                success: function(form, result) {
                    this.getParent().setMasked(false);
                    this.getParent().getParent().setActiveItem('#HomePanel', {type: 'slide', direction: 'left'});
                },
                failure: function(form, result) {
                    this.getParent().setMasked(false);
                    Ext.Msg.alert('Error', result.content);
                }
            });
        }
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});
