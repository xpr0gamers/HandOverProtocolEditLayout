sap.ui.define(
  ["./BaseController", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/MessageBox"],
  function (BaseController, Filter, FilterOperator, MessageBox) {
    "use strict";

    return BaseController.extend("sap.Beutlhauser.HandOverProtocolEditLayout.controller.CopyLayoutDialog", {
      /**
       * Called when the worklist controller is instantiated.
       * @public
       */
      onInit: function () {},
      showDialog: function (sProdhCopy) {
        this.oDialog = this.getView().getContent()[0];
        this.sProdhCopy = sProdhCopy;
        this.oDialog.open();
      },
      onSearchProductLines: function (oEvent) {
        const oFilters = [];
        const sValue = oEvent.getParameter("value");
        if (sValue && sValue.length >= 1) {
          oFilters.push(new Filter("Description", FilterOperator.Contains, sValue.toLowerCase()));
          //oFilters.push(new Filter("toLower(Description)", FilterOperator.Contains, sValue.toLowerCase()));
        }
        const oBinding = oEvent.getParameter("itemsBinding");
        oBinding.filter(oFilters);
      },
      copyLayout: function (oSelectedItems) {
        this.getView().setBusy(true);
        const sProdhTarges = oSelectedItems
          .map(function (oItemTemp) {
            return oItemTemp.Prodh;
          })
          .join(",");
        this.getView()
          .getModel("handoverLayout")
          .callFunction("/CopyLayout", {
            method: "GET",
            urlParameters: {
              Prodh: this.sProdhCopy,
              ProdhTargets: sProdhTarges,
            },
            success: function () {
              this.getView().setBusy(false);
            }.bind(this),
            error: function(){
              this.getView().setBusy(false);
            }.bind(this)
          });
      },
      onSelectToCopyLayouts: function (oEvent) {
        const oSelectedItems = oEvent.getParameter("selectedItems").map(function (oItemTemp) {
          return oItemTemp.getBindingContext("handoverLayout").getObject();
        });
        if (oSelectedItems.length == 0) {
          return;
        }

        const sOverrideLayout = oSelectedItems
          .filter(function (oItemTemp) {
            return oItemTemp.LayoutExists == true;
          })
          .map(function (oItemTemp) {
            return oItemTemp.Description;
          })
          .join(", ");
        //wenn layout überschrieben werden sollen, eine Warnmeldung ausgeben
        if (sOverrideLayout.length != 0) {
          MessageBox.confirm("Achtung, die Layouts für " + sOverrideLayout + " werden überschrieben", {
            onClose: function (oActionResult) {
              if (oActionResult != "OK") {
                return;
              }
              this.copyLayout(oSelectedItems);
            }.bind(this),
          });
        } else {
          this.copyLayout(oSelectedItems);
        }
      },
    });
  }
);
