"""
RetailBeastFX Institutional Risk Engine v9.0
Position sizing, pyramiding logic, and disaster alerts for institutional-grade risk management.

Usage:
    from position_sizer import InstitutionalRiskEngine
    
    # Calculate lot size
    lots = InstitutionalRiskEngine.calculate_lot_size(
        balance=100000,
        risk_pct=0.75,
        atr=45,
        sl_atr_mult=2.0
    )
    
    # Check pyramiding opportunity
    pyramid = InstitutionalRiskEngine.pyramiding_suggestion(adx=32, current_rr=1.1)
    
    # Monitor for disasters
    alert = InstitutionalRiskEngine.disaster_alert(adx_current=18, adx_prev=30)
"""

from dataclasses import dataclass
from typing import Optional, Tuple
from datetime import datetime


@dataclass
class PositionResult:
    """Result of position size calculation"""
    lot_size: float
    risk_amount: float
    sl_pips: float
    sl_price: float
    tp_prices: Tuple[float, float, float]  # 1R, 2R, 3R targets
    
    def __repr__(self):
        return (
            f"Position(lots={self.lot_size:.4f}, "
            f"risk=${self.risk_amount:.2f}, "
            f"SL={self.sl_pips:.1f} pips)"
        )


@dataclass
class PyramidSignal:
    """Pyramiding recommendation"""
    should_add: bool
    add_size_pct: float  # Percentage of original position
    reason: str
    adx: float
    current_rr: float


@dataclass
class DisasterAlert:
    """Disaster warning signal"""
    is_alert: bool
    severity: str  # "WARNING", "CRITICAL"
    message: str
    recommended_action: str


class InstitutionalRiskEngine:
    """
    Institutional-grade risk management engine for RetailBeastFX v9.0
    
    Core Principles:
    - 2x ATR stop loss for asymmetric R:R
    - ADX-gated pyramiding
    - Proactive disaster detection
    """
    
    # Default instrument specifications (can be overridden)
    INSTRUMENT_SPECS = {
        "XAUUSD": {"pip_size": 0.1, "lot_value": 100},  # $100 per lot per pip
        "EURUSD": {"pip_size": 0.0001, "lot_value": 10},
        "USDJPY": {"pip_size": 0.01, "lot_value": 1000},
        "XAGUSD": {"pip_size": 0.01, "lot_value": 5000},
    }
    
    @classmethod
    def calculate_lot_size(
        cls,
        balance: float,
        risk_pct: float,
        atr: float,
        sl_atr_mult: float = 2.0,
        entry_price: Optional[float] = None,
        instrument: str = "XAUUSD",
        direction: str = "LONG"
    ) -> PositionResult:
        """
        Calculate position size for ATR-based stop loss.
        
        Args:
            balance: Account balance in USD
            risk_pct: Risk percentage (e.g., 0.75 for 0.75%)
            atr: Current ATR value
            sl_atr_mult: ATR multiplier for stop loss (default 2.0)
            entry_price: Optional entry price for SL/TP calculation
            instrument: Trading instrument (default XAUUSD)
            direction: LONG or SHORT
            
        Returns:
            PositionResult with lot size and risk details
        """
        # Calculate risk amount in dollars
        risk_amount = balance * (risk_pct / 100)
        
        # Calculate SL distance in price
        sl_distance = atr * sl_atr_mult
        
        # Get instrument specs
        specs = cls.INSTRUMENT_SPECS.get(instrument, {"pip_size": 0.1, "lot_value": 100})
        pip_size = specs["pip_size"]
        lot_value = specs["lot_value"]
        
        # Convert SL to pips
        sl_pips = sl_distance / pip_size
        
        # Calculate lot size: Risk / (SL pips * pip value per lot)
        lot_size = risk_amount / (sl_pips * lot_value * pip_size)
        
        # Calculate SL and TP prices
        if entry_price:
            if direction == "LONG":
                sl_price = entry_price - sl_distance
                tp_prices = (
                    entry_price + atr * 1.0,  # 1R
                    entry_price + atr * 2.0,  # 2R
                    entry_price + atr * 3.5,  # 3.5R (institutional target)
                )
            else:
                sl_price = entry_price + sl_distance
                tp_prices = (
                    entry_price - atr * 1.0,
                    entry_price - atr * 2.0,
                    entry_price - atr * 3.5,
                )
        else:
            sl_price = sl_distance
            tp_prices = (atr * 1.0, atr * 2.0, atr * 3.5)
        
        return PositionResult(
            lot_size=round(lot_size, 4),
            risk_amount=risk_amount,
            sl_pips=sl_pips,
            sl_price=sl_price,
            tp_prices=tp_prices
        )
    
    @classmethod
    def pyramiding_suggestion(
        cls,
        adx: float,
        current_rr: float,
        add_threshold: float = 30.0,
        rr_threshold: float = 1.0
    ) -> PyramidSignal:
        """
        Suggest pyramid addition based on ADX and current R multiple.
        
        Args:
            adx: Current ADX value
            current_rr: Current R:R of open position (e.g., 1.0 = at 1R profit)
            add_threshold: ADX threshold for pyramid (default 30)
            rr_threshold: Minimum R:R for pyramid (default 1.0)
            
        Returns:
            PyramidSignal with recommendation
        """
        should_add = adx >= add_threshold and current_rr >= rr_threshold
        
        if should_add:
            # Scale add size based on ADX strength
            if adx >= 40:
                add_pct = 0.75  # 75% add on extreme ADX
                reason = f"Extreme ADX ({adx:.1f}) + {current_rr:.1f}R profit → aggressive add"
            elif adx >= 35:
                add_pct = 0.50  # 50% add on strong ADX
                reason = f"Strong ADX ({adx:.1f}) + {current_rr:.1f}R profit → standard add"
            else:
                add_pct = 0.25  # 25% add on moderate ADX
                reason = f"Moderate ADX ({adx:.1f}) + {current_rr:.1f}R profit → cautious add"
        else:
            add_pct = 0.0
            if adx < add_threshold:
                reason = f"ADX ({adx:.1f}) below threshold ({add_threshold})"
            else:
                reason = f"R:R ({current_rr:.1f}) below threshold ({rr_threshold})"
        
        return PyramidSignal(
            should_add=should_add,
            add_size_pct=add_pct,
            reason=reason,
            adx=adx,
            current_rr=current_rr
        )
    
    @classmethod
    def disaster_alert(
        cls,
        adx_current: float,
        adx_prev: float,
        structure_broken: bool = False,
        adx_collapse_threshold: float = 10.0
    ) -> DisasterAlert:
        """
        Check for disaster conditions that warrant position exit.
        
        Args:
            adx_current: Current ADX value
            adx_prev: Previous ADX value (e.g., 5 bars ago)
            structure_broken: Whether market structure has broken
            adx_collapse_threshold: ADX drop that triggers alert (default 10)
            
        Returns:
            DisasterAlert with warning details
        """
        adx_change = adx_current - adx_prev
        adx_collapsing = adx_change < -adx_collapse_threshold
        
        if structure_broken and adx_collapsing:
            return DisasterAlert(
                is_alert=True,
                severity="CRITICAL",
                message=f"🚨 CRITICAL: Structure break + ADX collapse ({adx_change:+.1f})",
                recommended_action="EXIT ALL POSITIONS IMMEDIATELY"
            )
        elif structure_broken:
            return DisasterAlert(
                is_alert=True,
                severity="WARNING",
                message="⚠️ WARNING: Market structure broken",
                recommended_action="Move SL to breakeven or exit"
            )
        elif adx_collapsing:
            return DisasterAlert(
                is_alert=True,
                severity="WARNING",
                message=f"⚠️ WARNING: ADX collapsing ({adx_change:+.1f})",
                recommended_action="Tighten stops, prepare for ranging conditions"
            )
        else:
            return DisasterAlert(
                is_alert=False,
                severity="CLEAR",
                message="✅ No disaster conditions detected",
                recommended_action="Continue monitoring"
            )


def demo_current_gold():
    """
    Demo with current Gold market conditions (January 5, 2026)
    XAU/USD ~$4,429, ADX ~35
    """
    print("=" * 60)
    print("🦁 RetailBeastFX v9.0 — Risk Engine Demo")
    print("=" * 60)
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print()
    
    # Current market conditions
    balance = 100_000
    risk_pct = 0.75
    current_atr = 45.0  # Approx 1H ATR for Gold
    entry_price = 4390.0  # OTE retest level
    current_adx = 35.0
    
    print("📊 Market Context:")
    print(f"   XAU/USD Entry: ${entry_price:,.2f}")
    print(f"   ATR(14): ${current_atr:.2f}")
    print(f"   ADX(14): {current_adx:.1f}")
    print()
    
    # Position sizing
    position = InstitutionalRiskEngine.calculate_lot_size(
        balance=balance,
        risk_pct=risk_pct,
        atr=current_atr,
        sl_atr_mult=2.0,
        entry_price=entry_price,
        instrument="XAUUSD",
        direction="LONG"
    )
    
    print("💰 Position Calculation:")
    print(f"   Balance: ${balance:,}")
    print(f"   Risk: {risk_pct}% (${position.risk_amount:,.2f})")
    print(f"   Lot Size: {position.lot_size:.4f} standard lots")
    print(f"   Stop Loss: ${position.sl_price:,.2f} ({position.sl_pips:.1f} pips)")
    print(f"   Take Profits:")
    print(f"      1R: ${position.tp_prices[0]:,.2f}")
    print(f"      2R: ${position.tp_prices[1]:,.2f}")
    print(f"      3.5R: ${position.tp_prices[2]:,.2f}")
    print()
    
    # Simulate at 1R profit
    print("📈 Pyramiding Check (at 1R profit):")
    pyramid = InstitutionalRiskEngine.pyramiding_suggestion(
        adx=current_adx,
        current_rr=1.0
    )
    print(f"   Should Add: {'✅ YES' if pyramid.should_add else '❌ NO'}")
    print(f"   Add Size: {pyramid.add_size_pct * 100:.0f}% of original")
    print(f"   Reason: {pyramid.reason}")
    print()
    
    # Disaster check
    print("🛡️ Disaster Check:")
    disaster = InstitutionalRiskEngine.disaster_alert(
        adx_current=current_adx,
        adx_prev=38.0,  # Slight decline but not collapsing
        structure_broken=False
    )
    print(f"   Alert: {disaster.severity}")
    print(f"   Message: {disaster.message}")
    print(f"   Action: {disaster.recommended_action}")
    print()
    
    # Simulate disaster scenario
    print("⚠️ Disaster Simulation (ADX collapse):")
    disaster_sim = InstitutionalRiskEngine.disaster_alert(
        adx_current=20.0,
        adx_prev=35.0,
        structure_broken=False
    )
    print(f"   Alert: {disaster_sim.severity}")
    print(f"   Message: {disaster_sim.message}")
    print(f"   Action: {disaster_sim.recommended_action}")


if __name__ == "__main__":
    demo_current_gold()
