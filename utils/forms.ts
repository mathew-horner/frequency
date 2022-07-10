import { FormikHelpers } from "formik";

export type FormikOnSubmitHandler<T> = (
  values: T,
  actions: FormikHelpers<T>
) => Promise<void>;

/**
 * Wraps an async action that the consumer writes for handling a Formik form submission
 * with logic to properly set the `submitting` field.
 */
export function formikOnSubmitHandler<T>(
  handler: FormikOnSubmitHandler<T>
): FormikOnSubmitHandler<T> {
  return (values, actions) => {
    actions.setSubmitting(true);
    return handler(values, actions).finally(() => actions.setSubmitting(false));
  };
}

// ========================================================================================
// Vendored from https://github.com/robertLichtnow/zod-formik-adapter/blob/master/index.ts
//
// Was running into dependency issues... if they ever sort those out, we can just use
// their package.

import { z } from "zod";

export class ValidationError extends Error {
  public name = "ValidationError";

  public inner: Array<{ path: string; message: string }> = [];

  public constructor(message: string) {
    super(message);
  }
}

function createValidationError(e: z.ZodError) {
  const error = new ValidationError(e.message);
  error.inner = e.errors.map((err) => ({
    message: err.message,
    path: err.path.join("."),
  }));

  return error;
}

/**
 * Wrap your zod schema in this function when providing it to Formik's validation schema prop
 * @param schema The zod schema
 * @returns An object containing the `validate` method expected by Formik
 */
export function toFormikValidationSchema<T>(
  schema: z.ZodSchema<T>,
  params?: Partial<z.ParseParams>
): { validate: (obj: T) => Promise<void> } {
  return {
    async validate(obj: T) {
      try {
        await schema.parseAsync(obj, params);
      } catch (err: unknown) {
        throw createValidationError(err as z.ZodError<T>);
      }
    },
  };
}
