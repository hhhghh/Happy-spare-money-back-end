const index = require('./index.js')
const users = require('./users.js')
const task_api = require('./task_api.js')
const team_api = require('./team_api.js')
const tr_api = require('./tr_api')

module.exports = {
    index: index,
    users: users,
    task_api: task_api,
    team_api: team_api,
    tr_api: tr_api
}