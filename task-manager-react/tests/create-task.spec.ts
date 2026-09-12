import { test, expect } from '@playwright/test';

type Task = { id: number; text: string; completed: boolean };

/**
 * Mockea la API de tareas (http://localhost:3000) para que el test no dependa
 * del backend. Mantiene las tareas en memoria durante el test.
 */
async function mockTasksApi(page: import('@playwright/test').Page) {
  const tasks: Task[] = [];
  let nextId = 1;

  await page.route('http://localhost:3000/tasks', async (route) => {
    const request = route.request();

    if (request.method() === 'GET') {
      await route.fulfill({ json: tasks });
      return;
    }

    if (request.method() === 'POST') {
      const { text } = request.postDataJSON() as { text: string };
      const newTask: Task = { id: nextId++, text, completed: false };
      tasks.push(newTask);
      await route.fulfill({ status: 201, json: newTask });
      return;
    }

    await route.continue();
  });

  return tasks;
}

test('crea una nueva tarea desde la pantalla principal', async ({ page }) => {
  await mockTasksApi(page);

  // 1. Entrar a la pantalla principal de tareas
  await page.goto('/home');

  // Al inicio no hay tareas
  await expect(page.getByText('No hay tareas todavía, Agrega una nueva tarea.')).toBeVisible();

  // 2. Crear una nueva tarea
  const taskText = 'Comprar pan';
  await page.getByPlaceholder('Escribe una tarea').fill(taskText);
  await page.getByRole('button', { name: 'Agregar' }).click();

  // 3. Validar que la tarea quedó creada
  const task = page.getByRole('listitem').filter({ hasText: taskText });
  await expect(task).toBeVisible();
  await expect(task.getByRole('button', { name: 'Completar' })).toBeVisible();

  // El estado vacío ya no se muestra y el input se limpió
  await expect(page.getByText('No hay tareas todavía, Agrega una nueva tarea.')).toBeHidden();
  await expect(page.getByPlaceholder('Escribe una tarea')).toHaveValue('');
});
