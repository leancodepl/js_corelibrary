local claims = {
  email_verified: false,
} + std.extVar('claims');

{
  identity: {
    traits: {
      [if 'email' in claims && claims.email_verified then 'email' else null]: claims.email,
    },
    metadata_admin: {
      apple_claims: std.extVar('claims'),
    },
    verified_addresses: std.prune([
      if 'email' in claims && claims.email_verified then { via: 'email', value: claims.email },
    ]),
  },
}
