import React, { useState } from 'react';
import {
  X,
  Calendar,
  MapPin,
  CheckCircle2,
  Lock,
  CreditCard,
  QrCode,
  Tag,
  Clock,
  Sparkles,
  Smartphone,
  Check,
  Landmark,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { EventItem, TicketTier, Booking, User } from '../types';
import { RealPaymentQrScanner } from './RealPaymentQrScanner';
import { backendApi } from '../services/backendApi';

interface EventDetailModalProps {
  event: EventItem | null;
  currentUser: User | null;
  onClose: () => void;
  onConfirmBooking: (booking: Booking) => void;
  onPromptLogin?: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  currentUser,
  onClose,
  onConfirmBooking,
  onPromptLogin,
}) => {
  if (!event) return null;

  const [selectedTierId, setSelectedTierId] = useState<string>(event.tiers[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoError, setPromoError] = useState<string>('');
  const [promoSuccess, setPromoSuccess] = useState<string>('');
  const [apiError, setApiError] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'cash'>('upi');
  const [attendeeName, setAttendeeName] = useState<string>(currentUser?.name || '');
  const [attendeeEmail, setAttendeeEmail] = useState<string>(currentUser?.email || '');
  const [attendeePhone, setAttendeePhone] = useState<string>(currentUser?.phone || '+1 (555) 234-5678');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [acidLog, setAcidLog] = useState<string[]>([]);
  const [paymentState, setPaymentState] = useState<'idle' | 'creating_order' | 'simulation_modal' | 'gateway_open' | 'verifying' | 'cancelled' | 'failed'>('idle');
  const [pendingOrder, setPendingOrder] = useState<any>(null);
  const [cancellationNotice, setCancellationNotice] = useState<string>('');

  // QR Code & Payment states
  const [qrVerified, setQrVerified] = useState<boolean>(false);
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 9821');
  const [cardExp, setCardExp] = useState<string>('08/29');
  const [cardCvv, setCardCvv] = useState<string>('419');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');

  const selectedTier = event.tiers.find((t) => t.id === selectedTierId) || event.tiers[0];
  const unitPrice = selectedTier?.price || 0;
  const subtotal = unitPrice * quantity;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const totalAmount = Math.max(0, subtotal - discountAmount);

  // Promo code validation
  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'EARLYBIRD20') {
      setDiscountPercent(20);
      setPromoSuccess('Promo EARLYBIRD20 applied: 20% Discount!');
    } else if (code === 'STUDENT50') {
      setDiscountPercent(50);
      setPromoSuccess('Promo STUDENT50 applied: 50% Student Discount!');
    } else if (code === 'VIP10') {
      setDiscountPercent(10);
      setPromoSuccess('Promo VIP10 applied: 10% Discount!');
    } else {
      setPromoError('Invalid coupon code. Try EARLYBIRD20 or STUDENT50');
      setDiscountPercent(0);
    }
  };

  // Backend-connected ACID booking submission with official Razorpay Checkout and Simulation Sandbox
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setCancellationNotice('');

    // Pre-check seat availability in UI
    if (quantity > selectedTier.available) {
      setApiError(`Only ${selectedTier.available} seats left for tier "${selectedTier.name}". Cannot request ${quantity} seats.`);
      return;
    }

    setIsProcessing(true);
    setPaymentState('creating_order');
    setAcidLog([
      '⚡ [Express Client]: Establishing session with EventForge Backend API...',
      `🔒 [ACID Step 1]: POST /api/bookings/create-order -> Enforcing server-side pricing & seat locks for ${quantity}x "${selectedTier.name}"...`,
    ]);

    try {
      // 1. Create order on backend (server calculates official price and verifies SQLite seat inventory)
      const orderRes = await backendApi.createPaymentOrder({
        eventId: event.id,
        tierId: selectedTier.id,
        quantity,
        promoCode: promoCode.trim() || undefined,
        attendeeName: attendeeName || 'Guest Attendee',
        attendeeEmail: attendeeEmail || 'guest@example.com',
        attendeePhone: attendeePhone || undefined,
        userId: currentUser?.id,
      });

      setPendingOrder(orderRes);

      setAcidLog((prev) => [
        ...prev,
        `✅ [Order Initialized]: Ref ${orderRes.bookingRef} (Order ID: ${orderRes.orderId})`,
        `💰 [Zero-Trust Verified]: Server amount: ₹${orderRes.calculatedDetails.totalAmount} (Discount: -₹${orderRes.calculatedDetails.discount})`,
      ]);

      // Free ticket path
      if (orderRes.calculatedDetails.totalAmount === 0) {
        setPaymentState('verifying');
        const verifyRes = await backendApi.verifyPayment({
          bookingRef: orderRes.bookingRef,
          razorpayOrderId: orderRes.orderId,
          razorpayPaymentId: 'FREE_TICKET_PROMO',
          razorpaySignature: 'FREE_TICKET_APPROVED',
        });
        setPaymentState('idle');
        setIsProcessing(false);
        onConfirmBooking({ ...verifyRes.booking, paymentMethod: 'cash' });
        return;
      }

      // Check whether server is running in simulation mode or real Razorpay test credentials
      if (orderRes.isSimulation) {
        // Test Simulation Mode Modal
        setPaymentState('simulation_modal');
        setIsProcessing(false);
        setAcidLog((prev) => [
          ...prev,
          '🧪 [Simulation Mode]: Gateway is operating in sandbox simulation mode.',
          '👉 [Action Required]: Authorize simulated payment or test cryptographic signature rejection.',
        ]);
      } else {
        // Real Razorpay Checkout Popup
        setPaymentState('gateway_open');
        setAcidLog((prev) => [
          ...prev,
          '🚀 [Razorpay Checkout]: Opening official Razorpay Checkout gateway...',
        ]);

        const loadScript = () => {
          return new Promise<boolean>((resolve) => {
            if ((window as any).Razorpay) return resolve(true);
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };

        const loaded = await loadScript();
        if (!loaded) {
          throw new Error('Failed to load official Razorpay Checkout script from checkout.razorpay.com');
        }

        const options = {
          key: orderRes.keyId,
          amount: orderRes.amount,
          currency: orderRes.currency || 'INR',
          name: 'EventForge',
          description: `${event.title} - ${selectedTier.name}`,
          order_id: orderRes.orderId,
          prefill: {
            name: attendeeName,
            email: attendeeEmail,
            contact: attendeePhone,
          },
          theme: {
            color: '#6366f1',
          },
          modal: {
            ondismiss: () => {
              setPaymentState('cancelled');
              setCancellationNotice('Payment was cancelled by user. No seats were reserved.');
              setIsProcessing(false);
              setAcidLog((prev) => [
                ...prev,
                '⚠️ [Razorpay Cancelled]: Checkout dismissed by user.',
              ]);
            },
          },
          handler: async (response: any) => {
            // NEVER confirm booking from frontend callback alone! Always verify HMAC on server!
            setPaymentState('verifying');
            setIsProcessing(true);
            setAcidLog((prev) => [
              ...prev,
              `🔒 [ACID Step 2]: Received Payment ID ${response.razorpay_payment_id}. Submitting signature to server...`,
            ]);
            try {
              const verifyRes = await backendApi.verifyPayment({
                bookingRef: orderRes.bookingRef,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              setPaymentState('idle');
              setIsProcessing(false);
              onConfirmBooking({ ...verifyRes.booking, paymentMethod });
            } catch (vErr: any) {
              setPaymentState('failed');
              setApiError(vErr.message || 'Server rejected payment signature.');
              setIsProcessing(false);
            }
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (failResp: any) => {
          setPaymentState('failed');
          setApiError(failResp?.error?.description || 'Payment failed on Razorpay gateway.');
          setIsProcessing(false);
        });
        rzp.open();
      }
    } catch (err: any) {
      console.error('[Booking Error]', err);
      const errorMsg = err?.message || 'Server error processing booking request';
      setPaymentState('failed');
      setApiError(errorMsg);
      setAcidLog((prev) => [
        ...prev,
        `❌ [Transaction Aborted]: ${errorMsg}`,
      ]);
      setIsProcessing(false);
    }
  };

  const handleAuthorizeSimulatedPayment = async () => {
    if (!pendingOrder) return;
    setIsProcessing(true);
    setPaymentState('verifying');
    setAcidLog((prev) => [
      ...prev,
      '🧪 [Simulation Authorized]: Submitting test HMAC signature to server...',
    ]);
    try {
      const verifyRes = await backendApi.verifyPayment({
        bookingRef: pendingOrder.bookingRef,
        razorpayOrderId: pendingOrder.orderId,
        razorpayPaymentId: `sim_pay_${Date.now()}`,
        razorpaySignature: 'simulated_valid_signature',
      });
      setPaymentState('idle');
      setIsProcessing(false);
      onConfirmBooking({ ...verifyRes.booking, paymentMethod });
    } catch (err: any) {
      setPaymentState('failed');
      setApiError(err.message || 'Signature verification failed in simulation mode.');
      setIsProcessing(false);
    }
  };

  const handleTestTamperedSignature = async () => {
    if (!pendingOrder) return;
    setIsProcessing(true);
    setAcidLog((prev) => [
      ...prev,
      '🛡️ [Security Test]: Submitting intentionally tampered signature to server...',
    ]);
    try {
      await backendApi.verifyPayment({
        bookingRef: pendingOrder.bookingRef,
        razorpayOrderId: pendingOrder.orderId,
        razorpayPaymentId: `tampered_pay_${Date.now()}`,
        razorpaySignature: 'MALICIOUS_TAMPERED_SIGNATURE',
      });
    } catch (err: any) {
      setPaymentState('failed');
      setApiError(`[Security Test Verified]: Server correctly rejected tampered signature: "${err.message}"`);
      setIsProcessing(false);
    }
  };

  const handleCancelSimulatedPayment = () => {
    setPaymentState('cancelled');
    setCancellationNotice('Payment simulation cancelled by user. No seats were reserved.');
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
          {/* Left Column: Event Overview & Schedule (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950/60 p-6 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between">
            <div>
              <div className="h-44 rounded-xl overflow-hidden relative mb-4">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-indigo-600/80 text-white text-xs font-semibold backdrop-blur-md">
                  {event.category}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white mb-2 leading-tight">
                {event.title}
              </h2>

              <div className="space-y-2 text-xs text-slate-300 mb-4">
                <div className="flex items-center text-slate-300">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-400 shrink-0" />
                  <span>{event.date} · {event.time}</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <MapPin className="w-4 h-4 mr-2 text-indigo-400 shrink-0" />
                  <span>{event.venue}, {event.city}</span>
                </div>
                <div className="flex items-center text-slate-400">
                  <Clock className="w-4 h-4 mr-2 text-indigo-400 shrink-0" />
                  <span>Organized by {event.organizer}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {event.description}
              </p>

              {/* Event Agenda if available */}
              {event.agenda && event.agenda.length > 0 && (
                <div className="border-t border-slate-800/80 pt-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Event Schedule / Agenda
                  </h4>
                  <div className="space-y-2">
                    {event.agenda.map((item, idx) => (
                      <div key={idx} className="flex text-xs space-x-2">
                        <span className="font-mono text-indigo-400 text-[11px] shrink-0 font-medium">
                          {item.time}
                        </span>
                        <span className="text-slate-400 text-[11px] leading-tight">
                          {item.activity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
              <span className="flex items-center">
                <Lock className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                ACID Concurrency Safe Booking
              </span>
              <span className="font-mono text-emerald-400 font-semibold">
                {event.availableSeats} Seats Remaining
              </span>
            </div>
          </div>

          {/* Right Column: Ticket Configuration & Checkout (7 cols) */}
          <div className="lg:col-span-7 p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center">
              <span>Select Pass & Attendee Information</span>
            </h3>

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              {/* Ticket Tier Cards */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  1. Choose Ticket Tier
                </label>
                <div className="space-y-2">
                  {event.tiers.map((tier) => {
                    const isSelected = tier.id === selectedTierId;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTierId(tier.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500 shadow-sm'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="tierRadio"
                              checked={isSelected}
                              onChange={() => setSelectedTierId(tier.id)}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-xs font-bold text-white">
                              {tier.name}
                            </span>
                          </div>
                          <span className="text-sm font-mono font-bold text-indigo-400">
                            ${tier.price}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 pl-5">
                          {tier.description}
                        </p>
                        {tier.perks && tier.perks.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2 pl-5">
                            {tier.perks.map((perk, pIdx) => (
                              <span
                                key={pIdx}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium"
                              >
                                ✓ {perk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-white">Number of Tickets</div>
                  <div className="text-[11px] text-slate-400">
                    Maximum 5 tickets per reservation
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold flex items-center justify-center text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-white text-sm">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                    disabled={quantity >= 5 || quantity >= selectedTier.available}
                    className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Attendee Details Form */}
              <div>
                {!currentUser && onPromptLogin && (
                  <div className="mb-3 p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300 flex items-center justify-between">
                    <span>Booking as Guest. Have an account?</span>
                    <button
                      type="button"
                      onClick={onPromptLogin}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-semibold transition-colors"
                    >
                      Sign In Now
                    </button>
                  </div>
                )}
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  2. Attendee Contact Details
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <input
                      type="text"
                      required
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="tel"
                      required
                      value={attendeePhone}
                      onChange={(e) => setAttendeePhone(e.target.value)}
                      placeholder="Phone / WhatsApp Number"
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Promo Code Engine */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>3. Promotional Discount</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    Try: <code className="text-amber-400">EARLYBIRD20</code> or <code className="text-amber-400">STUDENT50</code>
                  </span>
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo coupon code"
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 uppercase font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoSuccess && (
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {promoSuccess}
                  </p>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-400 mt-1">
                    {promoError}
                  </p>
                )}
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>4. Payment Method</span>
                  <span className="text-[11px] text-indigo-400 font-mono">100% Encrypted</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {[
                    { id: 'upi', label: 'Scan QR to Pay', icon: QrCode },
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'netbanking', label: 'NetBanking', icon: Landmark },
                    { id: 'cash', label: 'On-Spot Gate', icon: Lock },
                  ].map((pm) => {
                    const Icon = pm.icon;
                    const isSel = paymentMethod === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className={`p-2 rounded-lg border text-left flex items-center space-x-2 text-xs transition-colors ${
                          isSel
                            ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                        <span className="truncate">{pm.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* REAL SCANNABLE PAYMENT QR CODE SECTION */}
                {paymentMethod === 'upi' && (
                  <RealPaymentQrScanner
                    amount={totalAmount}
                    eventTitle={event.title}
                    onPaymentVerified={() => setQrVerified(true)}
                    isVerified={qrVerified}
                  />
                )}

                {/* CREDIT CARD SECTION */}
                {paymentMethod === 'card' && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Card Details Simulation</span>
                      <span className="text-[10px] text-indigo-400 flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1" /> 256-Bit SSL
                      </span>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card Number"
                        className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVV"
                        className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {/* NETBANKING SECTION */}
                {paymentMethod === 'netbanking' && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <span className="text-slate-400 block">Select NetBanking Institution:</span>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="HDFC Bank">HDFC Bank Direct Portal</option>
                      <option value="ICICI Bank">ICICI Corporate & Retail</option>
                      <option value="State Bank">State Bank of India (SBI)</option>
                      <option value="Chase">JPMorgan Chase & Co.</option>
                      <option value="Citibank">Citibank Worldwide</option>
                    </select>
                    <p className="text-[11px] text-slate-500">
                      You will be securely redirected to {selectedBank} portal to authorize the transfer of ${totalAmount}.
                    </p>
                  </div>
                )}

                {/* CASH AT GATE SECTION */}
                {paymentMethod === 'cash' && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="font-semibold text-slate-300">Reserve Now, Pay at Entrance Desk</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Your seats will be reserved immediately. Present your booking reference and pay ${totalAmount} in cash or card at the venue admission desk.
                    </p>
                  </div>
                )}
              </div>

              {/* Cancellation Notice */}
              {cancellationNotice && (
                <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-500/50 text-xs text-amber-200 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-amber-300">Payment Cancelled</div>
                    <div className="text-[11px] text-amber-300/90 mt-0.5">{cancellationNotice}</div>
                  </div>
                </div>
              )}

              {/* Server / Validation Error Notice */}
              {apiError && (
                <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-xs text-red-200 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-red-300">Backend Validation Notice</div>
                    <div className="text-[11px] text-red-300/90 mt-0.5">{apiError}</div>
                  </div>
                </div>
              )}

              {/* Price Calculation Summary */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>{selectedTier.name} (${unitPrice} × {quantity})</span>
                  <span className="font-mono text-slate-200">${subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount Coupon ({discountPercent}%)</span>
                    <span className="font-mono">-${discountAmount}</span>
                  </div>
                )}
                <div className="border-t border-slate-800 pt-1.5 flex justify-between font-bold text-white text-sm">
                  <span>Final Payable Amount</span>
                  <span className="font-mono text-emerald-400">${totalAmount}</span>
                </div>
              </div>

              {/* ACID Logs display when processing */}
              {isProcessing && acidLog.length > 0 && (
                <div className="p-2.5 rounded-lg bg-black border border-indigo-500/30 text-[11px] font-mono text-indigo-300 space-y-0.5 animate-pulse">
                  {acidLog.map((log, lIdx) => (
                    <div key={lIdx}>{log}</div>
                  ))}
                </div>
              )}

              {/* Confirm Booking & Cancel Actions */}
              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>
                      {paymentState === 'verifying'
                        ? 'Verifying HMAC Signature...'
                        : 'Creating Payment Order...'}
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Proceed to Payment (${totalAmount})</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Simulation Sandbox Modal Overlay */}
        {paymentState === 'simulation_modal' && pendingOrder && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Razorpay Test Simulation Sandbox</h3>
                    <span className="text-[10px] font-mono text-indigo-400">Mode: Backend Test Mode / Dry-Run</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCancelSimulatedPayment}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order ID:</span>
                  <span className="font-mono text-indigo-300 font-semibold">{pendingOrder.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Booking Ref:</span>
                  <span className="font-mono text-slate-200 font-semibold">{pendingOrder.bookingRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Event & Tier:</span>
                  <span className="text-white font-medium">{event.title} ({selectedTier.name} × {quantity})</span>
                </div>
                <div className="flex justify-between border-t border-slate-800/80 pt-2 font-bold text-sm">
                  <span className="text-slate-300">Server-Validated Amount:</span>
                  <span className="font-mono text-emerald-400">₹{pendingOrder.calculatedDetails.totalAmount}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
                <p className="leading-relaxed text-[11px]">
                  <strong>Zero-Trust Architecture:</strong> The order was created on the Node.js backend. In official test mode, the checkout popup opens. In simulation mode, you can verify cryptographic HMAC verification or test tampering rejection.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleAuthorizeSimulatedPayment}
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize Simulated Payment & Issue E-Ticket</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestTamperedSignature}
                  disabled={isProcessing}
                  className="w-full py-2 px-4 bg-slate-800 hover:bg-rose-950/40 hover:border-rose-700/60 text-slate-300 hover:text-rose-200 border border-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Test Signature Tampering Rejection (Security Audit)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancelSimulatedPayment}
                  className="w-full py-2 px-4 text-slate-400 hover:text-white text-xs font-medium rounded-xl transition-colors text-center cursor-pointer"
                >
                  Cancel Transaction
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
