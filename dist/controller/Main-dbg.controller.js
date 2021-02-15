sap.ui.define(["./BaseController", "sap/m/MessageBox"], function (BaseController, MessageBox) {
  "use strict";

  return BaseController.extend("sap.Beutlhauser.HandOverProtocolEditLayout.controller.Main", {
    /**
     * Called when the worklist controller is instantiated.
     * @public
     */
    onInit: function () {
      this.getRouter()
        .getRoute("RouteMainView")
        .attachPatternMatched(function () {
          this.getView().getModel("handoverLayout").setDeferredGroups(["own-group"]);
          this.getView().setModel(
            new sap.ui.model.json.JSONModel({
              oConfig: {
                oSelectedObject: null,
                oSelectedProductLineItem: null,
                sUrlHandoverPdf: null,
              },
            })
          );
        }, this);
    },
    loadObjects: function (sProdh) {
      this.getView().setBusy(true);
      this.getView()
        .getModel("handoverLayout")
        .read("/RootItemSet", {
          urlParameters: {
            $expand: "CriteriaItemSet",
            $filter: "Prodh eq '" + sProdh + "'",
          },
          success: function (oObjects) {
            const oResult = oObjects.results.map(function (oRootTemp) {
              oRootTemp.CriteriaItemSet = oRootTemp.CriteriaItemSet.results.map(function (oCriteriaTemp) {
                oCriteriaTemp.Level = 1;
                return oCriteriaTemp;
              });
              oRootTemp.Level = 0;
              return oRootTemp;
            });
            this.getView().getModel().setProperty("/oObjects", oResult);
            this.getView().setBusy(false);
          }.bind(this),
          error: function () {
            this.getView().setBusy(false);
            this.showErrorMessage();
          }.bind(this),
        });
    },
    onClickAddRootItem: function () {
      this.getView().byId("TreeTableObjects").setBusy(true);
      var oObjects = this.getView().getModel().getProperty("/oObjects") || [];
      const sGroupLabel = "Überschrift Neu " + oObjects.length;
      const sProdh = this.getView().getModel().getProperty("/oConfig/oSelectedProductLineItem/Prodh");
      this.getView()
        .getModel("handoverLayout")
        .create(
          "/RootItemSet",
          {
            GroupLabel: sGroupLabel,
            Prodh: sProdh,
          },
          {
            success: function (oResult) {
              this.getView().byId("handoverPdfViewer").invalidate(); //refresh pdf
              oObjects = oObjects.slice(); //create new Reference
              oObjects.push({
                Guid: oResult.Guid,
                GroupLabel: sGroupLabel,
                Level: 0,
                CriteriaItemSet: [],
              });
              this.getView().getModel().setProperty("/oObjects", oObjects);
              this.getView().byId("TreeTableObjects").setBusy(false);
            }.bind(this),
            error: function () {
              this.getView().byId("TreeTableObjects").setBusy(false);
            }.bind(this),
          }
        );
    },
    onClickAddCriterium: function () {
      var oObjects = this.getView().getModel().getProperty("/oObjects");
      const oRootItem = this.getView().getModel().getProperty("/oConfig/oSelectedObject").getObject();
      const sCriteriaBezeichnung = "Kriterium Neu " + oRootItem.CriteriaItemSet.length;
      //odata create criteria
      this.getView()
        .getModel("handoverLayout")
        .create(
          "/CriteriaItemSet",
          {
            RootItemGuid: oRootItem.Guid,
            Bezeichnung: sCriteriaBezeichnung,
          },
          {
            success: function (oResult) {
              this.getView().byId("handoverPdfViewer").invalidate(); //refresh pdf
              oRootItem.CriteriaItemSet.push({
                Guid: oResult.Guid,
                RootItemGuid: oRootItem.Guid,
                Bezeichnung: sCriteriaBezeichnung,
                Level: 1,
              });
              oObjects = oObjects.slice(); //create new Reference
              this.getView().getModel().setProperty("/oObjects", oObjects);
              this.getView().byId("TreeTableObjects").setBusy(false);
            }.bind(this),
            error: function () {
              this.getView().byId("TreeTableObjects").setBusy(false);
            }.bind(this),
          }
        );
    },
    onClickDeleteLayout: function () {
      MessageBox.confirm("Layout sicher löschen?", {
        onClose: function (oActionResult) {
          if (oActionResult != "OK") {
            return;
          }

          this.getView().setBusy(true);
          const oObjects = this.getView().getModel().getProperty("/oObjects");
          oObjects.forEach(
            function (oRootTemp) {
              if (oRootTemp.Guid) {
                this.getView()
                  .getModel("handoverLayout")
                  .remove("/RootItemSet(Guid=guid'" + oRootTemp.Guid + "')", {
                    groupId: "own-group",
                  });
              }
            }.bind(this)
          );
          this.getView()
            .getModel("handoverLayout")
            .submitChanges({
              groupId: "own-group",
              success: function () {
                this.getView().byId("handoverPdfViewer").invalidate(); //refresh pdf
                this.getView().getModel().setProperty("/oObjects", []);
                this.getView().setBusy(false);
              }.bind(this),
              error: function () {
                this.getView().setBusy(false);
              }.bind(this),
            });
          this.getView().getModel().setProperty("/oConfig/oSelectedObject", null);
        }.bind(this),
      });
    },
    onRowSelectionChangeObjects: function (oEvent) {
      const oRowContext = oEvent.getParameter("rowContext");
      if (this.getView().byId("TreeTableObjects").getSelectedIndex() === -1) {
        this.getView().getModel().setProperty("/oConfig/oSelectedObject", null);
      } else {
        this.getView().getModel().setProperty("/oConfig/oSelectedObject", oRowContext);
      }
    },
    isCriteriaAddVisibleFormatter(oSelectedObject) {
      if (oSelectedObject) {
        return oSelectedObject.getProperty("Level") === 0;
      } else {
        return false;
      }
    },
    isCriteriaDeleteVisibleFormatter(oSelectedObject) {
      if (oSelectedObject) {
        return oSelectedObject.getProperty("Level") === 1;
      } else {
        return false;
      }
    },
    isLayoutDeleteCopyVisibleFormatter: function (oObjects) {
      if (oObjects && oObjects.length != 0) {
        return true;
      } else {
        return false;
      }
    },
    onValueHelpRequested: function (oEvent) {
      const oSelectProductLineDialogView = this.getOwnerComponent().runAsOwner(function () {
        return new sap.ui.view({
          viewName: "sap.Beutlhauser.HandOverProtocolEditLayout.view.SelectProductLineForMainDialog",
          type: sap.ui.core.mvc.ViewType.XML,
        });
      });
      oEvent.getSource().addDependent(oSelectProductLineDialogView); //wichtig, zur aktuell gedrückten Zeile hinzufügen
      oSelectProductLineDialogView.getController().showDialog(
        function (oSelectedProductLineItem) {
          this.getView().getModel().setProperty("/oConfig/oSelectedProductLineItem", oSelectedProductLineItem);
          //set pdf url
          const sServiceUrl = this.getView().getModel("handoverLayout").sServiceUrl;
          this.getView()
            .getModel()
            .setProperty("/oConfig/sUrlHandoverPdf", sServiceUrl + "/HandOverPdfSet('" + oSelectedProductLineItem.Prodh + "')/$value");
          this.loadObjects(oSelectedProductLineItem.Prodh);
        }.bind(this)
      );
    },
    onClickCopyLayout: function (oEvent) {
      const oCopyLayoutDialogView = this.getOwnerComponent().runAsOwner(function () {
        return new sap.ui.view({
          viewName: "sap.Beutlhauser.HandOverProtocolEditLayout.view.CopyLayoutDialog",
          type: sap.ui.core.mvc.ViewType.XML,
        });
      });
      oEvent.getSource().addDependent(oCopyLayoutDialogView); //wichtig, zur aktuell gedrückten Zeile hinzufügen
      const sCopyProdh = this.getView().getModel().getProperty("/oConfig/oSelectedProductLineItem/Prodh");
      oCopyLayoutDialogView.getController().showDialog(sCopyProdh);
    },
    onClickCopyHeadline: function (oEvent) {
      const oCopyHeadlineDialogView = this.getOwnerComponent().runAsOwner(function () {
        return new sap.ui.view({
          viewName: "sap.Beutlhauser.HandOverProtocolEditLayout.view.CopyHeadlineDialog",
          type: sap.ui.core.mvc.ViewType.XML,
        });
      });
      oEvent.getSource().addDependent(oCopyHeadlineDialogView); //wichtig, zur aktuell gedrückten Zeile hinzufügen
      const oSelectedHeadline = this.getView().getModel().getProperty("/oConfig/oSelectedObject").getObject();
      oCopyHeadlineDialogView.getController().showDialog(oSelectedHeadline);
    },
    onClickDeleteCriteria: function () {
      const oSelectedObject = this.getView().getModel().getProperty("/oConfig/oSelectedObject");
      const sPath = this.getView().getModel("handoverLayout").createKey("/CriteriaItemSet", {
        Guid: oSelectedObject.getObject().Guid,
      });
      MessageBox.confirm("Kriterium sicher löschen?", {
        onClose: function (oActionResult) {
          if (oActionResult != "OK") {
            return;
          }
          this.getView().byId("TreeTableObjects").setBusy(true);
          this.getView()
            .getModel("handoverLayout")
            .remove(sPath, {
              success: function () {
                this.getView().byId("handoverPdfViewer").invalidate(); //refresh pdf
                //delete from table
                const oObjects = this.getView().getModel().getProperty("/oObjects");
                const oObjectRoot = oObjects.find(function (oObjectRootTemp) {
                  return oObjectRootTemp.CriteriaItemSet.indexOf(oSelectedObject.getObject()) != -1;
                });
                const nIndexChild = oObjectRoot.CriteriaItemSet.indexOf(oSelectedObject.getObject());
                oObjectRoot.CriteriaItemSet.splice(nIndexChild, 1);
                this.getView().getModel().setProperty("/oObjects", oObjects);
                this.getView().getModel().setProperty("/oConfig/oSelectedObject", null);
                this.getView().byId("TreeTableObjects").setBusy(false);
              }.bind(this),
              error: function () {
                this.getView().byId("TreeTableObjects").setBusy(false);
              }.bind(this),
            });
        }.bind(this),
      });
    },
    onClickDeleteHeadline: function () {
      var oObjects = this.getView().getModel().getProperty("/oObjects");
      const oSelectedObject = this.getView().getModel().getProperty("/oConfig/oSelectedObject");
      const oObjectRoot = oSelectedObject.getObject();
      const nIndexRoot = oObjects.indexOf(oObjectRoot);

      MessageBox.confirm("Überschrift sicher löschen?", {
        onClose: function (oActionResult) {
          if (oActionResult != "OK") {
            return;
          }
          this.getView().byId("TreeTableObjects").setBusy(true);
          this.getView()
            .getModel("handoverLayout")
            .remove("/RootItemSet(Guid=guid'" + oObjectRoot.Guid + "')", {
              success: function () {
                this.getView().byId("handoverPdfViewer").invalidate(); //refresh pdf
                oObjects = oObjects.slice(); //create new Reference
                oObjects.splice(nIndexRoot, 1);
                this.getView().getModel().setProperty("/oObjects", oObjects);
                this.getView().getModel().setProperty("/oConfig/oSelectedObject", null);
                this.getView().byId("TreeTableObjects").setBusy(false);
              }.bind(this),
              error: function () {
                this.getView().byId("TreeTableObjects").setBusy(false);
              }.bind(this),
            });
        }.bind(this),
      });
    },
    onSelectCriteriaChange: function (oEvent) {
      const oCriteria = oEvent.getSource().getBindingContext().getObject();
      this.changeCriteria(oCriteria);
    },
    onChangeGroupLabelRootItem: function (oEvent) {
      this.getView().byId("TreeTableObjects").setBusy(true);
      const oRootItem = oEvent.getSource().getBindingContext().getObject();
      const sPath = this.getView().getModel("handoverLayout").createKey("/RootItemSet", {
        Guid: oRootItem.Guid,
      });
      const oUpdateRootItem = { GroupLabel: oRootItem.GroupLabel, Prodh: oRootItem.Prodh };
      this.getView()
        .getModel("handoverLayout")
        .update(sPath, oUpdateRootItem, {
          success: function () {
            this.getView().byId("handoverPdfViewer").invalidate(); //refresh pdf
            this.getView().byId("TreeTableObjects").setBusy(false);
          }.bind(this),
          error: function () {
            this.getView().byId("TreeTableObjects").setBusy(false);
          }.bind(this),
        });
    },
    onChangeBezeichnungCriteria: function (oEvent) {
      this.changeCriteria(oEvent.getSource().getBindingContext().getObject());
    },
    changeCriteria: function (oCriteria) {
      this.getView().byId("TreeTableObjects").setBusy(true);
      const sPath = this.getView().getModel("handoverLayout").createKey("/CriteriaItemSet", {
        Guid: oCriteria.Guid,
      });
      const oUpdateCriteria = { Criteria: oCriteria.Criteria, Bezeichnung: oCriteria.Bezeichnung, CountImages: oCriteria.CountImages };
      this.getView()
        .getModel("handoverLayout")
        .update(sPath, oUpdateCriteria, {
          success: function () {
            this.getView().byId("handoverPdfViewer").invalidate(); //refresh pdf
            this.getView().byId("TreeTableObjects").setBusy(false);
          }.bind(this),
          error: function () {
            this.getView().byId("TreeTableObjects").setBusy(false);
          }.bind(this),
        });
    },
  });
});
