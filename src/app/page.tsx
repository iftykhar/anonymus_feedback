import Question from "@/components/website/question/Question";
import Reviews from "@/components/website/Reviews";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#020617] p-6 overflow-x-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative z-10 w-full flex flex-col items-center">
        <section className="min-h-screen flex items-center justify-center w-full">
          <Question />
        </section>

        <Reviews />
      </main>
    </div>
  );
}
