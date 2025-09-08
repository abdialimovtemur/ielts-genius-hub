import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Headphones, Mic, PenSquare } from "lucide-react";

export default function LevelCheckPage() {
  const testSections = [
    {
      title: "Listening",
      description: "Test your ability to understand spoken English in various contexts.",
      icon: <Headphones className="h-10 w-10" />,
      href: "/level-check/listening",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Reading",
      description: "Evaluate your comprehension of written English texts and passages.",
      icon: <BookOpen className="h-10 w-10" />,
      href: "/level-check/reading",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Writing",
      description: "Assess your ability to express ideas in well-structured written English.",
      icon: <PenSquare className="h-10 w-10" />,
      href: "/level-check/writing",
      color: "bg-amber-100 text-amber-700",
    },
    {
      title: "Speaking",
      description: "Measure your fluency and coherence in spoken English communication.",
      icon: <Mic className="h-10 w-10" />,
      href: "/level-check/speaking",
      color: "bg-rose-100 text-rose-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">IELTS Practice Tests</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Prepare for your IELTS exam with our comprehensive practice tests. Select a section below to begin improving your skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testSections.map((section, index) => (
            <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardHeader className={`pb-3 ${section.color} flex flex-row items-center justify-between`}>
                <CardTitle className="text-2xl">{section.title}</CardTitle>
                <div className={section.color.replace("bg-", "text-").replace("100", "700")}>
                  {section.icon}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <CardDescription className="text-lg mb-4 text-slate-700">
                  {section.description}
                </CardDescription>
                <Button asChild className="w-full">
                  <Link href={section.href}>Start {section.title} Test</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">About the IELTS Test</h2>
          <p className="text-slate-600 mb-3">
            The International English Language Testing System (IELTS) is designed to help you work, study or migrate to a country where English is the native language.
          </p>
          <p className="text-slate-600">
            Each section of the test assesses different language skills. Regular practice with our tests will help you become familiar with the format and improve your scores.
          </p>
        </div>
      </div>
    </div>
  );
}