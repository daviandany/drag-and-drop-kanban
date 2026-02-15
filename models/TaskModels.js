import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: { 
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Título não pode ser vazio'}
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('todo', 'in_progress', 'done'),
        defaultValue: 'todo',
    },
    order: { 
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
}, {
    tablename: 'tasks',
    timestamps: 'true',
});

module.exports = 'Tasks'