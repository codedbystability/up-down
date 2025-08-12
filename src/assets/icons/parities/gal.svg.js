import * as React from "react"

const GalSvg = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" {...props}>
        <path fill="url(#a)" d="M0 0h56v56H0z" />
        <path
            d="m13 43 26.9-22.4a3.2 3.2 0 1 0-4.5-4.5L13 43Zm12.98-23.86-11.33 8.5 8.5-11.33a2.02 2.02 0 1 1 2.83 2.83Zm13.71 13.71-11.33 8.5 8.5-11.33a2.02 2.02 0 1 1 2.83 2.83Z"
            fill="#fff"
        />
        <defs>
            <linearGradient
                id="a"
                x1={10.42}
                y1={9.71}
                x2={68.15}
                y2={76.02}
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#1A1E21" />
                <stop offset={1} stopColor="#06060A" />
            </linearGradient>
        </defs>
    </svg>
)

export default GalSvg
