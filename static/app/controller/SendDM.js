Ext.define('Trister.controller.SendDM', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            homeView: '#HomePanel',
            sendDMView: '#SendDMPanel',
            backBtn: '#SendDMPanel #BackToDMBtn',
            searchBtn: '#SendDMPanel #SearchDMUserBtn',
            userField: '#SendDMPanel #DMToWhom',
            searchResultView: '#SendDMPanel #FoundUserPanel',
            sendDMBtn: '#SendDMPanel #SendDMBtn'
        },
        control: {
            backBtn: {
                tap: 'BackToDMView'
            },
            searchBtn: {
                tap: 'doSearchUser'
            },
            sendDMBtn: {
                tap: 'doSendDM'
            }
        }
    },

    BackToDMView: function() {
        var homeView =this.getSendDMView().getParent();
        this.getHomeView().getTabBar().show();
        homeView.setActiveItem('#HomePanel');
    },

    doSearchUser: function() {
        var userName = this.getUserField().getValue();
        if (userName === '') {
            Ext.Msg.alert('Error', 'Please input a name first!');
        } else {
            if (userName[0] === '@') {
                userName = userName.substring(1);
            }
            Ext.Ajax.request({
                url: '/user/' + userName,
                method: 'GET',
                scope: this,
                success: function(response) {
                    var res = Ext.decode(response.responseText);
                    if (res.success === true) {
                        var user = res.content;
                        if (user.following === true) {
                            // this.getUserField().disable();
                            this.getSearchResultView().setData(user);
                            this.getSearchResultView().show();
                        } else {
                            Ext.Msg.alert('Error', 'You can not send DM to a person you don\'t follow');
                            this.getUserField().focus();
                        }
                    } else {
                        Ext.Msg.alert('Error', res.content);
                    }
                }
            });
        }
    },

    doSendDM: function() {

    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});