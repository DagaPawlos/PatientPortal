export class Validator {
  validate(body: Record<string, unknown>, allowedFields: string[]) {
    const keys = Object.keys(body);
    const isValidOperation = keys.every((key) => allowedFields.includes(key));
    return isValidOperation;
  }
}
