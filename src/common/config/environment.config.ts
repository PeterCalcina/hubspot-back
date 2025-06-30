export interface EnvironmentConfig {
  supabase: { jwtSecret: string; dbUrl: string; directUrl: string };
  hubspot: { clientId: string; clientSecret: string; redirectUrl: string };
}

export const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = process.env;
  const supabaseJwtSecret = env.SUPABASE_JWT_SECRET;
  const supabaseDbUrl = env.DATABASE_URL;
  const supabaseDirectUrl = env.DATABASE_URL;
  const hubspotClientId = env.HUBSPOT_CLIENT_ID;
  const hubspotClientSecret = env.HUBSPOT_CLIENT_SECRET;
  const hubspotRedirectUrl = env.HUBSPOT_REDIRECT_URI;

  if (!supabaseJwtSecret || !supabaseDbUrl || !supabaseDirectUrl) {
    throw new Error('Supabase environment variables are not properly set.');
  }

  if (!hubspotClientId || !hubspotClientSecret || !hubspotRedirectUrl) {
    throw new Error('HubSpot environment variables are not properly set.');
  }

  return {
    supabase: {
      jwtSecret: supabaseJwtSecret,
      dbUrl: supabaseDbUrl,
      directUrl: supabaseDirectUrl,
    },
    hubspot: {
      clientId: hubspotClientId,
      clientSecret: hubspotClientSecret,
      redirectUrl: hubspotRedirectUrl,
    },
  };
};
