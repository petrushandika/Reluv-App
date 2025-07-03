import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { GoogleService } from './google.service';
import { GoogleDto } from './dto/google.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly googleService: GoogleService,
  ) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error(
        'Google OAuth credentials are not configured in .env file',
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    if (!profile.emails || profile.emails.length === 0) {
      return done(new Error('No email found in Google profile'), false);
    }

    const { id, name, emails } = profile;

    const googleDto = new GoogleDto();
    googleDto.googleId = id;
    googleDto.email = emails[0].value;
    googleDto.firstName = name?.givenName ?? null;
    googleDto.lastName = name?.familyName ?? null;

    const user = await this.googleService.validateUser(googleDto);

    done(null, user);
  }
}
