require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});


function simpleTaskExtractor(text) {
  if (!text) return [];

  const rawParts = text
    .replace(/\n/g, ' ')
    .split(/\.|\?|!| and /i)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return rawParts.map((part) => ({
    title: part.length > 80 ? part.slice(0, 77) + '...' : part,
    description: part,
    status: 'PENDING',
    priority: 'MEDIUM',
    due_at: null,
    source: 'AI_EXTRACTED',
  }));
}


app.get('/api/tasks', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM tasks ORDER BY due_at NULLS LAST, created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tasks', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, status, priority, due_at, source } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await db.query(
      `INSERT INTO tasks (title, description, status, priority, due_at, source)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        title,
        description || null,
        status || 'PENDING',
        priority || 'MEDIUM',
        due_at ? new Date(due_at) : null,
        source || 'MANUAL',
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating task', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, due_at } = req.body;

    const result = await db.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           priority = COALESCE($4, priority),
           due_at = COALESCE($5, due_at),
           updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [
        title || null,
        description || null,
        status || null,
        priority || null,
        due_at ? new Date(due_at) : null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating task', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM tasks WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting task', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/ai/extract-tasks', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const tasksToCreate = simpleTaskExtractor(text);
    const createdTasks = [];

    for (const t of tasksToCreate) {
      const result = await db.query(
        `INSERT INTO tasks (title, description, status, priority, due_at, source)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [t.title, t.description, t.status, t.priority, t.due_at, t.source]
      );
      createdTasks.push(result.rows[0]);
    }

    res.status(201).json({ tasks: createdTasks });
  } catch (err) {
    console.error('Error in AI extraction', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
