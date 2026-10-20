import { test } from '@playwright/test';
import { LOGIN_ERRORS, USERS } from '../data/testData';
import { LoginPage } from '../pages/LoginPage';

interface InvalidLoginCase {
  name: string;
  username: string;
  password: string;
  expectedError: string;
}

const negativeCases: InvalidLoginCase[] = [
  {
    name: 'a wrong password',
    username: USERS.standard.username,
    password: 'wrong_password',
    expectedError: LOGIN_ERRORS.invalidCredentials,
  },
  {
    name: 'an unknown username',
    username: 'unknown_user',
    password: USERS.standard.password,
    expectedError: LOGIN_ERRORS.invalidCredentials,
  },
  {
    name: 'a locked out user',
    username: USERS.lockedOut.username,
    password: USERS.lockedOut.password,
    expectedError: LOGIN_ERRORS.lockedOut,
  },
  {
    name: 'an empty username',
    username: '',
    password: USERS.standard.password,
    expectedError: LOGIN_ERRORS.usernameRequired,
  },
  {
    name: 'an empty password',
    username: USERS.standard.username,
    password: '',
    expectedError: LOGIN_ERRORS.passwordRequired,
  },
  {
    name: 'an empty username and password',
    username: '',
    password: '',
    expectedError: LOGIN_ERRORS.usernameRequired,
  },
  {
    name: 'a password with different casing',
    username: USERS.standard.username,
    password: 'SECRET_SAUCE',
    expectedError: LOGIN_ERRORS.invalidCredentials,
  },
  {
    name: 'a username with leading and trailing spaces',
    username: ` ${USERS.standard.username} `,
    password: USERS.standard.password,
    expectedError: LOGIN_ERRORS.invalidCredentials,
  },
  {
    name: 'a password with leading and trailing spaces',
    username: USERS.standard.username,
    password: ` ${USERS.standard.password} `,
    expectedError: LOGIN_ERRORS.invalidCredentials,
  },
  {
    name: 'a whitespace-only username',
    username: '   ',
    password: USERS.standard.password,
    expectedError: LOGIN_ERRORS.invalidCredentials,
  },
  {
    name: 'a whitespace-only password',
    username: USERS.standard.username,
    password: '   ',
    expectedError: LOGIN_ERRORS.invalidCredentials,
  },
];

const boundaryCases: InvalidLoginCase[] = [
  {
    name: 'single-character credentials',
    username: 'a',
    password: 'b',
    expectedError: LOGIN_ERRORS.invalidCredentials,
  },
  {
    name: 'a 255-character username',
    username: 'x'.repeat(255),
    password: USERS.standard.password,
    expectedError: LOGIN_ERRORS.invalidCredentials,
  },
  {
    name: 'a 255-character password',
    username: USERS.standard.username,
    password: 'x'.repeat(255),
    expectedError: LOGIN_ERRORS.invalidCredentials,
  },
  {
    name: '1000-character username and password',
    username: 'x'.repeat(1000),
    password: 'x'.repeat(1000),
    expectedError: LOGIN_ERRORS.invalidCredentials,
  },
  {
    name: 'special characters and SQL injection input',
    username: "' OR '1'='1",
    password: "' OR '1'='1",
    expectedError: LOGIN_ERRORS.invalidCredentials,
  },
];

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.describe('Positive case', () => {
    test('logs in successfully with valid credentials', async () => {
      const inventoryPage = await loginPage.login(
        USERS.standard.username,
        USERS.standard.password,
      );

      await inventoryPage.expectLoaded();
    });
  });

  test.describe('Negative cases', () => {
    for (const { name, username, password, expectedError } of negativeCases) {
      test(`rejects ${name}`, async () => {
        await loginPage.login(username, password);

        await loginPage.expectErrorMessage(expectedError);
        await loginPage.expectLoginPage();
      });
    }
  });

  test.describe('Boundary cases', () => {
    for (const { name, username, password, expectedError } of boundaryCases) {
      test(`handles ${name}`, async () => {
        await loginPage.login(username, password);

        await loginPage.expectErrorMessage(expectedError);
        await loginPage.expectLoginPage();
      });
    }
  });
});
