import { ZodIssue } from "zod";

const getZodErrorObj = (errors: ZodIssue[]) => {
  return errors.reduce(
    (acc, el) => {
      acc[el.path.join(".")] = el.message;

      return acc;
    },
    {} as { [key: string]: string }
  );
};

export default getZodErrorObj;
