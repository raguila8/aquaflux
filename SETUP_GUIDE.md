# AquaFlux Setup Guide

## Required Setup Steps

### 1. Alchemy Account Kit Setup

**IMPORTANT**: You must complete this step first!

1. Go to https://dashboard.alchemy.com/accounts
2. Sign in with your Alchemy account
3. Accept the Terms of Service for Alchemy Account Kit
4. Your existing API key should then work with Account Kit

### 2. WalletConnect (Reown) Project Setup

The current WalletConnect project ID is either invalid or not configured correctly. You need to:

1. Go to https://cloud.reown.com (this is the new WalletConnect dashboard)
2. Sign in or create an account
3. Create a new project called "AquaFlux"
4. In the project settings, add these domains to the allowlist:
   - `staging.aquaflux.tech`
   - `aquaflux.tech`
   - `localhost:3000`
   - `*.vercel.app` (for preview deployments)
5. Copy the new Project ID

### 3. Update Environment Variables

Update your `.env.local` file with the new WalletConnect project ID:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_new_project_id_here
NEXT_PUBLIC_ALCHEMY_API_KEY=WsRl4toSVOL8xSY2QQcrgpQ6MCHb-8cQ
NEXT_PUBLIC_ETHERSCAN_API_KEY=N6JDYEFIP3544JDTEBFT8VCT4Q8SV5V1IC
NEXT_PUBLIC_FLUX_TOKEN_ADDRESS=0xb6a9d1e420b0dbaa3d137d8aa3d97927f04ea8f9
```

### 4. Vercel Environment Variables

Also update these environment variables in your Vercel dashboard:

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add/Update:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` with the new project ID
   - Ensure all other environment variables are set

### 5. Gas Sponsorship Policy

Your gas sponsorship policy (fb9425f4-229d-4bd0-ad23-0d5c6eab65b9) is configured for Base Sepolia. If you want to use Base mainnet instead:

1. Go to your Alchemy dashboard
2. Navigate to Account Kit > Gas Manager
3. Create a new policy for Base mainnet or update the existing one

## Current Issues Explanation

1. **"You have not signed the Alchemy Accounts terms of service"**
   - This prevents the Alchemy Account Kit from working
   - Must be resolved by accepting terms at dashboard.alchemy.com/accounts

2. **"Project not found" (WalletConnect)**
   - The project ID `b5de3f0a0e7e4c8f9c7f8d3f7a8c9e1f` is invalid or deleted
   - Need to create a new project at cloud.reown.com

3. **"Origin not found on Allowlist"**
   - The domain `staging.aquaflux.tech` is not allowlisted in WalletConnect
   - Add it in the project settings at cloud.reown.com

## Temporary Fix Applied

I've updated the Alchemy configuration to only enable WalletConnect if a valid project ID is provided. This prevents the errors from blocking the entire application.

## Testing After Setup

After completing the above steps:

1. Run locally: `pnpm run dev`
2. Test the sign-in button - it should open the Alchemy modal
3. If WalletConnect is configured, you'll see wallet options
4. If not configured, you'll see other auth methods (if any are enabled)

## Support

- Alchemy Documentation: https://docs.alchemy.com/docs/account-kit
- Reown (WalletConnect) Documentation: https://docs.reown.com
- Alchemy Support: support@alchemy.com