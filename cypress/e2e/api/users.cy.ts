/**
 * Spec: Users API — ReqRes.in CRUD operations.
 * Target: https://reqres.in/api
 *
 * Uses cy.apiRequest (custom command) which reads API_BASE_URL from env.
 * No hard waits — all assertions happen on resolved responses.
 */

interface ReqResUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface ReqResListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: ReqResUser[];
}

interface ReqResSingleResponse {
  data: ReqResUser;
}

interface ReqResCreatedUser {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}

interface ReqResUpdatedUser {
  name: string;
  job: string;
  updatedAt: string;
}

describe('Users API — GET', () => {
  it('should return a paginated list of users with the correct schema', () => {
    cy.apiRequest({ method: 'GET', url: '/users?page=1' }).then(
      (response: Cypress.Response<ReqResListResponse>) => {
        expect(response.status).to.equal(200);
        expect(response.body.data).to.be.an('array').and.have.length.greaterThan(0);
        expect(response.body.page).to.equal(1);
        expect(response.body.per_page).to.be.a('number');
        expect(response.body.total).to.be.a('number');

        // Validate the schema of the first user object
        const firstUser = response.body.data[0];
        expect(firstUser).to.have.all.keys('id', 'email', 'first_name', 'last_name', 'avatar');
        expect(firstUser.email).to.match(/@/);
      }
    );
  });

  it('should return the correct user when fetching by ID', () => {
    cy.apiRequest({ method: 'GET', url: '/users/2' }).then(
      (response: Cypress.Response<ReqResSingleResponse>) => {
        expect(response.status).to.equal(200);
        expect(response.body.data.id).to.equal(2);
        expect(response.body.data.email).to.be.a('string').and.match(/@/);
      }
    );
  });

  it('should return 404 when the requested user does not exist', () => {
    cy.apiRequest({ method: 'GET', url: '/users/9999', failOnStatusCode: false }).then(
      (response: Cypress.Response<Record<string, never>>) => {
        expect(response.status).to.equal(404);
        expect(response.body).to.deep.equal({});
      }
    );
  });
});

describe('Users API — POST / PUT / DELETE', () => {
  it('should create a new user and return 201 with the created resource', () => {
    const payload = { name: 'Nicolás Martínez', job: 'QA Automation Engineer' };

    cy.apiRequest({ method: 'POST', url: '/users', body: payload }).then(
      (response: Cypress.Response<ReqResCreatedUser>) => {
        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal(payload.name);
        expect(response.body.job).to.equal(payload.job);
        expect(response.body.id).to.be.a('string');
        expect(response.body.createdAt).to.be.a('string');
      }
    );
  });

  it('should update a user and return the updated fields', () => {
    const payload = { name: 'Nicolás Martínez', job: 'Senior QA Engineer' };

    cy.apiRequest({ method: 'PUT', url: '/users/2', body: payload }).then(
      (response: Cypress.Response<ReqResUpdatedUser>) => {
        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(payload.name);
        expect(response.body.job).to.equal(payload.job);
        expect(response.body.updatedAt).to.be.a('string');
      }
    );
  });

  it('should delete a user and return 204 with no content', () => {
    cy.apiRequest({ method: 'DELETE', url: '/users/2' }).then(
      (response: Cypress.Response<void>) => {
        expect(response.status).to.equal(204);
        expect(response.body).to.satisfy(
          (b: unknown) =>
            b === '' || (typeof b === 'object' && Object.keys(b as object).length === 0)
        );
      }
    );
  });
});
