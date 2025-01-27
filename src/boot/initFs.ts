import { FsDBUpgradeTX } from '@/db/fs';
import {
  OLD_WORKING_DIR_KEY,
  ROOT_DIR_INODE_ID_KEY,
  WORKING_DIR_INODE_ID_KEY,
  WORKING_DIR_KEY,
} from '@/shell/constants';

export default async function initFs(tx: FsDBUpgradeTX) {
  const inodes = tx.objectStore('inodes');
  const blobs = tx.objectStore('blobs');

  async function createFileFromBlob(blob: Blob) {
    const now = new Date();

    const blobId = await blobs.add(blob);
    const inodeId = await inodes.add({
      mode: 'file',
      size: blob.size,
      accessedTime: now,
      modifiedTime: now,
      createdTime: now,
      linkCount: 1,
      blobId,
    });

    return inodeId;
  }

  async function createDirectoryFromMap(
    map: SimpleFileMap,
    parentDirInodeId: number | undefined
  ): Promise<number> {
    const directoryBlobId = await blobs.add(new Blob());
    const now = new Date();
    const directoryInodeId = await inodes.add({
      mode: 'directory',
      size: 0,
      accessedTime: now,
      modifiedTime: now,
      createdTime: now,
      linkCount: 1,
      blobId: directoryBlobId,
    });

    const directoryEntries = new Map([
      ['.', directoryInodeId],
      ['..', parentDirInodeId ?? directoryInodeId],
    ]);

    for (const [name, value] of map.entries()) {
      if (value instanceof Blob) {
        const inodeId = await createFileFromBlob(value);
        directoryEntries.set(name, inodeId);
      } else {
        const inodeId = await createDirectoryFromMap(value, directoryInodeId);
        directoryEntries.set(name, inodeId);
      }
    }

    const directoryContentString = directoryEntries
      .entries()
      .toArray()
      .map((pair) => pair.join('\t'))
      .join('\n');

    return await blobs.put(new Blob([directoryContentString]), directoryBlobId);
  }

  const rootInodeId = await createDirectoryFromMap(initialFileMap, undefined);

  localStorage.setItem(ROOT_DIR_INODE_ID_KEY, rootInodeId.toString());
  localStorage.setItem(WORKING_DIR_INODE_ID_KEY, rootInodeId.toString());
  localStorage.setItem(WORKING_DIR_KEY, '/');
  localStorage.setItem(OLD_WORKING_DIR_KEY, '/');
}

type SimpleFileMap = Map<string, Blob | SimpleFileMap>;

function createUrlFile(link: string): Blob {
  return new Blob([
    `[InternetShortcut]
URL=${link}
`,
  ]);
}

const initialFileMap: SimpleFileMap = new Map<string, Blob | SimpleFileMap>([
  [
    'README.md',
    new Blob([
      `# rmsh (Ronan McCarter Shell)

rmsh is a browser-based shell, which attempts to emulate the bash shell and some common bash commands.

I started this project because I wanted to build something cool and interactive for my personal website,
and since I've always loved the experience of navigating and exploring via the shell, I figured I'd give
others the opportunity to do the same.

The file system is backed by IndexedDB, and implements a lite version of Linux inodes.

The behavior of all commands is intended to replicate their behavior on My Machine (darwin 24.1.0).
Only a few commands have been implemented, and many of those lack some functionality or other.

The code for this project can be found at https://github.com/rpmccarter/rpmccarter.github.io
`,
    ]),
  ],
  [
    'links',
    new Map([
      ['linkedin.url', createUrlFile('https://linkedin.com/in/rpmccarter')],
      [
        'email.txt',
        new Blob([['.com', 'gmail', '@', 'rpmccarter'].reverse().join('')]),
      ],
      ['github.url', createUrlFile('https://github.com/rpmccarter')],
      [
        'resume.url',
        createUrlFile(
          'https://drive.google.com/file/d/1GTAgIQ32n6Cb3OlDoY1keHmf3O-AMpSu/view?usp=drive_link'
        ),
      ],
      [
        'repo.url',
        createUrlFile('https://github.com/rpmccarter/rpmccarter.github.io'),
      ],
    ]),
  ],
  [
    'experience',
    new Map([
      [
        'mintlify.txt',
        new Blob([
          `mintlify
founding engineer
apr 2023 – jan 2025
san francisco, ca

- incepted, implemented, and launched self-serve authenticated docs for enterprise customers
- updated AWS infrastructure, unlocking autoscaling, improving observability, and simplifying deployments
- rebuilt customer-facing local development tool, 10x’ing install speed, first page load speed, and hot-reload speed
- crafted engineer interview process, creating 7 technical assessments and conducting hundreds of interviews
- replaced 3,000-line Go microservice with 100 lines of TypeScript
- rearchitected Next.js frontend and API playground, while vastly simplifying React state management
- performed codebase-wide security audit, fixing several vulnerabilities and protecting against future issues

used TypeScript, Next.js, Express, AWS, MongoDB
`,
        ]),
      ],
      [
        'retool.txt',
        new Blob([
          `retool
software engineer, full stack
jul 2022 - mar 2023
san francisco, ca

- expanded in-house feature flagging framework to enable targeting specific customers by plan in staged rollout
- implemented passwordless login across all mobile devices and reduced friction in SSO account creation flows
- drove product adoption by curating a first experience for new Retool Mobile users
- developed user-facing sample Retool apps leveraged by go-to-market team in product launches

used TypeScript, React, Redux, SQL, Sequelize
`,
        ]),
      ],
      [
        'amazon.txt',
        new Blob([
          `amazon
software development engineer intern
may 2021 - aug 2021
boston, ma

- automated UI testing of 40 user experiences across 14 Alexa-enabled devices, saving the team at least 4
engineer-hours per week and drastically decreasing human error
- architected and deployed a scalable serverless UI testing solution using AWS’s infrastructure-as-code
- optimized performance for long-term high-volume storage and bursts of computation-intensive traffic

used TypeScript, AWS CDK, Jest
`,
        ]),
      ],
      [
        'stelo.txt',
        new Blob([
          `stelo e-commerce startup
lead engineer, full stack
jul 2020 - may 2022
notre dame, in

- designed/implemented MVP , consisting of iOS app and Python backend, for e-commerce apparel platform
- directed product roadmap and feature prioritization by communicating realistic milestones to founders

used Swift, Python, Django REST, Heroku
`,
        ]),
      ],
    ]),
  ],
  [
    'education.txt',
    new Blob([
      `university of notre dame
bachelor of science, computer science
may 2022
notre dame, in
3.97/4.00 gpa
`,
    ]),
  ],
]);
