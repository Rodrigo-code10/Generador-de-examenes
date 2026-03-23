import { test, expect } from '@playwright/test';

test('register funciona', async ({ page }) => {
  await page.goto('http://localhost:3000/api/register');

  const email = `carmen${Date.now()}@gmail.com`;

  const inputs = page.getByRole('textbox');

  await inputs.nth(0).fill('Carmen');
  await inputs.nth(1).fill(email);
  await inputs.nth(2).fill('password123');

  await page.getByRole('button', { name: /Registrar/i }).click();

  await expect(page).toHaveURL(/login|dashboard/);
});


test('login funciona', async ({ page }) => {
  await page.goto('http://localhost:3000/api/login');
  const inputs = page.locator('input:visible');
  await inputs.nth(0).fill('diazjosuesito25@gmail.com');
  await inputs.nth(1).fill('rebecafer');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).toHaveURL(/api/);
});


test('generar examen funciona', async ({ page }) => {
  await page.goto('http://localhost:3000/api/login');
  const loginInputs = page.locator('input:visible');
  await loginInputs.nth(0).fill('diazjosuesito25@gmail.com');
  await loginInputs.nth(1).fill('rebecafer');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).toHaveURL(/\/api$/, { timeout: 10000 });
  await page.goto('http://localhost:3000/api/users');
  await page.goto('http://localhost:3000/api/generate');
  const generateInput = page.locator('input:visible');
  await generateInput.nth(0).fill('fisica');
  await page.getByRole('button', { name: /empezar examen/i }).click();
  await expect(page).toHaveURL(/questions\?id=/, { timeout: 20000 });
});

test('logout funciona', async ({ page }) => {
  await page.goto('http://localhost:3000/api/login');
  const inputs = page.locator('input:visible');
  await inputs.nth(0).fill('diazjosuesito25@gmail.com');
  await inputs.nth(1).fill('rebecafer');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).toHaveURL(/\/api$/, { timeout: 10000 });
  await page.goto('http://localhost:3000/api/users');
  await page.getByRole('button', { name: /cerrar sesión/i }).click();
  await expect(page).toHaveURL('http://localhost:3000/', { timeout: 10000 });
});