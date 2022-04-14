sap.ui.define([
    "bntu/ohranaTryda/controller/BaseController",
    "sap/ui/core/Fragment",
], function (Controller, Fragment) {
    "use strict";

    return Controller.extend("bntu.ohranaTryda.controller.ListReport", {
        
        onInit() {
            this.openLoginDialog();
        },

        openLoginDialog() {
            var oView = this.getView();
            if (!this.oLoginDialog) {
                this.oLoginDialog = Fragment.load({
                    id: oView.getId(),
                    name: "bntu.ohranaTryda.view.fragments.Login",
                    controller: this
                }).then(oLoginDialog => {
                    oView.addDependent(oLoginDialog);
                    return oLoginDialog;
                });
            }
            this.oLoginDialog.then(oLoginDialog => {
                oLoginDialog.open();
            });
        },

        onCancelPress() {
            if (this.oLoginDialog) {
                this.oLoginDialog.then(oLoginDialog => {
                    oLoginDialog.close().destroy();
                    this.oLoginDialog = null;
                });
            }
        },
    });
});
