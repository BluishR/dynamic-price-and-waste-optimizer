'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import {
    PricingProduct,
    SimulationScenario,
} from '@/lib/mockPricingProducts';

interface SimulationModalProps {
  activeProduct: PricingProduct | null;
  onClose: () => void;
  onApply: (productId: string, newPrice: string, scenario: SimulationScenario) => void;
  onToast: (msg: string, type: 'success' | 'error') => void;
}

export function SimulationModal({ 
  activeProduct, 
  onClose, 
  onApply,
  onToast 
}: SimulationModalProps) {
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario | null>(
    activeProduct?.simulation?.length ? activeProduct.simulation[0].scenario : null
  );

  const handleApplySimulation = () => {
    if (!activeProduct || !selectedScenario) return;

    const selectedScenarioRow = activeProduct.simulation?.find(
      (row) => row.scenario === selectedScenario
    );

    if (!selectedScenarioRow) return;

    const newPrice = selectedScenarioRow.price.toString();

    // ccall the callback to update parent
    onApply(activeProduct.id, newPrice, selectedScenario);

    onToast('Simulation applied!', 'success');

    console.log('Simulation Applied:', {
      productId: activeProduct.id,
      productName: activeProduct.description,
      selectedScenario,
      newPrice,
    });

    onClose();
    setSelectedScenario(null);
  };

  return (
    <Modal
      open={!!activeProduct}
      title={activeProduct?.description}
      onClose={onClose}
    >
      {activeProduct && (
        <div className="space-y-6">
          {/* Top section: image left, explanation right */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <img
              src={activeProduct.imageUrl}
              alt={activeProduct.description}
              className="w-48 h-48 rounded-xl object-cover shrink-0"
              style={{ backgroundColor: 'var(--surface-2)' }}
            />

            <div className="min-w-0 flex-1">
              <p
                className="text-sm font-semibold mb-2"
                style={{ color: 'var(--text-dark)' }}
              >
                Explanation
              </p>

              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                {activeProduct.explanation}
              </p>
            </div>
          </div>

          {/* Simulation section */}
          <div className="space-y-3">
            <p
              className="text-sm font-semibold"
              style={{ color: 'var(--text-dark)' }}
            >
              Simulation
            </p>

            <div
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className="border-b"
                      style={{
                        borderColor: 'var(--border)',
                        backgroundColor: 'var(--primary)',
                        background:
                          'linear-gradient(135deg, var(--primary) 0%, rgb(13, 71, 161) 100%)',
                      }}
                    >
                      <th className="px-4 py-3 text-left w-10" />
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'white' }}>
                        Scenario
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'white' }}>
                        Revenue
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'white' }}>
                        Margin
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'white' }}>
                        Waste
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {(activeProduct.simulation ?? []).map((row) => {
                      const checked = selectedScenario === row.scenario;

                      return (
                        <tr
                          key={row.scenario}
                          className="border-b last:border-b-0 transition-colors"
                          style={{
                            borderColor: 'var(--border)',
                            backgroundColor: checked ? 'rgba(59,130,246,0.12)' : 'transparent',
                          }}
                          onClick={() => setSelectedScenario(row.scenario)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedScenario(row.scenario);
                            }
                          }}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => setSelectedScenario(row.scenario)}
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`Select ${row.scenario}`}
                              className="w-4 h-4 rounded"
                              style={{ accentColor: 'var(--primary)' }}
                            />
                          </td>

                          <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-dark)' }}>
                            {row.scenario}
                          </td>

                          <td className="px-4 py-3" style={{ color: 'var(--text-dark)' }}>
                            {row.revenue}
                          </td>

                          <td className="px-4 py-3" style={{ color: 'var(--text-dark)' }}>
                            {row.margin}
                          </td>

                          <td className="px-4 py-3" style={{ color: 'var(--text-dark)' }}>
                            {row.waste}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Apply button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleApplySimulation}
                disabled={!selectedScenario}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  !selectedScenario ? 'cursor-not-allowed' : 'active:scale-95'
                }`}
                style={{
                  backgroundColor: !selectedScenario ? 'var(--secondary-light)' : 'var(--primary)',
                  color: !selectedScenario ? 'var(--text-muted)' : 'var(--primary-foreground)',
                  boxShadow: !selectedScenario ? 'none' : 'var(--shadow)',
                }}
                onMouseEnter={(e) => {
                  if (selectedScenario) {
                    e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedScenario) {
                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                    e.currentTarget.style.boxShadow = 'var(--shadow)';
                  }
                }}
              >
                Apply
              </button>
              </div>
          </div>
        </div>
      )}
    </Modal>
  );
}