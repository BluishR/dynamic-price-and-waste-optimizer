'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Pencil, Info, ArrowLeft, ChevronDown, Search } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Modal } from '@/components/ui/Modal';
import {
    mockPricingProducts,
    PricingProduct,
    PricingRecommendation,
    ConfidenceLevel,
    SimulationScenario,
} from '@/lib/mockPricingProducts';

import Toast from '@/components/toast/Toast';
import { ToastType } from '@/components/toast/types';

type PrimaryGoal = 'maximize' | 'reduce' | 'balance';
type Mode = 'advisor' | 'autopilot';

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
    const [
        activeProduct, 
        setActiveProduct
    ] = useState<PricingProduct | null>(null);

    // modal simulation selection (only 1)
    const [
        selectedScenario, 
        setSelectedScenario
    ] = useState<SimulationScenario | null>(null)

    // Autopilot confirmation modal
    const [
        confirmAutopilotOpen, 
        setConfirmAutopilotOpen
    ] = useState(false);

    // optional: store the mode the user attempted to switch to (future-proof)
    const [
        pendingMode, 
        setPendingMode
    ] = useState<Mode | null>(null);

    const [products, setProducts] = useState<PricingProduct[]>(mockPricingProducts.products);

    const [scopeDropdownOpen, setScopeDropdownOpen] = useState(false);
    const [scopeSearch, setScopeSearch] = useState('');
    const [selectedScope, setSelectedScope] = useState<string>('all');

    /*


        CONSTANTS & DERIVED STATE


     */

    const canShowTable = !!primaryGoal && !!mode;

    // Ref for select all checkbox
    const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

    // Derived state
    const allSelected = products.length > 0 && selectedRows.size === products.length;
    const someSelected = selectedRows.size > 0 && selectedRows.size < products.length;

    // filter dropdown in table
    const RecommendedScopes = [
        { label: 'All recommended scope', value: 'all' },
        { label: 'National', value: 'national' },
        { label: 'Regional', value: 'regional' },
        { label: 'Store', value: 'store' },
    ]

    const filteredScopes = RecommendedScopes.filter((scope) =>
        scope.label.toLowerCase().includes(scopeSearch.toLowerCase())
    );

    /*


        FUNCTIONS


     */

    // Modal states
    const closeModal = () => setActiveProduct(null);
    const openModal = (product: PricingProduct) => setActiveProduct(product);

    const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
    const showToast = (msg: string, type: ToastType) => {
    setToast({ msg, type });
  };
    const handleApplySimulation = 
        () => {
            if (!activeProduct || !selectedScenario) return;

            const selectedScenarioRow = activeProduct.simulation?.find(
                (row) => row.scenario === selectedScenario
            );

            if (!selectedScenarioRow) return;

            const newPrice = selectedScenarioRow.price.toString();

            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === activeProduct.id
                        ? { ...product, currentPrice: newPrice }
                        : product
                )
            );

            setActiveProduct({
                ...activeProduct,
                currentPrice: newPrice,
            });
            
            setToast({ 
                msg: `Simulation applied!`, 
                type: "success" 
            });
            
            console.log('Simulation Applied:', {
                productId: activeProduct.id,
                productName: activeProduct.description,
                selectedScenario,
                newPrice,
            });

            closeModal();
            setSelectedScenario(null);
        };

    const handleSelectAll = 
        () => {
            if (selectedRows.size === mockPricingProducts.products.length) {
                setSelectedRows(new Set());
            } else {
                setSelectedRows(new Set(products.map((p) => p.id)));
            }
        };

    const handlePriceChange = 
        (productId: string, price: string) => {
            setUserAdjustedPrices((prev) => ({
                ...prev,
                [productId]: price,
            }));
        };

    const handleApproveAndApply = 
        () => {
            if (!primaryGoal || !mode) {
                alert('Please select a Primary Goal and Mode.');
                return;
            }

            const payload: ApprovalPayload = {
                primaryGoal,
                mode,
                selectedProductIds: Array.from(selectedRows),
                userAdjustedPrices,
            };
            console.log('Approve & Apply Payload:', payload);
            alert('Pricing optimization submitted! Check console for details.');
        };

    // Helper functions
    const getRecommendationBadgeVariant = 
        (rec: PricingRecommendation): 'promo' | 'increase' | 'decrease' | 'markdown' => {
            switch (rec) {
                case 'promo':
                    return 'promo';
                case 'increase':
                    return 'increase';
                case 'decrease':
                    return 'decrease';
                case 'markdown':
                    return 'markdown';
                default:
                    return 'decrease';
            }
        };

        const getConfidenceBadgeVariant = (conf?: ConfidenceLevel): 'high' | 'medium' | 'low' => {
            switch (conf) {
                case 'High':
                    return 'high';
                case 'Medium':
                    return 'medium';
                case 'Low':
                    return 'low';
                default:
                    return 'medium';
            }
        };

    const handleModeChange = 
        (value: string) => {
            const next = value as Mode;

            // If user is trying to enable autopilot, confirm first
            if (next === 'autopilot' && mode !== 'autopilot') {
                setPendingMode('autopilot');
                setConfirmAutopilotOpen(true);
                return; // IMPORTANT: do not setMode yet
            }

            // Otherwise set immediately
            setMode(next);
        };

    const handleConfirmAutopilot = 
        () => {
            setMode('autopilot');
            setPendingMode(null);
            setConfirmAutopilotOpen(false);
        };

    const handleCloseAutopilotConfirm = 
        () => {
            setPendingMode(null);
            setConfirmAutopilotOpen(false);
        };


    /*


        EFFECTS


     */
  
    // when activeProduct changes, default to first scenario (optional)
    useEffect(() => {
        if (activeProduct?.simulation?.length) {
            setSelectedScenario(activeProduct.simulation[0].scenario);
        } else {
            setSelectedScenario(null);
        }
    }, [activeProduct]);


  // Effect to set indeterminate state on checkbox
    useEffect(() => {
        if (selectAllCheckboxRef.current) {
            selectAllCheckboxRef.current.indeterminate = someSelected;
        }
        }, [someSelected]);
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

    useEffect(() => {
        const load = async () => {
            try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:7071';
            const res = await fetch(`${backendUrl}/api/pricing-products`, { method: 'GET' });

            if (!res.ok) throw new Error('Failed to fetch pricing products');
            const data = await res.json();

            if (data?.products?.length) {
                setProducts(data.products);
            } else {
                setProducts(mockPricingProducts.products); // fallback if empty
            }
            } catch (e) {
            setProducts(mockPricingProducts.products); // fallback if error
            }
    };

        load();
    }, []);


  return (
        <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-screen-xl mx-auto">
        {/* Back Button (Glass / Gamified) */}
        <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all active:scale-95"
        style={{
            color: 'var(--text)',
            background:
            'linear-gradient(135deg, rgba(168,85,247,0.22) 0%, rgba(255,107,157,0.12) 60%, rgba(18,10,36,0.55) 100%)',
            border: '1px solid rgba(168,85,247,0.35)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow:
            '0 0 0 1px rgba(168,85,247,0.15), 0 12px 30px rgba(0,0,0,0.35)',
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
            '0 0 0 1px rgba(168,85,247,0.25), 0 0 18px rgba(168,85,247,0.25), 0 14px 34px rgba(0,0,0,0.45)';
            e.currentTarget.style.borderColor = 'rgba(168,85,247,0.55)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
            '0 0 0 1px rgba(168,85,247,0.15), 0 12px 30px rgba(0,0,0,0.35)';
            e.currentTarget.style.borderColor = 'rgba(168,85,247,0.35)';
        }}
        aria-label="Go back"
        >
        <ArrowLeft className="w-4 h-4" />
        Back
        </button>

            {/* Header Section */}
            <div className="mb-8 pb-8" style={{ borderBottom: '2px solid var(--border)' }}>
            <h1 className="text-5xl font-bold mb-3" style={{ color: 'var(--primary)', fontWeight: '800', letterSpacing: '-0.02em' }}>
                Pricing Optimization
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
                Maximize profit and minimize waste with AI-driven pricing recommendations
            </p>
            </div>

            {/* Main Card */}
            <Card variant="default">
            {/* Controls Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
                {/* Primary Goal */}
                <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--primary-light-bg)', border: '1px solid var(--primary)' }}>
                <RadioGroup
                    label="Primary Goal"
                    variant="segmented"
                    options={[
                    { label: 'Maximize Profit', value: 'maximize' },
                    { label: 'Reduce Waste', value: 'reduce' },
                    { label: 'Balance Profit & Waste', value: 'balance' },
                    ]}
                    value={primaryGoal ?? undefined}
                    onChange={(value) => setPrimaryGoal(value as PrimaryGoal)}
                />
                
                    {!primaryGoal && (
                        <p className="mt-2 text-xs font-medium" style={{ color: '#ffffff' }}>
                        Please select a primary goal (required).
                        </p>
                    )}

                </div>

                {/* Mode Selection */}
                <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--primary-light-bg)', border: '1px solid var(--primary)' }}>
                <div className="flex items-center gap-2 mb-3">
                    <p
                    className="text-sm font-semibold"
                    style={{ color: 'var(--text)' }}
                    >
                    Mode
                    </p>

                    <Tooltip
                    side="top"
                    content={
                        <div className="space-y-2">
                        <div>
                            <div className="font-semibold" style={{ color: 'var(--text-dark)' }}>
                            Advisor
                            </div>
                            <div style={{ color: 'var(--text-muted)' }}>
                            Shows AI recommendations and lets you review and manually adjust prices before applying.
                            </div>
                        </div>

                        <div>
                            <div className="font-semibold" style={{ color: 'var(--text-dark)' }}>
                            Autopilot
                            </div>
                            <div style={{ color: 'var(--text-muted)' }}>
                            Automatically applies AI-recommended prices for selected products.
                            </div>
                        </div>
                        </div>
                    }
                    >
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md p-1 transition"
                        style={{ color: 'var(--text-muted)' }}
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
                        { label: 'Advisor', value: 'advisor' },
                        { label: 'Autopilot', value: 'autopilot' },
                        ]}
                        value={mode ?? undefined}
                        onChange={handleModeChange}
                    />

                    
                    {!mode && (
                        <p className="mt-2 text-xs font-medium" style={{ color: '#ffffff' }}>
                        Please select a mode (required).
                        </p>
                    )}


                </div>
            </div>

            {/* Table Section */}

            
                {canShowTable ? (
                <>
                    <div className="overflow-x-auto">
                        {/* recommended scope filter */}
                            <div>
                                <div className="mb-4">
                                <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--secondary-light-bg)', border: '1px solid var(--secondary)' }}>
                                    <label className="font-semibold text-dark">Recommended Scope</label>

                                    <div className="relative mt-2">
                                    {/* dropdown button */}
                                    <button
                                        onClick={() => setScopeDropdownOpen(!scopeDropdownOpen)}
                                        className="w-full px-3 py-2 rounded-md border bg-white/10 text flex justify-between items-center --secondary-hover"
                                        style={{border: '1px solid var(--secondary)'}}
                                    >
                                        {RecommendedScopes.find(scope => scope.value === selectedScope)?.label ||
                                        "All recommended scopes"}

                                        <ChevronDown
                                        size={16}
                                        className={`${scopeDropdownOpen ? "rotate-180" : ""} transition-transform`}
                                        />
                                    </button>

                                    {/* drropdown */}
                                    {scopeDropdownOpen && (
                                        <div>
                                        {/* search box */}
                                        <div className="p-2" style={{border: 'var(--secondary)'}}>
                                            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 border border-white/20">
                                            <Search size={14} className="text-dark" />
                                            <input
                                                type="text"
                                                placeholder="Search scopes..."
                                                value={scopeSearch}
                                                onChange={(e) => setScopeSearch(e.target.value)}
                                                className="flex-1 bg-transparent placeholder:text-dark focus:outline-none"
                                                style={{ color: 'var(--text-muted)' }}
                                            />
                                            </div>
                                        </div>

                                        {/* liist items */}
                                        <div className="max-h-40 overflow-y-auto">
                                            {filteredScopes.map((scope) => (
                                            <button
                                                key={scope.value}
                                                onClick={() => {
                                                setSelectedScope(scope.value);
                                                setScopeDropdownOpen(false);
                                                setScopeSearch("");
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm ${
                                                selectedScope === scope.value
                                                    ? "bg-violet-600/30 text-white font-medium"
                                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                                                }`}
                                            >
                                                {scope.label}
                                            </button>
                                            ))}
                                        </div>
                                        </div>
                                    )}
                                    </div>
                                </div>
                            </div>
                    </div>
                        <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                        {/* Table Header */}
                        <thead>
                            <tr className="border-b" style={{ 
                            borderColor: 'var(--border)', 
                            backgroundColor: 'var(--primary)',
                            background: 'linear-gradient(135deg, var(--primary) 0%, rgb(13, 71, 161) 100%)',
                            }}>
                            <th className="px-4 py-3 text-left">
                                <input
                                ref={selectAllCheckboxRef}
                                type="checkbox"
                                checked={allSelected}
                                onChange={handleSelectAll}
                                onClick={(e) => e.stopPropagation()}
                                aria-label="Select all products"
                                className="w-4 h-4 rounded"
                                style={{ accentColor: 'var(--primary-light-bg)' }}
                                />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'white' }}>
                                Product
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'white' }}>
                                AI Recommendation
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'white' }}>
                                Recommended Scope
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'white' }}>
                                Current Price
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'white' }}>
                                Recommended Price
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'white' }}>
                                User Adjusted Price
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'white' }}>
                                Reason
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'white' }}>
                                Expected Impact
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'white' }}>
                                Confidence
                            </th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {products.filter(product => {
                                if (selectedScope === 'all') return true;
                                return product.recommendedScope.level === selectedScope;
                            }).map((product, index) => {
                            const isSelected = selectedRows.has(product.id);
                            const userPrice = userAdjustedPrices[product.id] || '';

                            return (
                                    <tr
                                        key={product.id}
                                        className={`border-b transition-colors cursor-pointer ${
                                            index === products.length - 1 ? 'border-b-0' : ''
                                        }`}
                                        style={{
                                            borderColor: 'var(--border)',
                                            backgroundColor: isSelected ? 'rgba(59,130,246,0.12)' : 'transparent',
                                        }}
                                        onClick={() => openModal(product)}
                                        onMouseEnter={(e) =>
                                            !isSelected && (e.currentTarget.style.backgroundColor = 'var(--surface-hover)')
                                        }
                                        onMouseLeave={(e) =>
                                            !isSelected && (e.currentTarget.style.backgroundColor = 'transparent')
                                        }
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            openModal(product);
                                            }
                                        }}
                                    >
                                {/* Checkbox */}
                                <td className="px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleToggleRow(product.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        aria-label={`Select ${product.description}`}
                                        className="w-4 h-4 rounded"
                                        style={{ accentColor: 'var(--primary)' }}
                                    />
                                </td>

                                {/* Product */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.description}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <span className="font-medium" style={{ color: 'var(--text-dark)' }}>
                                        {product.description}
                                    </span>
                                    </div>
                                </td>

                                {/* AI Recommendation */}
                                <td className="px-4 py-3">
                                    <Badge
                                    variant={getRecommendationBadgeVariant(
                                        product.action
                                    )}
                                    >
                                    {product.action}
                                    </Badge>
                                </td>

                                {/* Recommended Scope */}
                                <td className="px-4 py-3">
                                    {product.recommendedScope.level}
                                </td>

                                {/* Current Price */}
                                <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-dark)' }}>
                                    {product.currentPrice}
                                </td>

                                {/* Recommended Price */}
                                <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-dark)' }}>
                                    {product.finalRecommendedPrice}
                                </td>

                                {/* User Adjusted Price */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={userPrice}
                                        onChange={(e) =>
                                        handlePriceChange(product.id, e.target.value)
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => e.stopPropagation()}
                                        placeholder="Enter price"
                                        className="w-24 px-3 py-1 rounded border text-sm focus:outline-none"
                                        style={{
                                        borderColor: 'var(--border)',
                                        backgroundColor: 'var(--surface)',
                                        color: 'var(--text)',
                                        boxShadow: 'none',
                                        }}
                                        onFocus={(e) => {
                                        e.currentTarget.style.boxShadow = `0 0 0 2px var(--ring)`;
                                        e.currentTarget.style.borderColor = 'transparent';
                                        }}
                                        onBlur={(e) => {
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                        }}
                                    />
                                    <Pencil className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                                    </div>
                                </td>

                                {/* Reason */}
                                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                                    {product.reasonSignals}
                                </td>

                                {/* Expected Impact */}
                                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                                    {product.expectedImpact}
                                </td>

                                {/* Confidence */}
                                <td className="px-4 py-3">
                                    <Badge
                                    variant={getConfidenceBadgeVariant(product.confidence)}
                                    >
                                    {product.confidence}
                                    </Badge>
                                </td>
                                </tr>
                            );
                            })}
                        </tbody>
                        </table>
                    </div>
                    </div>

                    {/* Footer with Action Button */}
                    <div className="mt-8 pt-6 flex justify-end" style={{ borderTop: '1px solid var(--border)' }}>
                        <button
                        onClick={handleApproveAndApply}
                        disabled={selectedRows.size === 0}
                        className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                            selectedRows.size === 0 ? 'cursor-not-allowed' : 'active:scale-95'
                        }`}
                        style={{
                            backgroundColor: selectedRows.size === 0 ? 'var(--secondary-light)' : 'var(--primary)',
                            color: selectedRows.size === 0 ? 'var(--text-muted)' : 'var(--primary-foreground)',
                            boxShadow: selectedRows.size === 0 ? 'none' : 'var(--shadow)',
                        }}
                        onMouseEnter={(e) => {
                            if (selectedRows.size > 0) {
                            e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (selectedRows.size > 0) {
                            e.currentTarget.style.backgroundColor = 'var(--primary)';
                            e.currentTarget.style.boxShadow = 'var(--shadow)';
                            }
                        }}
                        >
                        ✓ Approve & Apply ({selectedRows.size} selected)
                        </button>
                    </div>
                </>
            
                ) : (
                // Optional: show a hint area instead of the table
                <div className="py-14 text-center" style={{ borderTop: '1px solid var(--border)' }}>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>
                    Select a Primary Goal and Mode to view items for optimization
                    </p>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                    These selections are required before we can generate recommendations.
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

            {/* Modals */}
            <Modal
                open={!!activeProduct}
                title={activeProduct?.description}
                onClose={closeModal}
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
                                        {/* Checkbox UI but single-select behavior */}
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

            <Modal
                open={confirmAutopilotOpen}
                title="Enable Autopilot?"
                onClose={handleCloseAutopilotConfirm}
                >
                <div className="space-y-4">
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    Autopilot will automatically apply AI-recommended prices for the products you select.
                    This may change prices without manual review.
                    </p>

                    <div
                    className="rounded-xl p-4"
                    style={{
                        backgroundColor: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                    }}
                    >
                    <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
                        What will happen in Autopilot:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                        <li>Applies recommended prices for selected products automatically</li>
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
                        backgroundColor: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                        boxShadow: 'var(--shadow)',
                        }}
                        onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                        }}
                        onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--primary)';
                        e.currentTarget.style.boxShadow = 'var(--shadow)';
                        }}
                    >
                        Yes, I agree
                    </button>
                    </div>
                </div>
            </Modal>

            {/* Info Footer */}
            <div className="mt-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            <p>Select products to approve pricing changes based on AI recommendations</p>
            </div>
        </div>
        </div>
    );
}
