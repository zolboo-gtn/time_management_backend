import { ValidationError } from "class-validator";

export class CustomValidationError {
  constructor(public errors: ValidationError[]) {}
}

// export class CustomValidationError extends Error implements ValidationError {
//   constructor(
//     public property: string,
//     public publictarget?: object,
//     public value?: any,
//     public constraints?: { [type: string]: string },
//     public children?: ValidationError[],
//     public contexts?: { [type: string]: any },
//   ) {
//     super();
//   }

//   toString(
//     shouldDecorate?: boolean,
//     hasParent?: boolean,
//     parentPath?: string,
//   ): string {
//     throw new Error("Method not implemented.");
//   }
// }
