/*
interface define os tipos de um conjunto de informações, geralmente um objeto
*/
interface TechObject {
    title: string;
    experience: number;
}

interface CreateUserData {
    name?: string; //? indica que esta variável não é obrigatória
    email: string;
    password: string;
    techs: Array<string | TechObject>; //esse array pode ser do tipo string ou TechObject
}

export default function createUser({ name, email, password }: CreateUserData) {
    const user = {
        name,
        email,
        password,
    }

    return user;
}