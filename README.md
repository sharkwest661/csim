# Azerbaijan IT Career Simulator

A web-based life simulation game that allows players to experience the journey of an IT professional in Azerbaijan, from education through career development.

## Game Overview

Azerbaijan IT Career Simulator is a simulation game inspired by BitLife, focusing specifically on IT career progression in Azerbaijan. Players begin by creating a character with customizable attributes, family background, and connections that influence their career trajectory.

The game follows a realistic progression starting with pre-university exams, university education, and for male characters, mandatory military service. Throughout their career path, players can develop technical and soft skills, build a professional network, and navigate the Azerbaijani tech industry through various employment opportunities including local companies, international corporations, government positions, and entrepreneurship.

A key feature is the dynamic resume system that automatically documents all player achievements and directly impacts career opportunities. As players progress, their resume evolves from entry-level to executive quality, unlocking new opportunities and advancement paths.

## Features

- **Character Creation**: Customize your character's attributes, skills, and background.
- **Education System**: Navigate university entrance exams, choose your degree, and balance academics with skill development.
- **Military Service**: For male characters, complete mandatory military service while maintaining your IT skills.
- **Career Progression**: Apply for jobs, ace interviews, and climb the corporate ladder.
- **Dynamic Resume**: Watch your resume evolve as you gain experience and skills.
- **Skill Development**: Improve technical and soft skills through various activities and minigames.
- **Work-Life Balance**: Manage energy, stress, and satisfaction throughout your career.
- **Random Events**: Experience unexpected events that can impact your career trajectory.

## Technical Stack

- **Frontend Framework**: React.js with Vite
- **State Management**: Zustand
- **UI Components**: Chakra UI
- **Animations**: Framer Motion
- **Icons**: Lucide Icons
- **Routing**: React Router
- **Data Persistence**: LocalStorage (initial implementation)

## Development

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/azerbaijan-it-sim.git
   cd azerbaijan-it-sim
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser to http://localhost:3000

### Project Structure

```
azerbaijan-it-sim/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Game assets (images, sounds)
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Shared components
│   │   ├── character/       # Character creation components
│   │   ├── resume/          # Resume system components
│   │   ├── education/       # University gameplay components
│   │   ├── career/          # Career simulation components
│   │   ├── dashboard/       # Main game dashboard
│   │   └── minigames/       # Interactive gameplay elements
│   ├── store/               # Zustand store modules
│   │   ├── characterStore.js    # Character state management
│   │   ├── careerStore.js       # Career progression state
│   │   ├── gameEventsStore.js   # Random events management
│   │   └── resumeStore.js       # Resume system state
│   ├── utils/               # Helper functions and utilities
│   ├── pages/               # Main game screens/routes
│   ├── data/                # Game data (static content)
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Application entry point
├── vite.config.js           # Vite configuration
└── package.json             # Project dependencies
```

## Gameplay Flow

1. **Character Creation**: Define your character's gender, family background, attributes, and starting skills.
2. **Education**: Take the university entrance exam, enroll in a university program, and complete semesters.
3. **Military Service**: For male characters, complete mandatory service while maintaining skills.
4. **Career Start**: Apply for entry-level positions, attend interviews, and start building work experience.
5. **Career Advancement**: Progress through different job positions, improve skills, and increase your salary.
6. **Specialization**: Choose to focus on software development, management, entrepreneurship, or other paths.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by BitLife and other life simulation games
- Tailored specifically for the Azerbaijan IT industry context
- Developed with love for IT professionals and students in Azerbaijan
