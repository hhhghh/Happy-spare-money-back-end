const yaml = require('js-yaml');
const fs   = require('fs');

let file = './static/swagger.yaml';
// Get document, or throw exception on error
try {
    let doc = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
    console.log(doc);

    fs.writeFileSync('./static/swagger.txt', `module.exports = ${JSON.stringify(doc, null, 2)}`);
} catch (e) {
    console.log(e);
}