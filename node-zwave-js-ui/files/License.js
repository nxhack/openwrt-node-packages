import { CRC16_CCITT, decryptAES256OFB, encodeBitMask, encryptAES256OFB, parseBitMask, } from "@zwave-js/core";
import { Bytes } from "@zwave-js/shared";
// The license mechanism of Z-Wave.me controllers is protected only by a CRC-16
// under a symmetric key that is publicly embedded in the (open source)
// SerialAPIWebTools. Reproduced here to read and modify the feature license.
export const ZWAVEME_LICENSE_KEY = Bytes.from("867802098d894d418f3fd2042eecf5c4058cb936a9cc4b87913936b743183742", "hex");
export const LICENSE_BLOCK_SIZE = 0x30; // 48 bytes
export const LICENSE_BLOB_SIZE = 32;
export var ZWaveMeLicenseSubcommand;
(function (ZWaveMeLicenseSubcommand) {
    ZWaveMeLicenseSubcommand[ZWaveMeLicenseSubcommand["Get"] = 0] = "Get";
    ZWaveMeLicenseSubcommand[ZWaveMeLicenseSubcommand["Set"] = 1] = "Set";
    ZWaveMeLicenseSubcommand[ZWaveMeLicenseSubcommand["Nonce"] = 2] = "Nonce";
})(ZWaveMeLicenseSubcommand || (ZWaveMeLicenseSubcommand = {}));
export const LICENSE_STATUS_OK = 0x00;
/** Capabilities that can be unlocked through the feature license */
export var ZWaveMeLicenseFlag;
(function (ZWaveMeLicenseFlag) {
    ZWaveMeLicenseFlag[ZWaveMeLicenseFlag["ControllerStaticAPI"] = 0] = "ControllerStaticAPI";
    ZWaveMeLicenseFlag[ZWaveMeLicenseFlag["AllowMaxRFPower"] = 1] = "AllowMaxRFPower";
    ZWaveMeLicenseFlag[ZWaveMeLicenseFlag["BackupRestore"] = 2] = "BackupRestore";
    ZWaveMeLicenseFlag[ZWaveMeLicenseFlag["BatterySaveOnSleeping"] = 3] = "BatterySaveOnSleeping";
    ZWaveMeLicenseFlag[ZWaveMeLicenseFlag["AdvancedNetworkDiagnostics"] = 4] = "AdvancedNetworkDiagnostics";
    ZWaveMeLicenseFlag[ZWaveMeLicenseFlag["LongRange"] = 5] = "LongRange";
    ZWaveMeLicenseFlag[ZWaveMeLicenseFlag["FastCommunications"] = 6] = "FastCommunications";
    ZWaveMeLicenseFlag[ZWaveMeLicenseFlag["ChangeVendorID"] = 7] = "ChangeVendorID";
    ZWaveMeLicenseFlag[ZWaveMeLicenseFlag["PromiscuousMode"] = 8] = "PromiscuousMode";
    ZWaveMeLicenseFlag[ZWaveMeLicenseFlag["RFJammingDetection"] = 10] = "RFJammingDetection";
    ZWaveMeLicenseFlag[ZWaveMeLicenseFlag["ZnifferPTIMode"] = 11] = "ZnifferPTIMode";
    ZWaveMeLicenseFlag[ZWaveMeLicenseFlag["ZnifferAdvancedRadioTool"] = 12] = "ZnifferAdvancedRadioTool";
})(ZWaveMeLicenseFlag || (ZWaveMeLicenseFlag = {}));
/** Parses a 32-byte license blob */
export function parseLicenseBlob(blob) {
    const raw = Bytes.view(blob);
    return {
        vendorId: raw.readUInt16BE(0),
        maxNodes: raw[2],
        flags: parseBitMask(raw.subarray(3, 11), 0),
        countSupport: raw.readUInt16LE(11),
        raw,
    };
}
/** Serializes a license blob, appending the trailing CRC-16 */
export function buildLicenseBlob(opts) {
    const blob = new Bytes(LICENSE_BLOB_SIZE);
    blob.writeUInt16BE(opts.vendorId, 0);
    blob[2] = opts.maxNodes;
    blob.set(encodeBitMask(opts.flags, undefined, 0), 3);
    blob.writeUInt16LE(opts.countSupport ?? 0, 11);
    // bytes 13..30 are reserved and left zero
    blob.writeUInt16LE(CRC16_CCITT(blob.subarray(0, 30)), 30);
    return blob;
}
/**
 * Builds a plaintext license command block:
 * `subCommand | data... | 0xFF padding | CRC16 (LE)`
 */
export function buildCommandBlock(subCommand, data = new Uint8Array(0)) {
    const block = new Bytes(LICENSE_BLOCK_SIZE).fill(0xff);
    block[0] = subCommand;
    block.set(data, 1);
    const crcOffset = block.length - 2;
    block.writeUInt16LE(CRC16_CCITT(block.subarray(0, crcOffset)), crcOffset);
    return block;
}
/**
 * Verifies and parses a decrypted license command block.
 * Returns the payload after the subcommand and status bytes.
 */
export function parseCommandBlock(block) {
    const view = Bytes.view(block);
    // CRC covers the whole block except the trailing 2-byte CRC itself
    const crcOffset = view.length - 2;
    const expectedCRC = view.readUInt16LE(crcOffset);
    const actualCRC = CRC16_CCITT(view.subarray(0, crcOffset));
    if (expectedCRC !== actualCRC) {
        throw new Error("Z-Wave.me license response failed CRC check");
    }
    return {
        subCommand: view[0],
        status: view[1],
        payload: view.subarray(2, crcOffset),
    };
}
/** Encrypts a 48-byte command block using AES-256-OFB */
export function encryptLicenseBlock(block, iv) {
    return encryptAES256OFB(block, ZWAVEME_LICENSE_KEY, iv);
}
/** Decrypts a 48-byte command block using AES-256-OFB */
export function decryptLicenseBlock(ciphertext, iv) {
    return decryptAES256OFB(ciphertext, ZWAVEME_LICENSE_KEY, iv);
}
//# sourceMappingURL=License.js.map
