import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../config/database';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
         notEmpty: { msg: 'Name can not be avoid'},
         len: { args: [2, 100], msg: 'Name must has between 2 until 100 characters' }   
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'This E-mail is already registered' },
        validate: { 
            isEmail:{ msg: 'Invalid E-mail' }
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: { args: [2, 200], msg: 'Password must be 6 characters at least' }
        },
    }, 
}, {
    tableName: 'users',
    timestamps: true,

    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 10)
        },
        beforeUpdate: async (user) => {
            if(user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
    },

});

User.prototype.checkPassword = async function (setedPassword){
    return bcrypt.compare(setedPassword, this.password);
};

User.prototype.toSafeJSON = function () {
    const { password, ...user } = this.toJSON();
    return user;
}

export default User;
