import {
	car,
	css,
	express,
	git,
	github,
	html,
	javascript,
	linkedin,
	nodejs,
	pricewise,
	react,
	sass,
	tailwindcss,
	threads,
	typescript,
	wordpress
} from "../assets/icons";
import { liana, virtual } from "../assets/images";

export const skills = [
    {
        imageUrl: css,
        name: "CSS",
        type: "Frontend",
    },
    {
        imageUrl: express,
        name: "Express",
        type: "Backend",
    },
    {
        imageUrl: git,
        name: "Git",
        type: "Version Control",
    },
    {
        imageUrl: github,
        name: "GitHub",
        type: "Version Control",
    },
    {
        imageUrl: html,
        name: "HTML",
        type: "Frontend",
    },
    {
        imageUrl: javascript,
        name: "JavaScript",
        type: "Frontend",
    },
	{
		imageUrl: wordpress,
		name: "WordPress",
		type: "Frontend",
	},
    {
        imageUrl: nodejs,
        name: "Node.js",
        type: "Backend",
    },
    {
        imageUrl: react,
        name: "React",
        type: "Frontend",
    },
    {
        imageUrl: sass,
        name: "Sass",
        type: "Frontend",
    },
    {
        imageUrl: tailwindcss,
        name: "Tailwind CSS",
        type: "Frontend",
    },
    {
        imageUrl: typescript,
        name: "TypeScript",
        type: "Frontend",
    }
];

export const experiences = [
    {
        title: "Frontend Developer",
        company_name: "Liana Technologies",
        icon: liana,
        iconBg: "#fffffff2",
        date: "May 2021 - Now",
        points: [
            "Developing and maintaining website using Wordpress, React.js, PHP, Javascript and other related technologies.",
            "Leading frontend development for 5 projects.",
            "Implementing responsive design and ensuring cross-browser compatibility.",
            "Leading internal training and external training for 5 projects.",
        ],
    },
    {
        title: "Frontend Developer Trainee",
        company_name: "Virtual Connections",
        icon: virtual,
        iconBg: "#fffffff2",
        date: "Jan 2021 - May 2021",
        points: [
            "Developing and maintaining web applications using React.js, Firebase, Docker, and other related technologies.",
            "Developing an innovative startup educational platform for online teaching and learning",
            "Implementing a responsive design and ensuring cross-browser compatibility from Figma design",
            "Implementing efficient communication for CRUD operations using React.js and Firebase",
			"Styling the application with SASS and Tailwind CSS"
        ],
    },
];

export const socialLinks = [
    // {
    //     name: 'Contact',
    //     iconUrl: contact,
    //     link: '/contact',
    // },
    {
        name: 'GitHub',
        iconUrl: github,
        link: 'https://github.com/Chloe-Le97',
    },
    {
        name: 'LinkedIn',
        iconUrl: linkedin,
        link: 'https://www.linkedin.com/in/chloe-le-071125168/',
    }
];

export const projects = [
    {
        iconUrl: pricewise,
        theme: 'btn-back-red',
        name: 'Full Stack personal financial management application',
        description: 'Developing a personal financial management application that allows users to track income, expenses, set financial goals, and visualize savings progress. The app enables users to have greater control over their finances and track their financial journey. Built with React.js, Node.js, Express.js, PostgreSQL, and Tailwind CSS.',
        link: 'https://github.com/Chloe-Le97/budgeting-app',
    },
    {
        iconUrl: threads,
        theme: 'btn-back-green',
        name: 'Wedding invitation website',
        description: 'Developing a wedding invitation website using React.js and Tailwind CSS',
        link: 'https://thao-anh-wedding.netlify.app/',
    },
    {
        iconUrl: car,
        theme: 'btn-back-blue',
        name: 'Instagram Clone',
        description: 'Developing a Instagram clone using React.js, Firebase and Tailwind CSS',
        link: 'https://github.com/Chloe-Le97/instagram-clone',
    },
];