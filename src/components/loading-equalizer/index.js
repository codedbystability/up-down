import {useMemo} from "react";

/**
 * LoadingEqualizer
 * Props:
 *  - size:        number (px) of the box (width=height)  [default 120]
 *  - bars:        number of bars                         [default 4]
 *  - barWidth:    width of each bar (svg units)          [default 6]
 *  - barHeight:   height of each bar (svg units)         [default 28]
 *  - spacing:     space between bars (svg units)         [default 10]
 *  - radius:      corner radius of bars                  [default 2]
 *  - color:       bar color (hex/rgb)                    [default "#cad1dd"]
 *  - bg:          box background (css color)             [default "transparent"]
 *  - duration:    seconds for one up/down cycle          [default 1]
 *  - delay:       seconds to stagger each bar            [default 0.12]
 *  - amplitude:   translateY amplitude (svg units)       [default 6]
 *  - blur:        optional CSS blur on the whole bg      [default 0]
 *  - className:   extra class for the wrapper            [optional]
 *  - style:       extra style for the wrapper            [optional]
 */
export default function LoadingEqualizer({
                                             size = 120,
                                             bars = 4,
                                             barWidth = 6,
                                             barHeight = 28,
                                             spacing = 10,
                                             radius = 2,
                                             color = "#cad1dd",
                                             bg = "transparent",
                                             duration = 1,
                                             delay = 0.12,
                                             amplitude = 6,
                                             blur = 0,
                                             className = "",
                                             style = {},
                                         }) {
    // Build SVG once from props
    const dataUri = useMemo(() => {
        const totalW = bars * barWidth + (bars - 1) * spacing;
        const totalH = Math.max(barHeight + amplitude * 2, 36);
        const startX = 0;
        const y = (totalH - barHeight) / 2;

        const rects = Array.from({length: bars})
            .map((_, i) => {
                const x = startX + i * (barWidth + spacing);
                const begin = (i + 1) * delay; // stagger
                return `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="${radius}">
            <animateTransform attributeName="transform"
                              type="translate"
                              values="0 ${amplitude}; 0 -${amplitude}; 0 ${amplitude}"
                              dur="${duration}s"
                              repeatCount="indefinite"
                              begin="${begin}s"/>
          </rect>`;
            })
            .join("");

        const svg = `
      <svg width="120" height="220" viewBox="0 0 ${totalW} ${totalH}"
           xmlns="http://www.w3.org/2000/svg" fill="${color}">
        <g>${rects}</g>
      </svg>`.trim();

        return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    }, [bars, barWidth, barHeight, spacing, radius, color, duration, delay, amplitude]);

    return (
        <div
            className={`loading-eq ${className}`}
            style={{
                width: size,
                height: size,
                position: "relative",
                overflow: "hidden",
                background: bg,
                backgroundImage: dataUri,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                filter: blur ? `blur(${blur}px)` : undefined,
                ...style,
            }}
        />
    );
}


