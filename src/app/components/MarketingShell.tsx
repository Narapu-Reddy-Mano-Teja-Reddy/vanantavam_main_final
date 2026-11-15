'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import FloatingController from '@/components/premium/FloatingController';
import GrainOverlay from '@/components/premium/GrainOverlay';
import SmoothScroll from '@/components/premium/SmoothScroll';

export default function MarketingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [loadChatbot, setLoadChatbot] = useState(false);

  useEffect(() => {
    if (isAdmin) return;

    // Load third-party chatbot smoothly on user interaction or deep idle
    const triggerChatbot = () => {
      setLoadChatbot(true);
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener('scroll', triggerChatbot);
      window.removeEventListener('touchstart', triggerChatbot);
      window.removeEventListener('click', triggerChatbot);
      window.removeEventListener('mousemove', triggerChatbot);
      window.removeEventListener('keydown', triggerChatbot);
    };

    window.addEventListener('scroll', triggerChatbot, { passive: true, once: true });
    window.addEventListener('touchstart', triggerChatbot, { passive: true, once: true });
    window.addEventListener('click', triggerChatbot, { passive: true, once: true });
    window.addEventListener('mousemove', triggerChatbot, { passive: true, once: true });
    window.addEventListener('keydown', triggerChatbot, { passive: true, once: true });

    // Fallback: only load after 12 seconds of complete inactivity
    const timer = setTimeout(triggerChatbot, 12000);

    return () => {
      clearTimeout(timer);
      cleanupListeners();
    };
  }, [isAdmin]);

  useEffect(() => {
    // Hide or clean up third-party chatbot/WhatsApp widgets if user navigated from a marketing page to /admin
    if (isAdmin) {
      document.body.classList.add('admin-mode');
      const botElements = document.querySelectorAll(
        '[id*="kenyt"], [class*="kenyt"], iframe[src*="kenyt"], [id*="whatsapp"], [class*="whatsapp"]'
      );
      botElements.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
    } else {
      document.body.classList.remove('admin-mode');
      const botElements = document.querySelectorAll(
        '[id*="kenyt"], [class*="kenyt"], iframe[src*="kenyt"]'
      );
      botElements.forEach((el) => {
        (el as HTMLElement).style.display = '';
      });
    }
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <FloatingController />
      <GrainOverlay />
      <SmoothScroll>{children}</SmoothScroll>

      {/* Kenyt AI Chatbot & WhatsApp Widget - Marketing pages only, loaded after interaction or idle */}
      {loadChatbot && (
        <Script
          src="https://india.kenyt.ai/botapp/ChatbotUI/dist/js/bot-loader.js"
          strategy="lazyOnload"
          data-bot="116027152"
        />
      )}
    </>
  );
}

