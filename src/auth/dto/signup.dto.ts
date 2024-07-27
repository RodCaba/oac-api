export class SignupResponseDto {
  success: boolean;
  message: string;
  data: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export class SignupUserResponseDto {
  success: boolean;
  message: string;
  data: {
    email: string;
    firstName: string;
    lastName: string;
    signupToken: string;
  };
}
