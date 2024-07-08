export class SignupResponseDto {
  success: boolean;
  message: string;
  data: {
    firstName: string;
    lastName: string;
    email: string;
  };
}
