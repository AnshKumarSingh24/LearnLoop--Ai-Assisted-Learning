import React, { useState } from 'react';
import { CheckCircle2, XCircle, Lightbulb, ChevronDown, ChevronRight, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export type MCQOption = {
  text: string;
  is_correct: boolean;
  justification: string;
};

export type AssessmentItem = {
  id: string;
  learning_objective_id: string;
  stem: string;
  options: MCQOption[];
  bloomAlignment?: string;
  status?: 'draft' | 'reviewed' | 'approved' | 'rejected';
};

interface AssessmentReviewProps {
  assessments: AssessmentItem[];
  onApprove?: (itemId: string) => void;
  onReject?: (itemId: string) => void;
  onEdit?: (item: AssessmentItem) => void;
}

export function AssessmentReview({ assessments, onApprove, onReject, onEdit }: AssessmentReviewProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'reviewed': return 'bg-blue-100 text-blue-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Assessment Review</h3>
        <span className="text-sm text-gray-500">{assessments.length} items</span>
      </div>

      {assessments.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          <Lightbulb size={32} className="mx-auto mb-3 text-gray-300" />
          <p>No assessments generated yet. Click "Regenerate Assessments" on a Learning Objective.</p>
        </div>
      )}

      <div className="space-y-3">
        {assessments.map((item, idx) => {
          const expanded = expandedItems[item.id];
          const correctOption = item.options.find(o => o.is_correct);
          const distractors = item.options.filter(o => !o.is_correct);

          return (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Question Header */}
              <div 
                className="p-4 bg-gray-50 border-b border-gray-200 flex items-start justify-between gap-4 cursor-pointer"
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-sm font-bold text-gray-700">Q{idx + 1}</span>
                    <Badge variant="secondary" className="text-xs">{item.bloomAlignment || 'Bloom'}</Badge>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getStatusColor(item.status)}`}
                    >
                      {item.status || 'draft'}
                    </Badge>
                  </div>
                  <p className="text-gray-900 font-medium leading-relaxed">{item.stem}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {expanded ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
                </div>
              </div>

              {/* Expanded Options */}
              {expanded && (
                <div className="p-4 space-y-3 bg-white">
                  {/* Correct Answer */}
                  {correctOption && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 size={16} className="text-green-600" />
                        <span className="text-sm font-bold text-green-800">Correct Answer</span>
                      </div>
                      <p className="text-green-900 font-medium mb-2">{correctOption.text}</p>
                      <div className="text-sm text-green-700 bg-green-100 p-3 rounded">
                        <span className="font-medium">Why correct:</span> {correctOption.justification}
                      </div>
                    </div>
                  )}

                  {/* Distractors */}
                  {distractors.length > 0 && (
                    <div>
                      <h5 className="text-sm font-bold text-gray-600 mb-3">Distractors</h5>
                      <div className="space-y-2">
                        {distractors.map((opt, dIdx) => (
                          <div key={dIdx} className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <XCircle size={16} className="text-red-600" />
                              <span className="text-sm font-medium text-red-800">Option {String.fromCharCode(65 + dIdx + (correctOption ? 1 : 0))}</span>
                              <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-800">
                                Targets Misconception
                              </Badge>
                            </div>
                            <p className="text-red-900 font-medium mb-2">{opt.text}</p>
                            <div className="text-sm text-red-700 bg-red-100 p-3 rounded flex items-start gap-2">
                              <Lightbulb size={14} className="shrink-0 mt-0.5" />
                              <span className="font-medium">Misconception:</span> {opt.justification}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                    <Button 
                      size="sm" 
                      variant={item.status === 'approved' ? 'secondary' : 'default'}
                      onClick={() => onApprove?.(item.id)}
                      disabled={item.status === 'approved'}
                      className="flex-1"
                    >
                      <CheckCircle2 size={14} className="mr-1" />
                      {item.status === 'approved' ? 'Approved' : 'Approve'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onReject?.(item.id)}
                      disabled={item.status === 'rejected'}
                      className="flex-1"
                    >
                      <XCircle size={14} className="mr-1" />
                      {item.status === 'rejected' ? 'Rejected' : 'Reject'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => onEdit?.(item)}
                    >
                      <ArrowUpRight size={14} className="mr-1" /> Edit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface AssessmentStatsProps {
  total: number;
  approved: number;
  reviewed: number;
  draft: number;
  rejected: number;
}

export function AssessmentStats({ total, approved, reviewed, draft, rejected }: AssessmentStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-3 mb-4">
      <StatCard label="Total" value={total} color="gray" />
      <StatCard label="Approved" value={approved} color="green" icon={<CheckCircle2 size={16} />} />
      <StatCard label="Reviewed" value={reviewed} color="blue" />
      <StatCard label="Draft" value={draft} color="amber" />
      <StatCard label="Rejected" value={rejected} color="red" icon={<AlertCircle size={16} />} />
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon?: React.ReactNode }) {
  const colors = {
    gray: 'bg-gray-100 text-gray-700',
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <div className={`p-3 rounded-xl ${colors[color as keyof typeof colors] || colors.gray}`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">{value}</span>
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}