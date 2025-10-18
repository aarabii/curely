import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { DialogTitle } from "@radix-ui/react-dialog";

type props = {
  record: any;
};

function ViewReportDialog({ record }: props) {
  const report: any = record?.report;
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleExportPDF = async () => {
    if (!contentRef.current) return;

    setIsExporting(true);
    toast.loading("🎨 Our digital artists are painting your PDF...", {
      id: "pdf-export",
    });

    try {
      // Create a clone of the content to avoid affecting the UI
      const clone = contentRef.current.cloneNode(true) as HTMLElement;
      clone.id = "pdf-clone";
      clone.style.width = "800px";
      clone.style.padding = "40px";
      clone.style.backgroundColor = "#ffffff";
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "0";

      document.body.appendChild(clone);

      // Force reflow to compute all styles
      clone.offsetHeight;

      // Convert oklab/oklch colors to RGB by reading computed styles
      const convertColors = (element: Element) => {
        if (!(element instanceof HTMLElement)) return;

        const computed = window.getComputedStyle(element);
        const htmlEl = element as HTMLElement;

        // Convert background color
        if (
          computed.backgroundColor &&
          computed.backgroundColor !== "rgba(0, 0, 0, 0)"
        ) {
          htmlEl.style.backgroundColor = computed.backgroundColor;
        }

        // Convert text color
        if (computed.color) {
          htmlEl.style.color = computed.color;
        }

        // Convert border colors
        if (computed.borderTopColor) {
          htmlEl.style.borderTopColor = computed.borderTopColor;
        }
        if (computed.borderRightColor) {
          htmlEl.style.borderRightColor = computed.borderRightColor;
        }
        if (computed.borderBottomColor) {
          htmlEl.style.borderBottomColor = computed.borderBottomColor;
        }
        if (computed.borderLeftColor) {
          htmlEl.style.borderLeftColor = computed.borderLeftColor;
        }

        // Recursively process children
        Array.from(element.children).forEach(convertColors);
      };

      convertColors(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 800,
        windowHeight: clone.scrollHeight,
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      const fileName = "Medical_Report.pdf";
      pdf.save(fileName);

      toast.success("🎉 Your PDF is ready! Downloaded successfully", {
        id: "pdf-export",
        description: "Scroll down for your medical masterpiece!",
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("😅 Oops! Our printer ran out of digital ink", {
        id: "pdf-export",
        description: "Please try again in a moment",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareReport = async () => {
    setIsSharing(true);

    const shareData = {
      title: `Medical Report - ${report?.user || "Patient"}`,
      text: `Consultation with ${
        record?.selectedDoctor?.specialist || "AI Doctor"
      }\nDate: ${formatDate}`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        toast.success("🚀 Report shared successfully!", {
          description: "Your carrier pigeon has taken flight!",
        });
      } else {
        // Fallback: Copy to clipboard
        const textToCopy = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        toast.success("📋 Report details copied to clipboard!", {
          description: "Paste away! Old school but it works.",
        });
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Share error:", error);
        toast.error("🤷 Sharing failed", {
          description: "Our carrier pigeons got lost. Try copying instead!",
        });
      }
    } finally {
      setIsSharing(false);
    }
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

      <DialogContent className="max-h-[90vh] overflow-hidden p-0 border-0 w-[900px] max-w-[95vw] rounded-3xl shadow-2xl bg-gradient-to-br from-slate-50 via-purple-50/20 to-cyan-50/30">
        {/* Premium Animated Header */}
        <DialogHeader>
          <div className="relative bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 px-6 sm:px-8 py-6 rounded-t-3xl overflow-hidden">
            {/* Animated background particles */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <motion.div
                    className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </motion.div>
                  <DialogTitle>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                        Your Health Report ✨
                      </h1>
                      <p className="text-purple-100 text-xs sm:text-sm mt-1">
                        AI-Powered Medical Wizardry 🧙‍♂️
                      </p>
                    </div>
                  </DialogTitle>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 sm:flex-initial"
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleExportPDF}
                      disabled={isExporting}
                      className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm transition-all w-full sm:w-auto"
                      title="Download as PDF - It's like printing, but cooler!"
                    >
                      {isExporting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">Export</span>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 sm:flex-initial"
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleShareReport}
                      disabled={isSharing}
                      className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm transition-all w-full sm:w-auto"
                      title="Share with friends (or enemies, we don't judge)"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">
                        {copied ? "Copied!" : "Share"}
                      </span>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div
          ref={contentRef}
          id="pdf-content"
          className="overflow-y-auto max-h-[calc(90vh-140px)] px-4 sm:px-8 py-6 space-y-6"
        >
          {/* Patient & Session Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 rounded-2xl border border-blue-200/50 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-2 mb-5">
              <motion.div
                className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <User className="w-5 h-5 text-white" />
              </motion.div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                Session Deets 📋
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide">
                  <Stethoscope className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">Specialty</span>
                </div>
                <p className="text-slate-900 font-semibold text-base sm:text-lg truncate">
                  {record?.selectedDoctor?.specialist}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide">
                  <User className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">Patient Name</span>
                </div>
                <p className="text-slate-900 font-semibold text-base sm:text-lg truncate">
                  {report?.user || "Mystery Patient 🕵️"}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">Consultation Date</span>
                </div>
                <p className="text-slate-900 font-semibold text-sm sm:text-base break-words">
                  {formatDate}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide">
                  <Activity className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">AI Brain</span>
                </div>
                <p className="text-slate-900 font-semibold text-sm sm:text-base truncate">
                  {report?.agent || "AI Medical Genius 🧠"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Chief Complaint & Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-gradient-to-br from-white via-rose-50/30 to-pink-50/20 rounded-2xl border border-rose-200/50 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-2 mb-5">
              <motion.div
                className="bg-gradient-to-br from-rose-500 to-pink-500 p-2 rounded-lg"
                whileHover={{ scale: 1.1 }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Heart className="w-5 h-5 text-white" />
              </motion.div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                What's Bothering You? 🩺
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide truncate">
                  Main Complaint
                </h3>
                <p className="text-slate-700 leading-relaxed bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl p-4 border border-slate-200/50 break-words">
                  {report?.chiefComplaint || "The mystery continues... 🕵️"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide truncate">
                  The Full Story 📖
                </h3>
                <p className="text-slate-700 leading-relaxed bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-xl p-4 border border-slate-200/50 break-words">
                  {report?.summary || "Our AI is still thinking... 🤔"}
                </p>
              </div>

              {report?.symptoms?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide truncate">
                    The Symptom Squad 🦠
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {report.symptoms.map((symptom: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex items-start gap-3 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl p-3 border border-emerald-200/50 hover:border-emerald-300 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 break-words flex-1">
                          {symptom}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-xl p-4 border border-cyan-200/50 hover:shadow-md transition-shadow"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide truncate">
                      Duration ⏰
                    </span>
                  </div>
                  <p className="text-slate-900 font-semibold text-base sm:text-lg truncate">
                    {report?.duration || "Time flies! ⏱️"}
                  </p>
                </motion.div>
                <motion.div
                  className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-xl p-4 border border-orange-200/50 hover:shadow-md transition-shadow"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide truncate">
                      Severity Level 🌡️
                    </span>
                  </div>
                  <p className="text-slate-900 font-semibold text-base sm:text-lg truncate">
                    {report?.severity || "TBD 🤷"}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Medications */}
          {report?.medicationsMentioned?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-gradient-to-br from-white via-violet-50/30 to-purple-50/20 rounded-2xl border border-violet-200/50 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  className="bg-gradient-to-br from-violet-500 to-purple-500 p-2 rounded-lg"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  <Pill className="w-5 h-5 text-white" />
                </motion.div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                  Medicine Cabinet 💊
                </h2>
              </div>
              <div className="space-y-2">
                {report.medicationsMentioned.map(
                  (med: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200/50 hover:border-purple-300 transition-all"
                    >
                      <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0"></div>
                      <span className="text-slate-700 font-medium break-words flex-1">
                        {med}
                      </span>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          )}

          {/* Recommendations */}
          {report?.recommendations?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-cyan-50/30 rounded-2xl border-2 border-emerald-300/50 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2 rounded-lg"
                  whileHover={{ scale: 1.1 }}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FileText className="w-5 h-5 text-white" />
                </motion.div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                  Your Action Plan 🎯
                </h2>
              </div>
              <div className="space-y-3">
                {report.recommendations.map((rec: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-start gap-3 sm:gap-4 bg-white rounded-xl p-3 sm:p-4 border-2 border-emerald-200/50 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-center min-w-[28px] w-7 h-7 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-full font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-slate-700 leading-relaxed flex-1 pt-0.5 break-words">
                      {rec}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50/30 rounded-2xl border-2 border-amber-300/60 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <motion.div
                className="bg-gradient-to-br from-amber-500 to-orange-500 p-2 rounded-xl flex-shrink-0"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <div className="space-y-3 flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
                  ⚠️ Hold Your Horses! Read This!
                </h3>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm break-words">
                  <span className="font-semibold text-slate-900">
                    This AI-powered report is like a friendly health chat, not a
                    doctor's prescription! 🤖💬
                  </span>{" "}
                  It's here to inform and guide, not diagnose or treat. Always
                  chat with a real human doctor (you know, the ones with
                  stethoscopes 🩺) for actual medical advice. If you're having
                  an emergency, call 911 faster than you can say "AI"! 🚑💨
                </p>
                <p className="text-xs text-slate-500 italic border-t border-amber-200 pt-3 break-words">
                  Generated by your friendly neighborhood AI 🤖✨ • Not a
                  replacement for your doc, just a helpful sidekick! 🦸
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReportDialog;
