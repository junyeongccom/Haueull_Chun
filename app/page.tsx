"use client";

import { useRouter } from "next/navigation";
import {
  Navbar,
  Hero,
  Stats,
  Billing,
  Business,
  CardDeal,
  Testimonials,
  Clients,
  CTA,
  Footer,
} from "../components/utils";

export default function Home() {
  const router = useRouter();

  return (
    <main className=" bg-primary w-full overflow-hidden font-poppins">
      <header className="paddingX flexCenter">
        <nav className="boxWidth">
          <Navbar />
        </nav>
      </header>
      <section className=" bg-primary flexStart">
        <section className="boxWidth">
          <Hero />
          {/* 🚀 Get Started 버튼 수정: 클릭 시 로그인 페이지로 이동 */}
          <button
            onClick={() => router.push("/account/auth/user/login")}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md"
          >
            Get Started
          </button>
        </section>
      </section>
      <section className=" bg-primary paddingX flexStart">
        <section className="boxWidth">
          <Stats />
          <Business />
          <Billing />
          <CardDeal />
          <Testimonials />
          <Clients />
          <CTA />
          <Footer />
        </section>
      </section>
    </main>
  );
}
