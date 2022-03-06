import { useEffect, useState } from "react";
import Head from "next/head";
import { getMany, set, del } from "idb-keyval/dist/index";
import { useTheme } from "next-themes";
import TopAppBar from "@components/TopAppBar";
import Switch from "@components/elements/Switch";

type Settings = {
  hideGoodreadsRatings?: boolean;
  hideMyRatings?: boolean;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const loadSettings = async () => {
      const [hideGoodreadsRatings, hideMyRatings] = await getMany([
        "hideGoodreadsRatings",
        "hideMyRatings",
        "disableAnalytics",
      ]);

      setSettings({
        hideGoodreadsRatings,
        hideMyRatings,
      });
    };
    loadSettings();
  }, []);

  const setSetting = async (key: string, value?: boolean | string) => {
    setSettings({
      ...settings,
      [key]: value,
    });

    if (value === null) {
      del(key);
    } else {
      console.log(key, value);
      set(key, value);
    }
  };

  return (
    <>
      <Head>
        <title key="title">Settings | Antisocial Bibliophile</title>
      </Head>
      <TopAppBar title="Settings" />
      <main className="prose dark:prose-light container mx-auto p-4">
        <section>
          <h2>Settings</h2>
          <div className="mb-5">
            <b>Theme</b>
            <select
              className="w-full border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-700 py-2 px-3 border rounded focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
              onChange={(e) => setTheme(e.target.value)}
              value={theme}
            >
              <option value="system">Use device settings</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="flex justify-between mb-5">
            <div>
              <b>Hide Goodreads ratings</b>
              <br />
              By default, the app shows the average Goodreads ratings for books.
              If you don&apos;t want anything with the community, you can
              disable that here.
            </div>
            <Switch
              className="flex-shrink-0"
              on={settings.hideGoodreadsRatings}
              onToggle={() =>
                setSetting(
                  "hideGoodreadsRatings",
                  !settings.hideGoodreadsRatings
                )
              }
            />
          </div>
          <div className="flex justify-between mb-5">
            <div>
              <b>Hide my ratings</b>
              <br />
              By default, the app lets you rate books and see your book ratings.
              If you simply want to track reading and don&apos;t want ratings,
              you can disable that here.
            </div>
            <Switch
              className="flex-shrink-0"
              on={settings.hideMyRatings}
              onToggle={() =>
                setSetting("hideMyRatings", !settings.hideMyRatings)
              }
            />
          </div>
        </section>
        <section>
          <h2>About the App</h2>
          <p>
            This app was created by{" "}
            <a
              href="https://davidhallberg.design"
              target="_blank"
              rel="noreferrer"
            >
              a Swedish guy named David
            </a>
            . It&apos;s built as a{" "}
            <a href="https://nextjs.org" target="_blank" rel="noreferrer">
              Next.js
            </a>
            , app, using{" "}
            <a href="https://tailwindcss.com" target="_blank" rel="noreferrer">
              Tailwind
            </a>{" "}
            for styling, and a sprinkling of{" "}
            <a href="https://heroicons.com" target="_blank" rel="noreferrer">
              Heroicons
            </a>{" "}
            here and there. All illustrations (including the app icon) are from{" "}
            <a href="https://undraw.co" target="_blank" rel="noreferrer">
              unDraw
            </a>
            , coincidentally one of the best open-source projects out there.
          </p>
          <p>
            The app uses{" "}
            <a href="https://umami.is">
              umami, a &aquot;simple, easy to use, self-hosted web analytics
              solution&aquot;
            </a>
            . No personally identifiable information is collected and all data
            is anonymized.
          </p>
          <p>
            Notice anything wrong with the app? Any bugs you want fixed, or
            features you would like added?{" "}
            <a
              href="https://github.com/dvdhllbrg/agr-next"
              target="_blank"
              rel="noreferrer"
            >
              Create an issue on GitHub
            </a>{" "}
            (or go ahead and fix it yourself, pull requests are very welcome!)
            or{" "}
            <a
              href="https://twitter.com/dvdhllbrg"
              target="_blank"
              rel="noreferrer"
            >
              hit me up on Twitter
            </a>
            . Hope you enjoy the app!
          </p>
        </section>
      </main>
    </>
  );
}
