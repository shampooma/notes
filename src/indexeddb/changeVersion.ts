import { DBCurrentVersion } from "indexeddb/config";
import { upgradeV1 } from "indexeddb/versions/v1/changeVersion";
import { upgradeV2 } from "indexeddb/versions/v2/changeVersion";

export const DBChangeVersion = async (e: IDBVersionChangeEvent, request: IDBOpenDBRequest) => {
  const upgradeArray = [
    upgradeV1,
    upgradeV2,
  ];

  // Upgrade
  for (let i = e.oldVersion; i < DBCurrentVersion; i++) {
    upgradeArray[i](e, request);
  }
}
