

const DEMO_USER = {
  email: process.env.DEMO_EMAIL || 'admin@gmail.com',
  password: process.env.DEMO_PASSWORD || 'password123'
};

// POST /api/auth/login
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (email === DEMO_USER.email && password === DEMO_USER.password) {
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    return res.json({
      message: 'Login successful',
      token,
      user: { email }
    });
  }

  return res.status(401).json({ message: 'Invalid email or password' });
};
