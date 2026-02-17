import sequelize from '../config/database.js';
import User from './UserModels.js';
import Task from './TaskModels.js';

User.hasMany(Task, {
    foreignKey: 'userId',
    as: 'tasks',
    onDelete: 'CASCADE',
});

Task.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

const syncDatabase = async () => {
    try{
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida')

        await sequelize.sync({ alter: true });
        console.log('Tabelas sincronizadas')    
    } catch (error) {
        console.log('Erro ao conectar no banco: ', error.message);
        process.exit(1)
    }
};

export { sequelize, User, Task, syncDatabase };