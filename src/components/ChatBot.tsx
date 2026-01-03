"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function ChatBot() {
  const pathname = usePathname();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Only load bot if pathname doesn't start with /admin
    if (pathname && !pathname.startsWith("/admin")) {
      setShouldLoad(true);
    } else {
      setShouldLoad(false);
    }
  }, [pathname]);

  if (!shouldLoad) {
    return null;
  }

  return (
    <Script
      id="collect-chat"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w, d) {
            w.CollectId = "690b167f8956251af0466352";
            var h = d.head || d.getElementsByTagName("head")[0];
            var s = d.createElement("script");
            s.setAttribute("type", "text/javascript");
            s.async = true;
            s.setAttribute("src", "https://collectcdn.com/launcher.js");
            h.appendChild(s);
          })(window, document);
        `,
      }}
    />
  );
}

