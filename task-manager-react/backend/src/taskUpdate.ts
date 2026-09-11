/**
 * Funcion pura: arma el objeto `data` que se le pasa a Prisma en
 * PUT /tasks/:id a partir del body de la peticion.
 *
 * No toca la base de datos, no lee `req`/`res` ni ningun estado global:
 * el resultado depende unicamente del objeto recibido.
 */

export type TaskUpdateInput = {
    text?: unknown;
    completed?: unknown;
};

export type TaskUpdateData = {
    text?: string;
    completed?: boolean;
};

export function buildTaskUpdate(input: TaskUpdateInput): TaskUpdateData {
    const { text, completed } = input;
    const dataToUpdate: TaskUpdateData = {};

    if (typeof text === "string" && text.trim() !== "") {
        dataToUpdate.text = text;
    }
    if (typeof completed === "boolean") {
        dataToUpdate.completed = completed;
    }

    return dataToUpdate;
}
