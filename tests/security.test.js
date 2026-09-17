const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../server'); 

describe('Authorization & Access Control Edge Cases', () => {
  let standardUserToken;

  beforeAll(() => {
    // Generate a valid JWT payload for a mock standard user (not an admin)
    standardUserToken = jwt.sign(
      { userId: '64f1b2c3e4d5a6b7c8d9e0f1', role: 'user' },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Close mongoose connection so Jest exits cleanly without open handle warnings
    await mongoose.connection.close();
  });

  it('should block standard users from hitting admin routes with a 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${standardUserToken}`);
    
    expect(res.statusCode).toEqual(403);
  });
});