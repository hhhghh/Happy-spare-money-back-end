const router = require('koa-router')()
const TaskController = require('../controller/taskController');

router.prefix('/api/task')

router.get('/:task_id', TaskController.searchTask);

module.exports = router
