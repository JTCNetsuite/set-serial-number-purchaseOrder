/**
 * @NAPIVersion 2.x
 * @NScriptType UserEventScript
 */


import {EntryPoints} from  'N/types';
import * as msr from '../models/jtc_setting_serial_num_purchase_MSR';
import * as log from  'N/log';

export const afterSubmit: EntryPoints.UserEvent.afterSubmit = (ctx: EntryPoints.UserEvent.afterSubmitContext) => {
    try {
        msr.afterSubmit(ctx);
    } catch(e) {
        log.error("afterSubmit", e);
    }
}
