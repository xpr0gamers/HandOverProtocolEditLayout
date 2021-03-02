sap.ui.define(
    ["./BaseController"],
    function (BaseController) {
        "use strict";

        return BaseController.extend("sap.Beutlhauser.HandOverProtocolEditLayout.controller.CalcBuilderImageDialog", {
            /**
             * Called when the worklist controller is instantiated.
             * @public
             */
            onInit: function () {

            },
            showDialog: function (oCriteria, oCallbackChange) {
                this.oDialog = this.getView().getContent()[0];
                this.oCriteria = oCriteria;
                this.oCallbackChange = oCallbackChange;
                const oCriteriaSet = this.getModel().getProperty("/oCriteriaSet");
                const oFixedValuesCriteria = this.getFixedValuesToCriteria(oCriteria.Criteria, oCriteriaSet);
                this.setModel(
                    new sap.ui.model.json.JSONModel({
                        oFixedValues: oFixedValuesCriteria,
                        sExpression: oCriteria.ExpressionImagesAvailable
                    })
                );
                this.oDialog.open();
            },
            getFixedValuesToCriteria: function (sKeyCriteria, oCriteriaSet){
                const oCriteria = oCriteriaSet.find(function (oCriteriaTemp){
                    return oCriteriaTemp.Key === sKeyCriteria;
                });
                const oKeys = oCriteria.Key.split(";");
                const oValues = oCriteria.Description.split(",");
                const oResult = [];
                oKeys.forEach(function (sKeyTemp, nIndex){
                   oResult.push({sKey: sKeyTemp, sValue: oValues[nIndex]});
                });
                return oResult;
            },
            onCloseDialog: function () {
                this.oDialog.close();
            },
            onCriteriaSelect: function (oEvent) {
                const sKey = oEvent.getParameter("item").getBindingContext().getProperty("sKey");
                this.getView().byId("builderImage").updateOrCreateItem('"' + sKey + '"');
            },
            onSave: function (){
                const sExpression = this.getView().byId("builderImage").getExpression();
                this.oDialog.setBusy(true);
                const sPath = this.getModel("handoverLayout").createKey("/CriteriaItemSet", {
                    Guid: this.oCriteria.Guid,
                });
                const oUpdateCriteria = {
                    ExpressionImagesAvailable: sExpression
                };
                this.getModel("handoverLayout").update(sPath, oUpdateCriteria, {
                    success: function () {
                        this.oDialog.setBusy(false);
                        this.oDialog.close();
                        if(this.oCallbackChange){
                            this.oCallbackChange(sExpression);
                        }
                    }.bind(this),
                    error: function () {
                        this.oDialog.setBusy(false);
                    }.bind(this),
                });
            }
        });
    }
);
