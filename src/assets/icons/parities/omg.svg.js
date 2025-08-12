import * as React from "react"

const OmgSvg = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" {...props}>
        <path fill="url(#a)" d="M0 0h56v56H0z" />
        <path
            fillRule="evenodd"
            d="M13.5 36c3.59 0 6.5-3.58 6.5-8s-2.91-8-6.5-8S7 23.58 7 28s2.91 8 6.5 8Zm0-2c2.49 0 4.5-2.69 4.5-6s-2.01-6-4.5-6S9 24.69 9 28s2.01 6 4.5 6Zm7.5 2h2V24.48L26.69 36h2.35L33 24.48V36h2V20h-3.24l-3.88 12.76L24.07 20H21v16Zm21.5 0a5.9 5.9 0 0 0 4.5-2.23V36h2v-8h-7v2h4.78c-.58 2.41-2.28 4.16-4.28 4.16-2.49 0-4.5-2.69-4.5-6 0-3.32 2.01-6 4.5-6 2.13 0 3.4 1.13 4.02 2.84h2.12c-.76-2.93-2.74-5-6.14-5-3.59 0-6.5 3.58-6.5 8s2.91 8 6.5 8Z"
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

export default OmgSvg
