'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { supabase } from '@/lib/supabase';
import { Pitch, DashboardStats } from '@/lib/types';
import { Brain, Plus, FileText, Share2, Edit, Trash2, Calendar, Download, Globe } from 'lucide-react';
import { formatDate, downloadPitchAsPDF } from '@/lib/utils';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_ideas: 0,
    total_pitches: 0,
    recent_pitches: []
  });
  const [loading, setLoading] = useState(true);
  const [generatingWebsite, setGeneratingWebsite] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    const fetchPitches = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('pitches')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setPitches(data || []);
        setStats({
          total_ideas: data?.length || 0,
          total_pitches: data?.length || 0,
          recent_pitches: data?.slice(0, 5) || []
        });
      } catch (error) {
        console.error('Error fetching pitches:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPitches();
    }
  }, [user, authLoading, router]);

  const handleDeletePitch = async (pitchId: string) => {
    if (!confirm('Are you sure you want to delete this pitch?')) return;

    try {
      const { error } = await supabase
        .from('pitches')
        .delete()
        .eq('id', pitchId);

      if (error) throw error;

      setPitches(pitches.filter(pitch => pitch.id !== pitchId));
    } catch (error) {
      console.error('Error deleting pitch:', error);
    }
  };

  const handleViewWebsite = async (pitch: Pitch) => {
    try {
      // Check if website HTML is already stored
      if (pitch.website_html) {
        // Use stored HTML
        const blob = new Blob([pitch.website_html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        // Show loading state
        setGeneratingWebsite(pitch.id);

        // Generate website if not stored
        const response = await fetch('/api/generate-website', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pitchId: pitch.id }),
        });

        if (response.ok) {
          const htmlContent = await response.text();

          // Save the generated HTML to database for future use
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error: updateError } = await (supabase as any)
            .from('pitches')
            .update({ website_html: htmlContent })
            .eq('id', pitch.id);

          if (updateError) {
            console.error('Error saving website HTML:', updateError);
          }

          const blob = new Blob([htmlContent], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        } else {
          alert('Failed to generate website. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error generating website:', error);
      alert('Failed to generate website. Please try again.');
    } finally {
      setGeneratingWebsite(null);
    }
  };

  const handleExportPDF = async (pitch: Pitch) => {
    try {
      downloadPitchAsPDF(pitch, `${pitch.startup_name.replace(/\s+/g, '_')}_pitch`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
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
                href="/create"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Pitch
              </Link>
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Pitches</h1>
          <p className="text-gray-600 mt-2">
            Manage and edit your AI-generated startup pitches
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pitches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_pitches}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Brain className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ideas Generated</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_ideas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pitches.length > 0 ? formatDate(pitches[0].created_at) : 'None'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {pitches.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pitches yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first AI-generated startup pitch to get started
            </p>
            <Link
              href="/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Pitch
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {pitches.map((pitch) => (
              <div key={pitch.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {pitch.startup_name}
                    </h3>
                    <p className="text-gray-600 italic">&quot;{pitch.tagline}&quot;</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewWebsite(pitch)}
                      disabled={generatingWebsite === pitch.id}
                      className={`p-2 ${generatingWebsite === pitch.id
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-purple-600 hover:text-purple-800'
                        }`}
                      title={generatingWebsite === pitch.id ? "Generating website..." : "View Website"}
                    >
                      {generatingWebsite === pitch.id ? (
                        <Brain className="h-4 w-4 animate-spin" />
                      ) : (
                        <Globe className="h-4 w-4" />
                      )}
                    </button>
                    <Link
                      href={`/edit/${pitch.id}`}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Edit pitch"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleExportPDF(pitch)}
                      className="text-green-600 hover:text-green-800 p-2"
                      title="Export PDF"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePitch(pitch.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete pitch"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Problem:</h4>
                    <p className="text-gray-600">{pitch.problem}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Solution:</h4>
                    <p className="text-gray-600">{pitch.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Target Audience:</h4>
                    <p className="text-gray-600">{pitch.target_audience}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(pitch.created_at)}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(window.location.origin + `/share/${pitch.id}`)}
                      className="text-gray-600 hover:text-gray-800 p-2"
                      title="Copy share link"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

