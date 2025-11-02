import { Download, Mail, Phone, MapPin, Briefcase, GraduationCap, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function Profile() {
  const candidate = {
    name: 'Sarah Johnson',
    title: 'Senior Frontend Developer',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Experienced frontend developer with 8+ years of expertise in React, TypeScript, and modern web technologies. Passionate about creating intuitive user experiences and scalable applications.',
    experience: [
      {
        company: 'Tech Corp',
        position: 'Senior Frontend Developer',
        period: '2021 - Present',
        description: 'Lead frontend architecture and development for enterprise SaaS platform. Manage team of 5 developers.',
      },
      {
        company: 'StartupXYZ',
        position: 'Frontend Developer',
        period: '2018 - 2021',
        description: 'Built and maintained multiple React applications. Implemented design system and component library.',
      },
      {
        company: 'Digital Agency',
        position: 'Junior Developer',
        period: '2016 - 2018',
        description: 'Developed responsive websites and web applications for various clients.',
      },
    ],
    education: [
      {
        school: 'University of California',
        degree: 'Bachelor of Science in Computer Science',
        period: '2012 - 2016',
      },
    ],
    skills: [
      'React', 'TypeScript', 'JavaScript', 'Next.js', 'Tailwind CSS',
      'Node.js', 'GraphQL', 'REST APIs', 'Git', 'CI/CD',
    ],
  };

  const jobHistory = [
    {
      company: 'InterviewHub',
      position: 'Senior Frontend Developer',
      appliedDate: 'Oct 15, 2025',
      status: 'Interviewing',
      stage: 'Technical Interview',
      interviews: 2,
    },
    {
      company: 'CloudTech Solutions',
      position: 'Lead Developer',
      appliedDate: 'Oct 1, 2025',
      status: 'Interviewing',
      stage: 'Final Round',
      interviews: 3,
    },
    {
      company: 'DataStream Inc',
      position: 'Frontend Architect',
      appliedDate: 'Sep 20, 2025',
      status: 'Rejected',
      stage: 'Technical Round',
      interviews: 1,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                      SJ
                    </div>
                    <div>
                      <h1 className="text-2xl mb-1">{candidate.name}</h1>
                      <p className="text-gray-600 mb-3">{candidate.title}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {candidate.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {candidate.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {candidate.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                </div>
                <div>
                  <h3 className="text-sm mb-2">Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{candidate.summary}</p>
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {candidate.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-4">
                    <h4 className="mb-1">{exp.position}</h4>
                    <p className="text-sm text-gray-600 mb-1">{exp.company}</p>
                    <p className="text-sm text-gray-500 mb-2">{exp.period}</p>
                    <p className="text-sm text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.education.map((edu, index) => (
                  <div key={index}>
                    <h4 className="mb-1">{edu.degree}</h4>
                    <p className="text-sm text-gray-600">{edu.school}</p>
                    <p className="text-sm text-gray-500">{edu.period}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Job Application History */}
            <Card>
              <CardHeader>
                <CardTitle>Job Applications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobHistory.map((job, index) => (
                  <div key={index} className="pb-4 border-b last:border-b-0 last:pb-0">
                    <h4 className="text-sm mb-1">{job.position}</h4>
                    <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          job.status === 'Interviewing'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {job.status}
                      </span>
                      <span className="text-xs text-gray-500">{job.appliedDate}</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Stage: {job.stage} · {job.interviews} {job.interviews === 1 ? 'interview' : 'interviews'}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
