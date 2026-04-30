import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

interface ApplicationLogoProps {
    logo: keyof typeof LogoBrands;
    showIcon?: boolean;
    /** Override default image path. Defaults to /assets/images/logo/{logo}.png */
    imageSrc?: string;
    size?: 'sm' | 'md' | 'lg';
}

const LogoBrands = {
    Web3Connected: { pre: 'Web3', post: 'Connected' },
    CodexTime: { pre: 'Codex', post: 'Time' },
    CodexPulse: { pre: 'Codex', post: 'Pulse' },
    CodexHash: { pre: 'Codex', post: 'Hash' },
    CodexIdentity: { pre: 'Codex', post: 'Identity' },
    CodexAuth: { pre: 'Codex', post: 'Auth' },
    CodexSecure: { pre: 'Codex', post: 'Secure' }
} as const;

const sizeMap = {
    sm: { icon: 32, text: 'text-lg' },
    md: { icon: 40, text: 'text-2xl' },
    lg: { icon: 52, text: 'text-3xl' },
};

const ApplicationLogo: React.FC<ApplicationLogoProps> = ({
    logo,
    showIcon = true,
    imageSrc,
    size = 'md',
}) => {
    const brand = LogoBrands[logo];
    const { icon: iconSize, text: textSize } = sizeMap[size];
    const resolvedImageSrc = imageSrc ?? `/assets/images/logo/${logo}.png`;

    if (!brand) {
        return <div className="text-red-500">Invalid logo: {logo}</div>;
    }

    return (
        <Link href="/" className="flex items-center gap-3">
            {showIcon && (
                <div
                    className="rounded-full bg-sky-200/30 flex items-center justify-center"
                    style={{ width: iconSize, height: iconSize }}
                >
                    <Image
                        src={resolvedImageSrc}
                        alt={`${logo} logo`}
                        width={Math.round(iconSize * 0.7)}
                        height={Math.round(iconSize * 0.7)}
                        className="object-contain"
                    />
                </div>
            )}
            <div className={`brand-text ${textSize} font-bold`}>
                <span className="text-trinary">{brand.pre}</span>
                <span className="text-brand-codex">{brand.post}</span>
            </div>
        </Link>
    );
};

export default ApplicationLogo;
