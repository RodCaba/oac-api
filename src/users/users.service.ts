import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateAdminDto, CreateUserDto } from './dto/create-user.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/auth/enums/roles';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  private saltRounds = 20;
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private mailService: MailService,
  ) {}

  create(createAdminDto: CreateAdminDto): Promise<User> {
    const createdUser = new this.userModel(createAdminDto);
    return createdUser.save();
  }

  async createUser(createUserWithTokenDto: CreateUserDto): Promise<User> {
    const token = crypto.randomBytes(4).toString('hex').toUpperCase();
    const hashedToken = await bcrypt.hash(token, this.saltRounds);
    const data = {
      ...createUserWithTokenDto,
      signupToken: hashedToken,
      roles: createUserWithTokenDto.isManager ? [Roles.MANAGER] : [Roles.USER],
    };

    await this.mailService.sendEmail(
      'Your Signup Token',
      [
        {
          email: createUserWithTokenDto.email,
          name: createUserWithTokenDto.firstName
            ? createUserWithTokenDto.firstName
            : '',
        },
      ],
      'To complete your signup, please use the following token: ' +
        token +
        ' . ' +
        'Use the following link to complete your signup: http://localhost:3000/signup-user?projectId=' +
        createUserWithTokenDto.projectId,
    );

    const createdUser = new this.userModel(data);
    return createdUser.save();
  }

  findOne(id: ObjectId): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  findByEmailIncludePass(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }
}
