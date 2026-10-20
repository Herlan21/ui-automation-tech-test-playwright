export interface Customer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const USERS = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  lockedOut: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
} as const;

export const LOGIN_ERRORS = {
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  invalidCredentials:
    'Epic sadface: Username and password do not match any user in this service',
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
} as const;

export const PRODUCTS = {
  sauceLabsOnesie: 'Sauce Labs Onesie',
} as const;

export const CUSTOMER: Customer = {
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '12345',
};
