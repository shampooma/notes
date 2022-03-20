import * as CryptoJS from "crypto-js";

export const encryptPasswordRecord = (message: string, password: string) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(message),
    password,
    {
      mode: CryptoJS.mode.CTR
    })
    .toString();

  const HMAC = CryptoJS.HmacSHA512(encryptedData, password).toString();

  return {
    encryptedData: encryptedData,
    HMAC: HMAC
  }
}

export const decryptPasswordRecord = (encryptedData: string, targetHMAC: string, password: string) => {
  const returnValue = {
    error: 1,
    data: "",
  }

  const compareHMAC = CryptoJS.HmacSHA512(encryptedData, password).toString();

  if (compareHMAC !== targetHMAC) {
    return returnValue
  } else {
    const data = CryptoJS.AES.decrypt(
      encryptedData,
      password,
      {
        mode: CryptoJS.mode.CTR
      })
      .toString(CryptoJS.enc.Utf8);

    returnValue["error"] = 0;
    returnValue["data"] = JSON.parse(data);

    return returnValue
  }
}