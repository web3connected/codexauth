"use client"

import React from 'react'
import PageLayout from '@/components/layout/PageLayout'
import TitleBar from '@/components/common/TitleBar'
import MainQuantumHashingContent from '@/components/panels/codexhash/MainQuantumHashingContent'

const QuantumHashPage = () => {

    const pageTitle = "Quantum Hashing Service";
    const pageDescription = "Explore the capabilities of our Quantum Hashing Service.";
    const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: pageTitle, href: '/services/quantum-hash' }
    ];

    return (
        <PageLayout>
            {/* TitleBar */}
            <TitleBar 
                title={pageTitle} 
                description={pageDescription} 
                breadcrumbs={breadcrumbs} />

            {/* MainQuantumHashingContent */}
            <MainQuantumHashingContent />

        </PageLayout>
    )
}

export default QuantumHashPage
