import { Page } from '@playwright/test';

/**
 * Base Page Object for admin pages
 */
export class AdminPage {
  constructor(protected page: Page) { }

  async goto(path: string) {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  getSidebar() {
    return this.page.locator('aside');
  }

  async navigateTo(menuItem: string) {
    await this.page.click(`a:has-text("${menuItem}")`);
    await this.page.waitForLoadState('networkidle');
  }
}

/**
 * Login Page Object
 */
export class LoginPage extends AdminPage {
  getEmailInput() {
    return this.page.locator('input[type="email"]');
  }

  getPasswordInput() {
    return this.page.locator('input[type="password"]');
  }

  getSubmitButton() {
    return this.page.locator('button[type="submit"]');
  }

  getPasswordToggle() {
    // Password toggle is a button inside the password input's parent div
    // It's positioned absolutely within the relative container
    return this.page.locator('#password').locator('xpath=..').locator('button[type="button"]');
  }

  async fillEmail(email: string) {
    await this.getEmailInput().fill(email);
  }

  async fillPassword(password: string) {
    await this.getPasswordInput().fill(password);
  }

  async submit() {
    await this.getSubmitButton().click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }
}

/**
 * Dashboard Page Object
 */
export class DashboardPage extends AdminPage {
  getStatsCards() {
    return this.page.locator('[class*="Card"]');
  }

  getRecentBlogs() {
    return this.page.locator('text=Recent Blogs').locator('..');
  }

  getRecentLeads() {
    return this.page.locator('text=Recent Leads').locator('..');
  }
}

/**
 * Base CRUD Page Object
 */
export class CRUDPage extends AdminPage {
  constructor(page: Page, protected entityName: string) {
    super(page);
  }

  getCreateButton() {
    return this.page.locator('button:has-text("New"), button:has-text("Create"), button:has-text("Add")');
  }

  getSearchInput() {
    return this.page.locator('input[placeholder*="Search"]');
  }

  getTable() {
    return this.page.locator('table');
  }

  getTableRows() {
    return this.page.locator('table tbody tr');
  }

  async search(query: string) {
    await this.getSearchInput().fill(query);
    await this.page.waitForTimeout(500); // Wait for debounce
  }

  async clickCreate() {
    await this.getCreateButton().click();
    await this.page.waitForSelector('[role="dialog"], [data-state="open"]', { timeout: 5000 });
  }

  async getRowByText(text: string) {
    return this.page.locator(`tr:has-text("${text}")`);
  }
}

/**
 * Blogs Page Object
 */
export class BlogsPage extends CRUDPage {
  constructor(page: Page) {
    super(page, 'Blog');
  }

  getTitleInput() {
    return this.page.locator('#title');
  }

  getSlugInput() {
    return this.page.locator('#slug');
  }

  getExcerptInput() {
    return this.page.locator('#excerpt');
  }

  getContentEditor() {
    return this.page.locator('[contenteditable="true"], .ProseMirror');
  }

  getImageDropzone() {
    return this.page.locator('[id="image-dropzone"]');
  }

  getCategorySelect() {
    return this.page.locator('[id="category-select"] select, [id="category-select"] [role="combobox"]');
  }

  getAuthorInput() {
    return this.page.locator('#author');
  }

  getStatusSelect() {
    return this.page.locator('select, [role="combobox"]').filter({ hasText: 'Draft' }).or(this.page.locator('select, [role="combobox"]').filter({ hasText: 'Published' }));
  }

  getSaveButton() {
    return this.page.locator('button:has-text("Create"), button:has-text("Update"), button:has-text("Save")');
  }

  async fillBlogForm(data: {
    title: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    image?: string;
    author?: string;
    status?: 'draft' | 'published';
  }) {
    if (data.title) await this.getTitleInput().fill(data.title);
    if (data.slug) await this.getSlugInput().fill(data.slug);
    if (data.excerpt) await this.getExcerptInput().fill(data.excerpt);
    if (data.content) {
      await this.getContentEditor().click();
      await this.getContentEditor().fill(data.content);
    }
    if (data.author) await this.getAuthorInput().fill(data.author);
    if (data.status) {
      await this.getStatusSelect().click();
      await this.page.locator(`text=${data.status === 'draft' ? 'Draft' : 'Published'}`).click();
    }
  }

  async save() {
    await this.getSaveButton().click();
  }
}

/**
 * Projects Page Object
 */
export class ProjectsPage extends CRUDPage {
  constructor(page: Page) {
    super(page, 'Project');
  }

  getTitleInput() {
    return this.page.locator('#title');
  }

  getDescriptionInput() {
    return this.page.locator('#description');
  }

  getContentEditor() {
    return this.page.locator('[contenteditable="true"], .ProseMirror');
  }

  getImageDropzone() {
    return this.page.locator('[id="image-dropzone"]');
  }

  getSaveButton() {
    return this.page.locator('button:has-text("Create"), button:has-text("Update")');
  }

  async save() {
    await this.getSaveButton().click();
  }
}

/**
 * Categories Page Object
 */
export class CategoriesPage extends CRUDPage {
  constructor(page: Page) {
    super(page, 'Category');
  }

  getNameInput() {
    return this.page.locator('input[id*="name"], input[placeholder*="name" i]');
  }

  getSlugInput() {
    return this.page.locator('input[id*="slug"], input[placeholder*="slug" i]');
  }

  getSaveButton() {
    return this.page.locator('button:has-text("Create"), button:has-text("Update"), button:has-text("Save")');
  }

  async fillCategoryForm(data: { name: string; slug?: string }) {
    await this.getNameInput().fill(data.name);
    if (data.slug) await this.getSlugInput().fill(data.slug);
  }
}

/**
 * Leads Page Object
 */
export class LeadsPage extends CRUDPage {
  constructor(page: Page) {
    super(page, 'Lead');
  }

  getNameInput() {
    return this.page.locator('#name');
  }

  getEmailInput() {
    return this.page.locator('#email');
  }

  getPhoneInput() {
    return this.page.locator('#phone');
  }

  getMessageInput() {
    return this.page.locator('#message');
  }

  getStatusSelect() {
    return this.page.locator('select, [role="combobox"]').first();
  }

  getSaveButton() {
    return this.page.locator('button:has-text("Create"), button:has-text("Update")');
  }

  async fillLeadForm(data: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
    status?: string;
  }) {
    await this.getNameInput().fill(data.name);
    await this.getEmailInput().fill(data.email);
    if (data.phone) await this.getPhoneInput().fill(data.phone);
    if (data.message) await this.getMessageInput().fill(data.message);
    if (data.status) {
      await this.getStatusSelect().click();
      await this.page.locator(`text=${data.status}`).click();
    }
  }
}

