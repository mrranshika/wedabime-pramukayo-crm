# DEPLOYMENT GUIDE

## 🚀 Part 1: GitHub Deployment

### 1. Create GitHub Repository
1. Go to https://github.com
2. Click "+" → "New repository"
3. Name: `tech-master-crm`
4. Description: `TECH MASTER CRM - Wedabime Pramukayo`
5. Public (recommended)
6. Don't initialize with README
7. Click "Create repository"

### 2. Push to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/tech-master-crm.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel (Recommended)
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Add environment variables:
   - `DATABASE_URL`: `file:./db/custom.db`
   - `JWT_SECRET`: `your-secret-key-here`
6. Click "Deploy"

## 🔗 Part 2: Google Sheets Integration

### 1. Update Your Google Apps Script
1. Open your Google Sheet
2. Go to "Extensions" → "Apps Script"
3. Replace the existing code with the updated version from `google-apps-script-updated.js`
4. Save the project

### 2. Update Sheet Structure
Make sure your sheet has these columns in order:
| A | B | C | D | E | F | G | H | I | J | K | L | M | N |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Date | Customer ID | Name | Address | Phone | Email | Gutter | Ceiling | Roof | Status | Notes | Paid | Total | Status |

### 3. Deploy Web App
1. In Apps Script editor, click "Deploy" → "New deployment"
2. Type: "Web app"
3. Description: "TECH MASTER CRM API"
4. Execute as: "Me" (your Google account)
5. Who has access: "Anyone" (for API access)
6. Click "Deploy"
7. Copy the Web app URL

### 4. Configure Next.js App
1. Update `src/lib/google-sheets.ts`:
   ```typescript
   const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/YOUR_WEB_APP_URL/exec";
   ```
   Replace `YOUR_WEB_APP_URL` with the URL you copied.

2. Replace the API route files:
   - `src/app/api/customers/route.ts` → use `route-updated.ts`
   - `src/app/api/dashboard/route.ts` → use `route-updated.ts`

### 5. Test Integration
1. Deploy your Next.js app to Vercel
2. Test all CRM functions:
   - Customer creation
   - Payment updates
   - Dashboard statistics
   - Search and filtering

## 🌐 Part 3: Production Setup

### Environment Variables for Vercel
```
DATABASE_URL=file:./db/custom.db
JWT_SECRET=your-super-secret-jwt-key
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret
```

### Custom Domain (Optional)
1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Update DNS records as instructed

## 📱 Part 4: Mobile App (Future)

### React Native Setup
```bash
npx react-native init TechMasterCRM
cd TechMasterCRM
npm install @react-navigation/native @react-navigation/stack
```

### Key Features for Mobile
- Push notifications for new customers
- Offline mode support
- Mobile-optimized forms
- GPS integration for site visits

## 🔧 Part 5: Maintenance

### Regular Tasks
1. **Backup Google Sheets**: Download weekly
2. **Monitor API usage**: Check Google Sheets quotas
3. **Update dependencies**: Monthly security updates
4. **Performance monitoring**: Use Vercel Analytics

### Troubleshooting
- **Google Sheets API limits**: 30,000 requests/day
- **CORS issues**: Ensure Apps Script is deployed correctly
- **Authentication**: Check JWT tokens and cookies

## 📊 Part 6: Analytics & Monitoring

### Google Analytics 4
1. Create GA4 property
2. Add tracking script to `app/layout.tsx`
3. Track key events:
   - User registrations
   - Payment additions
   - Status changes

### Error Tracking
Consider using Sentry for error tracking:
```bash
npm install @sentry/nextjs
```

---

## 🎯 Quick Start Checklist

- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Deploy to Vercel
- [ ] Update Google Apps Script
- [ ] Configure Google Sheets structure
- [ ] Deploy Apps Script as Web App
- [ ] Update Next.js configuration
- [ ] Test all functionality
- [ ] Set up custom domain (optional)
- [ ] Configure analytics (optional)

Your TECH MASTER CRM will be live and integrated with Google Sheets! 🚀