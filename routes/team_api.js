const router = require('koa-router')()
const TeamController = require('../controller/teamController');

router.prefix('/api/team')

router.post('/', TeamController.create);
router.get('/:team_id', TeamController.detail);

module.exports = router
