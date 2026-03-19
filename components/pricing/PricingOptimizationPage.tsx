"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Info, ArrowLeft } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";

import { Card } from "@/components/ui/Card";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Modal } from "@/components/ui/Modal";
import { PricingTable } from "@/components/pricing/MainTable";
import {
  mockPricingProducts,
  PricingProduct,
  SimulationScenario,
} from "@/lib/mockPricingProducts";

import Toast from "@/components/toast/Toast";
import { ToastType } from "@/components/toast/types";
import { SimulationModal } from "@/components/pricing/SimulationModal";

type PrimaryGoal = "maximize" | "reduce" | "balance";
type Mode = "advisor" | "autopilot";

interface ApprovalPayload {
  primaryGoal: PrimaryGoal;
  mode: Mode;
  selectedProductIds: string[];
  userAdjustedPrices: Record<string, string>;
}

export function PricingOptimizationPage() {
  const router = useRouter();

  /*


        STATES


     */

    const [
        primaryGoal, 
        setPrimaryGoal
    ] = useState<PrimaryGoal | null>(null);

    const [
        mode, 
        setMode
    ] = useState<Mode | null>(null);

    const [
        selectedRows, 
        setSelectedRows
    ] = useState<Set<string>>(new Set());

    const [
        userAdjustedPrices, 
        setUserAdjustedPrices
    ] = useState<Record<string, string>>({});

    // For modal
    const [activeProduct, setActiveProduct] = useState<PricingProduct | null>(
        null,
    );

    // modal simulation selection (only 1)
    const [
        selectedScenario, 
        setSelectedScenario
    ] = useState<SimulationScenario | null>(null);

    // Autopilot confirmation modal
    const [
        confirmAutopilotOpen, 
        setConfirmAutopilotOpen
    ] = useState(false);

    const [
        products, 
        setProducts
    ] = useState<PricingProduct[]>( mockPricingProducts.products,);

    const [
        scopeDropdownOpen, 
        setScopeDropdownOpen
    ] = useState(false);

    const [
        scopeSearch, 
        setScopeSearch
    ] = useState("");
    
    const [
        selectedScope, 
        setSelectedScope
    ] = useState<string>("all");

  /*


        CONSTANTS & DERIVED STATE


     */

  const canShowTable = !!primaryGoal && !!mode;

  // Derived state
  const allSelected =
    products.length > 0 && selectedRows.size === products.length;
  const someSelected =
    selectedRows.size > 0 && selectedRows.size < products.length;

  // filter dropdown in table
  const RecommendedScopes = [
    { label: "All recommended scope", value: "all" },
    { label: "National", value: "national" },
    { label: "Regional", value: "regional" },
    { label: "Store", value: "store" },
  ];

  const filteredScopes = RecommendedScopes.filter((scope) =>
    scope.label.toLowerCase().includes(scopeSearch.toLowerCase()),
  );

  /*


        FUNCTIONS


     */

  // Modal states
  const closeModal = () => setActiveProduct(null);
  const openModal = (product: PricingProduct) => setActiveProduct(product);

  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(
    null,
  );
  const handleApplySimulation = (productId: string, newPrice: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, currentPrice: newPrice }
          : product,
      ),
    );

    setToast({
      msg: `Simulation applied for product ${productId}!`,
      type: "success",
    });
    console.log("Simulation Applied:", {
      productId,
      newPrice,
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.size === mockPricingProducts.products.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(products.map((p) => p.id)));
    }
  };

  const handlePriceChange = (productId: string, price: string) => {
    setUserAdjustedPrices((prev) => ({
      ...prev,
      [productId]: price,
    }));
  };

  const handleApproveAndApply = () => {
    if (!primaryGoal || !mode) {
      alert("Please select a Primary Goal and Mode.");
      return;
    }

    const payload: ApprovalPayload = {
      primaryGoal,
      mode,
      selectedProductIds: Array.from(selectedRows),
      userAdjustedPrices,
    };
    console.log("Approve & Apply Payload:", payload);
    alert("Pricing optimization submitted! Check console for details.");
  };

  const handleModeChange = (value: string) => {
    const next = value as Mode;

    // If user is trying to enable autopilot, confirm first
    if (next === "autopilot" && mode !== "autopilot") {
      setConfirmAutopilotOpen(true);
      return; // IMPORTANT: do not setMode yet
    }

    // Otherwise set immediately
    setMode(next);
  };

  const handleConfirmAutopilot = () => {
    setMode("autopilot");
    setConfirmAutopilotOpen(false);
  };

  const handleCloseAutopilotConfirm = () => {
    setConfirmAutopilotOpen(false);
  };

  /*


        EFFECTS


     */

  // when activeProduct changes, default to first scenario (optional)
  useEffect(
      () => {
          if (activeProduct?.simulation?.length) {
            setSelectedScenario(activeProduct.simulation[0].scenario);
          } else {
            setSelectedScenario(null);
          }
        }, [activeProduct]);

  const handleToggleRow = (productId: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  useEffect(
    () => {
        const load = async () => {
        try {
            const backendUrl =
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:7071";
            const res = await fetch(`${backendUrl}/api/pricing-products`, {
            method: "GET",
            });

            if (!res.ok) throw new Error("Failed to fetch pricing products");
            const data = await res.json();

            if (data?.products?.length) {
            setProducts(data.products);
            } else {
            setProducts(mockPricingProducts.products); // fallback if empty
            }
        } catch {
            setProducts(mockPricingProducts.products); // fallback if error
        }
        };

        load();
}, []);

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-screen-xl mx-auto">
        {/* Back Button (Glass / Gamified) */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all active:scale-95"
          style={{
            color: "var(--text)",
            background:
              "linear-gradient(135deg, rgba(168,85,247,0.22) 0%, rgba(255,107,157,0.12) 60%, rgba(18,10,36,0.55) 100%)",
            border: "1px solid rgba(168,85,247,0.35)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow:
              "0 0 0 1px rgba(168,85,247,0.15), 0 12px 30px rgba(0,0,0,0.35)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 0 0 1px rgba(168,85,247,0.25), 0 0 18px rgba(168,85,247,0.25), 0 14px 34px rgba(0,0,0,0.45)";
            e.currentTarget.style.borderColor = "rgba(168,85,247,0.55)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0 0 0 1px rgba(168,85,247,0.15), 0 12px 30px rgba(0,0,0,0.35)";
            e.currentTarget.style.borderColor = "rgba(168,85,247,0.35)";
          }}
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header Section */}
        <div
          className="mb-8 pb-8"
          style={{ borderBottom: "2px solid var(--border)" }}
        >
          <h1
            className="text-5xl font-bold mb-3"
            style={{
              color: "var(--primary)",
              fontWeight: "800",
              letterSpacing: "-0.02em",
            }}
          >
            Pricing Optimization
          </h1>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            Maximize profit and minimize waste with AI-driven pricing
            recommendations
          </p>
        </div>

        {/* Main Card */}
        <Card variant="default">
          {/* Controls Section */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            {/* Primary Goal */}
            <div
              className="p-6 rounded-xl"
              style={{
                backgroundColor: "var(--primary-light-bg)",
                border: "1px solid var(--primary)",
              }}
            >
              <RadioGroup
                label="Primary Goal"
                variant="segmented"
                options={[
                  { label: "Maximize Profit", value: "maximize" },
                  { label: "Reduce Waste", value: "reduce" },
                  { label: "Balance Profit & Waste", value: "balance" },
                ]}
                value={primaryGoal ?? undefined}
                onChange={(value) => setPrimaryGoal(value as PrimaryGoal)}
              />

              {!primaryGoal && (
                <p
                  className="mt-2 text-xs font-medium"
                  style={{ color: "#ffffff" }}
                >
                  Please select a primary goal (required).
                </p>
              )}
            </div>

            {/* Mode Selection */}
            <div
              className="p-6 rounded-xl"
              style={{
                backgroundColor: "var(--primary-light-bg)",
                border: "1px solid var(--primary)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  Mode
                </p>

                <Tooltip
                  side="top"
                  content={
                    <div className="space-y-2">
                      <div>
                        <div
                          className="font-semibold"
                          style={{ color: "var(--text-dark)" }}
                        >
                          Advisor
                        </div>
                        <div style={{ color: "var(--text-muted)" }}>
                          Shows AI recommendations and lets you review and
                          manually adjust prices before applying.
                        </div>
                      </div>

                      <div>
                        <div
                          className="font-semibold"
                          style={{ color: "var(--text-dark)" }}
                        >
                          Autopilot
                        </div>
                        <div style={{ color: "var(--text-muted)" }}>
                          Automatically applies AI-recommended prices for
                          selected products.
                        </div>
                      </div>
                    </div>
                  }
                >
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md p-1 transition"
                    style={{ color: "var(--text-muted)" }}
                    aria-label="Mode info"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </Tooltip>
              </div>
              <RadioGroup
                variant="segmented"
                name="mode"
                options={[
                  { label: "Advisor", value: "advisor" },
                  { label: "Autopilot", value: "autopilot" },
                ]}
                value={mode ?? undefined}
                onChange={handleModeChange}
              />

              {!mode && (
                <p
                  className="mt-2 text-xs font-medium"
                  style={{ color: "#ffffff" }}
                >
                  Please select a mode (required).
                </p>
              )}
            </div>
          </div>

          {/* Table Section */}

          {canShowTable ? (
            <>
              <PricingTable
                products={products}
                selectedRows={selectedRows}
                userAdjustedPrices={userAdjustedPrices}
                selectedScope={selectedScope}
                scopeDropdownOpen={scopeDropdownOpen}
                scopeSearch={scopeSearch}
                allSelected={allSelected}
                someSelected={someSelected}
                recommendedScopes={RecommendedScopes}
                filteredScopes={filteredScopes}
                onToggleRow={handleToggleRow}
                onSelectAll={handleSelectAll}
                onPriceChange={handlePriceChange}
                onOpenModal={openModal}
                onScopeDropdownToggle={setScopeDropdownOpen}
                onScopeSearch={setScopeSearch}
                onScopeChange={setSelectedScope}
              />

              <SimulationModal
                activeProduct={activeProduct}
                onClose={closeModal}
                onApply={handleApplySimulation}
                onToast={(msg: string, type: ToastType) =>
                  setToast({ msg, type })
                }
              />

              {/* Footer with Action Button */}
              <div
                className="mt-8 pt-6 flex justify-end"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <button
                  onClick={handleApproveAndApply}
                  disabled={selectedRows.size === 0}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    selectedRows.size === 0
                      ? "cursor-not-allowed"
                      : "active:scale-95"
                  }`}
                  style={{
                    backgroundColor:
                      selectedRows.size === 0
                        ? "var(--secondary-light)"
                        : "var(--primary)",
                    color:
                      selectedRows.size === 0
                        ? "var(--text-muted)"
                        : "var(--primary-foreground)",
                    boxShadow:
                      selectedRows.size === 0 ? "none" : "var(--shadow)",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedRows.size > 0) {
                      e.currentTarget.style.backgroundColor =
                        "var(--primary-hover)";
                      e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedRows.size > 0) {
                      e.currentTarget.style.backgroundColor = "var(--primary)";
                      e.currentTarget.style.boxShadow = "var(--shadow)";
                    }
                  }}
                >
                  ✓ Approve & Apply ({selectedRows.size} selected)
                </button>
              </div>
            </>
          ) : (
            // Optional: show a hint area instead of the table
            <div
              className="py-14 text-center"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text-dark)" }}
              >
                Select a Primary Goal and Mode to view items for optimization
              </p>
              <p
                className="text-sm mt-2"
                style={{ color: "var(--text-muted)" }}
              >
                These selections are required before we can generate
                recommendations.
              </p>
            </div>
          )}
        </Card>

        {/*toast notification*/}
        {toast && (
          <Toast
            message={toast.msg}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <Modal
          open={confirmAutopilotOpen}
          title="Enable Autopilot?"
          onClose={handleCloseAutopilotConfirm}
        >
          <div className="space-y-4">
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              Autopilot will automatically apply AI-recommended prices for the
              products you select. This may change prices without manual review.
            </p>

            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: "var(--surface-2)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--text-dark)" }}
              >
                What will happen in Autopilot:
              </p>
              <ul
                className="list-disc pl-5 space-y-1 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <li>
                  Applies recommended prices for selected products automatically
                </li>
                <li>Reduces manual review steps in the workflow</li>
                <li>Add here the guardrails details</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleConfirmAutopilot}
                className="px-5 py-2 rounded-lg font-semibold transition active:scale-95"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                  boxShadow: "var(--shadow)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--primary-hover)";
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--primary)";
                  e.currentTarget.style.boxShadow = "var(--shadow)";
                }}
              >
                Yes, I agree
              </button>
            </div>
          </div>
        </Modal>

        {/* Info Footer */}
        <div
          className="mt-8 text-center text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          <p>
            Select products to approve pricing changes based on AI
            recommendations
          </p>
        </div>
      </div>
    </div>
  );
}
