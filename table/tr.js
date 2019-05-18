const db = require('../config/db');
const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = function(sequelize, DataTypes){
    return sequelize.define('tr',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        username:{
            type:DataTypes.CHAR(20),
            allowNull:false,
            unique: 'one_reciever_to_one_task'
        },
        task_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            unique: 'one_reciever_to_one_task'
        },
        state:{
            type: DataTypes.INTEGER,
            allowNull:false
            // 0: waiting to be done
            // 1: accpeter complete, waiting publisher confirm
            // 2: publisher confirmed, over
        },
        accpeter_mark: {
            type: DataTypes.INTEGER
        },
        createdAt:{
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        // 更新时间
        updatedAt:{
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    }, {
        // 如果为 true 则表的名称和 model 相同，即 user
        // 为 false MySQL创建的表名称会是复数 users
        // 如果指定的表名称本就是复数形式则不变
        freezeTableName: true
    });
};