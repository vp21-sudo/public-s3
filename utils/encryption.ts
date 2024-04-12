import crypto from "node:crypto";
const enctryptData = (data:string) => {
  try {
    // Convert hexadecimal key to Buffer
    const keyBuffer = Buffer.from(process.env.ENCRYPTION_KEY || '', "hex");

    // Generate an Initialization Vector (IV)
    const iv = crypto.randomBytes(16);

    // Create a cipher object
    const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv);

    // Update the cipher with the data and finalize it
    let encryptedData = cipher.update(data, "utf-8", "hex");
    encryptedData += cipher.final("hex");

    // Concatenate IV and encrypted data
    const encryptedPayload = iv.toString("hex") + encryptedData;
    return encryptedPayload;
  } catch (err) {
    throw err;
  }
};

const decryptData = (encryptedPayload: string) => {
  try {

    // Extract IV and encrypted data
    const iv = Buffer.from(encryptedPayload.substring(0, 32), "hex");
    const encryptedData = encryptedPayload.substring(32);

    // Convert hexadecimal key to Buffer
    const keyBuffer = Buffer.from(process.env.ENCRYPTION_KEY || '', "hex");

    // Create a decipher object
    const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);

    // Update the decipher with the encrypted data and finalize it
    let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
    decryptedData += decipher.final("utf-8");
    return decryptedData
  } catch (err) {
    throw err;
  }
};

export {
  enctryptData,
  decryptData
}
