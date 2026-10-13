import React, { useState } from 'react';
import { AlertTriangle, X, Trash2, ShieldAlert } from 'lucide-react';
import { User } from '../types';

interface DeleteAccountModalProps {
  isOpen: boolean;
  currentUser: User | null;
  onClose: () => void;
  onConfirmDelete: (userId: string) => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen || !currentUser) return null;

  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isConfirmed = confirmText.trim().toUpperCase() === 'DELETE';

  const handleDelete = () => {
    if (!isConfirmed) return;
    setIsDeleting(true);
    setTimeout(() => {
      onConfirmDelete(currentUser.id);
      setIsDeleting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-rose-900/50 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Strip */}
        <div className="bg-rose-950/40 p-6 border-b border-rose-900/40">
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Danger Zone · Account Deletion</span>
          </div>

          <h2 className="text-xl font-bold text-white">Delete User Account</h2>
          <p className="text-xs text-slate-400 mt-1">
            This action is permanent and cannot be undone.
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          {/* Target Account Summary */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center space-x-3">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-rose-500/30"
            />
            <div className="flex-1 truncate">
              <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
              <div className="text-[11px] text-slate-400 font-mono truncate">{currentUser.email}</div>
              <div className="text-[10px] text-rose-400 font-mono capitalize">
                Role: {currentUser.role}
              </div>
            </div>
          </div>

          {/* Impact Warning */}
          <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl space-y-1.5 text-xs text-rose-200">
            <div className="font-semibold flex items-center text-rose-300">
              <AlertTriangle className="w-4 h-4 mr-1.5 shrink-0 text-rose-400" />
              <span>What will happen upon deletion:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-rose-300/80 leading-relaxed">
              <li>Your login credentials and profile records will be permanently removed.</li>
              <li>Any active event tickets will be cancelled, and reserved seats will be returned to the venue.</li>
              <li>You will be logged out to guest mode immediately.</li>
            </ul>
          </div>

          {/* Type DELETE confirmation */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              To verify, type <span className="font-mono text-rose-400 font-bold">DELETE</span> below:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono placeholder-slate-600 focus:outline-none focus:border-rose-500 uppercase"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={!isConfirmed || isDeleting}
              className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isDeleting ? 'Deleting...' : 'Permanently Delete'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
