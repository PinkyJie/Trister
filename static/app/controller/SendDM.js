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
            sendDMBtn: '#SendDMPanel #SendDMBtn',
            dmContentArea: '#SendDMPanel #DMContentArea',
            formView: '#SendDMPanel formpanel',
            isValidField: '#SendDMPanel #isUserValid'
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
        // clean view
        cleanView(this);

        var homeView =this.getSendDMView().getParent();
        this.getHomeView().getTabBar().show();
        homeView.setActiveItem('#HomePanel');
    },

    doSearchUser: function() {
        var userName = this.getUserField().getValue();
        if (userName === '') {
            Ext.Msg.alert('Error', 'Please input a name first!');
        } else {
            var searchResultView = this.getSearchResultView();
            searchResultView.hide();
            this.getSendDMView().setMasked({
                xtype: 'loadmask',
                message: 'Searching...'
            });
            if (userName[0] === '@') {
                userName = userName.substring(1);
            }
            Ext.Ajax.request({
                url: '/user/' + userName,
                method: 'GET',
                scope: this,
                success: function(response) {
                    var res = Ext.decode(response.responseText);
                    this.getSendDMView().setMasked(false);
                    if (res.success === true) {
                        var user = res.content;
                        if (user.following === true) {
                            searchResultView.setData(user);
                            searchResultView.show();
                            this.getIsValidField().setValue('true');
                        } else {
                            searchResultView.hide();
                            this.getIsValidField().setValue('false');
                            Ext.Msg.alert('Error', 'You can not send DM to @' +
                                userName + ' because you don\'t follow him!');
                            this.getUserField().focus();
                        }
                    } else {
                        searchResultView.hide();
                        this.getIsValidField().setValue('false');
                        Ext.Msg.alert('Error', res.content);
                    }
                }
            });
        }
    },

    doSendDM: function() {
        var dmForm = this.getFormView();
        var formData = dmForm.getValues();
        if (formData['screen_name'] === '' || formData['text'] === '') {
            Ext.Msg.alert('Error','Name or Content can not be blank!');
        } else if (formData['valid'] === 'false') {
            Ext.Msg.alert('Error', 'Click search button to check whether the name is valid!');
        } else {
            this.getSendDMView().setMasked({
                xtype: 'loadmask',
                message: 'Sending...Please wait...'
            });
            dmForm.submit({
                url: '/dm/create',
                method: 'POST',
                scope: this,
                success: function(form, result) {
                    this.getSendDMView().setMasked(false);
                    cleanView(this);
                    var homeView =this.getSendDMView().getParent();
                    this.getHomeView().getTabBar().show();
                    homeView.setActiveItem('#HomePanel');
                },
                failure: function(form, result) {
                    this.getSendDMView().setMasked(false);
                    Ext.Msg.alert('Error', result.content);
                }
            });
        }
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    }
});

function cleanView(controller) {
    controller.getSearchResultView().setData(null);
    controller.getSearchResultView().setMasked(false);
    controller.getSearchResultView().hide();
    controller.getUserField().setValue('');
    controller.getDmContentArea().setValue('');
    controller.getIsValidField().setValue('false');
}