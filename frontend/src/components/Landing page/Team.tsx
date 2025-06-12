import React from "react";
import AryanImage from "./images/aryan.jpg";
import Suraj from "./images/suraj.jpg";
import Om from "./images/om.jpg";
import Srujan from "./images/srujan.jpg";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    github?: string;
    custom?: string;
  };
}

const team: TeamMember[] = [
  {
    name: "Aryan Galande",
    role: "Project Member",
    description: "Aryan drives the technical strategy of the platform.",
    imageUrl: AryanImage,
    socialLinks: {
      facebook: "#",
      twitter: "#",
      github: "#",
      custom: "#",
    },
  },
  {
    name: "Suraj Mohite",
    role: "Project Member",
    description: "Suraj drives the finance strategy of the platform.",
    imageUrl: Suraj,
    socialLinks: {
      facebook: "#",
      twitter: "#",
      github: "#",
    },
  },
  {
    name: "Om Panchwate",
    role: "Project Member",
    description: "Om drives the marketing strategy of the platform.",
    imageUrl: Om,
    socialLinks: {
      facebook: "#",
      twitter: "#",
      github: "#",
    },
  },
  {
    name: "Srujan Mukund",
    role: "Project Member",
    description: "Srujan drives the research strategy of the platform.",
    imageUrl: Srujan,
    socialLinks: {
      facebook: "#",
      twitter: "#",
      github: "#",
      custom: "#",
    },
  },
];

const TeamSection: React.FC = () => {
  return (
    <section id="team" className="bg-black">
      <div className="mx-auto max-w-screen-xl py-8 px-4 lg:py-16 lg:px-6">
        <div className="mx-auto mb-8 max-w-screen-sm text-center lg:mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Our Team
          </h2>
          <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Meet the dedicated team behind HandyTalk committed to bridging
            communication gaps and making healthcare accessible for all.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {team.map((member) => (
            <div
              key={member.name}
              className="flex flex-col bg-gray-50 rounded-lg shadow transition transform hover:-translate-y-2 hover:shadow-xl dark:bg-gray-800 dark:border-gray-700"
            >
              <a href="#">
                <img
                  className="rounded-t-lg object-cover w-full h-70 sm:rounded-none sm:rounded-l-lg"
                  src={member.imageUrl}
                  alt={`${member.name}'s avatar`}
                />
              </a>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="mb-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <a href="#">{member.name}</a>
                </h3>
                <span className="mb-4 text-gray-500 dark:text-gray-400">
                  {member.role}
                </span>
                <p className="mb-6 flex-grow font-light text-gray-500 dark:text-gray-400">
                  {member.description}
                </p>
                <ul className="flex space-x-4 mt-auto">
                  {member.socialLinks?.facebook && (
                    <li>
                      <a
                        href={member.socialLinks.facebook}
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        {/* Facebook Icon */}
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M22 12c0-5.523..."
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                  )}
                  {member.socialLinks?.twitter && (
                    <li>
                      <a
                        href={member.socialLinks.twitter}
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        {/* Twitter Icon */}
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.29 20.251..." />
                        </svg>
                      </a>
                    </li>
                  )}
                  {member.socialLinks?.github && (
                    <li>
                      <a
                        href={member.socialLinks.github}
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        {/* GitHub Icon */}
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2..."
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                  )}
                  {member.socialLinks?.custom && (
                    <li>
                      <a
                        href={member.socialLinks.custom}
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        {/* add other icon or placeholder */}
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="..." />
                        </svg>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
