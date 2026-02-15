'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { supabase } from '@/lib/supabase';
import { generatePitch } from '@/lib/gemini';
import { IdeaFormData, GeminiResponse, Idea, Pitch } from '@/lib/types';
import { Brain, ArrowLeft, Sparkles, Globe, Link } from 'lucide-react';

export default function CreatePitchPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<IdeaFormData>({
    idea_name: '',
    description: '',
    industry: '',
    tone: 'formal',
    language: 'en'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const aiResponse: GeminiResponse = await generatePitch(formData);

      const { data: ideaData, error: ideaError } = await supabase
        .from('ideas')
        .insert({
          user_id: user!.id,
          idea_name: formData.idea_name,
          description: formData.description,
          industry: formData.industry,
          tone: formData.tone,
          language: formData.language
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
        .select()
        .single();

      if (ideaError) throw ideaError;

      const { data: pitchData, error: pitchError } = await supabase
        .from('pitches')
        .insert({
          user_id: user!.id,
          idea_id: (ideaData as Idea).id,
          startup_name: aiResponse.startup_name,
          tagline: aiResponse.tagline,
          pitch: aiResponse.pitch,
          problem: aiResponse.problem,
          solution: aiResponse.solution,
          target_audience: aiResponse.target_audience,
          landing_copy: aiResponse.landing_copy,
          color_palette: aiResponse.color_palette || null,
          logo_concept: aiResponse.logo_concept || null,
          language: formData.language
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
        .select()
        .single();

      if (pitchError) throw pitchError;

      const response = await fetch('/api/generate-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pitchId: (pitchData as Pitch).id }),
      });

      if (response.ok) {
        const htmlContent = await response.text();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from('pitches')
          .update({ website_html: htmlContent })
          .eq('id', (pitchData as Pitch).id);

        if (updateError) {
          console.error('Error saving website HTML:', updateError);
        }

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');

        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Error creating pitch:', err);
      setError('Failed to generate pitch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof IdeaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">PitchCraft</span>
            </div>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your Startup Pitch
            </h1>
            <p className="text-gray-600">
              Tell us about your idea and we&apos;ll generate a professional pitch for you
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language / زبان
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center text-gray-900">
                  <input
                    type="radio"
                    name="language"
                    value="en"
                    checked={formData.language === 'en'}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="mr-2"
                  />
                  <Globe className="h-4 w-4 mr-1" />
                  English
                </label>
                <label className="flex items-center text-gray-900">
                  <input
                    type="radio"
                    name="language"
                    value="ur"
                    checked={formData.language === 'ur'}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="mr-2"
                  />
                  <Globe className="h-4 w-4 mr-1" />
                  Roman Urdu
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="idea_name" className="block text-sm font-medium text-gray-700 mb-2">
                {formData.language === 'ur' ? 'Idea کا نام' : 'Idea Name'}
              </label>
              <input
                type="text"
                id="idea_name"
                value={formData.idea_name}
                onChange={(e) => handleInputChange('idea_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                placeholder={formData.language === 'ur' ? 'اپنے idea کا نام لکھیں' : 'Enter your idea name'}
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                {formData.language === 'ur' ? 'تفصیل' : 'Description'}
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                placeholder={formData.language === 'ur' ? 'اپنے idea کی تفصیل لکھیں' : 'Describe your startup idea in detail'}
                required
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                {formData.language === 'ur' ? 'صنعت' : 'Industry'}
              </label>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                required
              >
                <option value="">{formData.language === 'ur' ? 'صنعت منتخب کریں' : 'Select an industry'}</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Finance">Finance</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Transportation">Transportation</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.language === 'ur' ? 'ٹون' : 'Tone'}
              </label>
              <div className="grid grid-cols-3 gap-4 text-gray-900">
                <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="tone"
                    value="formal"
                    checked={formData.tone === 'formal'}
                    onChange={(e) => handleInputChange('tone', e.target.value)}
                    className="mr-2"
                  />
                  <div>
                    <div className="font-medium">{formData.language === 'ur' ? 'رسمی' : 'Formal'}</div>
                    <div className="text-sm text-gray-500">{formData.language === 'ur' ? 'پروفیشنل' : 'Professional'}</div>
                  </div>
                </label>
                <label className="flex items-center p-3 border text-gray-900 border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="tone"
                    value="fun"
                    checked={formData.tone === 'fun'}
                    onChange={(e) => handleInputChange('tone', e.target.value)}
                    className="mr-2"
                  />
                  <div>
                    <div className="font-medium">{formData.language === 'ur' ? 'مزاحیہ' : 'Fun'}</div>
                    <div className="text-sm text-gray-500">{formData.language === 'ur' ? 'دلچسپ' : 'Playful'}</div>
                  </div>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="tone"
                    value="creative"
                    checked={formData.tone === 'creative'}
                    onChange={(e) => handleInputChange('tone', e.target.value)}
                    className="mr-2"
                  />
                  <div>
                    <div className="font-medium">{formData.language === 'ur' ? 'تخلیقی' : 'Creative'}</div>
                    <div className="text-sm text-gray-500">{formData.language === 'ur' ? 'انوکھا' : 'Innovative'}</div>
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-spin" />
                    {formData.language === 'ur' ? 'Pitch بن رہا ہے...' : 'Generating Pitch...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {formData.language === 'ur' ? 'Pitch بنائیں' : 'Generate Pitch'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

