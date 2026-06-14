# SOC Shield

A comprehensive **Security Operations Center (SOC)** dashboard and browser security tool built with modern web technologies. SOC Shield provides real-time security monitoring, threat tracking, incident management, and security analytics for organizations.

## 🎯 Features

- **Security Monitoring Dashboard**: Real-time visibility into security events and incidents
- **Threat Detection & Analysis**: Track and analyze security threats across your infrastructure
- **Incident Management**: Create, manage, and resolve security incidents efficiently
- **Security Analytics**: Visualize security metrics and trends with interactive charts
- **User Management**: Role-based access control for security team members
- **PDF Report Generation**: Export security reports and incident details as PDF documents
- **Browser Security Integration**: Browser-based security shield for enhanced protection
- **Rate Limiting**: Built-in rate limiting for API security
- **Authentication**: Secure user authentication with JWT and bcrypt encryption

## 🚀 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) 16 with React 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4
- **Database**: PostgreSQL with Supabase
- **Authentication**: Supabase SSR, JWT (Jose)
- **Security**: bcryptjs for password hashing
- **Rate Limiting**: Upstash Redis & Rate Limit API
- **Charts & Visualization**: Recharts
- **PDF Generation**: jsPDF with AutoTable
- **UI Components**: Lucide React icons, Sonner notifications
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Supabase account and project
- Upstash Redis instance (for rate limiting)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ahmed-hashamm/soc-shield.git
   cd soc-shield
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_token
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
soc-shield/
├── app/                 # Next.js app directory
├── components/          # React components
├── lib/                 # Utility functions and helpers
├── public/              # Static assets
├── styles/              # Global styles and Tailwind config
├── pages/               # API routes and pages
├── types/               # TypeScript type definitions
└── package.json         # Project dependencies
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication via Jose
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Prevent abuse with Upstash rate limiting
- **Supabase Auth**: Built-in row-level security policies
- **HTTPS/TLS**: Secure communication over HTTPS

## 📊 Main Capabilities

### Dashboard
- Real-time security event feed
- Key metrics and KPIs
- Threat intelligence summary

### Incident Management
- Create and track security incidents
- Assign incidents to team members
- Update incident status and severity
- Add incident notes and timeline

### Reports
- Generate PDF reports with incident details
- Export security metrics and analytics
- Schedule automated reports

### User Management
- Team member access control
- Role-based permissions
- User audit logs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is currently unlicensed. Please see the repository for more details.

## 📞 Support

For questions or issues, please open a GitHub issue in the repository.

## 🔗 Links

- [GitHub Repository](https://github.com/ahmed-hashamm/soc-shield)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Built with ❤️ for security teams**
