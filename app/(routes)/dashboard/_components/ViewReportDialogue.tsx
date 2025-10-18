import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
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
} from "lucide-react";

type props = {
  record: SessionDetail;
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
          variant={"link"}
          size={"sm"}
          className="group"
          title="Peek into the AI''s mind... responsibly!"
        >
          <FileText className="w-4 h-4 mr-1 group-hover:text-primary transition-colors" />
          View Report
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto bg-card shadow-2xl p-0 border border-border w-[800px] rounded-2xl">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b border-border px-6 py-5 rounded-t-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-primary animate-pulse" />
              <h2 className="text-3xl font-serif font-bold text-foreground">
                Medical AI Consultation Report
              </h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                className="gap-2"
                title="Save this wisdom for posterity!"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareReport}
                className="gap-2"
                title="Spread the good news (responsibly)!"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-xl border border-border bg-gradient-to-br from-card to-muted/20 p-5 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-serif font-semibold text-foreground">
                Patient Input Summary
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Stethoscope className="w-4 h-4 text-accent mt-0.5" />
                <div>
                  <p className="font-sans font-semibold text-foreground">
                    AI Specialist
                  </p>
                  <p className="text-muted-foreground">
                    {record?.selectedDoctor?.specialist}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-accent mt-0.5" />
                <div>
                  <p className="font-sans font-semibold text-foreground">
                    Patient
                  </p>
                  <p className="text-muted-foreground">
                    {report?.user || "Anonymous User"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-accent mt-0.5" />
                <div>
                  <p className="font-sans font-semibold text-foreground">
                    Consultation Date
                  </p>
                  <p className="text-muted-foreground">{formatDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Activity className="w-4 h-4 text-accent mt-0.5" />
                <div>
                  <p className="font-sans font-semibold text-foreground">
                    Agent Model
                  </p>
                  <p className="text-muted-foreground">
                    {report?.agent || "AI Medical Assistant"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-destructive" />
              <h3 className="text-xl font-serif font-semibold text-foreground">
                AI Symptom Analysis
              </h3>
            </div>

            <div className="space-y-2">
              <h4 className="font-sans font-semibold text-foreground text-sm">
                Chief Complaint
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {report?.chiefComplaint || "Not specified"}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-sans font-semibold text-foreground text-sm">
                Analysis Summary
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {report?.summary || "No summary available"}
              </p>
            </div>

            {report?.symptoms?.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-sans font-semibold text-foreground text-sm">
                  Reported Symptoms
                </h4>
                <ul className="space-y-1">
                  {report.symptoms.map((symptom: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-muted-foreground text-sm"
                    >
                      <span className="text-accent mt-0.5">•</span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-accent mt-0.5" />
                <div>
                  <p className="font-sans font-semibold text-foreground text-sm">
                    Duration
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {report?.duration || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                <div>
                  <p className="font-sans font-semibold text-foreground text-sm">
                    Severity
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {report?.severity || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {report?.medicationsMentioned?.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Pill className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-serif font-semibold text-foreground">
                  Medications Mentioned
                </h3>
              </div>
              <ul className="space-y-1">
                {report.medicationsMentioned.map(
                  (med: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-muted-foreground text-sm"
                    >
                      <span className="text-primary mt-0.5">•</span>
                      <span>{med}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {report?.recommendations?.length > 0 && (
            <div className="rounded-xl border border-border bg-gradient-to-br from-accent/5 to-primary/5 p-5 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-accent" />
                <h3 className="text-xl font-serif font-semibold text-foreground">
                  Potential Next Steps
                </h3>
              </div>
              <ul className="space-y-2">
                {report.recommendations.map((rec: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-foreground text-sm"
                  >
                    <span className="font-bold text-accent">{index + 1}.</span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-5 space-y-2">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="text-lg font-serif font-bold text-foreground">
                  Disclaimer
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                  <span className="font-semibold text-foreground">
                    Our AI is brilliant, but it''s not a licensed doctor (yet!).
                  </span>{" "}
                  This report was generated by an artificial intelligence for
                  informational and educational purposes only. It does not
                  constitute medical advice, diagnosis, or treatment. Always
                  consult with a qualified healthcare professional for proper
                  medical guidance. If experiencing a medical emergency, please
                  contact emergency services immediately.
                </p>
                <p className="text-xs text-muted-foreground italic mt-2">
                  P.S. — Our AI practices medicine in the digital realm, where
                  malpractice insurance costs exactly zero bytes. 🤖✨
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
