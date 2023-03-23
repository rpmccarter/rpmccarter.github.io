export type Position = {
    company: string
    title: string
    location: string
    start: string
    end?: string
    bullets: string[]
    technologies?: string[]
}

export const positions: Position[] = [
    {
        company: 'Retool',
        title: 'Software Engineer, Full Stack',
        location: 'San Francisco, CA',
        start: 'July 2022',
        end: 'March 2023',
        bullets: [
            'Expanded in-house feature flagging framework to enable targeting specific customers by plan in staged rollout',
            'Implemented passwordless login across all mobile devices and reduced friction in SSO account creation flows',
            'Drove product adoption by curating a first experience for new Retool Mobile users',
            'Developed user-facing sample Retool apps leveraged by go-to-market team in product launches',
        ],
        technologies: [
            'TypeScript',
            'React',
            'Redux',
            'SQL',
            'Sequelize',
        ],
    },
    {
        company: 'Amazon',
        title: 'Software Development Engineer Intern',
        location: 'Boston, MA',
        start: 'May 2021',
        end: 'August 2021',
        bullets: [
            'Automated UI testing of 40 user experiences across 14 Alexa-enabled devices, saving the team at least 4 engineer-hours per week and drastically decreasing human error', 
            'Architected and deployed a scalable serverless UI testing solution using AWS’s infrastructure-as-code', 
            'Optimized performance for long-term high-volume storage and bursts of computation-intensive traffic', 
        ],
        technologies: [
            'Typescript',
            'AWS CDK',
            'Jest',
        ]
    },
]