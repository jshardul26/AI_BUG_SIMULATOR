function cleanOCRText(text) {

    if (!text) return "";

    return text
        .replace(/¥/g, "")
        .replace(/[^\x00-\x7F]/g, "\n") // removes weird symbols
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

module.exports = {
    cleanOCRText
};