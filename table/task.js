const moment = require('moment');
module.exports = function(sequelize, DataTypes){
    return sequelize.define('task',{
        task_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        title:{
            type:DataTypes.CHAR(45),
            allowNull:false
        },
        introduction:{
            type:DataTypes.CHAR(100),
            allowNull:false
        },
        money:{
            type:DataTypes.FLOAT,
            allowNull:false,
            defaultValue:0
        },
        score:{
            type:DataTypes.INTEGER
        },
        number:{
            type:DataTypes.INTEGER
        },
        publisher:{
            type:DataTypes.CHAR(20),
			allowNull:false
        },
        state:{
            type:DataTypes.CHAR(45)
        },
        type:{
            type:DataTypes.INTEGER
        },
        starttime:{
            type:DataTypes.DATE
        },
        endtime:{
            type:DataTypes.DATE
        },
        content:{
            type:DataTypes.CHAR(45)
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
    });
};