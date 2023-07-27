/**
 * @NApiVersion 2.x
 * @NMOduleScope public
 */

import {EntryPoints} from  'N/types';
import * as record from  'N/record';
import {contants as cts} from '../module/jtc_setting_serial_num_CTS';
import * as log from 'N/log';

export const afterSubmit = (ctx: EntryPoints.UserEvent.afterSubmitContext) => {
    const currRecord = ctx.newRecord;

    const idPurchase = currRecord.getValue(cts.INT_COMP_SERIAL.PEDIDO_COMPRA);
    const numLote = String(currRecord.getValue(cts.INT_COMP_SERIAL.NUM_SERIAL));
    const data_validade = currRecord.getValue(cts.INT_COMP_SERIAL.DATA_VALIDADE);
    const quatidade = currRecord.getValue(cts.INT_COMP_SERIAL.QUATIDADE);
    const intItem = currRecord.getValue(cts.INT_COMP_SERIAL.ITEM);

    const numLoteArr = tranformToArrayNumserial(numLote);

    setPurchaseOrder(idPurchase, numLoteArr, intItem, data_validade);


    // setPurchaseOrder(recordPurchaseOrder);
}


const setPurchaseOrder = (idPurchaseOrder, numLoteArr: Array<[]>, intItem, dtValidade) => {

    try {
        const recordPurchaseOrder = record.load({
            type: record.Type.PURCHASE_ORDER,
            id: idPurchaseOrder, 
            isDynamic: true
        });
    
        const lineCount = recordPurchaseOrder.getLineCount({sublistId: cts.PURCHASE_ORDER.SUBLIST_ITEM.ID});
    
        for (var i=0; i < lineCount; i++) {
            recordPurchaseOrder.selectLine({
                sublistId: cts.PURCHASE_ORDER.SUBLIST_ITEM.ID,
                line: i
            });
    
            const item = recordPurchaseOrder.getCurrentSublistValue({
                sublistId: cts.PURCHASE_ORDER.SUBLIST_ITEM.ID,
                fieldId: cts.PURCHASE_ORDER.SUBLIST_ITEM.ITEM
            })
    
            const inventoryDetaiRec = recordPurchaseOrder.getCurrentSublistSubrecord({
                sublistId: cts.PURCHASE_ORDER.SUBLIST_ITEM.ID,
                fieldId: cts.PURCHASE_ORDER.SUBLIST_INVENTORY_DETAIL.ID_SUBRECORD
            });
    
    
            const lineCountInventoryDetail = inventoryDetaiRec.getLineCount({sublistId: cts.PURCHASE_ORDER.SUBLIST_INVENTORY_DETAIL.ID});
            
            if (lineCountInventoryDetail == 0 &&  item == intItem) {
                
                for (var j=0; j < numLoteArr.length; j+=2) {
                    
                    inventoryDetaiRec.selectNewLine({
                        sublistId: cts.PURCHASE_ORDER.SUBLIST_INVENTORY_DETAIL.ID,
                    });
    
                    
                    
                    
                    
                    inventoryDetaiRec.setCurrentSublistValue({
                        fieldId: cts.PURCHASE_ORDER.SUBLIST_INVENTORY_DETAIL.DATA_VALIDADE,
                        sublistId: cts.PURCHASE_ORDER.SUBLIST_INVENTORY_DETAIL.ID,
                        value: new Date(dtValidade)
                    });
                    log.debug("dtValidade", dtValidade);
    
                    inventoryDetaiRec.setCurrentSublistValue({
                        fieldId: cts.PURCHASE_ORDER.SUBLIST_INVENTORY_DETAIL.QUANTITY,
                        sublistId: cts.PURCHASE_ORDER.SUBLIST_INVENTORY_DETAIL.ID,
                        value: numLoteArr[j+1]
                    });
                    log.debug("qtde", numLoteArr[j+1])
    
                    inventoryDetaiRec.setCurrentSublistValue({
                        fieldId: cts.PURCHASE_ORDER.SUBLIST_INVENTORY_DETAIL.SET_SERIAL_NUMBER,
                        sublistId:  cts.PURCHASE_ORDER.SUBLIST_INVENTORY_DETAIL.ID,
                        value: numLoteArr[j]
                    });
                    log.debug("numSerial", numLoteArr[j]);
                    inventoryDetaiRec.commitLine({sublistId: cts.PURCHASE_ORDER.SUBLIST_INVENTORY_DETAIL.ID});
    
                }
    
            }
    
    
            recordPurchaseOrder.commitLine({sublistId: cts.PURCHASE_ORDER.SUBLIST_ITEM.ID});
            
    
        }
    
    
        const returnIdPurcharOrder = recordPurchaseOrder.save({ignoreMandatoryFields: true});
        log.debug("returnPurchaseOrder", returnIdPurcharOrder);
    } catch (e) {
        log.error("jtc_setting_serial_num_purchase_MSR.setPurchaseOrder", e);
    }

}


const tranformToArrayNumserial = (numLoteSerie: String) => {
    var ajudaSerier;
    var numLoteArr = [];

    if (numLoteSerie.indexOf(",") == -1) {
        numLoteArr = numLoteSerie.split("(");
        numLoteArr[1] = numLoteArr[1].slice(0,-1);

    } else {
        ajudaSerier = numLoteSerie.split(",");
        for (var i=0; i < ajudaSerier.length; i++) {
            
            ajudaSerier[i] = ajudaSerier[i].split("(");
            ajudaSerier[i][1] = ajudaSerier[i][1].slice(0,-1);

            for (var j =0; j < ajudaSerier[i].length; j++){
                numLoteArr.push(ajudaSerier[i][j])
            }
        }

    }

    return numLoteArr;
}