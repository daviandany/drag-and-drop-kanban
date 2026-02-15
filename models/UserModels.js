import { DataTypes } from 'sequelize';
import bcrypt from bcrypt;
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
         notEmpty: { msg: 'Nome não pode ser vazio'},
         len: { args: [2, 100], msg: 'Nome deve ter entre 2 a 100 caracteres' }   
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Este e-mail já está cadastrado' },
        validate: { 
            isEmail:{ msg: 'E-mail inválido' }
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNulll: false,
        validate: {
            len: { args: [2, 200], msg: 'Senha deve ter pelo menos 6 caracteres' }
        },
    }, 
}, {
    tableName: 'users',
    timestamps: true,

    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 10)
        },
        befereUpdate: async (user) => {
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

module.exports = User;
