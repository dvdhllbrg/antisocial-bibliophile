import BottomAppBar from "@components/BottomAppBar";
import Script from "next/script";
import "../styles/globals.css";

type RootLayoutProps = {
  children: React.ReactNode;
};
const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <Script
        strategy="lazyOnload"
        data-website-id="fb737107-35b4-41f2-9143-6a4255ce0cee"
        data-do-not-track="true"
        data-domains="antisocial-bibliophile.vercel.app"
        src="https://umami-five-cyan.vercel.app/umami.js"
      />
      {/* This whole bit is to get toggleable, no-flash dark mode. */}
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){function e(e){document.body.className=e}window.__setPreferredTheme=function(t){e(t);try{localStorage.setItem("theme",t)}catch(r){}};var t,r=window.matchMedia("(prefers-color-scheme: dark)");r.addEventListener("change",function(e){window.__setPreferredTheme(e.matches?"dark":"light")});try{t=localStorage.getItem("theme")}catch(c){}e(t||(r.matches?"dark":"light"))}();`,
          }}
        />
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
          {children}
          <BottomAppBar />
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
