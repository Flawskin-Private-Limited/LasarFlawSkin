import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trash2,
  Home,
  Building2,
  Umbrella,
  Phone,
  MapPin,
  ChevronRight,
  MapPinPlus,
} from 'lucide-react';
import { getAddresses, addAddress as addFirestoreAddress, deleteAddress as deleteFirestoreAddress, setDefaultAddress as setFirestoreDefault } from '../firebase/addressService';
import { getCurrentUserId } from '../utils/authSession';

const MAX_ADDRESSES = 5;

const SaveAddress = () => {
  const buildFullAddress = (item) =>
    item.fullAddress ||
    [item.house, item.building, item.landmark, item.selectedAddress]
      .filter(Boolean)
      .join(', ');
  const [addresses, setAddresses] = useState(() => {
    try {
      const normalized = [];
      const stored = localStorage.getItem('savedAddresses');

      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          parsed.forEach((item, index) => {
            const fullAddress = buildFullAddress(item);
            if (fullAddress) {
              normalized.push({
                ...item,
                id: item.id || `addr-${index}`,
                saveAs: item.saveAs || 'Home',
                fullAddress,
                isDefault: Boolean(item.isDefault),
              });
            }
          });
        }
      }

      const singleStoredAddress = localStorage.getItem('fullAddress');
      if (singleStoredAddress) {
        try {
          const parsedSingle = JSON.parse(singleStoredAddress);
          if (parsedSingle?.persistInSavedAddresses === false) {
            return normalized;
          }
          const singleFullAddress = buildFullAddress(parsedSingle);
          if (
            singleFullAddress &&
            !normalized.some((item) => buildFullAddress(item) === singleFullAddress)
          ) {
            normalized.push({
              ...parsedSingle,
              id: parsedSingle.id || `addr-${Date.now()}`,
              saveAs: parsedSingle.saveAs || 'Home',
              fullAddress: singleFullAddress,
              isDefault: normalized.length === 0,
            });
          }
        } catch (error) {
          console.error('Unable to parse fullAddress', error);
        }
      }

      if (normalized.length > 0 && !normalized.some((item) => item.isDefault)) {
        normalized[0].isDefault = true;
      }

      return normalized;
    } catch (error) {
      console.error('Unable to parse savedAddresses', error);
      return [];
    }
  });
  const [limitError, setLimitError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAddresses(getCurrentUserId())
      .then((remote) => {
        if (!Array.isArray(remote) || remote.length === 0) return;
        const normalized = remote.map((item, index) => ({
          ...item,
          id: item.id || `addr-${index}`,
          saveAs: item.saveAs || 'Home',
          fullAddress: buildFullAddress(item),
          isDefault: Boolean(item.isDefault),
        }));
        localStorage.setItem('savedAddresses', JSON.stringify(normalized));
        setAddresses(normalized);
      })
      .catch(() => {});
  }, []);

  const persistAddresses = (nextAddresses) => {
    localStorage.setItem('savedAddresses', JSON.stringify(nextAddresses));
    setAddresses(nextAddresses);
  };

  const handleAddAddress = () => {
    if (addresses.length >= MAX_ADDRESSES) {
      setLimitError(true);
      setTimeout(() => setLimitError(false), 3000);
      return;
    }

    setLimitError(false);
    navigate('/select-location', {
      state: { source: 'saved-address' },
    });
  };

  const handleDelete = (id) => {
    setLimitError(false);
    const filtered = addresses.filter((addr) => addr.id !== id);

    if (filtered.length > 0 && !filtered.some((item) => item.isDefault)) {
      filtered[0].isDefault = true;
      localStorage.setItem('fullAddress', JSON.stringify(filtered[0]));
    } else if (filtered.length === 0) {
      localStorage.removeItem('fullAddress');
    }

    persistAddresses(filtered);

    // Also delete from Firestore
    deleteFirestoreAddress(getCurrentUserId(), id).catch(() => {});
  };

  const handleSetDefault = (id) => {
    const updated = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));

    const selected = updated.find((item) => item.id === id);
    if (selected) {
      localStorage.setItem('fullAddress', JSON.stringify(selected));
    }

    persistAddresses(updated);

    // Also sync default to Firestore
    setFirestoreDefault(getCurrentUserId(), id).catch(() => {});
  };

  const renderIcon = (label) => {
    const normalizedLabel = String(label || '').toLowerCase();

    if (normalizedLabel.includes('office')) {
      return (
        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
          <Building2 className="h-5 w-5" />
        </div>
      );
    }

    if (normalizedLabel.includes('vacation')) {
      return (
        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
          <Umbrella className="h-5 w-5" />
        </div>
      );
    }

    return (
      <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-400">
        <Home className="h-5 w-5" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center text-sm text-slate-400 mb-6 gap-2">
          <span
            onClick={() => navigate('/profile-dashboard')}
            className="hover:text-sky-500 cursor-pointer"
          >
            Dashboard
          </span>
          <ChevronRight size={14} />
          <span className="text-slate-800 font-medium">Manage Addresses</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Saved Addresses</h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage your service locations for home treatments.
            </p>
          </div>

          <button
            onClick={handleAddAddress}
            className="flex items-center gap-2 bg-[#86B6CC] hover:bg-[#79AFC6] text-[#0F172A] font-semibold px-6 py-3 rounded-2xl text-lg"
          >
            <MapPinPlus size={20} />
            Add New Address
          </button>
        </div>

        {limitError && (
          <div className="mb-6 text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg w-fit">
            Maximum {MAX_ADDRESSES} addresses allowed. Delete one to add a new address.
          </div>
        )}

        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center flex flex-col items-center">
            <svg className="w-32 h-32 text-slate-200 mb-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">No Saved Addresses</h2>
            <p className="text-slate-500 mb-6">
              Add a home or office address to book services easily.
            </p>
            <button
              onClick={handleAddAddress}
              className="flex items-center gap-2 bg-sky-400 hover:bg-sky-500 text-white px-6 py-3 rounded-full font-medium"
            >
              <MapPinPlus size={18} />
              Add Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white p-6 rounded-[20px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col h-full relative"
              >
                {addr.isDefault && (
                  <div className="absolute top-6 right-6 px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                    Default
                  </div>
                )}

                {renderIcon(addr.saveAs)}

                <h3 className="text-xl font-bold text-slate-800 mt-5 mb-4">{addr.saveAs || 'Home'}</h3>

                <div className="space-y-3 mb-8 flex-1">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-[14px] leading-relaxed text-slate-500">
                      {buildFullAddress(addr)}
                    </span>
                  </div>

                  {addr.phoneNumber && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-[14px] text-slate-500">{addr.phoneNumber}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-auto">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-sm py-2 rounded-lg"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="flex-1 bg-slate-100 hover:bg-red-50 text-sm py-2 rounded-lg flex items-center justify-center gap-1 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}

            <div
              onClick={handleAddAddress}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50"
            >
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <MapPinPlus size={22} />
              </div>
              <h3 className="font-semibold mb-1">Add New Location</h3>
              <p className="text-sm text-slate-400">Easily book services at a new spot</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaveAddress;
