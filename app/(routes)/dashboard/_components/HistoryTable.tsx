import React from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SessionDetail } from "./types";
import moment from "moment";
import ViewReportDialogue from "./ViewReportDialogue";

type Props = {
  historyList: SessionDetail[];
};

function HistoryTable({ historyList }: Props) {
  return (
    <div
      className="rounded-xl border border-border bg-card"
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      <Table>
        <TableCaption className="font-sans text-muted-foreground">
          Previous Consultation Reports
        </TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-sans text-foreground">
              AI Medical Specialist
            </TableHead>
            <TableHead className="font-sans text-foreground">
              Description
            </TableHead>
            <TableHead className="font-sans text-foreground">Date</TableHead>
            <TableHead className="text-right font-sans text-foreground">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyList.map((record: SessionDetail, index: number) => (
            <motion.tr
              key={record.sessionId || index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border-border"
            >
              <TableCell className="font-serif font-semibold text-foreground">
                {record.selectedDoctor.specialist}
              </TableCell>
              <TableCell className="font-sans text-muted-foreground">
                {record.notes}
              </TableCell>
              <TableCell className="font-mono text-muted-foreground">
                {moment(new Date(record.createdOn)).fromNow()}
              </TableCell>
              <TableCell className="text-right">
                <ViewReportDialogue record={record} />
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default HistoryTable;
