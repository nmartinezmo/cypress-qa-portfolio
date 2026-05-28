/**
 * Spec: Users API — JSONPlaceholder CRUD operations.
 * Target: https://jsonplaceholder.typicode.com/users
 *
 * Note: ReqRes.in was replaced by JSONPlaceholder because ReqRes
 * introduced mandatory paid API keys (401 on all endpoints without auth).
 * JSONPlaceholder is a free, stable public REST API suitable for portfolio demos.
 */
import { assertSchema } from '../../support/schema-validators';

const BASE = 'https://jsonplaceholder.typicode.com';

interface JPUser {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface JPCreatedUser {
  id: number;
  name: string;
  username: string;
  email: string;
}

describe('Users API — GET', () => {
  it('should return an array of users with the correct schema', () => {
    cy.request<JPUser[]>({ method: 'GET', url: `${BASE}/users` }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array').and.have.length.greaterThan(0);

      // Validate the schema of the first user via shared helper
      assertSchema(response.body[0] as unknown as Record<string, unknown>, {
        id: 'number',
        name: 'string',
        username: 'string',
        email: 'string',
      });
    });
  });

  it('should return the correct user when fetching by ID', () => {
    cy.request<JPUser>({ method: 'GET', url: `${BASE}/users/1` }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.id).to.equal(1);
      expect(response.body.email).to.be.a('string').and.match(/@/);
    });
  });

  it('should return 404 when the requested user does not exist', () => {
    cy.request({ method: 'GET', url: `${BASE}/users/9999`, failOnStatusCode: false }).then(
      (response) => {
        expect(response.status).to.equal(404);
      }
    );
  });
});

describe('Users API — POST / PUT / PATCH / DELETE', () => {
  it('should create a new user and return 201 with the created resource', () => {
    const payload = {
      name: 'Nicolás Martínez',
      username: 'nicomar9928',
      email: 'nicomar9928@gmail.com',
    };

    cy.request<JPCreatedUser>({ method: 'POST', url: `${BASE}/users`, body: payload }).then(
      (response) => {
        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal(payload.name);
        expect(response.body.email).to.equal(payload.email);
        expect(response.body.id).to.be.a('number');
      }
    );
  });

  it('should replace a user via PUT and return the updated resource', () => {
    const payload = {
      id: 1,
      name: 'Nicolás Martínez',
      username: 'nicomar9928',
      email: 'nicomar9928@gmail.com',
    };

    cy.request<JPUser>({ method: 'PUT', url: `${BASE}/users/1`, body: payload }).then(
      (response) => {
        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(payload.name);
        expect(response.body.id).to.equal(payload.id);
      }
    );
  });

  it('should partially update a user via PATCH and return the patched field', () => {
    const patch = { name: 'Senior QA Engineer' };

    cy.request<JPUser>({ method: 'PATCH', url: `${BASE}/users/1`, body: patch }).then(
      (response) => {
        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(patch.name);
        expect(response.body.id).to.equal(1);
      }
    );
  });

  it('should delete a user and return 200', () => {
    cy.request({ method: 'DELETE', url: `${BASE}/users/1` }).then((response) => {
      expect(response.status).to.equal(200);
    });
  });
});
