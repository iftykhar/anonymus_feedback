import Question from "@/components/website/question/Question";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#020617] p-6 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative z-10 w-full flex justify-center">
        <Question />
      </main>
    </div>
  );
}
