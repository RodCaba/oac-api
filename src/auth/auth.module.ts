import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: async () => {
        console.log('JWT_SECRET', process.env.JWT_SECRET);
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '10s' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
