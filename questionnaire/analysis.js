const yaml = require('js-yaml');
const fs   = require('fs');
const util = require('util');
const p_readFile = util.promisify(fs.readFile);

class AnalysisModel {
    static async AnalysisQuestionnaire(filePath) {
        try {
            let data = await p_readFile(filePath, 'utf8');
            let doc = yaml.safeLoad(data);
            let newFile = '.' + filePath.split('.')[1] + '.json';
            fs.writeFileSync(newFile, `Questionnaire = ${JSON.stringify(doc, null, 4)}`);
            fs.unlinkSync(filePath);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = AnalysisModel;