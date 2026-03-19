'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { mockItems, filterItems } from '@/lib/mockItems';
import { FilterBar } from '@/components/pricing/FilterBar';
import { PriceTable } from '@/components/pricing/SimulationTable';
import { PricingOptimizationPage } from '@/components/pricing/PricingOptimizationPage';

export default function PricingPage() {
  // Draft filters (what user is selecting in UI)
  const [draftAction, setDraftAction] = useState('profit');
  const [draftDepartment, setDraftDepartment] = useState('fresh');
  const [draftRegion, setDraftRegion] = useState('national');
  const [draftState, setDraftState] = useState('');
  const [draftStore, setDraftStore] = useState('');

  // Applied filters (what drives the table)
  const [appliedAction, setAppliedAction] = useState('profit');
  const [appliedDepartment, setAppliedDepartment] = useState('fresh');
  const [appliedRegion, setAppliedRegion] = useState('national');
  const [appliedState, setAppliedState] = useState('');
  const [appliedStore, setAppliedStore] = useState('');

  // Table state
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [edits, setEdits] = useState<Record<string, { userAdjustedPrice?: number }>>({});
  const [showTable, setShowTable] = useState(false);

  const handleApplyFilters = () => {
    setAppliedAction(draftAction);
    setAppliedDepartment(draftDepartment);
    setAppliedRegion(draftRegion);
    setAppliedState(draftState);
    setAppliedStore(draftStore);
    setShowTable(true);
  };

  const handleResetFilters = () => {
    setDraftAction(appliedAction);
    setDraftDepartment(appliedDepartment);
    setDraftRegion(appliedRegion);
    setDraftState(appliedState);
    setDraftStore(appliedStore);
  };

  const handlePriceChange = (itemId: string, newPrice: number) => {
    setEdits((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], userAdjustedPrice: newPrice },
    }));
  };

  // Filter items based on applied filters
  const filteredItems = filterItems(mockItems, {
    department: appliedDepartment,
    region: appliedRegion,
    state: appliedState,
    store: appliedStore,
  });

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#1a0b2e_0%,#0f0520_50%,#0a0a10_100%)] text-white
                    before:pointer-events-none before:content-[''] before:absolute before:inset-0
                    before:bg-[radial-gradient(1400px_700px_at_85%_-5%,rgba(124,35,200,0.75),rgba(100,30,180,0.4),transparent_50%)]
                    after:pointer-events-none after:content-[''] after:absolute after:inset-0
                    after:bg-[radial-gradient(1200px_650px_at_0%_120%,rgba(124,35,200,0.7),rgba(100,30,180,0.35),transparent_55%)]
                    relative">
      {/* Subtle noise layer */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.08]
                  bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAG0lEQVQYV2NkYGD4z0AEMDEwMDAwGJgYQwAA1c0F6bX2vZEAAAAASUVORK5CYII=')]"
      />

      {/* Grid and vignette overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-20 mix-blend-screen"
      >
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 32 0 L 0 0 0 32"
                fill="none"
                stroke="white"
                strokeWidth="0.75"
                strokeOpacity="0.15"
              />
            </pattern>
            <radialGradient id="vignette" cx="50%" cy="40%" r="70%">
              <stop offset="60%" stopColor="transparent" />
              <stop offset="100%" stopColor="#0a0a10" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#vignette)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-6 inline-flex p-3 rounded-lg border-2 border-white/20 bg-white/[0.08] text-white/90
                    hover:border-white/40 hover:text-white hover:shadow-[0_0_24px] hover:shadow-violet-600/30
                    backdrop-blur-3xl transition-all duration-300 items-center gap-2 group"
        >
          <ArrowLeft size={20} className="group-hover:text-violet-400 transition-colors duration-300" />
          <span className="text-sm font-medium">Back</span>
        </Link>

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Price Optimization</h1>
            <p className="text-white/70">
              Adjust pricing to {appliedAction === 'profit' ? 'maximize profit' : 'grow revenue'} across departments and regions
            </p>
          </div>

          {/* Summary Button */}
          <Link
            href="/pricing/summary"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-white/20 bg-white/[0.08]
                     text-white/90 text-sm font-medium hover:border-white/40 hover:text-white
                     backdrop-blur-3xl transition-all duration-300 ml-6 flex-shrink-0 breathing"
          >
            <BarChart3 size={16} />
            Summary
          </Link>
        </div>

        {/* Filter Bar */}
        <FilterBar
          draftAction={draftAction}
          draftDepartment={draftDepartment}
          draftRegion={draftRegion}
          draftState={draftState}
          draftStore={draftStore}
          onActionChange={setDraftAction}
          onDepartmentChange={setDraftDepartment}
          onRegionChange={setDraftRegion}
          onStateChange={setDraftState}
          onStoreChange={setDraftStore}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        {/* Results Table */}
        {showTable && (
          <PriceTable
            items={filteredItems}
            action={appliedAction}
            selectedRowId={selectedRowId}
            onSelectRow={setSelectedRowId}
            onPriceChange={handlePriceChange}
            edits={edits}
            search={search}
            onSearchChange={setSearch}
          />
        )}
      </div>
    </main>
  );
}
