"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { PortfolioTeam } from "@/lib/figma/types";
import { Dialog } from "../ui/Dialog";
import { MICRO_SLOW } from "@/lib/motion/constants";

type Props = {
  headline: string;
  teams: PortfolioTeam[];
};

const defaultTeams: PortfolioTeam[] = [
  {
    name: "EISEN Labs",
    detail: "DeFi trading & hedging UI with live microinteractions.",
  },
  {
    name: "HODL Bot",
    detail: "Brand & interaction patterns for bot experience.",
  },
  {
    name: "Product Summit",
    detail: "Storytelling deck for trading interfaces.",
  },
  {
    name: "Studio",
    detail: "Design engineering + prototypes.",
  },
];

export const TeamsSection = ({ headline, teams }: Props) => {
  const cards = useMemo(() => (teams.length ? teams : defaultTeams), [teams]);
  const [selected, setSelected] = useState<PortfolioTeam | null>(null);

  return (
    <section className="section-shell">
      <p className="text-h4-em mb-2">{`// Teams that I’ve made great outputs with`}</p>
      <h2 className="text-h2 leading-tight">{headline}</h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((team, idx) => (
          <motion.button
            key={team.name}
            onClick={() => setSelected(team)}
            className={clsx(
              "relative h-[240px] overflow-hidden rounded-3xl border border-white/50 bg-white/70 p-4 text-left shadow-lg backdrop-blur",
              "transition-transform duration-300 hover:-translate-y-1",
            )}
            animate={{
              y: [0, idx % 2 === 0 ? -6 : 6, 0],
              rotate: [0, idx % 2 === 0 ? 1.4 : -1.4, 0],
            }}
            transition={{
              duration: MICRO_SLOW,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          >
            <div className="absolute inset-0 gradient-spotlight opacity-70" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <span className="text-em uppercase tracking-[0.08em] text-gray-300">
                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </span>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-gray-900">
                  {team.name}
                </h3>
                <p className="mt-2 text-body">{team.detail}</p>
              </div>
              <span className="text-em text-gray-900">Tap to open</span>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected ? (
          <Dialog
            open={!!selected}
            onOpenChange={(open) => {
              if (!open) setSelected(null);
            }}
            title={selected.name}
            description={selected.detail}
            trigger={<span className="sr-only">open</span>}
          >
            <p className="text-body">
              I love building in small, focused teams where everyone owns both the craft and the
              outcome. Reach out if you’d like to jam on similar problems.
            </p>
            <div className="mt-4 text-em text-gray-900">Click × or press Esc to close.</div>
          </Dialog>
        ) : null}
      </AnimatePresence>
    </section>
  );
};

