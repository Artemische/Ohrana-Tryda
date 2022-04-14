sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
    "use strict";

    return Opa5.extend("bntu.ohranaTryda.test.integration.arrangements.Startup", {
        iStartMyApp: function () {
            this.iStartMyUIComponent({
                componentConfig: {
                    name: "bntu.ohranaTryda",
                    async: true,
                    manifest: true
                }
            });
        }
    });
});
