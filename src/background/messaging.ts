// follow from ./messages/*.ts
import { type RequestBody as NotifyRequestBody } from "./messages/notify";
import { type RequestBody as OpenTabRequestBody } from "./messages/open-tab";
import { type RequestBody as RequestRequestBody } from "./messages/request";
import { type RequestBody as StreamRequestBody } from "./messages/get-stream-urls";
import { type RequestBody as UpdateRequestBody } from "./messages/check-update";

export interface MessagingData {
    'notify': NotifyRequestBody
    'open-tab': OpenTabRequestBody
    'request': RequestRequestBody
    'get-stream-urls': StreamRequestBody
    'check-update': UpdateRequestBody
}