const encryptObj = { "id": "7f85f6db-7894-418d-996c-f3f4ac61bf8e", "sellerScore": 80, "salesCount": 5 };
// we have to know all of these properties before calling the encryption method
const salt = "SALT";
const password = "PASSWORD";
const keyLength = 48;


async function getDerivation(salt, password, keyLength) {
    const textEncoder = new TextEncoder("utf-8");
    const passwordBuffer = textEncoder.encode(password);
    const importedKey = await crypto.subtle.importKey("raw", passwordBuffer, "PBKDF2", false, ["deriveBits"]);

    const saltBuffer = textEncoder.encode(salt);
    const derivation = await crypto.subtle.deriveBits(
        {name: "PBKDF2", hash: "SHA-256", salt: saltBuffer, iterations: 1000},
        importedKey,
        keyLength*8);
    return derivation;
}

async function getKey(derivation) {
    const keylen = 32;
    const derivedKey = derivation.slice(0, keylen);
    const iv = derivation.slice(keylen);
    const importedEncryptionKey = await crypto.subtle.importKey('raw', derivedKey, { name: 'AES-CBC' }, false, ['encrypt', 'decrypt']);
    return {
        key: importedEncryptionKey,
        iv: iv
    }
}

async function encrypt(text, keyObject) {
    const textEncoder = new TextEncoder("utf-8");
    const textBuffer = textEncoder.encode(text);
    const encryptedText = await crypto.subtle.encrypt({ name: 'AES-CBC', iv: keyObject.iv }, keyObject.key, textBuffer);
    return encryptedText;
}

(async function () {
    const derivation = await getDerivation(salt, password, keyLength);
    const keyObject = await getKey(derivation);
// calling encrypt
    const encryptedObject = await encrypt(JSON.stringify(encryptObj), keyObject);
})

