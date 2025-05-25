// utils/vnpayQrCodeUtil.js

function formatField(id, value) {
    const len = value.length.toString().padStart(2, "0");
    return id + len + value;
}

function crc16(str) {
    let crc = 0xffff;
    for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc <<= 1;
            }
            crc &= 0xffff;
        }
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Tạo chuỗi mã QR chuẩn VNPAY.
 * @param {object} param0
 * @param {string} param0.accountNumber - Số tài khoản (VD: "0792360150")
 * @param {string} param0.bankCode - Mã ngân hàng (VD: "MB")
 * @param {number} param0.amount - Số tiền (đơn vị đồng, số nguyên)
 * @param {string} param0.merchantName - Tên merchant (VD: "PNJ SHOP")
 * @param {string} param0.city - Tên thành phố (VD: "HANOI")
 * @returns {string} Chuỗi QR code
 */
export function createVnpayQrCode({
    accountNumber,
    bankCode,
    amount,
    merchantName = "PNJ SHOP",
    city = "HANOI",
}) {
    const payloadFormatIndicator = formatField("00", "01");
    const pointOfInitiationMethod = formatField("01", "12"); // QR thanh toán 1 lần
    const merchantAccountInfo = formatField(
        "26",
        formatField("00", "04") +
        formatField("01", bankCode) +
        formatField("02", accountNumber)
    );
    const merchantCategoryCode = formatField("52", "0000");
    const transactionCurrency = formatField("53", "704"); // VND theo ISO 4217
    const transactionAmount = formatField("54", amount.toString());
    const countryCode = formatField("58", "VN");
    const merchantNameField = formatField("59", merchantName);
    const merchantCity = formatField("60", city);
    const additionalData = formatField("62", formatField("01", "MOMO")); // Giúp Momo nhận diện
    const crc = "6304";

    const rawQr =
        payloadFormatIndicator +
        pointOfInitiationMethod +
        merchantAccountInfo +
        merchantCategoryCode +
        transactionCurrency +
        transactionAmount +
        countryCode +
        merchantNameField +
        merchantCity +
        additionalData +
        crc;

    return rawQr + crc16(rawQr);
}