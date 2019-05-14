const moment = require('moment');
const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes){
    return sequelize.define('team',{
        team_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        team_name:{
            type:DataTypes.CHAR(45),
            allowNull:false
        },
        leader:{
            type:DataTypes.CHAR(20),
            allowNull:false,
            references: {
                model: 'user',
                key: 'username',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            }
        },
        logo:{
            type:DataTypes.CHAR(255),
            allowNull:false,
            defaultValue:'default url waiting be set'
        },
        description:{
            type:DataTypes.CHAR(100),
            allowNull:false,
            defaultValue:'The group leader was too lazy to write an introduction.'
        },
        limit:{
            type:DataTypes.INTEGER,
            defaultValue: 0
        },
        createdAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        // 更新时间
        updatedAt: {
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
    })
};