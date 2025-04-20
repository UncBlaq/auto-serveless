import {z} from 'zod';

const validateLeeds = async function validatLeeds(payload) {
    const schema = z.object({
        email: z.string().email(),
    }).strict();
    const result = schema.safeParse(payload);
    if (result.success) {
        return { data: result.data, error: null, message: "Valid payload" };
    } else {
        return { data: null, error: result.error, message: "Invalid payload" };
    }
}

export { validateLeeds };