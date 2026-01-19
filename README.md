# 🎨 3D Interactive Portfolio

A stunning, interactive 3D portfolio website built with React and Three.js, featuring immersive 3D scenes, smooth animations, and an engaging user experience.

## 🌐 Live Demo

**[View Live Demo](https://chloe-le-portfolio.netlify.app/)**

## ✨ Features

- **🎮 Interactive 3D Scenes**: Explore immersive 3D environments with interactive models including islands, characters, and animated elements
- **🔄 Multi-Stage Navigation**: Seamlessly navigate through different sections (Home, Skills, Work Experience, Projects)
- **🎭 Animated 3D Models**: Beautifully rendered 3D models with smooth animations and transitions
- **🎵 Ambient Sound**: Optional background music to enhance the immersive experience
- **💼 Work Experience Timeline**: Interactive timeline showcasing professional experience
- **🛠️ Skills Showcase**: Visual representation of technical skills and expertise
- **📂 Projects Gallery**: Showcase of featured projects with live links
- **✨ Smooth Animations**: GSAP-powered animations for fluid transitions and interactions

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI library
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for React Three Fiber
- **GSAP** - Animation library for smooth transitions
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

### 3D & Graphics
- **@react-three/postprocessing** - Post-processing effects
- **@react-spring/three** - Spring animations for 3D

### Other
- **Vite** - Build tool and development server
- **React Vertical Timeline Component** - Timeline UI component

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chloe-Le97/Portfolio-2025.git
   cd Portfolio-2025
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (if using EmailJS)
   Create a `.env` file in the root directory and add your EmailJS credentials:
   ```env
   VITE_APP_EMAILJS_SERVICE_ID=your_service_id
   VITE_APP_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_APP_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues

## 📁 Project Structure

```
Portfolio-2025/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, icons, 3D models, audio
│   │   ├── 3d/           # GLB/GLTF 3D model files
│   │   ├── icons/        # SVG icons
│   │   └── images/       # Image assets
│   ├── components/       # Reusable React components
│   │   ├── Alert.jsx
│   │   ├── CTA.jsx
│   │   ├── Footer.jsx
│   │   ├── HomeInfo.jsx
│   │   ├── Loader.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProjectsPanel.jsx
│   │   ├── SkillsPanel.jsx
│   │   └── WorkExperience.jsx
│   ├── constants/        # Constants and configuration
│   │   └── index.js      # Skills, experiences, projects data
│   ├── hooks/            # Custom React hooks
│   │   └── useAlert.js
│   ├── models/           # 3D model components
│   │   ├── Bird.jsx
│   │   ├── Island.jsx
│   │   ├── Sky.jsx
│   │   ├── Witch.jsx
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Contact.jsx
│   │   ├── IntroScene.jsx
│   │   └── SceneManager.jsx
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json           # Vercel deployment configuration
```

## 🎮 Usage

### Navigation

- **Scroll or Click**: Use the scroll button or click the arrow to navigate between different stages
- **Interactive 3D Scene**: Click or scrolll to rotate the 3D models
- **Music Toggle**: Click the sound icon in the bottom-left to toggle background music

### Sections

1. **Home** - Introduction and welcome screen
2. **Skills** - Technical skills showcase
3. **Work Experience** - Professional timeline
4. **Projects** - Featured projects gallery

## 🎨 Customization

### Update Personal Information

Edit `src/constants/index.js` to update:
- Skills
- Work experience
- Projects
- Social media links

### Modify 3D Models

Replace GLB files in `src/assets/3d/` and update the corresponding model components in `src/models/`.

### Styling

The project uses Tailwind CSS. Modify `tailwind.config.js` for theme customization or edit component classes directly.

## 🚢 Deployment

This project is configured for deployment on Vercel. The `vercel.json` file includes routing configuration for single-page application support.

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect the Vite configuration
4. Your site will be deployed and you'll get a URL

### Update Demo Link

After deployment, update the demo link in this README file at the top of the document.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Chloe Le**

- GitHub: [@Chloe-Le97](https://github.com/Chloe-Le97)
- LinkedIn: [Chloe Le](https://www.linkedin.com/in/chloe-le-071125168/)

## 🙏 Acknowledgments

- Three.js community for amazing 3D graphics resources
- React Three Fiber team for the excellent React integration
- All the open-source contributors whose libraries made this project possible

---

⭐ If you like this project, please consider giving it a star on GitHub!
