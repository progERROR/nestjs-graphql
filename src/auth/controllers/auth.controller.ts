import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  LoggerService,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';
import { Response } from 'express';
import { User } from '../../users/entities/user.entity';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegistrationDto } from '../dto/user-registration.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SignResponse } from '../response-types/sign.response';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  private readonly logger: LoggerService = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiResponse({ status: 201, type: SignResponse })
  @HttpCode(HttpStatus.CREATED)
  public async signUp(
    @Res({ passthrough: true }) response: Response,
    @Body() userRegistrationDto: UserRegistrationDto,
  ): Promise<void> {
    this.logger.log(
      `[SignUp] Of new User with email: ${userRegistrationDto.email}`,
    );
    const user = await this.authService.signUp(userRegistrationDto);

    await this.sendSignInResponse(user, response);
  }

  @Post('/signin')
  @ApiResponse({ status: 200, type: SignResponse })
  @HttpCode(HttpStatus.OK)
  public async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() userLoginDto: UserLoginDto,
  ): Promise<void> {
    this.logger.log(`[SignIn] Of the User with email: ${userLoginDto.email}`);
    const user = await this.authService.signIn(userLoginDto);

    await this.sendSignInResponse(user, response);
  }

  @Post('/logout')
  @ApiResponse({ status: 200 })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public async logOut(
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.sendLogOutResponse(response);
  }

  private async sendSignInResponse(
    user: User,
    response: Response,
  ): Promise<void> {
    const accessToken = await this.authService.getAccessToken(user);
    const accessTokenOptions =
      await this.authService.getAccessTokenCookieOptions();

    response.cookie('AccessToken', accessToken, accessTokenOptions).send({
      user: instanceToPlain(user),
      accessToken,
    });
  }

  private async sendLogOutResponse(response: Response): Promise<void> {
    const signOutCookieOption =
      await this.authService.getSignOutCookieOptions();

    response.cookie('AccessToken', '', signOutCookieOption).sendStatus(200);
  }
}
