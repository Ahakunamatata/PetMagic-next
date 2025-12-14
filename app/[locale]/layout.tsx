import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import StoreHydration from "@/components/common/StoreHydration";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "AIPetLive - Transform Pet Photos into AI Art & Videos",
  description: "Turn your pet photos into amazing AI-generated images and videos. Create cartoon pets, baby versions, or funny characters in seconds.",
  keywords: "AI pet generator, pet photo transformation, AI pet images, AI pet videos, cartoon pet, pet art",
  authors: [{ name: "AIPetLive" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'en' | 'zh')) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <StoreHydration />
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
