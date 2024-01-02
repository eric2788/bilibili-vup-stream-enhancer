// follow from ./messages/*.ts
import * as notify from "./messages/notify";
import * as openTab from "./messages/open-tab";
import * as request from "./messages/request";
import * as getStreamUrls from "./messages/get-stream-urls";
import * as checkUpdate from "./messages/check-update";

export interface MessagingData {
    'notify': notify.RequestBody
    'open-tab': openTab.RequestBody
    'request': request.RequestBody
    'get-stream-urls': getStreamUrls.RequestBody
    'check-update': checkUpdate.RequestBody
}