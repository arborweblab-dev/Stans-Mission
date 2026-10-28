import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Camera, 
  Globe, 
  MapPin, 
  ShieldCheck, 
  Award, 
  PawPrint, 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  Gift,
  Sparkles,
  User,
  Share2,
  RefreshCw,
  QrCode,
  Lock,
  LogOut,
  ExternalLink
} from 'lucide-react';

// Firebase imports for user authentication & cloud storage
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

import { washtenawCharities } from './data/charities';

// Initialize Firebase safely with fallback config
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : { apiKey: "demo-key", authDomain: "demo.firebaseapp.com", projectId: "demo-project" };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'stans-mission-app';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [stanStatus, setStanStatus] = useState('grass'); // 'grass', 'bath', 'normal'
  const [selectedCharity, setSelectedCharity] = useState(washtenawCharities[0]);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successModal, setSuccessModal] = useState(null);
  const [qrModal, setQrModal] = useState(false);
  const [userSupporterName, setUserSupporterName] = useState('A2 Dog Friend');
  const [userSupporterMsg, setUserSupporterMsg] = useState('Keep up the great work Stan! 🐾');
  
  // Auth & Cloud State
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([
    { name: 'A2 Dog Lover', amount: 150, message: 'Keep up the great work Stan!' },
    { name: 'Ann Arbor Barkery', amount: 100, message: 'Treats on us next time!' },
    { name: 'Washtenaw Pup Squad', amount: 75, message: 'Love those underbite smiles!' },
    { name: 'Anonymous Friend', amount: 50, message: 'For the grass rolling fund!' },
  ]);

  // Firebase Auth Lifecycle
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setAuthLoading(false);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Supabase / Firestore live donations
  useEffect(() => {
    if (!user) return;
    try {
      const q = collection(db, 'artifacts', appId, 'public', 'data', 'donations');
      const unsubscribeData = onSnapshot(q, (snapshot) => {
        const fetched = [];
        snapshot.forEach((doc) => {
          fetched.push(doc.data());
        });
        if (fetched.length > 0) {
          // Sort descending by amount or timestamp
          fetched.sort((a, b) => (b.amount || 0) - (a.amount || 0));
          setLeaderboard(fetched);
        }
      }, (error) => {
        console.debug("Firestore snapshot note:", error);
      });
      return () => unsubscribeData();
    } catch (e) {
      console.debug("Firestore not fully configured or offline mode:", e);
    }
  }, [user]);

  // Handle donation flow & Stripe link redirection
  const handleDonate = async (amount, type) => {
    setIsProcessing(true);
    
    // Simulate or trigger real Stripe link if available
    setTimeout(async () => {
      setIsProcessing(false);
      let titleName = userSupporterName.trim() || 'Generous Friend';
      let msg = userSupporterMsg.trim() || (type === 'photo' ? 'Snapped a photo with Stan! 📸' : type === 'pet' ? `Gave Stan pets (${stanStatus === 'grass' ? 'messy grass fur!' : 'fresh bath fluff!'}) 🐾` : `Helped raise money for ${selectedCharity.name} 💚`);

      const newEntry = {
        name: titleName,
        amount: amount,
        message: msg,
        timestamp: Date.now()
      };

      // Try saving to Firestore if available
      try {
        if (user) {
          await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'donations'), newEntry);
        }
      } catch (e) {
        console.debug("Saved locally to state");
      }

      setLeaderboard([newEntry, ...leaderboard]);
      setSuccessModal({
        amount,
        charity: selectedCharity.name,
        type,
        stripeUrl: selectedCharity.stripeUrl
      });
    }, 700);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500 selection:text-neutral-950 flex justify-center">
      
      {/* Mobile App Frame (Phone Frame Container) */}
      <div className="w-full max-w-md bg-neutral-900 md:my-6 md:rounded-[40px] md:border-[8px] md:border-neutral-800 shadow-2xl flex flex-col min-h-screen md:min-h-[850px] md:max-h-[92vh] relative overflow-hidden">

        {/* App Status Bar (Mobile feel) */}
        <div className="hidden md:flex items-center justify-between px-6 pt-3 pb-1 text-[11px] text-neutral-400 font-mono border-b border-neutral-800/60 bg-neutral-950/40">
          <span>9:41</span>
          <div className="w-20 h-3 bg-neutral-800 rounded-full mx-auto"></div>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <div className="w-4 h-2.5 border border-neutral-400 rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-emerald-500 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* App Header */}
        <header className="bg-neutral-900/95 backdrop-blur-md px-5 py-4 border-b border-neutral-800 sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-neutral-800 rounded-2xl flex items-center justify-center border-2 border-emerald-500 shadow-inner overflow-hidden flex-shrink-0">
              <span className="text-xl">🐾</span>
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-neutral-100 flex items-center gap-1.5">
                STAN'S MISSION <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-bold uppercase">Washtenaw</span>
              </h1>
              <p className="text-[11px] text-neutral-400 truncate max-w-[190px]">Helping raise money for dog orgs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setQrModal(true)}
              className="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-emerald-400 flex items-center justify-center border border-neutral-700 transition active:scale-95"
              title="Show QR Code for In-Person Pay"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main App Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 space-y-5 pb-24">
          
          {/* TAB 1: HOME / MISSION */}
          {activeTab === 'home' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Stan's Interactive Status Widget */}
              <div className="bg-neutral-950 p-4 rounded-3xl border border-neutral-800 shadow-xl space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🐾</span>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-100">Stan's Live Mood & Coat</h3>
                      <p className="text-[11px] text-neutral-400">Select current texture for in-person tipping:</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-500 text-neutral-950 font-extrabold px-2.5 py-0.5 rounded-full">
                    {stanStatus === 'grass' ? '$1 Pet' : stanStatus === 'bath' ? '$3 Pet' : '$2 Pet'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button 
                    onClick={() => setStanStatus('grass')}
                    className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${stanStatus === 'grass' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold' : 'border-neutral-800 text-neutral-400 bg-neutral-900/50 hover:border-neutral-700'}`}
                  >
                    <span className="text-lg">🍂</span>
                    <span className="text-[11px] leading-tight">Leafy / Grass</span>
                  </button>

                  <button 
                    onClick={() => setStanStatus('normal')}
                    className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${stanStatus === 'normal' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold' : 'border-neutral-800 text-neutral-400 bg-neutral-900/50 hover:border-neutral-700'}`}
                  >
                    <span className="text-lg">📸</span>
                    <span className="text-[11px] leading-tight">Standard Smile</span>
                  </button>

                  <button 
                    onClick={() => setStanStatus('bath')}
                    className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${stanStatus === 'bath' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold' : 'border-neutral-800 text-neutral-400 bg-neutral-900/50 hover:border-neutral-700'}`}
                  >
                    <span className="text-lg">✨</span>
                    <span className="text-[11px] leading-tight">Fresh Bath</span>
                  </button>
                </div>
              </div>

              {/* Hero Banner Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-neutral-950 border border-neutral-800">
                <div className="aspect-[16/10] relative bg-neutral-900 flex items-center justify-center">
                  <div className="text-center p-6 space-y-2">
                    <span className="text-5xl">🐕‍🦺</span>
                    <h3 className="font-bold text-neutral-300 text-sm">Stan the Underbite King</h3>
                    <p className="text-[10px] text-neutral-500">Black, grey & white coat with a love for green!</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4 space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <MapPin className="w-3 h-3" /> Washtenaw County Ambassador
                    </div>
                    <h2 className="text-xl font-black text-neutral-100 leading-tight">
                      Hi, I'm Stan! 🐾 Making Underbites Cool Again.
                    </h2>
                  </div>
                </div>
                <div className="p-4 space-y-3 bg-neutral-950">
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    I'm on a mission to help raise money for incredible Washtenaw dog rescues and shelters. In the future, I'll take my underbite global to support dog missions worldwide!
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button 
                      onClick={() => setActiveTab('donate')}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold py-3 px-4 rounded-2xl shadow-lg transition text-xs flex items-center justify-center gap-1.5"
                    >
                      <DollarSign className="w-4 h-4 bg-neutral-950/20 rounded-full" /> Quick Donate
                    </button>
                    <button 
                      onClick={() => setActiveTab('booth')}
                      className="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-bold py-3 px-4 rounded-2xl transition text-xs flex items-center justify-center gap-1.5 border border-neutral-800"
                    >
                      <Camera className="w-4 h-4 text-emerald-400" /> Booth
                    </button>
                  </div>
                </div>
              </div>

              {/* Washtenaw Charities Quick List */}
              <div className="bg-neutral-950 p-4 rounded-3xl border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-neutral-100 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" /> Current Washtenaw Partner
                  </h3>
                  <button 
                    onClick={() => setActiveTab('donate')}
                    className="text-xs text-emerald-400 font-bold hover:underline"
                  >
                    Change
                  </button>
                </div>

                <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedCharity.icon}</span>
                    <div>
                      <h4 className="font-bold text-xs text-neutral-100">{selectedCharity.name}</h4>
                      <p className="text-[10px] text-neutral-400 line-clamp-1">{selectedCharity.description}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-1 rounded-full whitespace-nowrap">
                    Goal: {selectedCharity.goal}
                  </span>
                </div>
              </div>

              {/* Recent Feed */}
              <div className="bg-neutral-950 p-4 rounded-3xl border border-neutral-800 space-y-3">
                <h3 className="font-bold text-sm text-neutral-100 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-emerald-400" /> Recent Supporters Feed
                </h3>
                <div className="space-y-2">
                  {leaderboard.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800/80 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-bold text-neutral-200 text-xs">{item.name}</p>
                        <p className="text-[11px] text-neutral-400">{item.message}</p>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-extrabold text-xs px-2.5 py-1 rounded-full whitespace-nowrap">
                        ${item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SECURE DONATION HUB */}
          {activeTab === 'donate' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-neutral-950 p-4 rounded-3xl border border-neutral-800 space-y-3">
                <h3 className="font-bold text-sm text-neutral-100 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" /> Choose Washtenaw Organization
                </h3>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {washtenawCharities.map((charity) => (
                    <div 
                      key={charity.id}
                      onClick={() => setSelectedCharity(charity)}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${selectedCharity.id === charity.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{charity.icon}</span>
                        <div>
                          <h4 className="font-bold text-xs text-neutral-100">{charity.name}</h4>
                          <p className="text-[10px] text-neutral-400">{charity.goal}</p>
                        </div>
                      </div>
                      {selectedCharity.id === charity.id && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Supporter Details Input */}
              <div className="bg-neutral-950 p-4 rounded-3xl border border-neutral-800 space-y-3">
                <h3 className="font-bold text-sm text-neutral-100 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-400" /> Your Supporter Profile
                </h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">Your Name / Display Name</label>
                    <input 
                      type="text" 
                      value={userSupporterName}
                      onChange={(e) => setUserSupporterName(e.target.value)}
                      placeholder="e.g. Ann Arbor Pup Lover"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">Cheering Message for Stan</label>
                    <input 
                      type="text" 
                      value={userSupporterMsg}
                      onChange={(e) => setUserSupporterMsg(e.target.value)}
                      placeholder="e.g. Keep up the great work Stan!"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Donation Amount Hub */}
              <div className="bg-neutral-950 p-4 rounded-3xl border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-neutral-100">Help Raise Money</h3>
                    <p className="text-[10px] text-neutral-400">Secure Stripe checkout for {selectedCharity.name}</p>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[10, 25, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleDonate(amt, 'general')}
                      disabled={isProcessing}
                      className="bg-neutral-900 hover:bg-emerald-500 hover:text-neutral-950 font-bold py-2.5 rounded-xl transition border border-neutral-800 text-xs text-neutral-200"
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Custom amount ($)" 
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-neutral-100 text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <button 
                    onClick={() => {
                      if(customAmount && Number(customAmount) > 0) {
                        handleDonate(Number(customAmount), 'general');
                        setCustomAmount('');
                      }
                    }}
                    disabled={isProcessing}
                    className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold px-4 py-2.5 rounded-xl transition text-xs whitespace-nowrap flex items-center gap-1 shadow-lg"
                  >
                    {isProcessing ? 'Processing...' : <><CreditCard className="w-3.5 h-3.5"/> Pay via Stripe</>}
                  </button>
                </div>
                
                {/* Stripe Product URL Helper Note */}
                <div className="p-3 bg-neutral-900/80 rounded-2xl border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
                  <p className="font-semibold text-neutral-300 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 text-emerald-400" /> Stripe Integration Ready:
                  </p>
                  <p>Paste your Stripe Product URLs in <code className="text-emerald-400 font-mono">src/data/charities.js</code> to link direct live checkouts.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IN-PERSON BOOTH */}
          {activeTab === 'booth' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-3xl text-center space-y-1 relative overflow-hidden">
                <div className="text-3xl mb-1">📸</div>
                <h3 className="font-black text-base text-neutral-100">Stan's In-Person Booth</h3>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Spotted Stan out in Washtenaw County? Pay securely here or bring cash/card in person!
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Petting Pass */}
                <div className="bg-neutral-950 p-4 rounded-3xl border border-neutral-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase">Petting Pass</span>
                    <h4 className="font-bold text-sm text-neutral-100">Pet Stan ({stanStatus === 'grass' ? 'Leafy Fur' : stanStatus === 'bath' ? 'Fresh Bath' : 'Standard'})</h4>
                    <p className="text-[11px] text-neutral-400">
                      {stanStatus === 'grass' ? '$1 - Max twiggy fun' : stanStatus === 'bath' ? '$3 - Deluxe plushness' : '$2 - Standard pets'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDonate(stanStatus === 'grass' ? 1 : stanStatus === 'bath' ? 3 : 2, 'pet')}
                    className="bg-neutral-900 hover:bg-emerald-500 hover:text-neutral-950 text-neutral-100 font-bold px-4 py-2.5 rounded-2xl border border-neutral-800 text-xs transition shadow-md whitespace-nowrap"
                  >
                    Pay {stanStatus === 'grass' ? '$1' : stanStatus === 'bath' ? '$3' : '$2'}
                  </button>
                </div>

                {/* Photo Op */}
                <div className="bg-neutral-950 p-4 rounded-3xl border-2 border-emerald-500 flex items-center justify-between relative">
                  <div className="absolute -top-2 right-4 bg-emerald-500 text-neutral-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">Popular</div>
                  <div className="space-y-1">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase">Photo Op</span>
                    <h4 className="font-bold text-sm text-neutral-100">Photo with Stan</h4>
                    <p className="text-[11px] text-neutral-400">Snap a selfie with the underbite king ($2)</p>
                  </div>
                  <button
                    onClick={() => handleDonate(2, 'photo')}
                    className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold px-4 py-2.5 rounded-2xl text-xs transition shadow-lg whitespace-nowrap"
                  >
                    Pay $2
                  </button>
                </div>

                {/* Treat Fund Tip */}
                <div className="bg-neutral-950 p-4 rounded-3xl border border-neutral-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase">Treat Fund</span>
                    <h4 className="font-bold text-sm text-neutral-100">Gourmet Biscuit Tip</h4>
                    <p className="text-[11px] text-neutral-400">Support Stan's organic treat supply</p>
                  </div>
                  <button
                    onClick={() => handleDonate(10, 'general')}
                    className="bg-neutral-900 hover:bg-emerald-500 hover:text-neutral-950 text-neutral-100 font-bold px-4 py-2.5 rounded-2xl border border-neutral-800 text-xs transition shadow-md whitespace-nowrap"
                  >
                    Support $10
                  </button>
                </div>
              </div>

              {/* Photo Gallery Grid */}
              <div className="bg-neutral-950 p-4 rounded-3xl border border-neutral-800 space-y-3">
                <h3 className="font-bold text-xs text-neutral-100 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-400" /> Washtenaw Photo Gallery
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl overflow-hidden aspect-square bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs text-neutral-500">
                    Stan 1
                  </div>
                  <div className="rounded-xl overflow-hidden aspect-square bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs text-neutral-500">
                    Stan 2
                  </div>
                  <div className="rounded-xl overflow-hidden aspect-square bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs text-neutral-500">
                    Stan 3
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Bottom App Navigation Bar (App-like Dock) */}
        <nav className="absolute bottom-0 left-0 right-0 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 px-6 py-2.5 flex items-center justify-around z-40">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition ${activeTab === 'home' ? 'text-emerald-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            <PawPrint className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('donate')}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition ${activeTab === 'donate' ? 'text-emerald-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            <DollarSign className="w-5 h-5" />
            <span className="text-[10px]">Donate</span>
          </button>

          <button 
            onClick={() => setActiveTab('booth')}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition ${activeTab === 'booth' ? 'text-emerald-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            <Camera className="w-5 h-5" />
            <span className="text-[10px]">Booth</span>
          </button>
        </nav>

        {/* SUCCESS MODAL */}
        {successModal && (
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xs w-full p-6 text-center space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-neutral-700"></div>
              
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
                🎉
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-neutral-100">Thank You!</h3>
                <p className="text-xs text-neutral-300">
                  Your <span className="font-bold text-emerald-400">${successModal.amount}</span> contribution helps raise money for <span className="font-bold text-neutral-100">{successModal.charity}</span>!
                </p>
              </div>

              <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 text-[11px] text-emerald-400 italic">
                "Bork! Thanks for supporting my mission!" — Stan 🐾
              </div>

              <div className="space-y-2">
                {successModal.stripeUrl && successModal.stripeUrl.startsWith('http') && (
                  <a
                    href={successModal.stripeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold py-3 rounded-2xl transition text-xs shadow-lg flex items-center justify-center gap-1.5"
                  >
                    Proceed to Stripe Checkout <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setSuccessModal(null)}
                  className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold py-3 rounded-2xl transition text-xs"
                >
                  Close & Return
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR CODE MODAL FOR IN-PERSON PAYMENTS */}
        {qrModal && (
          <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xs w-full p-6 text-center space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-neutral-100 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-400" /> In-Person Tipping QR
                </h3>
                <button 
                  onClick={() => setQrModal(false)}
                  className="text-xs text-neutral-400 hover:text-neutral-200"
                >
                  ✕
                </button>
              </div>

              <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 flex flex-col items-center justify-center space-y-3">
                <div className="w-36 h-36 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-center relative overflow-hidden">
                  <div className="grid grid-cols-6 gap-1 w-28 h-28 p-1 bg-neutral-950 rounded-lg">
                    {Array.from({length: 36}).map((_, i) => (
                      <div key={i} className={`rounded-2xs ${i % 2 === 0 || i % 5 === 0 ? 'bg-emerald-400' : 'bg-neutral-800'}`}></div>
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-neutral-950/20 flex items-center justify-center">
                    <span className="text-[10px] bg-neutral-900 text-emerald-400 px-2 py-1 rounded-md font-mono font-bold border border-neutral-800">STAN-A2</span>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Scan with camera to instantly pay <span className="text-emerald-400 font-bold">$1-$3</span> for pets & photos!
                </p>
              </div>

              <button
                onClick={() => setQrModal(false)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold py-2.5 rounded-2xl transition text-xs shadow-lg"
              >
                Close QR Code
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
