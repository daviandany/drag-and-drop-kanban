import Router from 'express';
import Task from 'models';
import auth from './auth';

const router = router();

router.use(auth);

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: { userId: req.user.id },
            order: [['order', 'ASC'], ['createdAt', 'ASC']],
        });
        return res.json(tasks)
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar tasks' })
    }
});

router.post('/', async (req, res) => {
    try {
    const { title, description, status, order } = req.body;

    const task = await Task.create({
        title,
        description,
        status,
        order,
        userId: req.user.id,
    });
    return res.status(201).json(task);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map((e) => e.message);
            return res.status(400).json({ error: messages })
        }
        return res.status(500).json({ error: 'Erro ao criar task' })
    }
});
    router.put('/:id', async (req, res) => {
        try {
            const task = await Task.findOne({
                where: { id: req.params.id, userId: req.user.id },
            });

            if (!task) {
                return res.status(404).json({ error: 'Task não encontrada' })
            }

            const { title, description, status, order } = req.body;
            await task.update({ title, description, status, order });

            return res.json(task);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar task' });
        }
        
    });

    router.delete('/:id', async (req, res) => {
        try {
            const task = Task.findOne({ 
                where: { id: req.params.id, userId: req.user.id },
             });

             if(!task) {
                return res.status(404).json({ error: 'Task não encontrada' });
             }

             await task.destroy();
             return res.status(204).send()
        } catch (error) {
             return res.status(500).json({ error: 'Erro ao deletar task' })
        }
    });

module.exports = router;