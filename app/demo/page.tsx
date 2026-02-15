'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Brain, Sparkles, ArrowRight, CheckCircle, Globe } from 'lucide-react';

export default function DemoPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ur'>('en');

  const samplePitch = {
    en: {
      startup_name: "EduConnect",
      tagline: "Bridging the Gap Between Students and Success",
      problem: "Students struggle to find quality mentors and career guidance, leading to poor career choices and missed opportunities.",
      solution: "An AI-powered platform that connects students with industry professionals for personalized mentorship and career guidance.",
      target_audience: "University students and recent graduates aged 18-25 seeking career guidance",
      pitch: "EduConnect is a revolutionary mentorship platform that uses AI to match students with industry professionals, providing personalized career guidance and networking opportunities.",
      landing_copy: "Transform your career journey with personalized mentorship from industry experts."
    },
    ur: {
      startup_name: "MentorMate",
      tagline: "Guidance Meets Growth",
      problem: "Students ko quality mentors aur career guidance nahi milti, jis se unhe galat career choices karni padti hain.",
      solution: "AI-powered platform jo students ko industry professionals se connect karta hai personalized mentorship ke liye.",
      target_audience: "University students aur recent graduates jo career guidance chahte hain",
      pitch: "MentorMate ek revolutionary mentorship platform hai jo AI use karta hai students ko industry professionals se match karne ke liye.",
      landing_copy: "Apne career journey ko transform karein industry experts se personalized mentorship ke saath."
    }
  };

  const currentPitch = samplePitch[selectedLanguage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">PitchCraft</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            See PitchCraft in Action
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Watch how AI transforms a simple idea into a professional startup pitch
          </p>

          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setSelectedLanguage('en')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${selectedLanguage === 'en'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <Globe className="h-4 w-4 mr-2" />
                English
              </button>
              <button
                onClick={() => setSelectedLanguage('ur')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${selectedLanguage === 'ur'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <Globe className="h-4 w-4 mr-2" />
                Roman Urdu
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Sparkles className="h-6 w-6 text-blue-600 mr-3" />
              {selectedLanguage === 'ur' ? 'Input - Idea' : 'Your Input'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedLanguage === 'ur' ? 'Idea کا نام' : 'Idea Name'}
                </label>
                <div className="bg-gray-50 p-3 rounded-md">
                  <span className="text-gray-600">Mentorship Platform for Students</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedLanguage === 'ur' ? 'تفصیل' : 'Description'}
                </label>
                <div className="bg-gray-50 p-3 rounded-md">
                  <span className="text-gray-600">
                    {selectedLanguage === 'ur'
                      ? 'Students ko mentors se connect karne wala platform jo career guidance provide karta hai'
                      : 'A platform that connects students with mentors for career guidance and professional development'
                    }
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedLanguage === 'ur' ? 'صنعت' : 'Industry'}
                </label>
                <div className="bg-gray-50 p-3 rounded-md">
                  <span className="text-gray-600">Education Technology</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedLanguage === 'ur' ? 'ٹون' : 'Tone'}
                </label>
                <div className="bg-gray-50 p-3 rounded-md">
                  <span className="text-gray-600">
                    {selectedLanguage === 'ur' ? 'رسمی (Professional)' : 'Formal (Professional)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Brain className="h-6 w-6 text-purple-600 mr-3" />
              {selectedLanguage === 'ur' ? 'AI Output - Pitch' : 'AI Generated Output'}
            </h2>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {currentPitch.startup_name}
                </h3>
                <p className="text-gray-600 italic">&quot;{currentPitch.tagline}&quot;</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">
                    {selectedLanguage === 'ur' ? 'مسئلہ' : 'Problem'}
                  </h4>
                  <p className="text-red-700 text-sm">{currentPitch.problem}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">
                    {selectedLanguage === 'ur' ? 'حل' : 'Solution'}
                  </h4>
                  <p className="text-green-700 text-sm">{currentPitch.solution}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {selectedLanguage === 'ur' ? 'Target Audience' : 'Target Audience'}
                </h4>
                <p className="text-blue-700 text-sm">{currentPitch.target_audience}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">
                  {selectedLanguage === 'ur' ? 'Elevator Pitch' : 'Elevator Pitch'}
                </h4>
                <p className="text-purple-700 text-sm">{currentPitch.pitch}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {selectedLanguage === 'ur' ? 'Landing Page Copy' : 'Landing Page Copy'}
                </h4>
                <p className="text-gray-700 text-sm">{currentPitch.landing_copy}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {selectedLanguage === 'ur' ? 'کیوں PitchCraft استعمال کریں؟' : 'Why Choose PitchCraft?'}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedLanguage === 'ur' ? 'AI-Powered' : 'AI-Powered Generation'}
              </h3>
              <p className="text-gray-600">
                {selectedLanguage === 'ur'
                  ? 'Advanced AI professional content generate karta hai'
                  : 'Advanced AI creates professional startup content'
                }
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedLanguage === 'ur' ? 'Bilingual Support' : 'Bilingual Support'}
              </h3>
              <p className="text-gray-600">
                {selectedLanguage === 'ur'
                  ? 'English aur Roman Urdu dono languages mein content'
                  : 'Generate content in English and Roman Urdu'
                }
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedLanguage === 'ur' ? 'Export & Share' : 'Export & Share'}
              </h3>
              <p className="text-gray-600">
                {selectedLanguage === 'ur'
                  ? 'PDF export aur shareable links'
                  : 'Export to PDF and create shareable links'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              {selectedLanguage === 'ur' ? 'ابھی شروع کریں!' : 'Ready to Get Started?'}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {selectedLanguage === 'ur'
                ? 'اپنے ideas کو professional pitches میں تبدیل کریں'
                : 'Transform your ideas into professional pitches'
              }
            </p>
            <Link
              href="/auth/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              {selectedLanguage === 'ur' ? 'ابھی شروع کریں' : 'Get Started Free'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
