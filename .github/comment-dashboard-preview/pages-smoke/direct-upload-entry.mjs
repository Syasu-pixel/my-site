// Isolated Pages Preview only, never set a production route with this entry.
import {buildPreviewFetch} from './advanced-wrapper.mjs';
import {onRequest,verifyPreviewAccess} from './staging-worker.mjs';
export default {fetch:buildPreviewFetch({verify:verifyPreviewAccess,api:onRequest})};
