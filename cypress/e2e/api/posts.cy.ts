/**
 * Spec: Posts API — JSONPlaceholder CRUD operations.
 * Target: https://jsonplaceholder.typicode.com
 *
 * Uses cy.request directly (not cy.apiRequest) because the base URL
 * differs from the default API_BASE_URL (ReqRes).
 */

const BASE = 'https://jsonplaceholder.typicode.com';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

describe('Posts API — GET', () => {
  it('should return an array of posts with the correct schema', () => {
    cy.request<Post[]>({ method: 'GET', url: `${BASE}/posts` }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array').and.have.length(100);

      const post = response.body[0];
      expect(post).to.have.all.keys('userId', 'id', 'title', 'body');
      expect(post.id).to.be.a('number');
      expect(post.title).to.be.a('string').and.have.length.greaterThan(0);
    });
  });

  it('should return a single post by ID', () => {
    cy.request<Post>({ method: 'GET', url: `${BASE}/posts/1` }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.id).to.equal(1);
      expect(response.body.userId).to.equal(1);
    });
  });

  it('should return comments for a specific post', () => {
    cy.request<Comment[]>({ method: 'GET', url: `${BASE}/posts/1/comments` }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array').and.have.length.greaterThan(0);

      const comment = response.body[0];
      expect(comment).to.have.all.keys('postId', 'id', 'name', 'email', 'body');
      expect(comment.email).to.match(/@/);
    });
  });
});

describe('Posts API — POST / PATCH / DELETE', () => {
  it('should create a new post and return 201 with the resource', () => {
    const payload = { title: 'Portfolio test post', body: 'Automated by Cypress', userId: 1 };

    cy.request<Post>({ method: 'POST', url: `${BASE}/posts`, body: payload }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.title).to.equal(payload.title);
      expect(response.body.userId).to.equal(payload.userId);
      expect(response.body.id).to.be.a('number');
    });
  });

  it('should partially update a post and return the patched field', () => {
    const patch = { title: 'Updated title' };

    cy.request<Post>({ method: 'PATCH', url: `${BASE}/posts/1`, body: patch }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.title).to.equal(patch.title);
      expect(response.body.id).to.equal(1);
    });
  });

  it('should delete a post and return 200', () => {
    cy.request({ method: 'DELETE', url: `${BASE}/posts/1` }).then((response) => {
      expect(response.status).to.equal(200);
    });
  });
});
