/* eslint-disable react/no-unescaped-entities */
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientNav from "./Components/ClientNav";
import Footer from "./Components/Footer";
import Head from "next/head"; // Import Head

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Clothing Department Union",
  description: "Deals in All Kind of Premium Qualities in Clothing",
  icons: {
    icon: ["/imgs/favicon/favicon.ico?v=4"],
    apple: ["imgs/favicon/apple-touch-icon.png?v=4"],
    shortcut: ["imgs/favicon/apple-touch-icon.png"],
  },
  verification: {
    google: "ozZ41ZOWAlxYbZTtbYIo4w-lH-R41y1eRCnowZKBbFk",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1218412293219923');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1218412293219923&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-gray-100 pt-[80px]`}
      >
        <ClientNav />
        {children}
        <Footer />
      </body>
    </html>
  );
}