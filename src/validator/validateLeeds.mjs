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

const validateWithZod = (schema) => {
    return (req, res, next) => {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ errors: result.error.format() });
      }
      req.validatedData = result.data;
      next();
    };
  };

export { validateLeeds, validateWithZod };