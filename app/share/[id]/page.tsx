'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Pitch } from '@/lib/types';
import { Brain, Download, Share2, ArrowLeft } from 'lucide-react';

import { downloadPitchAsPDF } from '@/lib/utils';
import Link from 'next/link';

interface SharePitchPageProps {
  params: {
    id: string;
  };
}

export default function SharePitchPage({ params }: SharePitchPageProps) {
  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPitch = async () => {
      try {
        const { data, error } = await supabase
          .from('pitches')
          .select('*')
          .eq('id', params.id)
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

    fetchPitch();
  }, [params.id]);

  const handleExportPDF = async () => {
    if (!pitch) return;
    try {
      downloadPitchAsPDF(pitch, `${pitch.startup_name.replace(/\s+/g, '_')}_pitch`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${pitch?.startup_name} - Startup Pitch`,
          text: `Check out this startup pitch: ${pitch?.tagline}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading pitch...</p>
        </div>
      </div>
    );
  }

  if (error || !pitch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pitch Not Found</h1>
          <p className="text-gray-600 mb-4">The pitch you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go to PitchCraft
          </Link>
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
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to PitchCraft
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {pitch.startup_name}
            </h1>
            <p className="text-xl text-gray-600 italic mb-6">
              &quot;{pitch.tagline}&quot;
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleExportPDF}
                className="bg-green-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-green-700 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              <button
                onClick={handleShare}
                className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-red-800 mb-3">The Problem</h2>
                <p className="text-red-700">{pitch.problem}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-green-800 mb-3">Our Solution</h2>
                <p className="text-green-700">{pitch.solution}</p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-800 mb-3">Target Audience</h2>
              <p className="text-blue-700">{pitch.target_audience}</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-purple-800 mb-3">Elevator Pitch</h2>
              <p className="text-purple-700 text-lg leading-relaxed">{pitch.pitch}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Landing Page Hero Copy</h2>
              <p className="text-gray-700 text-lg">{pitch.landing_copy}</p>
            </div>

            {(pitch.color_palette || pitch.logo_concept) && (
              <div className="grid md:grid-cols-2 gap-6">
                {pitch.color_palette && (
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-yellow-800 mb-3">Color Palette</h2>
                    <p className="text-yellow-700">{pitch.color_palette}</p>
                  </div>
                )}
                {pitch.logo_concept && (
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-indigo-800 mb-3">Logo Concept</h2>
                    <p className="text-indigo-700">{pitch.logo_concept}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-4">
              This pitch was generated using PitchCraft - AI-powered startup pitch generator
            </p>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Create your own pitch →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

