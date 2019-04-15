const moment = require('moment');
module.exports = function(sequelize, DataTypes){
    var user = sequelize.define('user',{
        username:{
            type:DataTypes.CHAR(20),
            primaryKey:true,
            allowNull:false,
			unique:true
        },
        password:{
            type:DataTypes.CHAR(128),
            allowNull:false
        },
        score:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue: 50,
        },
        money:{
            type:DataTypes.FLOAT,
            allowNull:false,
            defaultValue:0
        },
        true_name:{
            type:DataTypes.CHAR(20),
            allowNull:false
        },
        school_name:{
            type:DataTypes.CHAR(45),
            allowNull:false,
            defaultValue:'SYSU'
        },
        grade:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        avatar:{
            type:DataTypes.CHAR(128),
            defaultValue:'default url waiting be set'
        },
        nickname:{
            type:DataTypes.CHAR(20),
            defaultValue:user.username
        },
        wechat:{
            type:DataTypes.CHAR(21)
        },
        QQ:{
            type:DataTypes.CHAR(14)
        },
        phone_number:{
            type:DataTypes.CHAR(14)
        },
        account_state:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
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
    return user;
};