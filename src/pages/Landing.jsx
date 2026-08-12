import { useEffect } from "react";
import { Link } from "react-router-dom";

const FONT_LINK_ID = "workflow-landing-fonts";

function ensureFontsLoaded() {
  if (document.getElementById(FONT_LINK_ID)) return;
  const link = document.createElement("link");
  link.id = FONT_LINK_ID;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap";
  document.head.appendChild(link);
}

const displayFont = { fontFamily: "'Space Grotesk', sans-serif" };
const monoFont = { fontFamily: "'IBM Plex Mono', monospace" };

export default function Landing() {
  useEffect(() => {
    ensureFontsLoaded();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#12172B]">
      <style>{`
        @keyframes glide {
          0%, 14% { transform: translate(0, 0); }
          30%, 44% { transform: translate(calc(100% + 14px), 46px); }
          60%, 74% { transform: translate(calc(200% + 28px), 20px); }
          90%, 100% { transform: translate(calc(200% + 28px), 20px); }
        }
        @keyframes fadecycle {
          0%, 10% { opacity: 1; }
          16% { opacity: 0.35; }
          92% { opacity: 0.35; }
          98%, 100% { opacity: 1; }
        }
        .lp-glide { animation: glide 9s ease-in-out infinite; }
        .lp-fade { animation: fadecycle 9s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .lp-glide, .lp-fade { animation: none; }
        }
      `}</style>

      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-[#F8F9FB]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
          <div className="flex items-center gap-2 text-lg font-bold" style={displayFont}>
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3B49FC]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1.2" fill="white" />
                <rect x="8" y="1" width="5" height="9" rx="1.2" fill="white" fillOpacity="0.55" />
                <rect x="1" y="8" width="5" height="5" rx="1.2" fill="white" fillOpacity="0.55" />
              </svg>
            </span>
            Workflow
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900">
              Features
            </a>
            <a href="#how" className="text-sm font-medium text-gray-500 hover:text-gray-900">
              How it works
            </a>
            <a href="#roles" className="text-sm font-medium text-gray-500 hover:text-gray-900">
              Roles
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/signin" className="text-sm font-semibold text-gray-500 hover:text-gray-900">
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-[#3B49FC] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="mx-auto max-w-6xl px-6 pb-10 pt-20 sm:px-8 sm:pt-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span
              className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#EEF0FF] px-3 py-1.5 text-xs font-medium text-[#3B49FC]"
              style={monoFont}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#0EA5A0]" />
              Now with live activity tracking
            </span>

            <h1
              className="max-w-lg text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[54px]"
              style={displayFont}
            >
              Work, organized <span className="text-[#3B49FC]">without</span> the overhead.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-500">
              Workflow gives your team one place to plan projects, assign tasks, and see
              what's actually moving — without wrestling a spreadsheet or a tool built for
              someone else's process.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="rounded-lg bg-[#3B49FC] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Start for free
              </Link>
              <a
                href="#how"
                className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:border-gray-900"
              >
                See how it works
              </a>
            </div>

            <p className="mt-4 text-xs text-gray-400">
              No credit card required · Set up a workspace in under two minutes
            </p>
          </div>

          {/* SIGNATURE BOARD */}
          <div
            className="relative overflow-hidden rounded-[20px] border border-gray-200 bg-white p-5 shadow-[0_1px_2px_rgba(18,23,43,0.04),0_8px_24px_-8px_rgba(18,23,43,0.10)]"
            role="img"
            aria-label="Animated preview of a Workflow task board with a card moving from To Do to Done"
          >
            <div className="mb-4 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-gray-200" />
              <span className="h-2 w-2 rounded-full bg-gray-200" />
              <span className="h-2 w-2 rounded-full bg-gray-200" />
            </div>

            <div className="grid grid-cols-3 gap-3.5">
              <div className="relative min-h-[210px]">
                <div
                  className="mb-2.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400"
                  style={monoFont}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                  To Do
                </div>
                <div className="lp-fade mb-2.5 rounded-lg border border-gray-200 bg-[#F8F9FB] p-3 text-xs font-semibold">
                  <span
                    className="mb-1.5 inline-block rounded-full bg-[#EEF0FF] px-2 py-0.5 text-[10px] font-medium text-[#3B49FC]"
                    style={monoFont}
                  >
                    DESIGN
                  </span>
                  <p className="m-0">Redesign onboarding flow</p>
                  <div
                    className="mt-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#3B49FC] text-[9px] text-white"
                    style={displayFont}
                  >
                    JD
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-[#F8F9FB] p-3 text-xs font-semibold">
                  <span
                    className="mb-1.5 inline-block rounded-full bg-[#FCF2E1] px-2 py-0.5 text-[10px] font-medium text-[#B87A17]"
                    style={monoFont}
                  >
                    BUG
                  </span>
                  <p className="m-0">Fix export timeout</p>
                  <div
                    className="mt-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#3B49FC] text-[9px] text-white"
                    style={displayFont}
                  >
                    PS
                  </div>
                </div>

                {/* gliding card overlays the columns */}
                <div
                  className="lp-glide absolute left-0 top-[190px] z-10 w-full rounded-lg border border-gray-200 bg-[#F8F9FB] p-3 text-xs font-semibold shadow-sm"
                  style={{ width: "calc(100% - 4px)" }}
                >
                  <span
                    className="mb-1.5 inline-block rounded-full bg-[#EEF0FF] px-2 py-0.5 text-[10px] font-medium text-[#3B49FC]"
                    style={monoFont}
                  >
                    DESIGN
                  </span>
                  <p className="m-0">Ship pricing page copy</p>
                  <div
                    className="mt-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#3B49FC] text-[9px] text-white"
                    style={displayFont}
                  >
                    JD
                  </div>
                </div>
              </div>

              <div className="min-h-[210px]">
                <div
                  className="mb-2.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400"
                  style={monoFont}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E8A33D]" />
                  In Progress
                </div>
                <div className="rounded-lg border border-gray-200 bg-[#F8F9FB] p-3 text-xs font-semibold">
                  <span
                    className="mb-1.5 inline-block rounded-full bg-[#E5F8F6] px-2 py-0.5 text-[10px] font-medium text-[#0EA5A0]"
                    style={monoFont}
                  >
                    API
                  </span>
                  <p className="m-0">Rate limit middleware</p>
                  <div
                    className="mt-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#3B49FC] text-[9px] text-white"
                    style={displayFont}
                  >
                    RK
                  </div>
                </div>
              </div>

              <div className="min-h-[210px]">
                <div
                  className="mb-2.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400"
                  style={monoFont}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0EA5A0]" />
                  Done
                </div>
                <div className="rounded-lg border border-gray-200 bg-[#F8F9FB] p-3 text-xs font-semibold">
                  <span
                    className="mb-1.5 inline-block rounded-full bg-[#EEF0FF] px-2 py-0.5 text-[10px] font-medium text-[#3B49FC]"
                    style={monoFont}
                  >
                    QA
                  </span>
                  <p className="m-0">Cross-browser pass</p>
                  <div
                    className="mt-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#3B49FC] text-[9px] text-white"
                    style={displayFont}
                  >
                    MN
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* TRUST STRIP */}
      <div className="border-y border-gray-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-7 sm:px-8 md:grid-cols-3">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 flex-shrink-0 text-[#3B49FC]"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <p className="m-0 text-sm text-gray-500">
              <strong className="text-gray-900">Set up fast.</strong> Create a workspace and
              invite your team the same day you sign up.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 flex-shrink-0 text-[#3B49FC]"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p className="m-0 text-sm text-gray-500">
              <strong className="text-gray-900">Roles that fit real teams.</strong> Admins,
              managers, and employees each see exactly what they need.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 flex-shrink-0 text-[#3B49FC]"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 19V5a2 2 0 0 1 2-2h8.5L20 7.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
              <path d="M14 3v5h5" />
            </svg>
            <p className="m-0 text-sm text-gray-500">
              <strong className="text-gray-900">Nothing lost in the shuffle.</strong> Docs,
              tasks, and activity live in the same workspace.
            </p>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="mb-14 max-w-lg">
            <div
              className="mb-3 text-xs font-medium uppercase tracking-widest text-gray-400"
              style={monoFont}
            >
              Features
            </div>
            <h2 className="text-3xl font-bold leading-tight sm:text-[36px]" style={displayFont}>
              Everything a project needs, nothing it doesn't
            </h2>
            <p className="mt-3.5 text-base leading-relaxed text-gray-500">
              Workflow stays out of the way until you need it — then gives you exactly the
              tool for the moment.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-7 transition hover:bg-gray-50">
              <div className="mb-4.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF0FF] text-[#3B49FC]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="9" rx="1" />
                  <rect x="14" y="3" width="7" height="5" rx="1" />
                  <rect x="14" y="12" width="7" height="9" rx="1" />
                  <rect x="3" y="16" width="7" height="5" rx="1" />
                </svg>
              </div>
              <h3 className="mb-2 text-base font-semibold">Projects & boards</h3>
              <p className="m-0 text-sm leading-relaxed text-gray-500">
                Group work into projects with their own status, timeline, and team — then
                track tasks on a board built for how work actually moves.
              </p>
            </div>
            <div className="bg-white p-7 transition hover:bg-gray-50">
              <div className="mb-4.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF0FF] text-[#3B49FC]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="mb-2 text-base font-semibold">Team assignment</h3>
              <p className="m-0 text-sm leading-relaxed text-gray-500">
                Assign tasks straight to whoever's actually on the project — no digging
                through the full company directory to find them.
              </p>
            </div>
            <div className="bg-white p-7 transition hover:bg-gray-50">
              <div className="mb-4.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF0FF] text-[#3B49FC]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />
                </svg>
              </div>
              <h3 className="mb-2 text-base font-semibold">Live activity feed</h3>
              <p className="m-0 text-sm leading-relaxed text-gray-500">
                See what changed, who changed it, and when — updates land in real time, so
                status meetings can be shorter.
              </p>
            </div>
            <div className="bg-white p-7 transition hover:bg-gray-50">
              <div className="mb-4.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF0FF] text-[#3B49FC]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19V5a2 2 0 0 1 2-2h8.5L20 7.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
                  <path d="M14 3v5h5" />
                </svg>
              </div>
              <h3 className="mb-2 text-base font-semibold">Docs, in context</h3>
              <p className="m-0 text-sm leading-relaxed text-gray-500">
                Keep briefs, sheets, and reference files next to the work they belong to,
                instead of buried in someone's inbox.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <div id="how" className="border-y border-gray-200 bg-white">
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <div className="mb-14 max-w-lg">
              <div
                className="mb-3 text-xs font-medium uppercase tracking-widest text-gray-400"
                style={monoFont}
              >
                How it works
              </div>
              <h2 className="text-3xl font-bold leading-tight sm:text-[36px]" style={displayFont}>
                Three steps to an organized team
              </h2>
            </div>

            <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3">
              <div className="hidden md:block absolute left-[16.66%] right-[16.66%] top-[23px] h-px bg-gray-200" />

              <div className="relative">
                <div
                  className="relative z-10 mb-5 flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#12172B] text-sm text-white"
                  style={monoFont}
                >
                  01
                </div>
                <h3 className="mb-2 text-lg font-semibold">Create your workspace</h3>
                <p className="m-0 max-w-[280px] text-sm leading-relaxed text-gray-500">
                  Set your company name and you're in — as the admin, with full control from
                  the start.
                </p>
              </div>

              <div className="relative">
                <div
                  className="relative z-10 mb-5 flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#12172B] text-sm text-white"
                  style={monoFont}
                >
                  02
                </div>
                <h3 className="mb-2 text-lg font-semibold">Invite your team</h3>
                <p className="m-0 max-w-[280px] text-sm leading-relaxed text-gray-500">
                  Add managers and employees by email. Everyone gets a role that matches what
                  they should see.
                </p>
              </div>

              <div className="relative">
                <div
                  className="relative z-10 mb-5 flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#12172B] text-sm text-white"
                  style={monoFont}
                >
                  03
                </div>
                <h3 className="mb-2 text-lg font-semibold">Assign & track work</h3>
                <p className="m-0 max-w-[280px] text-sm leading-relaxed text-gray-500">
                  Spin up a project, assign the first tasks, and watch the board update as
                  your team moves them.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ROLES */}
      <section id="roles" className="py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 sm:px-8 md:grid-cols-2 md:gap-16">
          <div>
            <div
              className="mb-3 text-xs font-medium uppercase tracking-widest text-gray-400"
              style={monoFont}
            >
              Roles & permissions
            </div>
            <h2 className="mb-4 text-[28px] font-bold leading-tight sm:text-[32px]" style={displayFont}>
              Every person sees exactly what their role needs
            </h2>
            <p className="text-[15.5px] leading-relaxed text-gray-500">
              No more all-or-nothing access. Admins manage the workspace, managers run their
              projects, and employees stay focused on their own tasks — automatically,
              without you setting up permissions by hand.
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-3.5 rounded-xl border border-gray-200 bg-white p-4">
              <span
                className="min-w-[78px] flex-shrink-0 rounded-full bg-[#EEF0FF] px-3 py-1.5 text-center text-[11px] font-medium text-[#3B49FC]"
                style={monoFont}
              >
                ADMIN
              </span>
              <p className="m-0 text-sm text-gray-500">
                Manages the workspace, members, and every project inside it.
              </p>
            </div>
            <div className="flex items-center gap-3.5 rounded-xl border border-gray-200 bg-white p-4">
              <span
                className="min-w-[78px] flex-shrink-0 rounded-full bg-[#FCF2E1] px-3 py-1.5 text-center text-[11px] font-medium text-[#B87A17]"
                style={monoFont}
              >
                MANAGER
              </span>
              <p className="m-0 text-sm text-gray-500">
                Creates projects, assigns tasks, and reviews submitted work.
              </p>
            </div>
            <div className="flex items-center gap-3.5 rounded-xl border border-gray-200 bg-white p-4">
              <span
                className="min-w-[78px] flex-shrink-0 rounded-full bg-[#E5F8F6] px-3 py-1.5 text-center text-[11px] font-medium text-[#0EA5A0]"
                style={monoFont}
              >
                EMPLOYEE
              </span>
              <p className="m-0 text-sm text-gray-500">
                Sees their assigned tasks and the projects they're part of — nothing else.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 sm:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#12172B] px-8 py-16 text-center sm:px-12">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(600px 300px at 50% 0%, rgba(59,73,252,0.35), transparent 70%)",
            }}
          />
          <div className="relative">
            <h2
              className="mx-auto max-w-md text-[28px] font-bold text-white sm:text-[34px]"
              style={displayFont}
            >
              Ready to get your team organized?
            </h2>
            <p className="mt-3.5 text-[15.5px] text-gray-400">
              Set up your workspace in under two minutes.
            </p>
            <div className="mt-7 flex justify-center">
              <Link
                to="/register"
                className="rounded-lg bg-[#3B49FC] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Start for free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 sm:px-8">
          <div className="flex items-center gap-2 text-base font-bold" style={displayFont}>
            <span className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-[#3B49FC]">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1.2" fill="white" />
                <rect x="8" y="1" width="5" height="9" rx="1.2" fill="white" fillOpacity="0.55" />
                <rect x="1" y="8" width="5" height="5" rx="1.2" fill="white" fillOpacity="0.55" />
              </svg>
            </span>
            Workflow
          </div>
          <div className="flex gap-6">
            <a href="#features" className="text-sm text-gray-400 hover:text-gray-600">
              Features
            </a>
            <a href="#how" className="text-sm text-gray-400 hover:text-gray-600">
              How it works
            </a>
            <a href="#roles" className="text-sm text-gray-400 hover:text-gray-600">
              Roles
            </a>
          </div>
          <div className="text-sm text-gray-400">© 2026 Workflow. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}