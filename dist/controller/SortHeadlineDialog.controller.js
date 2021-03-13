sap.ui.define(["./BaseController"],function(e){"use strict";return e.extend("sap.Beutlhauser.HandOverProtocolEditLayout.controller.SortHeadlineDialog",{onInit:function(){},showDialog:function(e){this.oDialog=this.getView().getContent()[0];this.oCallbackChange=e;this.oDialog.open()},onCloseDialog:function(){this.oDialog.close()},onDown:function(){const e=this.byId("tableSortHeadline");const t=e.indexOfItem(e.getSelectedItem());e.removeSelections();const o=e.getItems();const n=o[t];e.removeItem(t);if(t===o.length-1){e.insertItem(n,0)}else{e.insertItem(n,t+1)}n.setSelected(true)},onUp:function(){const e=this.byId("tableSortHeadline");const t=e.indexOfItem(e.getSelectedItem());e.removeSelections();const o=e.getItems();const n=o[t];e.removeItem(t);if(t===0){e.insertItem(n,o.length-1)}else{e.insertItem(n,t-1)}n.setSelected(true)},onSaveOrder:function(){this.oDialog.setBusy(true);const e=this.getView().byId("tableSortHeadline").getItems();const t=[];e.forEach(function(e,o){const n=e.getBindingContext().getObject();t.push(n);const s=this.getModel("handoverLayout").createKey("/RootItemSet",{Guid:n.Guid});const i={SortPosition:o};this.getModel("handoverLayout").update(s,i,{groupId:"sort"})}.bind(this));this.getModel("handoverLayout").setDeferredGroups(["sort"]);this.getModel("handoverLayout").submitChanges({groupId:"sort",success:function(){this.oDialog.setBusy(false);this.oDialog.close();if(this.oCallbackChange){this.oCallbackChange(t)}}.bind(this),error:function(){this.oDialog.setBusy(false)}.bind(this)})}})});