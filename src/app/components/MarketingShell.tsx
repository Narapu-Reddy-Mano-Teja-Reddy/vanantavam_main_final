'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import FloatingController from '@/components/premium/FloatingController';
import FloatingWhatsApp from '@/components/premium/FloatingWhatsApp';
import GrainOverlay from '@/components/premium/GrainOverlay';
import SmoothScroll from '@/components/premium/SmoothScroll';

export default function MarketingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) {
      document.body.classList.add('admin-mode');
      const botElements = document.querySelectorAll(
        '[id*="kenyt"], [class*="kenyt"], iframe[src*="kenyt"]'
      );
      botElements.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const hero = document.getElementById('hero') || document.querySelector('.hero');
      const threshold = hero
        ? (hero.offsetTop + hero.offsetHeight) * 0.75
        : (window.innerHeight ? window.innerHeight * 0.65 : 400);

      if (scrollY <= threshold) {
        document.body.classList.add('in-hero-section');
      } else {
        document.body.classList.remove('in-hero-section');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Clean up Kenyt's duplicate WhatsApp button so only our native FloatingWhatsApp renders
    const removeKenytWhatsApp = () => {
      document.querySelectorAll(
        '#kenyt-bot-launcher .kenyt-whatsapp-btn, #kenyt-bot-launcher [class*="whatsapp"], #kenyt-bot-launcher [id*="whatsapp"], #kenyt-bot-launcher img[src*="whatsapp"], [id*="kenyt"] img[src*="whatsapp"]'
      ).forEach((el) => {
        el.remove();
      });
    };
    removeKenytWhatsApp();
    const cleanTimer = setInterval(removeKenytWhatsApp, 1000);

    return () => {
      clearInterval(cleanTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      document.body.classList.remove('in-hero-section');
    };
  }, [pathname, isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <FloatingController />
      <FloatingWhatsApp />

      {/* Kenyt Chat AI Embed Script placed directly under the WhatsApp floating icon */}
      <Script
        src="https://india.kenyt.ai/botapp/ChatbotUI/dist/js/bot-loader.js"
        strategy="lazyOnload"
        data-bot="116027152"
      />

      <GrainOverlay />
      <SmoothScroll>{children}</SmoothScroll>
    </>
  );
}
