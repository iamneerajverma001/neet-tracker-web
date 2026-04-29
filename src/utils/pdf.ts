import type { DoneMap, Subject, Topic } from "../types";

type SubjectSummary = {
  subject: Subject;
  doneCount: number;
  totalCount: number;
  completed: Topic[];
  pending: Topic[];
};

type RGB = [number, number, number];

function formatSubject(subject: Subject): string {
  if (subject === "physics") {
    return "Physics";
  }

  if (subject === "chemistry") {
    return "Chemistry";
  }

  return "Biology";
}

function toSubjectSummary(topics: Topic[], done: DoneMap, subject: Subject): SubjectSummary {
  const subjectTopics = topics.filter((topic) => topic.subject === subject);
  const completed = subjectTopics.filter((topic) => done[topic.id]);
  const pending = subjectTopics.filter((topic) => !done[topic.id]);

  return {
    subject,
    doneCount: completed.length,
    totalCount: subjectTopics.length,
    completed,
    pending,
  };
}

function pct(doneCount: number, totalCount: number): number {
  if (totalCount === 0) {
    return 0;
  }

  return Math.round((doneCount / totalCount) * 100);
}

function formatTopicNumber(order: number): string {
  return `${order}.`;
}

function subjectPriority(subject: Subject): number {
  if (subject === "biology") {
    return 0;
  }

  if (subject === "physics") {
    return 1;
  }

  return 2;
}

export async function exportProgressSummaryPdf(
  topics: Topic[],
  done: DoneMap,
  filename = "neet-progress-summary.pdf",
): Promise<void> {
  const [{ jsPDF }] = await Promise.all([import("jspdf")]);

  const pdf = new jsPDF("p", "mm", "a4");
  const left = 12;
  const right = 198;
  const pageBottom = 285;
  let y = 12;

  const contentWidth = right - left;

  const setText = (size: number, bold = false, color: RGB = [34, 32, 58]) => {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(size);
    pdf.setTextColor(color[0], color[1], color[2]);
  };

  const ensureSpace = (height: number) => {
    if (y + height > pageBottom) {
      pdf.addPage();
      y = 14;
    }
  };

  const drawCard = (
    x: number,
    top: number,
    width: number,
    height: number,
    fill: RGB,
    border: RGB,
  ) => {
    pdf.setDrawColor(border[0], border[1], border[2]);
    pdf.setFillColor(fill[0], fill[1], fill[2]);
    pdf.roundedRect(x, top, width, height, 2.5, 2.5, "FD");
  };

  const drawProgressBar = (
    x: number,
    top: number,
    width: number,
    height: number,
    valuePct: number,
    fillColor: RGB,
  ) => {
    pdf.setFillColor(235, 236, 245);
    pdf.roundedRect(x, top, width, height, 1.6, 1.6, "F");

    const progressWidth = Math.max(0, Math.min(width, (width * valuePct) / 100));
    pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    pdf.roundedRect(x, top, progressWidth, height, 1.6, 1.6, "F");
  };

  const writeWrapped = (text: string, x: number, top: number, maxWidth: number, lineHeight = 4.6) => {
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, top);
    return lines.length * lineHeight;
  };

  const overallDone = topics.filter((topic) => done[topic.id]).length;
  const overallPending = topics.length - overallDone;
  const overallPct = pct(overallDone, topics.length);

  const subjectSummary = [
    toSubjectSummary(topics, done, "physics"),
    toSubjectSummary(topics, done, "chemistry"),
    toSubjectSummary(topics, done, "biology"),
  ];

  const tierSummary = ([1, 2, 3] as const).map((tier) => {
    const tierTopics = topics.filter((topic) => topic.tier === tier);
    const doneCount = tierTopics.filter((topic) => done[topic.id]).length;

    return {
      tier,
      doneCount,
      totalCount: tierTopics.length,
      pending: tierTopics.filter((topic) => !done[topic.id]),
      pct: pct(doneCount, tierTopics.length),
    };
  });

  const sortedPending = topics
    .filter((topic) => !done[topic.id])
    .sort((a, b) => {
      const subjectOrder = subjectPriority(a.subject) - subjectPriority(b.subject);

      if (subjectOrder !== 0) {
        return subjectOrder;
      }

      if (a.tier !== b.tier) {
        return a.tier - b.tier;
      }

      return a.order - b.order;
    });

  const completedTopics = topics.filter((topic) => done[topic.id]).sort((a, b) => a.order - b.order);

  // Page 1: visual summary
  drawCard(left, y, contentWidth, 22, [33, 30, 58], [33, 30, 58]);
  setText(17, true, [255, 255, 255]);
  pdf.text("NEET Progress Summary", left + 5, y + 8);
  setText(9, false, [224, 226, 245]);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, left + 5, y + 14);
  pdf.text("Done vs Pending with next-study priorities", left + 5, y + 18);
  y += 27;

  const gap = 4;
  const kpiWidth = (contentWidth - gap * 2) / 3;
  const kpiHeight = 26;

  const kpis: Array<{ label: string; value: string; meta: string; color: [number, number, number] }> = [
    {
      label: "Completed",
      value: `${overallDone}`,
      meta: `of ${topics.length} topics`,
      color: [226, 249, 236],
    },
    {
      label: "Pending",
      value: `${overallPending}`,
      meta: "topics remaining",
      color: [255, 239, 236],
    },
    {
      label: "Overall",
      value: `${overallPct}%`,
      meta: "completion rate",
      color: [235, 238, 255],
    },
  ];

  kpis.forEach((kpi, index) => {
    const x = left + index * (kpiWidth + gap);
    drawCard(x, y, kpiWidth, kpiHeight, kpi.color, [213, 214, 228]);
    setText(9, false, [88, 84, 120]);
    pdf.text(kpi.label, x + 3, y + 7);
    setText(16, true, [33, 30, 58]);
    pdf.text(kpi.value, x + 3, y + 16);
    setText(8, false, [95, 94, 122]);
    pdf.text(kpi.meta, x + 3, y + 22);
  });
  y += kpiHeight + 7;

  const subjectCardWidth = (contentWidth - gap * 2) / 3;
  const subjectCardHeight = 28;
  const subjectStyles: Record<Subject, RGB> = {
    physics: [62, 167, 255],
    chemistry: [255, 96, 176],
    biology: [103, 212, 95],
  };

  subjectSummary.forEach((summary, index) => {
    const x = left + index * (subjectCardWidth + gap);
    const accent = subjectStyles[summary.subject];
    const summaryPct = pct(summary.doneCount, summary.totalCount);

    drawCard(x, y, subjectCardWidth, subjectCardHeight, [247, 248, 255], [214, 216, 230]);

    setText(10, true, [33, 30, 58]);
    pdf.text(formatSubject(summary.subject), x + 3, y + 7.5);
    setText(8.8, false, [93, 91, 125]);
    pdf.text(`${summary.doneCount}/${summary.totalCount} completed`, x + 3, y + 13.2);
    setText(8, true, [67, 63, 103]);
    pdf.text(`${summaryPct}%`, x + subjectCardWidth - 12, y + 13.2);
    drawProgressBar(x + 3, y + 16, subjectCardWidth - 6, 4.5, summaryPct, accent);
  });
  y += subjectCardHeight + 7;

  setText(11, true, [40, 35, 75]);
  pdf.text("Tier-Wise Progress", left, y);
  y += 4;

  const tierCardWidth = (contentWidth - gap * 2) / 3;
  const tierCardHeight = 23;
  tierSummary.forEach((entry, index) => {
    const x = left + index * (tierCardWidth + gap);
    drawCard(x, y, tierCardWidth, tierCardHeight, [248, 248, 253], [215, 216, 232]);
    setText(9, true, [47, 42, 82]);
    pdf.text(`Tier ${entry.tier}`, x + 3, y + 6.8);
    drawProgressBar(x + 3, y + 9, tierCardWidth - 6, 4.2, entry.pct, [255, 175, 107]);
    setText(8, false, [92, 89, 121]);
    pdf.text(`${entry.doneCount}/${entry.totalCount} done`, x + 3, y + 17);
    pdf.text(`${entry.pct}%`, x + tierCardWidth - 13, y + 17);
  });
  y += tierCardHeight + 7;

  const focusLeftWidth = 120;
  const focusRightWidth = contentWidth - focusLeftWidth - gap;
  const blockHeight = 78;

  drawCard(left, y, focusLeftWidth, blockHeight, [252, 245, 239], [226, 204, 189]);
  setText(11, true, [82, 52, 33]);
  pdf.text("Immediate Focus", left + 3, y + 7);
  setText(8.5, false, [111, 79, 59]);
  pdf.text("Priority order: Tier 1 -> Tier 2 -> Tier 3", left + 3, y + 12);

  let focusY = y + 18;
  const immediateFocusSubjects: Subject[] = ["biology", "physics", "chemistry"];
  const focusItems = immediateFocusSubjects.map((subject) => {
    const nextTopic = topics
      .filter((topic) => topic.subject === subject && !done[topic.id])
      .sort((a, b) => (a.tier === b.tier ? a.order - b.order : a.tier - b.tier))[0];

    return {
      subject,
      nextTopic,
    };
  });

  const hasAnyPending = focusItems.some((item) => item.nextTopic);
  if (!hasAnyPending) {
    setText(9, true, [55, 108, 78]);
    pdf.text("All topics complete. Great work.", left + 3, focusY);
  } else {
    focusItems.forEach((item) => {
      setText(8.4, true, [92, 60, 42]);
      pdf.text(`${formatSubject(item.subject)}:`, left + 3, focusY);

      setText(8.2, false, [92, 60, 42]);
      const topicLabel = item.nextTopic
        ? `${formatTopicNumber(item.nextTopic.order)} ${item.nextTopic.name} (T${item.nextTopic.tier})`
        : "All topics complete";
      const lines = pdf.splitTextToSize(topicLabel, focusLeftWidth - 16);
      pdf.text(lines[0], left + 24, focusY);
      focusY += 6;
    });
  }

  drawCard(left + focusLeftWidth + gap, y, focusRightWidth, blockHeight, [242, 244, 255], [199, 206, 235]);
  setText(11, true, [40, 45, 92]);
  pdf.text("Plan", left + focusLeftWidth + gap + 3, y + 7);
  setText(8.5, false, [70, 74, 118]);
  const planTop = y + 14;
  const planLines = [
    "1. Finish all Tier 1 pending topics first.",
    "2. Reserve daily revision for completed topics.",
    "3. Use Tier 2 for score boost after Tier 1.",
    "4. Keep Tier 3 as quick-win revision set.",
  ];

  let planY = planTop;
  planLines.forEach((line) => {
    const consumed = writeWrapped(line, left + focusLeftWidth + gap + 3, planY, focusRightWidth - 6, 4.8);
    planY += consumed + 0.6;
  });

  y += blockHeight + 6;

  drawCard(left, y, contentWidth, 16, [244, 253, 245], [196, 224, 199]);
  setText(9.2, true, [35, 96, 53]);
  pdf.text("Summary: Focus on pending Tier 1 first, then Tier 2. Keep Tier 3 as fast revision wins.", left + 4, y + 9.8);

  // Page 2: detailed checklist by subject
  pdf.addPage();
  y = 14;

  drawCard(left, y, contentWidth, 18, [34, 31, 58], [34, 31, 58]);
  setText(14, true, [255, 255, 255]);
  pdf.text("Detailed Topic Checklist", left + 4, y + 7.6);
  setText(8.7, false, [220, 224, 245]);
  pdf.text("Use this page for daily tracking and revision planning.", left + 4, y + 13.2);
  y += 24;

  for (const summary of subjectSummary) {
    ensureSpace(16);

    const accent: RGB = subjectStyles[summary.subject];
    drawCard(left, y, contentWidth, 11, [248, 249, 255], [213, 216, 235]);
    setText(11, true, [42, 39, 75]);
    pdf.text(`${formatSubject(summary.subject)} (${summary.doneCount}/${summary.totalCount})`, left + 3, y + 7);
    drawProgressBar(left + 78, y + 4.7, contentWidth - 83, 3.3, pct(summary.doneCount, summary.totalCount), accent);
    y += 15;

    const sortedTopics = topics
      .filter((topic) => topic.subject === summary.subject)
      .sort((a, b) => a.order - b.order);

    for (const topic of sortedTopics) {
      ensureSpace(8);
      const checked = !!done[topic.id];
      const marker = checked ? "[x]" : "[ ]";

      setText(8.8, false, checked ? [40, 104, 63] : [86, 84, 118]);
      const line = `${marker} ${formatTopicNumber(topic.order)} ${topic.name} (Tier ${topic.tier})`;
      const consumed = writeWrapped(line, left + 2, y, contentWidth - 4, 4.8);
      y += consumed + 0.5;
    }

    y += 3;
  }

  // Footer with developer credit
  setText(7, false, [150, 148, 180]);
  pdf.text("Created by Neeraj • NEET Smart Tracker", left, pageBottom - 4);

  pdf.save(filename);
}
