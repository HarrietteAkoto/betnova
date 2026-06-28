"use client";
import { Star } from "lucide-react";

// Types for the match data
interface MatchOdds { id: string; matchId: string; matchName: string; market: string; outcome: string; odds: number; }
interface MatchMarkets { main: { home: MatchOdds; draw: MatchOdds; away: MatchOdds }; extra?: { over: MatchOdds; under: MatchOdds; btts: MatchOdds }; special?: { dc1x: MatchOdds; dcx2: MatchOdds; cs: MatchOdds }; }

export interface MatchData { 
  id: string; home: string; away: string; score: string; status: string; isLive: boolean; sport: string; 
  stats: string; 
  form: { home: string; away: string }; 
  markets: MatchMarkets; 
}

interface MatchCardProps {
  match: MatchData;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  activeMarketTab: 'markets' | 'stats' | 'codes';
  setActiveMarketTab: (tab: 'markets' | 'stats' | 'codes') => void;
  activeMarketFilter: 'all' | 'main' | 'goals' | 'corners' | 'half' | 'players';
  setActiveMarketFilter: (filter: any) => void;
  liveCommentary: string[];
  commentaryIndex: number;
  addSelection: (odd: MatchOdds) => void;
  setNotification: (msg: string) => void;
}

export function MatchCard({ match, favorites, toggleFavorite, activeMarketTab, setActiveMarketTab, activeMarketFilter, setActiveMarketFilter, liveCommentary, commentaryIndex, addSelection, setNotification }: MatchCardProps) {
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 space-y-4">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className={match.status.includes("World Cup") ? "text-yellow-400 font-bold" : ""}>{match.status}</span>
        {match.isLive && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">LIVE</span>}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <p className="font-semibold text-white">{match.home}</p>
            <span className="text-[10px] text-gray-500 font-mono tracking-wider">{match.form.home}</span>
            <button onClick={() => toggleFavorite(match.id)}>
              <Star className={`w-4 h-4 ${favorites.includes(match.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
            </button>
          </div>
          <p className="font-semibold text-white mt-1">{match.away}</p>
          <span className="text-[10px] text-gray-500 font-mono tracking-wider">{match.form.away}</span>
        </div>
        <div className={`text-2xl font-bold px-4 ${match.isLive ? 'text-green-500' : 'text-gray-500'}`}>{match.score}</div>
      </div>

      {match.isLive && (
        <div className="bg-gray-950 border border-gray-800 rounded p-2 flex items-center gap-2 text-xs">
          <span className="text-green-500 font-bold animate-pulse">● LIVE</span>
          <span className="text-gray-400 truncate">{liveCommentary[commentaryIndex]}</span>
        </div>
      )}
      
      <div className="pt-2 border-t border-gray-800">
        <div className="flex gap-4 mb-3 border-b border-gray-800">
          {(['markets','stats','codes'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveMarketTab(tab)} className={`pb-2 text-xs font-bold uppercase flex items-center gap-1 ${activeMarketTab === tab ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeMarketTab === 'markets' && (
          <div className="space-y-3">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
              {(['all','main','goals','corners','half','players'] as const).map(f => (
                <button key={f} onClick={() => setActiveMarketFilter(f)} className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${activeMarketFilter === f ? 'bg-green-500 text-gray-950' : 'bg-gray-800 text-gray-400'}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            
            {(activeMarketFilter === 'all' || activeMarketFilter === 'main') && (
              <div className="grid grid-cols-3 gap-2">
                <OddsButton selection={match.markets.main.home} addSelection={addSelection} />
                <OddsButton selection={match.markets.main.draw} addSelection={addSelection} />
                <OddsButton selection={match.markets.main.away} addSelection={addSelection} />
              </div>
            )}
          </div>
        )}

        {activeMarketTab === 'stats' && (
          <div className="bg-gray-950 rounded-lg p-3 border border-gray-800">
            <p className="text-sm text-gray-300 mb-3">📊 {match.stats}</p>
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '55%' }}></div>
            </div>
          </div>
        )}

        {activeMarketTab === 'codes' && (
          <div className="bg-gray-950 rounded-lg p-3 border border-gray-800 text-center">
            <p className="text-sm text-gray-400 mb-2">Share this match</p>
            <button onClick={() => { addSelection(match.markets.main.home); setNotification("Added to betslip!"); setTimeout(() => setNotification(null), 2000); }} className="px-4 py-2 bg-gray-800 hover:bg-green-600 text-white rounded text-xs font-bold">
              Add to Betslip
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple OddsButton included so you don't get import errors!
function OddsButton({ selection, addSelection }: { selection: MatchOdds, addSelection: (odd: MatchOdds) => void }) {
  return (
    <button 
      onClick={() => addSelection(selection)}
      className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold py-2 px-1 rounded border border-gray-700 flex flex-col items-center transition-colors"
    >
      <span className="text-[10px] text-gray-400 truncate w-full text-center">{selection.outcome}</span>
      <span className="text-green-400">{selection.odds.toFixed(2)}</span>
    </button>
  );
}
