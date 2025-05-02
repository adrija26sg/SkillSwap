# SkillSwap Platform

A peer-to-peer micro mentorship app that lets users connect and exchange skills, promoting collaborative learning through time-based swaps.

## Features

- User authentication and profiles
- Skill listing and searching
- Time-based skill exchange system
- Rating and review system
- Real-time messaging between users
- Skill matching algorithm

## Tech Stack

- React.js
- React Router for navigation
- Tailwind CSS for styling
- Firebase for authentication and database
- Axios for API calls

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/skillswap.git
cd skillswap
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

   - Copy the `.env.example` file to a new file named `.env`:

   ```bash
   cp .env.example .env
   ```

   - Open the `.env` file and replace the placeholder values with your Firebase configuration:

   ```
   REACT_APP_FIREBASE_API_KEY=your_actual_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   ...
   ```

   You can find these values in your Firebase project settings.

4. Start the development server:

```bash
npm start
```

The app will be available at `http://localhost:3000`

## Environment Variables

This project uses environment variables to store sensitive information like Firebase configuration. These variables are stored in a `.env` file at the root of the project.

**Important:** Never commit your `.env` file to version control. It contains sensitive API keys and credentials.

Required environment variables:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Project Structure

```
skillswap/
├── public/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React context providers
│   ├── features/         # Feature-specific components
│   │   ├── auth/
│   │   ├── profile/
│   │   ├── skills/
│   │   └── messaging/
│   ├── services/         # API and service functions
│   ├── utils/            # Utility functions
│   ├── App.js            # Main app component
│   ├── firebase.js       # Firebase configuration
│   └── index.js          # Entry point
├── .env                  # Environment variables (not in version control)
├── .env.example          # Example environment variables template
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
