export function RatingRing({ rating, size = 60 }) {
    const percentage = (rating / 10) * 100;
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDash = (percentage / 100) * circumference;

    const color =
        percentage >= 70 ? "#22c55e" :
            percentage >= 50 ? "#eab308" : "#ef4444";

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                {/* Background ring */}
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke="#27272a" strokeWidth="4"
                />
                {/* Foreground ring */}
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke={color} strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - strokeDash}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                />
            </svg>
            <div className="absolute text-center">
                <span className="font-mono font-bold text-xs" style={{ color }}>
                    {rating.toFixed(1)}
                </span>
            </div>
        </div>
    );
}