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
                url: '/login',
                method: 'POST',
                success: function(form, result) {
                    // update user info in localstorage
                    var config = Ext.getStore('Config').getAt(0);
                    config.set('user', result.content);
                    form.getParent().setMasked(false);
                    // form.getParent().getParent().setActiveItem('#HomePanel', {type: 'slide', direction: 'left'});
                    Ext.Viewport.setActiveItem('#MainPanel');
                },
                failure: function(form, result) {
                    form.getParent().setMasked(false);
                    Ext.Msg.alert('Error', result.content);
                }
            });
        }
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});
