const analyzeBug = (req, res) => {

    console.log("Analyze Bug API called");

    const { code, errorLog, language } = req.body;

    res.json({
        success: true,
        message: "Bug received successfully",
        receivedData: {
            code,
            errorLog,
            language
        }
    });

};

module.exports = {
    analyzeBug
};