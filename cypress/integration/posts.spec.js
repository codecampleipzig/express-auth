describe('Posts API', () => {
  let jwt = null
  let user = null
  beforeEach(() => {
    cy.exec('yarn db:seed')
    cy.request('POST', 'http://localhost:3000/auth/signin', {
      email: 'gabe@codecampleipzig.de',
      password: 'Lotte123'
    }).then(response => {
      jwt = response.body.jwt
      user = response.body.user
      expect(jwt).to.exist // eslint-disable-line
    })
  })

  it('should return posts when logged in', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/posts',
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    }).should(response => {
      expect(response.body).to.have.lengthOf(3)
      expect(response.body[0]).to.have.keys('id', 'title', 'content', 'userId', 'userEmail', 'createdAt')
    })
  })

  it('should return an error if jwt is missing', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/posts',
      failOnStatusCode: false
    }).should(response => {
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property('error')
    })
  })

  it('should return an error if trying to create a post and jwt is missing', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/posts',
      body: {
        title: 'Test Title',
        content: 'Test Content'
      },
      failOnStatusCode: false
    }).should(response => {
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property('error')
    })
  })

  it('should create a new post', () => {
    const testPost = {
      title: 'Test Title',
      content: 'Test Content'
    }
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/posts',
      body: testPost,
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    }).should(response => {
      expect(response.body).to.have.keys('id', 'title', 'content', 'userId', 'userEmail', 'createdAt')
      expect(response.body).property('title').to.eq(testPost.title)
      expect(response.body).property('content').to.eq(testPost.content)
      expect(response.body).property('userEmail').to.eq(user.email)
      expect(response.body).property('userId').to.eq(user.id)
    })
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/posts',
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    }).should(response => {
      expect(response.body).to.have.lengthOf(4)
      expect(response.body[3]).to.have.keys('id', 'title', 'content', 'userId', 'userEmail', 'createdAt')
      const post = response.body[3]
      expect(post).property('title').to.eq(testPost.title)
      expect(post).property('content').to.eq(testPost.content)
      expect(post).property('userEmail').to.eq(user.email)
      expect(post).property('userId').to.eq(user.id)
    })
  })
})
