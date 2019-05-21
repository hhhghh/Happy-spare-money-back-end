const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');
const AnalysisModel = require('../questionnaire/analysis.js');

router.prefix('/api/v1/file');


const mkdirsSync = (dirname) => {
    if (fs.existsSync(dirname)) {
        return true
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true
        }
    }
    return false
};

function getSuffix (fileName) {
    return fileName.split('.').pop()
}

// 重命名
/**
 * @return {string}
 */
function Rename (fileName) {
    return Math.random().toString(16).substr(2) + '.' + getSuffix(fileName)
}

// 上传到本地服务器
function uploadFile (ctx, options) {
    const _emmiter = new Busboy({headers: ctx.req.headers});
    const fileType = options.fileType;
    const filePath = path.join(options.path, fileType);
    const confirm = mkdirsSync(filePath);
    if (!confirm) {
        return
    }
    // console.log('start uploading...');
    return new Promise((resolve, reject) => {
        _emmiter.on('file', function (fieldname, file, filename, encoding, mimetype) {
            const fileName = Rename(filename);
            const saveTo = path.join(path.join(filePath, fileName));
            file.pipe(fs.createWriteStream(saveTo));
            file.on('end', function () {
                resolve({
                    code: 200,
                    msg: '上传成功',
                    imgPath: `/${fileType}/${fileName}`,
                    imgKey: fileName
                })
            })
        });

        _emmiter.on('finish', function () {
        });

        _emmiter.on('error', function (err) {
            reject(err)
        });

        ctx.req.pipe(_emmiter)
    })
}


router.post('/TeamLogo', async (ctx, next) => {
    const serverPath = path.join(__dirname, '../static/uploads/');
    // 获取上存图片
    const result = await uploadFile(ctx, {
        fileType: 'team',
        path: serverPath
    });

    ctx.body = {
        code: result.code,
        msg: result.msg,
        data: {
            imgUrl: 'localhost:3000' + '/uploads' + result.imgPath,
        }
    };
});

router.post('/Questionnaire', async (ctx, next) => {
    const serverPath = path.join(__dirname, '../static/uploads/');
    // 获取上存文件
    const result = await uploadFile(ctx, {
        fileType: 'questionnaire',
        path: serverPath
    });

    AnalysisModel.AnalysisQuestionnaire('./static/uploads' + result.imgPath);

    ctx.body = {
        code: result.code,
        msg: result.msg,
        data: {
            fileUrl: 'localhost:3000' + '/uploads' + result.imgPath.split('.')[0] + '.json',
        }
    };
});


module.exports = router;