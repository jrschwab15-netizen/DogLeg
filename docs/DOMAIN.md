# doglegclub.com

Primary website: https://doglegclub.com/

GitHub Pages serves the main branch of jrschwab15-netizen/DogLeg. The root CNAME file contains doglegclub.com and is copied into dist by the build. HTTPS is enforced after GitHub approved a certificate for both doglegclub.com and www.doglegclub.com.

## DNS

GoDaddy remains the DNS provider. Nameservers, domain-connect, and DMARC records were preserved. The parked apex record was replaced by GitHub Pages addresses:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | jrschwab15-netizen.github.io |

The DNS addresses follow [GitHub's custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). Authoritative DNS and a public resolver returned the configured records. Both HTTPS apex and www requests returned 200 after redirecting to the primary website.

## Supabase

Supabase project DogLeg remains the authentication/database backend at its existing API endpoint. Its Site URL is https://doglegclub.com/, and that exact redirect URL is allowed. The previous GitHub Pages redirect is retained for compatibility. Frontend authentication callbacks now use the primary domain. No paid Supabase API custom-domain add-on was needed or configured.

The domain does not create a second database or move records. Account data stays in the existing private journal table.

## First visit after the domain change

Browser storage is isolated by origin. Users must log in once on doglegclub.com; their Supabase journal can then load, and the session is remembered on the new domain. Local-only records and cached sessions from the old GitHub/file origin are not automatically readable on the new domain. Original browser storage is not deleted. Use an existing V7 export or export from the original standalone file and import after logging in.
