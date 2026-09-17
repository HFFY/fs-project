/**
 * Unico lugar donde el backend lee variables de entorno.
 *
 * Los valores sensibles (DATABASE_URL, JWT_SECRET) nunca se escriben en el
 * codigo: llegan desde backend/.env en local, desde docker-compose en Docker
 * y desde GitHub Secrets en el pipeline. Si falta alguno, el servidor no
 * arranca, en lugar de firmar tokens con un valor vacio o inventado.
 */
function required(name: string): string {
    const value = process.env[name];
    if (!value || value.trim() === "") {
        throw new Error(
            `Falta la variable de entorno ${name}. Copia backend/.env.example a backend/.env y completala.`
        );
    }
    return value;
}

export function loadConfig() {
    return {
        databaseUrl: required("DATABASE_URL"),
        jwtSecret: required("JWT_SECRET"),
        port: Number(process.env.PORT ?? 3000),
    };
}
