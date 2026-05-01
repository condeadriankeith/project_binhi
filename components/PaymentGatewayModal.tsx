import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, ShieldCheck, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  onClose: () => void;
  onSuccess: (amount: number) => void;
  isDarkMode: boolean;
}

export const PaymentGatewayModal: React.FC<Props> = ({ onClose, onSuccess, isDarkMode }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'amount' | 'processing' | 'success'>('amount');
  const [amount, setAmount] = useState<string>('500');

  const handleProcess = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    
    setStep('processing');
    
    // Simulate network delay
    setTimeout(() => {
      setStep('success');
      // Trigger success callback after showing the checkmark briefly
      setTimeout(() => {
        onSuccess(Number(amount));
        onClose();
      }, 2000);
    }, 2500);
  };

  const predefinedAmounts = [100, 500, 1000, 5000];

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md ${isDarkMode ? 'bg-slate-950/80' : 'bg-slate-900/60'}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl border relative ${isDarkMode ? 'bg-slate-900 border-slate-700/50' : 'bg-white border-slate-200'}`}
      >
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <Smartphone size={16} />
            </div>
            <div>
              <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('payment_title')}</h3>
              <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t('payment_subtitle')}</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            
            {step === 'amount' && (
              <motion.div 
                key="amount"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className={`block text-xs font-bold mb-2 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t('cash_in_amount')}
                  </label>
                  <div className="relative">
                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>₱</span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={`w-full text-2xl font-bold py-4 pl-10 pr-4 rounded-2xl border outline-none transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {predefinedAmounts.map(val => (
                    <button 
                      key={val}
                      onClick={() => setAmount(val.toString())}
                      className={`py-2 rounded-xl text-sm font-bold border transition-colors ${Number(amount) === val ? 'bg-blue-500 text-white border-blue-500' : (isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50')}`}
                    >
                      ₱{val.toLocaleString()}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleProcess}
                  disabled={!amount || Number(amount) <= 0}
                  className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('proceed_to_pay')} <ArrowRight size={18} />
                </button>
                
                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 mt-4">
                  <ShieldCheck size={12} />
                  <span>{t('secured_by')}</span>
                </div>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10"
              >
                <Loader2 size={48} className="text-blue-500 animate-spin mb-6" />
                <h3 className={`font-bold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('processing')}</h3>
                <p className={`text-sm text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t('processing_subtitle')}</p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10"
              >
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 text-emerald-500">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className={`font-bold text-2xl mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('success')}</h3>
                <p className={`text-sm mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t('success_subtitle')}</p>
                <p className="text-3xl font-black text-emerald-500">₱{Number(amount).toLocaleString()}</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
