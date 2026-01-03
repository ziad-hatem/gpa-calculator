import GPACalculator from "@/components/GPACalculator";
import { Metadata } from "next";

export const revalidate = 86400; // Cache for 24 hours

export const metadata: Metadata = {
  title: "GPA Calculator Pro | Precision Academic Tool",
  description:
    "Calculate your semester GPA instantly. Supports fixed credit hours, automated logic, and result exporting. Perfect for university students.",
  keywords: [
    "GPA Calculator",
    "Academic Tool",
    "University Grades",
    "Semester GPA",
    "Credit Hours",
    "Student Tools",
  ],
  authors: [{ name: "Ziad Hatem" }],
  openGraph: {
    title: "GPA Calculator Pro",
    description:
      "Calculate your semester GPA instantly with our precise, student-friendly tool.",
    type: "website",
    locale: "en_US",
    siteName: "Ziad Hatem Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "GPA Calculator Pro",
    description:
      "Calculate your semester GPA instantly. Supports fixed credit hours and result exporting.",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background selection:bg-accent selection:text-accent-foreground relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 py-12 md:py-20 px-4">
        <GPACalculator />
      </div>
    </main>
  );
}
