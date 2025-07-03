import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { FacebookService } from './facebook.service';
import { FacebookDto } from './dto/facebook.dto';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly configService: ConfigService,
    private readonly facebookService: FacebookService,
  ) {
    const clientID = configService.get<string>('FACEBOOK_APP_ID');
    const clientSecret = configService.get<string>('FACEBOOK_APP_SECRET');
    const callbackURL = configService.get<string>('FACEBOOK_CALLBACK_URL');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error(
        'Facebook Auth credentials are not configured in .env file',
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'public_profile'],
      profileFields: ['id', 'name', 'emails'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { id, name, emails } = profile;

    const facebookDto = new FacebookDto();
    facebookDto.facebookId = id;
    facebookDto.email = emails?.[0]?.value ?? null;
    facebookDto.firstName = name?.givenName ?? null;
    facebookDto.lastName = name?.familyName ?? null;

    const user = await this.facebookService.validateUser(facebookDto);

    done(null, user);
  }
}
