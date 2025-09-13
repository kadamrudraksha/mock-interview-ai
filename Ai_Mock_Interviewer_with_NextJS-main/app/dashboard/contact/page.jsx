'use client';

import React from 'react';
import { Github, Linkedin, Mail, Phone, User, Code, Briefcase } from 'lucide-react';

const ProjectCreatorProfile = () => {
  const contactInfo = {
    linkedin: "https://www.linkedin.com/in/rudraksha-kadam-6398b3218/",
    github: "https://github.com/kadamrudraksha",
    email: "rudrakshakadam04@gmail.com",
    phone: "9604122508"
  };

  const handleContactClick = (type, value) => {
    switch(type) {
      case 'email':
        window.open(`mailto:${value}`);
        break;
      case 'phone':
        window.open(`tel:${value}`);
        break;
      case 'linkedin':
      case 'github':
        window.open(value, '_blank');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Rudraksha Kadam</h1>
            <p className="text-lg text-gray-600 mb-4">Project Creator & Developer</p>
            <p className="text-gray-500 max-w-2xl">
              Passionate about creating innovative solutions and building projects that make a difference. 
              Always eager to collaborate on exciting ventures and bring creative ideas to life.
            </p>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Code className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {['React', 'JavaScript', 'Node.js', 'Python', 'MongoDB', 'Express', 'Git', 'CSS', 'HTML'].map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Get In Touch</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* LinkedIn */}
            <div 
              onClick={() => handleContactClick('linkedin', contactInfo.linkedin)}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Linkedin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">LinkedIn</p>
                <p className="text-sm text-gray-500">Professional Profile</p>
              </div>
            </div>

            {/* GitHub */}
            <div 
              onClick={() => handleContactClick('github', contactInfo.github)}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-500 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                <Github className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">GitHub</p>
                <p className="text-sm text-gray-500">Code Repository</p>
              </div>
            </div>

            {/* Email */}
            <div 
              onClick={() => handleContactClick('email', contactInfo.email)}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-500">{contactInfo.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div 
              onClick={() => handleContactClick('phone', contactInfo.phone)}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Phone</p>
                <p className="text-sm text-gray-500">{contactInfo.phone}</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-gray-600 mb-4">Ready to collaborate? Let's discuss your project!</p>
            <button 
              onClick={() => handleContactClick('email', contactInfo.email)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreatorProfile;