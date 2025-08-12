// CenterOrb.jsx
import './index.css'

export default function CenterOrb({upPct = 55, downPct = 45, label = "Live Tilt"}) {
    // clamp and normalize
    const up = Math.max(0, Math.min(100, upPct));
    const down = 100 - up;

    return (
        <div
            className="center-orb"
            style={{"--up": `${up}%`, "--down": `${down}%`}}
            aria-label={label}
            title={`${up.toFixed(1)}% UP • ${down.toFixed(1)}% DOWN`}
        >
            <div className="orb__core">
                <div className="orb__stats">
                    <span className="orb__up">{up.toFixed(0)}%</span>
                    <span className="orb__mid">VS</span>
                    <span className="orb__down">{down.toFixed(0)}%</span>
                </div>
            </div>
        </div>
    );
}
