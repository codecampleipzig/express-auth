describe('Authentication', () => {
  beforeEach(() => {
    cy.exec('yarn db:seed')
  })

  it('should create a new user on signup and return a JWT token', () => {
    cy.request('POST', 'http://localhost:3000/auth/signup', {
      email: 'test@codecampleipzig.de',
      password: '123456'
    }).should(response => {
      expect(response.body).to.have.property('jwt').and.be.a('string')
      expect(response.body).to.have.property('user')
      expect(response.body.user).to.have.property('email').and.be.eq('test@codecampleipzig.de')
      expect(response.body.user).to.have.property('id').and.be.a('number')
    })
  })

  it('should return an error if the email is not valid', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/auth/signup',
      body: {
        email: 'testUser',
        password: '123456'
      },
      failOnStatus: false
    }).should(response => {
      expect(response.status).to.be.eq(400)
      expect(response.body).to.have.property('error')
    })
  })

  it('should return user and jwt on signin', () => {
    cy.request('POST', 'http://localhost:3000/auth/signin', {
      email: 'gabe@codecampleipzig.de',
      password: 'Lotte123'
    }).should(response => {
      expect(response.body).to.have.property('jwt').and.be.a('string')
      expect(response.body).to.have.property('user')
      expect(response.body.user).to.have.property('email').and.be.eq('gabe@codecampleipzig.de')
      expect(response.body.user).to.have.property('id').and.be.eq(2)
    })
  })

  it("should return an error when the user doesn't exit", () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/auth/signin',
      body: {
        email: 'asdf@codecampleipzig.de',
        password: '123456'
      },
      failOnStatus: false
    }).should(response => {
      expect(response.status).to.be.eq(401)
      expect(response.body).to.have.property('error')
    })
  })

  it('should return an error when the password is incorrect', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/auth/signin',
      body: {
        email: 'gabe@codecampleipzig.de',
        password: 'Lotte1234'
      },
      failOnStatus: false
    }).should(response => {
      expect(response.status).to.be.eq(401)
      expect(response.body).to.have.property('error')
    })
  })
})
