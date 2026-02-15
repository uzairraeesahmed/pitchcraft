'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { supabase } from '@/lib/supabase';
import { generatePitch } from '@/lib/gemini';
import { Pitch, IdeaFormData, GeminiResponse, Idea } from '@/lib/types';
import { Brain, Save, RefreshCw, Download, Share2, ArrowLeft } from 'lucide-react';
import { copyToClipboard, downloadPitchAsPDF, generateShareableLink } from '@/lib/utils';

interface EditPitchPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPitchPage({ params }: EditPitchPageProps) {
  const resolvedParams = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    const fetchPitch = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('pitches')
          .select('*')
          .eq('id', resolvedParams.id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setPitch(data);
      } catch (error) {
        console.error('Error fetching pitch:', error);
        setError('Pitch not found');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPitch();
    }
  }, [user, authLoading, router, resolvedParams.id]);

  const handleSave = async () => {
    if (!pitch) return;

    setSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('pitches')
        .update({
          startup_name: pitch.startup_name,
          tagline: pitch.tagline,
          pitch: pitch.pitch,
          problem: pitch.problem,
          solution: pitch.solution,
          target_audience: pitch.target_audience,
          landing_copy: pitch.landing_copy,
          color_palette: pitch.color_palette,
          logo_concept: pitch.logo_concept,
          updated_at: new Date().toISOString()
        })
        .eq('id', pitch.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving pitch:', error);
      setError('Failed to save pitch');
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!pitch) return;

    setRegenerating(true);
    try {
      const { data: ideaData, error: ideaError } = await supabase
        .from('ideas')
        .select('*')
        .eq('id', pitch.idea_id)
        .single();

      if (ideaError) throw ideaError;

      const ideaFormData: IdeaFormData = {
        idea_name: (ideaData as Idea).idea_name,
        description: (ideaData as Idea).description,
        industry: (ideaData as Idea).industry,
        tone: (ideaData as Idea).tone,
        language: (ideaData as Idea).language
      };

      const aiResponse: GeminiResponse = await generatePitch(ideaFormData);

      setPitch({
        ...pitch,
        startup_name: aiResponse.startup_name,
        tagline: aiResponse.tagline,
        pitch: aiResponse.pitch,
        problem: aiResponse.problem,
        solution: aiResponse.solution,
        target_audience: aiResponse.target_audience,
        landing_copy: aiResponse.landing_copy,
        color_palette: aiResponse.color_palette || undefined,
        logo_concept: aiResponse.logo_concept || undefined
      });
    } catch (error) {
      console.error('Error regenerating pitch:', error);
      setError('Failed to regenerate pitch');
    } finally {
      setRegenerating(false);
    }
  };

  const handleExportPDF = async () => {
    if (!pitch) return;
    try {
      downloadPitchAsPDF(pitch, `${pitch.startup_name.replace(/\s+/g, '_')}_pitch`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  const handleCopyShareLink = async () => {
    const shareLink = generateShareableLink(pitch!.id);
    await copyToClipboard(shareLink);
  };

  const handleInputChange = (field: keyof Pitch, value: string) => {
    if (!pitch) return;
    setPitch({ ...pitch, [field]: value });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading pitch...</p>
        </div>
      </div>
    );
  }

  if (!pitch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pitch Not Found</h1>
          <p className="text-gray-600 mb-4">The pitch you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Your Pitch</h1>
              <p className="text-gray-600">Customize your AI-generated startup pitch</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${regenerating ? 'animate-spin' : ''}`} />
                {regenerating ? 'Regenerating...' : 'Regenerate with AI'}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Startup Name
              </label>
              <input
                type="text"
                value={pitch.startup_name}
                onChange={(e) => handleInputChange('startup_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={pitch.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problem Statement
              </label>
              <textarea
                value={pitch.problem}
                onChange={(e) => handleInputChange('problem', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Solution
              </label>
              <textarea
                value={pitch.solution}
                onChange={(e) => handleInputChange('solution', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <textarea
                value={pitch.target_audience}
                onChange={(e) => handleInputChange('target_audience', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Elevator Pitch
              </label>
              <textarea
                value={pitch.pitch}
                onChange={(e) => handleInputChange('pitch', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Landing Page Hero Copy
              </label>
              <textarea
                value={pitch.landing_copy}
                onChange={(e) => handleInputChange('landing_copy', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
            </div>

            {pitch.color_palette && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Palette
                </label>
                <input
                  type="text"
                  value={pitch.color_palette}
                  onChange={(e) => handleInputChange('color_palette', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                />
              </div>
            )}

            {pitch.logo_concept && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Concept
                </label>
                <textarea
                  value={pitch.logo_concept}
                  onChange={(e) => handleInputChange('logo_concept', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                />
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  onClick={handleExportPDF}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </button>
                <button
                  onClick={handleCopyShareLink}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 flex items-center"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Share Link
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {new Date(pitch.updated_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

