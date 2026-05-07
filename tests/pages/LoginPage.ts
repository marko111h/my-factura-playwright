import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  
  // Locatori — definisani kao properties klase
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly keepMeLoggedInCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Inicijalizacija locatora — definicija na jednom mjestu
    this.usernameInput = page.getByPlaceholder('Username*');
    this.passwordInput = page.getByPlaceholder('Password*');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.forgotPasswordLink = page.getByText('Forgot password?');
    this.keepMeLoggedInCheckbox = page.getByLabel('Keep me logged in');
  }

  // Akcija: idi na login stranicu
  async goto() {
    await this.page.goto('/#/auth/login');
  }

  // Akcija: kompletan login flow
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Akcija: login pa sačekaj dashboard
  async loginAndWaitForDashboard(username: string, password: string) {
    await this.login(username, password);
    await this.page.waitForURL(/.*\/admin\/.*\/dashboard/);
  }

  // Provjera: jesu li sve forme login stranice vidljive
  async expectLoginFormVisible() {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  // Provjera: jesmo li još na login stranici
  async expectStillOnLoginPage() {
    await expect(this.page).toHaveURL(/.*auth\/login/);
  }
}