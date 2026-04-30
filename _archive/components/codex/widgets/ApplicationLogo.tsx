import React from 'react';
import { getBrandColors } from '../config/brand-colors';

interface BrandConfig {
    path: string;
    alt: string;
    text: {
        prefix: string;
        postfix: string;
    };
}

interface ApplicationLogoProps {
    logo?: keyof typeof LogoBrands;
    showIcon?: boolean;
    showText?: boolean;
    href?: string;
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

const LogoBrands: Record<string, BrandConfig> = {
    Web3Connected: {
        path: '/assets/images/logo/Web3ConnectedIcon.png',
        alt: 'Web3Connected',
        text: { prefix: 'Web3', postfix: 'Connected' }
    },
    CodexHash: {
        path: '/assets/images/logo/CodexHash.png',
        alt: 'CodexHash',
        text: { prefix: 'Codex', postfix: 'Hash' }
    },
    CodexTime: {
        path: '/assets/images/logo/CodexTimeIcon.png',
        alt: 'CodexTime',
        text: { prefix: 'Codex', postfix: 'Time' }
    },
    CodexIdentity: {
        path: '/assets/images/logo/CodexIdentity.png',
        alt: 'CodexIdentity',
        text: { prefix: 'Codex', postfix: 'Identity' }
    },
    CodexSecure: {
        path: '/assets/images/logo/CodexSecure.png',
        alt: 'CodexSecure',
        text: { prefix: 'Codex', postfix: 'Secure' }
    },
    CodexMind: {
        path: '/assets/images/logo/CodexMind.png',
        alt: 'CodexMind',
        text: { prefix: 'Codex', postfix: 'Mind' }
    }
} as const;

/**
 * ApplicationLogo Widget
 * 
 * Multi-brand logo component for Codex ecosystem applications
 * Supports all major Codex brands with customizable display options
 */
const ApplicationLogo: React.FC<ApplicationLogoProps> = ({ 
    logo = 'Web3Connected', 
    showIcon = true, 
    showText = true,
    href = '/',
    size = 'md',
    onClick
}) => {
    const brand = LogoBrands[logo];
    const sizeConfig = {
        sm: { width: 32, height: 32, text: 'text-lg' },
        md: { width: 48, height: 48, text: 'text-2xl' },
        lg: { width: 64, height: 64, text: 'text-3xl' }
    };

    if (!brand) {
        console.warn(`Invalid logo: ${logo}`);
        return null;
    }

    const colors = getBrandColors(logo);

    const content = (
        <>
            {showIcon && (
                <div className="rounded-full bg-slate-800/50 flex items-center justify-center overflow-hidden"
                     style={{ 
                         width: sizeConfig[size].width, 
                         height: sizeConfig[size].height 
                     }}>
                    <img 
                        src={brand.path} 
                        alt={brand.alt}
                        className="w-3/4 h-3/4 object-contain" 
                        style={{ 
                         width: 150 * (sizeConfig[size].width / 48), 
                         height: 150 * (sizeConfig[size].height / 48),
                         borderRadius: '50%'
                     }}
                    />
                </div>
            )}
            {showText && (
                <div className="flex items-baseline">
                    <span 
                        className={`font-bold ${sizeConfig[size].text} transition-colors`}
                        style={{ color: colors.prefix }}
                    >
                        {brand.text.prefix}
                    </span>
                    <span 
                        className={`font-bold ${sizeConfig[size].text} transition-colors`}
                        style={{ color: colors.postfix }}
                    >
                        {brand.text.postfix}
                    </span>
                </div>
            )}
        </>
    );

    // If onClick is provided, render as button
    if (onClick) {
        return (
            <button 
                onClick={onClick}
                className="flex items-center gap-3 group hover:opacity-90 transition-opacity bg-transparent border-0 cursor-pointer"
            >
                {content}
            </button>
        );
    }

    // Default: render as anchor tag
    return (
        <a href={href} className="flex items-center gap-3 group hover:opacity-90 transition-opacity">
            {content}
        </a>
    );
};

export default ApplicationLogo;
