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
        // Ext.Ajax.request({
        //     url: '/is_login',
        //     method: 'GET',
        //     scope: this,
        //     success: function(response) {
        //         var res = Ext.decode(response.responseText);
        //         if (res.is_login == 1) {
        //             this.getParent().setActiveItem(1);
        //         }
        //     }
        // });
    },

    doLogin: function() {
        // var form = this.getBtn().up('formpanel');
        // var form_data = form.getValues();
        // if (form_data['name'] === '' || form_data['password'] === '') {
        //     Ext.Msg.alert('Error','Twitter name or password can not be blank!');
        // } else {
        //     //this.getParent().getParent().getMasked().show();
        //     form.submit({
        //         success: function(form,result) {
        //             //form.getParent().getMasked().hide();
        //             if (result.status === "success") {
        //                 mainView.setActiveItem('HomeView', { type: 'slide', direction: 'left' });
        //             } else if (result.status === "error") {
        //                 Ext.Msg.alert('Error', result.content);
        //             }
        //         }
        //     });
        // }

        // static test
        this.getLoginView().getParent().setActiveItem('#HomePanel', {type: 'slide', direction: 'left'});
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});
