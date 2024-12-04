const express = require('express');
const router = express.Router();
const { db, auth } = require('../services/firebase');

// Middleware to log request details
const logRequest = (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  next();
};

// Middleware to verify token
const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split(' ')[1];
  if (!idToken) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Use the logRequest middleware before verifying the token
router.use(logRequest);

// Create a todo
router.post('/', verifyToken, async (req, res) => {
  const { title, content } = req.body;
  try {
    const docRef = await db.collection('todos').add({
      userId: req.user.uid,
      title,
      content,
      status: false,
      createdAt: new Date(),
    });
    res.status(201).json({ id: docRef.id, message: 'todo created' });
  } catch (error) {
    res.status(500).json({ error: `Failed to create todo, ${error}` });
    console.log(`Failed to create todo, ${error}`);
  }
});

//get a single todo
router.get('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;  // Get the todo ID from the URL parameters
  
    try {
      const todoDoc = await db.collection('todos').doc(id).get();
  
      if (!todoDoc.exists) {
        return res.status(404).json({ error: 'todo not found' });
      }
  
      // Ensure the todo belongs to the authenticated user
      if (todoDoc.data().userId !== req.user.uid) {
        return res.status(403).json({ error: 'Unauthorized to access this todo' });
      }
  
      // Return the todo details
      res.status(200).json({
        id: todoDoc.id,
        ...todoDoc.data(),
      });
  
    } catch (error) {
      console.error('Error fetching todo:', error);
      res.status(500).json({ error: 'Failed to fetch todo' });
    }
  });
  

// Get all todos
router.get('/', verifyToken, async (req, res) => {
  try {
    const todosSnapshot = await db
      .collection('todos')
      .where('userId', '==', req.user.uid)
      .get();

    const todos = todosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ todos });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Update a todo
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, content, status } = req.body;

  try {
    await db.collection('todos').doc(id).update({ title, content, status });
    res.status(200).json({ message: 'todo updated' });
  } catch (error) {
    res.status(500).json({ error: `Failed to update todo, ${error}` });
    console.log(`Failed to update todo, ${error}`);
  }
});

// Delete a todo
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('todos').doc(id).delete();
    res.status(200).json({ message: 'todo deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Log the response status after it is sent
router.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`Response Status: ${res.statusCode}`);
  });
  next();
});

module.exports = router;
