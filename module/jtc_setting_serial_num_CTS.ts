/**
 * @NApiVersion 2.x
 * @NMOduleScope public
 */


export const contants = {
    INT_COMP_SERIAL: {
        PEDIDO_COMPRA: 'custrecord_jtc_integ_purchaseorder_id',
        ITEM: 'custrecord_jtc_purchord_item_id',
        QUATIDADE: 'custrecord_jtc_purchorder_item_quantity',
        NUM_SERIAL: "custrecord_jtc_purchase_serial_number",
        DATA_VALIDADE: 'custrecord_jtc_purchase_expirationdate'
    },

    PURCHASE_ORDER: {
        SUBLIST_ITEM: {
            ID: 'item',
            ITEM: 'item'
        },

        SUBLIST_INVENTORY_DETAIL: {
            ID: 'inventoryassignment',
            DATA_VALIDADE: 'expirationdate',
            NUM_SERIAL: 'issueinventorynumber',
            QUANTITY: 'quantity',
            ID_SUBRECORD: 'inventorydetail',
            SET_SERIAL_NUMBER: 'receiptinventorynumber'
        }
    }
}