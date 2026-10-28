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
  Sliders,
  Send
} from 'lucide-react';

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
  
  const [leaderboard, setLeaderboard] = useState([
    { name: 'A2 Dog Lover', amount: 150, message: 'Keep up the great work Stan!' },
    { name: 'Ann Arbor Barkery', amount: 100, message: 'Treats on us next time!' },
    { name: 'Washtenaw Pup Squad', amount: 75, message: 'Love those underbite smiles!' },
    { name: 'Anonymous Friend', amount: 50, message: 'For the grass rolling fund!' },
  ]);

  // Handle donation flow simulation
  const handleDonate = (amount, type) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      let titleName = userSupporterName.trim() || 'Generous Friend';
      let msg = userSupporterMsg.trim() || (type === 'photo' ? 'Snapped a photo with Stan! 📸' : type === 'pet' ? `Gave Stan pets (${stanStatus === 'grass' ? 'messy grass fur!' : 'fresh bath fluff!'}) 🐾` : `Helped support ${selectedCharity.name} 💚`);

      const newEntry = {
        name: titleName,
        amount: amount,
        message: msg
      };
      setLeaderboard([newEntry, ...leaderboard]);
      setSuccessModal({
        amount,
        charity: selectedCharity.name,
        type
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500 selection:text-neutral-950 pb-24 md:pb-8 flex justify-center">
      
      {/* Mobile Device Container Frame (app-like view) */}
      <div className="w-full max-w-md md:max-w-xl bg-neutral-900 md:my-6 md:rounded-[40px] md:border-[8px] md:border-neutral-800 shadow-2xl flex flex-col min-h-screen md:min-h-[850px] md:max-h-[92vh] relative overflow-hidden">

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
              <img 
                src="PXL_20261013_195011835.jpg" 
                alt="Stan Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-neutral-100 flex items-center gap-1.5">
                STAN'S MISSION <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-bold uppercase">Washtenaw</span>
              </h1>
              <p className="text-[11px] text-neutral-400 truncate max-w-[200px]">Helping raise money for dog orgs</p>
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
        <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
          
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
                  <span className="text-xs bg-emerald-500 text-neutral-950 font-extrabold px-2 py-0.5 rounded-full">
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
                <div className="aspect-[16/10] relative">
                  <img 
                    src="PXL_20261013_195011835.jpg" 
                    alt="Stan smiling" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4 space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <MapPin className="w-3 h-3" /> Washtenaw County Ambassador
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-neutral-100 leading-tight">
                      Hi, I'm Stan! 🐾 Making Underbites Cool Again.
                    </h2>
                  </div>
                </div>
                <div className="p-4 space-y-3 bg-neutral-950">
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    I'm on a mission to help raise money for incredible Washtenaw dog rescues and shelters. In late 2027, I'll take my underbite global to support dog missions worldwide!
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
                <p className="text-[10px] text-neutral-500 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Secured with Stripe 256-bit encryption
                </p>
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
                  <div className="rounded-xl overflow-hidden aspect-square bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <span className="text-xl">🐾</span>
                  </div>
                  <div className="rounded-xl overflow-hidden aspect-square bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <span className="text-xl">🍂</span>
                  </div>
                  <div className="rounded-xl overflow-hidden aspect-square bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <span className="text-xl">✨</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WORLD TOUR (Late 2027) */}
          {activeTab === 'tour' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-neutral-950 border border-neutral-800 p-5 rounded-3xl space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                  <Globe className="w-3 h-3" /> Future Aspirations
                </div>
                <h3 className="font-black text-lg text-neutral-100">Stan's World Tour 🌍</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  While Stan is currently focused on Washtenaw County, his ambitions are global! In late 2027, Stan plans to travel the world to help raise money for international rescue sanctuaries and canine therapy networks.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="bg-neutral-950 p-4 rounded-3xl border border-neutral-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-xs text-neutral-100">Washtenaw County HQ</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Ann Arbor, Ypsilanti, and local townships. Active now supporting local shelter heroes.</p>
                    <span className="text-[10px] text-emerald-400 font-bold mt-1 inline-block">✓ Active Today</span>
                  </div>
                </div>

                <div className="bg-neutral-950 p-4 rounded-3xl border border-neutral-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-neutral-900 text-neutral-400 flex items-center justify-center font-bold text-xs flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-xs text-neutral-100">North American Bark Tour</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Roadtripping across state lines to visit iconic national parks and regional adoption fairs.</p>
                    <span className="text-[10px] text-neutral-500 font-bold mt-1 inline-block">Coming Late 2027</span>
                  </div>
                </div>

                <div className="bg-neutral-950 p-4 rounded-3xl border border-neutral-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-neutral-900 text-neutral-400 flex items-center justify-center font-bold text-xs flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-xs text-neutral-100">Global Paws Without Borders</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Passport stamped! Stan takes flight to support international rescue organizations.</p>
                    <span className="text-[10px] text-neutral-500 font-bold mt-1 inline-block">Future Vision (Late 2027+)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Bottom App Navigation Bar (App-like Dock) */}
        <nav className="absolute bottom-0 left-0 right-0 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 px-3 py-2 flex items-center justify-around z-40">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition ${activeTab === 'home' ? 'text-emerald-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            <PawPrint className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('donate')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition ${activeTab === 'donate' ? 'text-emerald-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            <DollarSign className="w-5 h-5" />
            <span className="text-[10px]">Donate</span>
          </button>

          <button 
            onClick={() => setActiveTab('booth')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition ${activeTab === 'booth' ? 'text-emerald-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            <Camera className="w-5 h-5" />
            <span className="text-[10px]">Booth</span>
          </button>

          <button 
            onClick={() => setActiveTab('tour')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition ${activeTab === 'tour' ? 'text-emerald-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            <Globe className="w-5 h-5" />
            <span className="text-[10px]">World Tour</span>
          </button>
        </nav>

        {/* SUCCESS MODAL */}
        {successModal && (
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xs w-full p-6 text-center space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-neutral-700"></div>
              
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner animate-bounce">
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

              <button
                onClick={() => setSuccessModal(null)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold py-3 rounded-2xl transition text-xs shadow-lg"
              >
                Back to Stan's Mission
              </button>
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
                <div className="w-36 h-36 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-center relative overflow-hidden group">
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

// Data for Washtenaw Charities
const washtenawCharities = [
  {
    id: 'hshv',
    name: 'Humane Society of Huron Valley (HSHV)',
    description: 'Providing compassionate care, shelter, and medical support for animals in Washtenaw County.',
    goal: '$5,000',
    icon: '🏡'
  },
  {
    id: 'safehouse',
    name: 'SafeHouse & Pet Shelter Alliance',
    description: 'Ensuring pets of families in transition remain safe and cared for in our community.',
    goal: '$2,500',
    icon: '❤️'
  },
  {
    id: 'washtenaw_rescue',
    name: 'Washtenaw County Dog Rescue Network',
    description: 'Volunteer-driven foster network rescuing senior and special-needs pups.',
    goal: '$3,500',
    icon: '🐶'
  },
  {
    id: 'community_fund',
    name: 'Stan’s General Treat & Outreach Fund',
    description: 'Direct community fund for local dog park improvements and emergency vet care assistance.',
    goal: '$1,500',
    icon: '✨'
  }
];
