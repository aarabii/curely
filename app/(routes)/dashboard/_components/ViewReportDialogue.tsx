import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import moment from "moment";
import {
  FileText,
  Download,
  Share2,
  AlertCircle,
  Activity,
  Clock,
  Pill,
  Heart,
  User,
  Calendar,
  Stethoscope,
  CheckCircle2,
} from "lucide-react";

type props = {
  record: any;
};

function ViewReportDialog({ record }: props) {
  const report: any = record?.report;

  const formatDate = (() => {
    try {
      const date = record?.createdOn;
      if (!date) return "Date not available";
      const momentDate = moment(date);
      if (momentDate.isValid()) {
        return momentDate.format("MMMM Do YYYY, h:mm a");
      }
      return moment().format("MMMM Do YYYY, h:mm a");
    } catch (error) {
      console.warn("Date formatting error:", error);
      return "Date not available";
    }
  })();

  const handleExportPDF = () => {
    alert(
      "Export to PDF - Coming soon! Our digital scribes are sharpening their quills."
    );
  };

  const handleShareReport = () => {
    alert(
      "Share Report - Coming soon! We're teaching our carrier pigeons to fly through the internet."
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className="gap-2 hover:shadow-md transition-all"
          title="View detailed consultation report"
        >
          <FileText className="w-4 h-4" />
          View Report
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-hidden p-0 border-0 w-[900px] max-w-[95vw] rounded-3xl shadow-2xl bg-gradient-to-br from-slate-50 to-blue-50/30">
        {/* Premium Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6 rounded-t-3xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    Medical Consultation Report
                  </h1>
                  <p className="text-blue-100 text-sm mt-1">
                    AI-Powered Health Analysis
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleExportPDF}
                  className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
                  title="Export report as PDF"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleShareReport}
                  className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
                  title="Share report with others"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-8 py-6 space-y-6">
          {/* Patient & Session Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="bg-blue-100 p-2 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Session Information
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide">
                  <Stethoscope className="w-3.5 h-3.5" />
                  Specialty
                </div>
                <p className="text-slate-900 font-semibold text-lg">
                  {record?.selectedDoctor?.specialist}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide">
                  <User className="w-3.5 h-3.5" />
                  Patient Name
                </div>
                <p className="text-slate-900 font-semibold text-lg">
                  {report?.user || "Anonymous User"}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide">
                  <Calendar className="w-3.5 h-3.5" />
                  Consultation Date
                </div>
                <p className="text-slate-900 font-semibold">{formatDate}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide">
                  <Activity className="w-3.5 h-3.5" />
                  AI Model
                </div>
                <p className="text-slate-900 font-semibold">
                  {report?.agent || "AI Medical Assistant"}
                </p>
              </div>
            </div>
          </div>

          {/* Chief Complaint & Analysis */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="bg-red-100 p-2 rounded-lg">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Clinical Assessment
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">
                  Chief Complaint
                </h3>
                <p className="text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">
                  {report?.chiefComplaint || "Not specified"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">
                  Clinical Summary
                </h3>
                <p className="text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">
                  {report?.summary || "No summary available"}
                </p>
              </div>

              {report?.symptoms?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">
                    Reported Symptoms
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {report.symptoms.map((symptom: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100"
                      >
                        <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{symptom}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Duration
                    </span>
                  </div>
                  <p className="text-slate-900 font-semibold text-lg">
                    {report?.duration || "Not specified"}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Severity
                    </span>
                  </div>
                  <p className="text-slate-900 font-semibold text-lg">
                    {report?.severity || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Medications */}
          {report?.medicationsMentioned?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Pill className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Current Medications
                </h2>
              </div>
              <div className="space-y-2">
                {report.medicationsMentioned.map(
                  (med: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-purple-50 rounded-xl p-4 border border-purple-100"
                    >
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-slate-700 font-medium">{med}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {report?.recommendations?.length > 0 && (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Recommended Next Steps
                </h2>
              </div>
              <div className="space-y-3">
                {report.recommendations.map((rec: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 bg-white rounded-xl p-4 border border-emerald-100 shadow-sm"
                  >
                    <div className="flex items-center justify-center w-7 h-7 bg-emerald-600 text-white rounded-full font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-slate-700 leading-relaxed flex-1 pt-0.5">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-2 rounded-xl flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900">
                  Important Medical Disclaimer
                </h3>
                <p className="text-slate-700 leading-relaxed text-sm">
                  <span className="font-semibold text-slate-900">
                    This AI-generated report is for informational purposes only.
                  </span>{" "}
                  It does not constitute professional medical advice, diagnosis,
                  or treatment. Always consult with a qualified healthcare
                  professional for proper medical guidance. In case of a medical
                  emergency, please contact emergency services immediately.
                </p>
                <p className="text-xs text-slate-500 italic border-t border-amber-200 pt-3">
                  Generated by AI Medical Assistant • Not a substitute for
                  professional medical consultation
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReportDialog;
