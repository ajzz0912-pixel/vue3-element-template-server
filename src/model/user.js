const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const md5 = require('../utils/md5');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'username不能为空',
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'password不能为空',
            },
            len: {
                args: [6, 20],
                msg: '密码长度为6～20',
            },
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'email不能为空',
            },
        },
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },
    permissions: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'user',
    freezeTableName: true,
    hooks: {
        beforeCreate: (user) => {
            if (user.password) {
                user.password = md5(user.password);
            }
        },
        beforeUpdate: (user) => {
            if (user.changed('password') && user.password) {
                user.password = md5(user.password);
            }
        },
    },
});

module.exports = User;