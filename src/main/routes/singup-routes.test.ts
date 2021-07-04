import request from 'supertest'
import app from '../config/app'

describe('SingUp Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/singup')
      .send({
        name: 'Leonardo',
        email: 'leonardoeverton.tec@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})