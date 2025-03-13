# Property Site Template

This is a template for creating property rental websites for Airbnb hosts. It's built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- Modern, responsive design
- Property details display
- Photo gallery with lightbox
- Amenities showcase
- Location information
- Booking system with availability checking
- Stripe payment integration
- Email notifications
- Google Calendar integration

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account
- Stripe account
- Resend account (for email notifications)
- Google Calendar API credentials

### Installation

1. Clone this repository to your local machine:

```bash
git clone https://github.com/yourusername/property-site-template.git
cd property-site-template
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Stripe Configuration (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Email Configuration (Using Resend)
RESEND_API_KEY=re_your-resend-api-key
EMAIL_FROM=bookings@yourpropertysite.com

# Property Configuration
NEXT_PUBLIC_PROPERTY_ID=your-property-id

# Admin Configuration
ADMIN_EMAIL=your-admin-email@example.com

# Google Calendar
GOOGLE_CALENDAR_ID=your-calendar-id
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## External Services Configuration

### Supabase Setup

1. Create a new project in [Supabase](https://supabase.com/)
2. Go to Project Settings > API to get your project URL and API keys
3. Add the URL and keys to your `.env.local` file
4. Use the SQL editor in Supabase to create the necessary tables:
   - properties
   - bookings
   - hosts
   - availability
   - custom_pricing
   - seasonal_pricing
   - website_settings

The schema for these tables follows the types defined in `src/lib/supabase.ts`.

### Stripe Setup

1. Create an account on [Stripe](https://stripe.com/)
2. Go to Developers > API keys to get your publishable and secret keys
3. Add these keys to your `.env.local` file
4. To set up webhooks for payment notifications:
   - Go to Developers > Webhooks
   - Create a new webhook endpoint with URL: `https://your-domain.com/api/webhooks/stripe`
   - Subscribe to the `checkout.session.completed` event
   - Copy the signing secret and add it as `STRIPE_WEBHOOK_SECRET` in `.env.local`
   - For local testing, use [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward events

### Email Notifications Setup (Resend)

1. Create an account on [Resend](https://resend.com/)
2. Create a new API key from the dashboard
3. Add the API key to your `.env.local` file as `RESEND_API_KEY`
4. Set `EMAIL_FROM` to an email address you've verified in Resend

Email templates are defined in `src/utils/email.ts`.

## Customization

### Property Data

The property data is fetched from Supabase using the property ID specified in the environment variables. For development, sample data is provided in the `src/app/page.tsx` file.

### Styling

The site uses Tailwind CSS for styling. You can customize the colors, fonts, and other design elements in the `tailwind.config.js` file.

### Components

The site is built with reusable components that you can customize:

- `Header.tsx`: Navigation bar
- `Footer.tsx`: Footer with contact information and links
- `PropertyHero.tsx`: Hero section with property title and key details
- `AmenitiesSection.tsx`: Display of property amenities
- `PhotoGallery.tsx`: Photo gallery with lightbox
- `LocationSection.tsx`: Location information and map
- `BookingForm.tsx`: Booking form with availability checking

## Deployment

This template is designed to be deployed on Vercel. Each property site should be in its own repository and connected to the same Supabase database.

1. Push your repository to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details. 