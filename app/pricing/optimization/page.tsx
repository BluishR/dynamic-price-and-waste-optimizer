'use client';

import { PricingOptimizationPage } from '@/components/pricing/PricingOptimizationPage';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PricingOptimizationRoute() {
  return (
    <>
      <PricingOptimizationPage />
      <ToastContainer />
    </>
  );
}
