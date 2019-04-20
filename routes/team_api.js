const router = require('koa-router')()
const TeamController = require('../controller/teamController');

router.prefix('/api/team')

router.post('/', TeamController.create);
router.get('/:team_id', TeamController.getTeamById);

module.exports = router
