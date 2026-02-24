import { CarrierTable } from "./components/carrier-table";
import { CustomerGallery } from "./components/custom-gallery";
import { IphoneLockGuides } from "./components/featured-products";

import { Features } from "./components/features";
import { FloatingContacts } from "./components/floating-contacts";
import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { News } from "./components/news";
import { Newsletter } from "./components/newsletter";
import { PromoModal } from "./components/promo-modal";
import { QuestionIPLock } from "./components/question-iplock";
import { Ticker } from "./components/ticker";
import { Videos } from "./components/video";

export default function Home() {
  return (
    <main className="min-h-screen">
      <PromoModal />
      <Hero />
      <QuestionIPLock />
      <IphoneLockGuides />

      <CarrierTable />
      <CustomerGallery />
    </main>
  );
}
