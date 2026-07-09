import Link from "next/link";

const steps = [
  {
    title: "Create Project",
    description:
      "Set up your project, invite contributors, and define milestone payments.",
  },
  {
    title: "Lock Funds",
    description:
      "Deposit funds securely into FlowVault so contributors know the budget is guaranteed.",
  },
  {
    title: "Approve Milestones",
    description:
      "Review completed work and approve milestones only when deliverables are met.",
  },
  {
    title: "Release Payments",
    description:
      "FlowVault automatically releases funds transparently after milestone approval.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">

      {/* NAVBAR */}
      
  <nav className="py-6">
  <div className="mx-auto flex max-w-7xl justify-center">

<Link
  href="/projects"
  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 shadow-lg"
>
  Projects
</Link>

  </div>
</nav>

   

         {/* HERO */}

      <section className="relative isolate overflow-hidden">

        <div className="absolute left-1/2 top-24 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[150px]" />

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="mx-auto max-w-3xl text-center">

            <div className="mb-8 inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2">

              <div className="mr-2 h-2 w-2 rounded-full bg-blue-500 animate-pulse" />

              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
                FlowVault v2 Live
              </span>

            </div>

            <h1 className="text-5xl font-black leading-tight md:text-7xl">
              Secure Milestones.
              <br />
              <span className="text-blue-500">
                Automated Trust.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/65">
              Lock project funds once, approve milestones with confidence,
              and release payments transparently through programmable escrow
              powered by FlowVault.
            </p>
        

      <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

  <Link
    href="/projects/new"
    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold transition hover:bg-blue-500"
  >
    Create Project
    <span>→</span>
  </Link>

  <Link
    href="/projects"
    className="rounded-xl border border-white/15 px-8 py-4 transition hover:border-blue-500 hover:text-white"
  >
    View Projects
  </Link>

</div>

          </div>

          <div className="mt-20 flex justify-center">

            <img
              src="/dashboard.png"
              alt="MileStack Dashboard"
              className="w-full max-w-5xl rounded-3xl border border-white/10 shadow-2xl"
            />

          </div>

        </div>

      </section>

         {/* STATS */}

      <section className="mx-auto max-w-7xl px-6 pb-24">

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-blue-500">

            <h2 className="text-5xl font-black text-blue-500">
              4
            </h2>

            <p className="mt-3 text-white/60">
              Milestone Workflow
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-blue-500">

            <h2 className="text-5xl font-black text-blue-500">
              100%
            </h2>

            <p className="mt-3 text-white/60">
              On-chain Escrow
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-blue-500">

            <h2 className="text-5xl font-black text-blue-500">
              24/7
            </h2>

            <p className="mt-3 text-white/60">
              Transparent Payments
            </p>

          </div>

        </div>

      </section>


        {/* HOW IT WORKS */}

      <section className="mx-auto max-w-7xl px-6 pb-24">

        <div className="text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            How It Works
          </p>

          <h2 className="mt-4 text-4xl font-black">
            A simple escrow workflow.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/60">
            MileStack combines milestone approvals with programmable
            escrow, giving clients and contributors confidence
            throughout every stage of a project.
          </p>

        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {steps.map((step, index) => (

            <div
              key={step.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition duration-300 hover:-translate-y-2 hover:border-blue-500"
            >

              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold">
                {index + 1}
              </div>

              <h3 className="text-xl font-semibold">
                {step.title}
              </h3>

              <p className="mt-4 leading-7 text-white/60">
                {step.description}
              </p>

            </div>

          ))}

        </div>

      </section>


   
         {/* WHY MILESTACK */}

      <section className="mx-auto max-w-7xl px-6 pb-24">

        <div className="text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            Why MileStack
          </p>

          <h2 className="mt-4 text-4xl font-black">
            Built for modern teams.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/60">
            MileStack helps clients and contributors collaborate
            confidently through programmable escrow, milestone
            approvals, and transparent on-chain payments.
          </p>

        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition duration-300 hover:-translate-y-2 hover:border-blue-500">

            <h3 className="text-xl font-semibold">
              Programmable Escrow
            </h3>

            <p className="mt-4 leading-7 text-white/60">
              Funds stay securely locked until milestone conditions
              are met, protecting both clients and contributors.
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition duration-300 hover:-translate-y-2 hover:border-blue-500">

            <h3 className="text-xl font-semibold">
              Transparent Workflow
            </h3>

            <p className="mt-4 leading-7 text-white/60">
              Every approval and payment is recorded on-chain,
              creating complete transparency for every project.
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition duration-300 hover:-translate-y-2 hover:border-blue-500">

            <h3 className="text-xl font-semibold">
              Fast Settlement
            </h3>

            <p className="mt-4 leading-7 text-white/60">
              Release milestone payments instantly after approval,
              reducing delays while building trust between teams.
            </p>

          </div>

        </div>

      </section>

       {/* FOOTER */}

    <footer className="border-t border-white/10 mt-24">

  <div className="mx-auto max-w-7xl px-6 py-16">

    <div className="grid gap-12 md:grid-cols-3">

      {/* Brand */}

      <div>

        <h2 className="text-3xl font-black">
          Mile<span className="text-blue-500">Stack</span>
        </h2>
   
    <p className="mt-5 max-w-sm leading-8 text-white/60">
          Secure milestone payments with programmable escrow
        </p>

      </div>

      {/* Product */}

      <div>

        <h3 className="text-lg font-semibold">
          Product
        </h3>

        <div className="mt-5 flex flex-col gap-4 text-white/60">

          <Link
            href="/projects/new"
            className="transition hover:text-blue-400"
          >
            Create Project
          </Link>

          <Link
            href="/projects"
            className="transition hover:text-blue-400"
          >
            View Projects
          </Link>

        </div>

      </div>

      {/* Built With */}

      <div>

        <h3 className="text-lg font-semibold">
          Built With
        </h3>

        <div className="mt-5 flex flex-col gap-4 text-white/60">

          <span>FlowVault</span>
          <span>Stacks</span>
          <span>Programmable Escrow</span>

        </div>

      </div>

    </div>

  </div>

  <div className="border-t border-white/10">

    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-white/40 md:flex-row">

      <p>© 2026 MileStack. All rights reserved.</p>

      <p>Powered by FlowVault</p>

    </div>

  </div>

</footer>    

    </main>
  );
}
